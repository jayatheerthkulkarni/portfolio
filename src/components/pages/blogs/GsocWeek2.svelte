<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	let activeDiff = $state(null);
	let patchContents = $state(["Loading...", "Loading...", "Loading...", "Loading..."]);

	function toggleDiff(index) {
		if (activeDiff === index) {
			activeDiff = null;
		} else {
			activeDiff = index;
		}
	}

	const diffs = [
		{
			title: "[v3 PATCH 1/4] path: introduce append_formatted_path() for shared path formatting",
			desc: "Extracts the path-formatting algorithm from rev-parse into a new shared append_formatted_path() helper in path.c, backed by a clean path_format enum in path.h.",
			src: "/week2/1.patch"
		},
		{
			title: "[v3 PATCH 2/4] rev-parse: use append_formatted_path() for path formatting",
			desc: "Removes the duplicate local enums and hand-rolled formatting logic from rev-parse, replacing them with a single call to the new shared helper.",
			src: "/week2/2.patch"
		},
		{
			title: "[v3 PATCH 3/4] repo: add path.commondir with absolute and relative suffix formatting",
			desc: "Introduces path.commondir.absolute and path.commondir.relative keys to git repo info, along with a robust parameterised test helper that avoids state leaks.",
			src: "/week2/3.patch"
		},
		{
			title: "[v3 PATCH 4/4] repo: add path.gitdir with absolute and relative suffix formatting",
			desc: "Adds path.gitdir.absolute and path.gitdir.relative keys, reusing the test helper from patch 3 and exercising GIT_DIR environment variable overrides.",
			src: "/week2/4.patch"
		}
	];

	onMount(async () => {
		window.scrollTo(0, 0);

		const tl = gsap.timeline();
		tl.from(".back-link", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" });
		tl.from(".post-header *", { opacity: 0, y: 25, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.3");
		tl.from(".post-content > *", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4");

		const results = await Promise.all(diffs.map(d => fetch(d.src).then(r => r.text()).catch(() => "Could not load patch.")));
		patchContents = results;
	});
</script>

<Navbar />

<div class="blog-post-page">
	<div class="article-wrapper">
		<a href="#/blogs" class="back-link">
			<span class="arrow">←</span> Back to Archive
		</a>

		<article class="blog-post-container">
			<header class="post-header">
				<div class="post-meta">
					<span class="category-badge">GSoC</span>
									<span class="date">June 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026 Week 2: Feedback and Iteration</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					Alright buckle up this is gonna be detailed. Week 2 has been a relatively smoother ride for me than Week 1.
				</p>

				<p>
					Since I submitted my patches to the mailing list, I have received some really good feedback. Before we delve into the feedback, I would like to break down my patches and explain what is happening in the code, so that we can understand the feedback properly.
				</p>

				<p>There are mainly 4 patches.</p>

				<h2>Breaking Down the Patches</h2>

				<p>
					Starting with <strong>Patch 1</strong>. As previously discussed, <code>rev-parse</code> and <code>repo-info</code> have some overlap. The <code>path.*</code> functions already exist in some form in <code>rev-parse</code>. Since the code already exists, why rewrite it?
				</p>
				<p>
					Patch 1 is about that. We take the path-formatting function from <code>rev-parse</code> and add it to <code>path.c</code> as a shared helper.
				</p>
				<p>
					Why <code>path.c</code>? Good question. <code>path.c</code> is a file that contains helper functions usable by multiple builtin files. It is basically Chuck Norris for path helpers ;)
				</p>

				<p>
					<strong>Patch 2</strong> is where, since we added a global function, we remove a good chunk of code from <code>rev-parse</code>. Do you see how we still use <code>puts()</code>? That is because the global helper only handles adding the path to an existing <code>strbuf</code>, while the function in <code>rev-parse.c</code> also prints it to the output stream. That is the difference.
				</p>
				<p>
					Now that we have made <code>rev-parse</code> use the global helper, we have cleared a path forward for <code>repo.c</code> to use the same function.
				</p>

				<p>
					<strong>Patch 3</strong> can now add <code>path.gitdir</code> keys to <code>repo-info</code>. Since no feedback was about changing the key architecture itself, I am not going to explain it again. We add functions that add the paths to the buffer. Why two functions? One is for the absolute path and the other is for the relative path.
				</p>
				<p>
					Something you should know is that Patch 1 also takes the enums from <code>rev-parse</code> and adds them to <code>path.h</code>. Patch 2 then removes them from <code>rev-parse.c</code>. So the functions start using common enums. <strong>Patch 4</strong> follows the same style.
				</p>

				<h2>Feedback</h2>

				<p>
					Since the submission of these patches, a good chunk of feedback has been recorded, and more is still coming in.
				</p>

				<h3>Design Feedback from Lucas</h3>
				<p>
					One of the questions I asked in the cover letter was whether we should still keep a <code>--path-format</code> flag. Lucas pointed out that if we are already exposing both <code>.absolute</code> and <code>.relative</code> variants as separate keys, then having a separate formatting flag does not make much sense. The format is already encoded in the key itself.
				</p>
				<p>
					Another discussion was about whether we should provide a default key such as <code>path.gitdir</code> without any suffix. Lucas highlighted both sides of the argument. On the positive side, some paths naturally make more sense in either absolute or relative form, and always typing <code>.absolute</code> or <code>.relative</code> can feel a little verbose. On the other hand, introducing a default means users now need to remember what that default actually is.
				</p>
				<p>
					He also pointed out that if both absolute and relative variants exist as independent keys, then <code>--all</code> should print both of them. After all, <code>--all</code> should mean exactly that.
				</p>

				<h3>Testing Feedback</h3>
				<p>
					Lucas noticed that I had semi-hardcoded the expected absolute path in the test helper:
				</p>
				<pre><code>expect_absolute=$(cd .. && pwd)/.git</code></pre>
				<p>
					While this works for <code>gitdir</code>, it would not work well for future path fields. Instead, the expected absolute path should be passed as a parameter, just like the relative path already is. Junio later replied to the thread and agreed with Lucas's observation.
				</p>
				<p>
					More testing feedback followed for Patch 4. Lucas suggested looking at the existing <code>git rev-parse</code> tests and checking for corner cases. For example, the documentation for <code>--git-common-dir</code> says:
				</p>
				<pre><code>Show $GIT_COMMON_DIR if defined, else $GIT_DIR</code></pre>
				<p>
					My tests only covered the basic case and did not exercise both branches of that behavior. The suggestion was to mirror the coverage that already exists in <code>rev-parse</code>, which makes a lot of sense.
				</p>

				<h3>Nitpick: Patch Subject Prefix</h3>
				<p>
					There was also a small nitpick regarding the patch subject prefix. Instead of:
				</p>
				<pre><code>[GSoC][PATCH]</code></pre>
				<p>Lucas suggested using:</p>
				<pre><code>[GSoC PATCH]</code></pre>
				<p>
					This is a tiny detail, but following project conventions makes patch series easier to read and keeps everything consistent with the rest of the mailing list.
				</p>

				<h3>API Feedback from Phillip Wood</h3>
				<p>
					The most significant technical feedback came from Phillip Wood. His main concern was the API introduced in Patch 1. The original API exposed two enums:
				</p>
				<pre><code>enum path_format_type
enum path_default_type</code></pre>
				<p>
					His observation was that the API felt very specific to <code>rev-parse</code> and was difficult to understand in isolation. Instead, he suggested simplifying everything into a single enum:
				</p>
				<pre><code>enum path_format &#123;
    PATH_FORMAT_ABSOLUTE,
    PATH_FORMAT_CANONICAL,
    PATH_FORMAT_RELATIVE,
    PATH_FORMAT_RELATIVE_IF_SHARED,
    PATH_FORMAT_UNMODIFIED,
&#125;;</code></pre>
				<p>
					He also suggested renaming the helper to something more generic like <code>format_path()</code> (or <code>append_formatted_path()</code>) rather than <code>strbuf_add_path()</code>. Another point Phillip raised was documentation: since this helper would now live in a public header, it should clearly document what each parameter does.
				</p>
				<p>
					I thought this feedback was particularly valuable because it improved the API itself rather than just the implementation.
				</p>

				<h3>Key Ordering Discussion</h3>
				<p>
					Phillip also questioned one of the design decisions discussed in the cover letter. I had mentioned that I preferred:
				</p>
				<pre><code>path.gitdir.absolute
path.gitdir.relative</code></pre>
				<p>over:</p>
				<pre><code>path.absolute.gitdir
path.relative.gitdir</code></pre>
				<p>
					Part of my reasoning was that the latter would disrupt the lexicographical ordering of the field list. Phillip pointed out that this is not actually true as long as entries are inserted in the correct order. For example, this would still be perfectly sorted:
				</p>
				<pre><code>path.absolute.commondir
path.absolute.gitdir
path.relative.commondir
path.relative.gitdir</code></pre>
				<p>
					That was a fair point. My real preference was more about grouping related keys together. I personally find it easier to discover both variants when they sit next to each other rather than having all absolute keys grouped separately from all relative keys.
				</p>

				<h3>Cover Letter Feedback from Junio</h3>
				<p>
					Finally, Junio provided feedback on the cover letter itself. The original cover letter started by saying that the first two patches were self-explanatory and that readers should focus on the third and fourth patches. Junio pointed out that this is exactly backwards.
				</p>
				<p>
					The purpose of a cover letter is to explain what the series is about and convince people that it is worth reading. At that point, readers have not yet looked at the patches and may not even know what problem is being solved. Telling them to go read the first two patches themselves defeats the purpose.
				</p>
				<p>
					He also pointed out that I referenced previous discussions without properly summarizing them, which unintentionally excludes readers who were not part of those discussions. This was a really useful reminder that communication is just as important as the code itself.
				</p>

				<h2>Summary</h2>
				<ul>
					<li>Some comments improved the API design.</li>
					<li>Some improved the tests.</li>
					<li>Some improved the cover letter.</li>
					<li>And some challenged the assumptions behind the design itself.</li>
				</ul>
				<p>
					A large portion of this feedback made its way directly into v2 of the series, which is exactly how the review process is supposed to work.
				</p>

				<p>
					For the technical ones, I am adding all the patches below. You can expand each of them to read how it works under the hood. In case you want to learn more, you can always reach out to me at <a href="mailto:jayatheerthkulkarni2005@gmail.com">jayatheerthkulkarni2005@gmail.com</a>.
				</p>

				<h2 class="diffs-heading">Patches</h2>

				<div class="diffs-accordion">
					{#each diffs as diff, index}
						<div class="accordion-item {activeDiff === index ? 'active' : ''}">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div class="accordion-header" on:click={() => toggleDiff(index)}>
								<span class="diff-title">{diff.title}</span>
								<span class="accordion-indicator">{activeDiff === index ? '−' : '+'}</span>
							</div>
							{#if activeDiff === index}
								<div class="accordion-content">
									<p class="diff-desc">{diff.desc}</p>
									<pre class="diff-code-block"><code>{patchContents[index]}</code></pre>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		</article>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>
	</div>
</div>

<Footer />

<style>
	.blog-post-page { max-width: 100%; padding: 4rem 1.5rem; box-sizing: border-box; }
	.article-wrapper { max-width: 760px; margin: 0 auto; }

	.back-link {
		display: inline-flex; align-items: center; gap: 0.5rem;
		color: #dccb8e; text-decoration: none; font-family: "Inter", sans-serif;
		font-size: 0.9rem; transition: all 0.3s ease; margin-bottom: 3rem;
	}
	.back-link:hover { color: #f3ebd8; transform: translateX(-4px); }

	.post-header { margin-bottom: 3.5rem; }
	.post-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }

	.category-badge, .week-badge {
		font-family: "Inter", sans-serif; font-size: 0.75rem;
		text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500;
	}
	.category-badge { color: #dccb8e; }
	.week-badge {
		color: rgba(220, 203, 142, 0.7);
		border: 1px solid rgba(220, 203, 142, 0.25);
		padding: 0.2rem 0.6rem; border-radius: 20px;
	}
	.date { font-family: "Inter", sans-serif; font-size: 0.85rem; color: rgba(243, 235, 216, 0.4); }

	.post-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 300; line-height: 1.25; margin: 0; color: #f3ebd8; letter-spacing: -0.02em; }

	.post-content { font-family: "Cormorant Garamond", serif; color: rgba(243, 235, 216, 0.85); }
	.post-content p { font-size: 1.2rem; line-height: 1.8; margin: 0 0 1.75rem 0; }
	.post-content p.lead { font-size: 1.4rem; line-height: 1.7; color: #f3ebd8; font-style: italic; margin-bottom: 2.5rem; }

	.post-content h2 { font-family: "Cormorant Garamond", serif; font-size: 1.8rem; font-weight: 400; color: #dccb8e; margin: 3.5rem 0 1.25rem 0; letter-spacing: -0.01em; }
	.post-content h3 { font-family: "Cormorant Garamond", serif; font-size: 1.35rem; font-weight: 400; color: rgba(220, 203, 142, 0.8); margin: 2.5rem 0 1rem 0; }

	.post-content ul { margin: 0 0 2rem 1.5rem; padding: 0; }
	.post-content li { font-size: 1.2rem; line-height: 1.8; margin-bottom: 0.6rem; color: rgba(243, 235, 216, 0.8); }

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1); color: #dccb8e;
		padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}
	.post-content pre { background: rgba(25, 25, 25, 0.4); border: 1px solid rgba(220, 203, 142, 0.15); border-radius: 8px; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
	.post-content pre code { background: transparent; border: none; padding: 0; font-size: 0.9rem; }

	.post-content a { color: #dccb8e; text-decoration: none; border-bottom: 1px solid rgba(220, 203, 142, 0.35); padding-bottom: 1px; transition: color 0.2s ease, border-color 0.2s ease; }
	.post-content a:hover { color: #f3ebd8; border-color: #f3ebd8; }

	.diffs-heading { margin-top: 4rem !important; }
	.diffs-accordion { margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; }

	.accordion-item { background: rgba(25, 25, 25, 0.4); border: 1px solid rgba(220, 203, 142, 0.1); border-radius: 12px; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.2); backdrop-filter: blur(10px); }
	.accordion-item:hover { border-color: rgba(220, 203, 142, 0.3); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
	.accordion-item.active { border-color: rgba(220, 203, 142, 0.4); background: rgba(30, 30, 30, 0.6); }

	.accordion-header { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; color: #f3ebd8; font-family: "Inter", sans-serif; font-size: 1.05rem; cursor: pointer; user-select: none; }
	.diff-title { font-weight: 500; line-height: 1.4; }
	.accordion-indicator { color: #dccb8e; font-size: 1.5rem; font-weight: 300; margin-left: 1rem; flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }

	.accordion-content { padding: 0 1.5rem 1.5rem 1.5rem; animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

	.diff-desc { font-family: "Inter", sans-serif !important; font-size: 0.95rem !important; line-height: 1.6 !important; color: rgba(243, 235, 216, 0.75) !important; margin-bottom: 1.5rem !important; padding-top: 0.5rem; }

	.diff-code-block { background: rgba(10, 10, 10, 0.8) !important; border: 1px solid rgba(220, 203, 142, 0.08) !important; max-height: 450px; overflow-y: auto; margin: 0 !important; border-radius: 8px !important; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
	.diff-code-block code { font-family: "Courier New", Courier, monospace; font-size: 0.82rem; line-height: 1.5; color: #e2d9bc; word-break: normal; white-space: pre; }
	.diff-code-block::-webkit-scrollbar { width: 8px; height: 8px; }
	.diff-code-block::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
	.diff-code-block::-webkit-scrollbar-thumb { background: rgba(220, 203, 142, 0.2); border-radius: 4px; }
	.diff-code-block::-webkit-scrollbar-thumb:hover { background: rgba(220, 203, 142, 0.4); }

	.rule { display: flex; align-items: center; gap: 0.75rem; width: 100%; margin: 5rem 0 2rem 0; }
	.line { flex: 1; height: 1px; background: rgba(243, 235, 216, 0.15); }
	.rule span { color: #dccb8e; font-size: 0.8rem; line-height: 1; flex-shrink: 0; }

	@media (max-width: 768px) {
		.blog-post-page { padding: 2.5rem 1rem; }
		.post-content p.lead { font-size: 1.25rem; }
		.post-content p { font-size: 1.15rem; }
	}
</style>
