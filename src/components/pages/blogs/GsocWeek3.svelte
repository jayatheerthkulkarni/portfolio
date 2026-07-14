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
			title: "[v4 PATCH 1/4] path: introduce append_formatted_path() for shared path formatting",
			desc: "Introduces the shared append_formatted_path() helper in path.c with a unified path_format enum. This is the foundation the rest of the series builds on.",
			src: "/week3/1.patch"
		},
		{
			title: "[v4 PATCH 2/4] rev-parse: use append_formatted_path() for path formatting",
			desc: "Removes duplicate enums and inline formatting logic from rev-parse, replacing them with a clean call to the shared helper.",
			src: "/week3/2.patch"
		},
		{
			title: "[v4 PATCH 3/4] repo: add path.commondir with absolute and relative suffix formatting",
			desc: "Adds path.commondir.absolute and path.commondir.relative keys to git repo info, with a robust isolated test helper.",
			src: "/week3/3.patch"
		},
		{
			title: "[v4 PATCH 4/4] repo: add path.gitdir with absolute and relative suffix formatting",
			desc: "Adds path.gitdir.absolute and path.gitdir.relative keys, reusing the test helper from patch 3.",
			src: "/week3/4.patch"
		}
	];

	onMount(async () => {
		window.scrollTo(0, 0);

		const tl = gsap.timeline();
		tl.from(".back-link", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" });
		tl.from(".post-header *", { opacity: 0, y: 25, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.3");
		tl.from(".post-content > *", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4");

		const results = await Promise.all(
			diffs.map(d => fetch(d.src).then(r => r.text()).catch(() => "Could not load patch."))
		);
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
				<h1 class="post-title">GSoC 2026 Week 3: Merging and Moving Forward</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					Look how fast time flies.
				</p>

				<p>
					We are currently looking at <code>git repo info path.*</code>'s foundation, ready to be merged. In this blog I want to post the patches of the final version that gets merged. Since we discussed the technical details before, I won't go into the nitty gritty again.
				</p>

				<h2>The Final Patches</h2>

				<p>
					Here are the patches that made it through the review process and are headed into Git's tree:
				</p>

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

				<h2>What I Learned This Week</h2>

				<p>
					Something else I learned this week is range diffs. They are underrated.
				</p>
				<p>
					They practically give you a "diff" between your v1 and v2 patch series. I also learned how to use range-diffs directly in the <code>format-patch</code> command.
				</p>
				<p>
					Want to see how the range diff turned out from v3 to v4 of my patches?
				</p>
				<p>
					Patches 1, 2, and 4 were identical between v3 and v4, a clean <code>=</code>. Only Patch 3 changed, and the only difference was removing the quotes around <code>..</code> in the test helper.
				</p>
				<p>
					That is the beauty of range diffs: a whole patch series summarised into a single glance.
				</p>

				<h2>Looking Back</h2>

				<p>
					When I look back at my older patches and my current ones, I can see how much I've grown.
				</p>
				<p>
					Back when I was new to Git, somewhere around February 2025, I had to send a v3 or v4. I used <code>git rebase -i</code> and changed a commit, but then instead of running <code>git rebase --continue</code>, I ran <code>format-patch</code> on the rebase itself.
				</p>
				<p>
					Without verifying the patches, I sent them to the mailing list. To this day I cringe looking at those patches.
				</p>
				<p>
					But I think everyone has their mishaps when they're new to a community. Nobody's perfect when you think about it.
				</p>

				<h2>Phase 2: What's Next</h2>

				<p>
					I also wanted to share my Phase 2 plan. I'm going to implement more <code>path.*</code> keys and also a querying system.
				</p>
				<p>
					The querying system groups keys in one call. If you say:
				</p>
				<pre><code>git repo info path</code></pre>
				<p>
					All the <code>path.*</code> keys get printed. Sounds good, right?
				</p>
				<p>
					Currently <code>git repo info</code> only does <code>--all</code> keys, or individual keys where you have to literally type out every <code>path.*</code> key one by one if you just want those. Instead of that, I am building a querying system which searches for the first item matching <code>path.&lt;something&gt;</code> and goes on till the end.
				</p>
				<p>
					While doing that, I am also planning to add more <code>path.*</code> keys in parallel.
				</p>
				<p>
					I expect this to go much faster than the current foundation, because these are just keys. The foundation takes time, but the keys themselves are just function calls that we have to write.
				</p>
				<p>
					That's my Week 3!
				</p>
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

	.diffs-accordion { margin-top: 1.5rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 1rem; }

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
