<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	onMount(() => {
		window.scrollTo(0, 0);

		const tl = gsap.timeline();
		tl.from(".back-link", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" });
		tl.from(".post-header *", { opacity: 0, y: 25, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.3");
		tl.from(".post-content > *", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4");
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
					<span class="date">August 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026 Week 10: Teaching `git repo info` New Tricks: A Debugging Diary</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					This week I added a set of path keys to <code>git repo info</code>. The code was mostly straightforward. Getting the interface, tests, commit messages, and patch series into shape took four revisions.
				</p>

				<h2>The Idea</h2>

				<p>
					<code>git repo info</code> provides a structured way to query repository metadata. It already had a few <code>path.*</code> keys, but scripts still needed several <code>git rev-parse</code> modes to find common repository paths.
				</p>

				<p>
					The series added keys for the top-level working tree, superproject root, hooks directory, index, grafts file, and the current prefix. Each key supports the same <code>.absolute</code> and <code>.relative</code> forms.
				</p>

				<div class="code-block">
					<code>path.toplevel · path.superproject-root · path.hooks<br />path.index · path.grafts · path.git-prefix</code>
				</div>

				<p>
					That was the plan. Most of the interesting work came from deciding exactly what those keys should mean.
				</p>

				<h2>v1: Start With the Obvious Mistakes</h2>

				<p>
					My editor inserted <code>#include "compat/posix.h"</code> at the top of <code>builtin/repo.c</code>, before a macro that had to come first. I did not notice it. Junio did.
				</p>

				<p>
					One commit was also called "path key validation," although it added a key and validated nothing. I changed the subject to say what the patch actually did. Both were small comments, but both pointed to the same problem: I had reviewed the code more carefully than I had reviewed the patch.
				</p>

				<h2>v2: Paths to Files That Do Not Exist</h2>

				<p>
					Lucas tried <code>path.grafts.relative</code> in a repository without a grafts file. The command returned the path where the file would be, even though no such file existed. He asked whether that was a bug.
				</p>

				<p>
					It was not. The key answers "where is the grafts file located?" It does not answer "does the grafts file exist?" The distinction matters because a caller may be asking for the path in order to create the file.
				</p>

				<p>
					The same question later came up for <code>path.index</code> in a bare repository. The answer was the same. These keys name repository locations; they do not promise that something currently exists at each location.
				</p>

				<h2>v3: Document the Answer</h2>

				<p>
					The code already behaved as intended, so there was nothing to fix there. Instead, v3 documented that a path key may report the designated location of a file that has not been created.
				</p>

				<p>
					This was a useful reminder that a review question does not always require a code change. Sometimes the code has the right answer, but the documentation has not stated the question clearly enough.
				</p>

				<p>
					Junio then asked for a more substantial review from others. A simple "looks good" is easy to write, but it does not tell the reader what was checked. I was not the person receiving that advice, but it was worth remembering.
				</p>

				<h2>Justin's Review</h2>

				<p>
					Justin Tobler reviewed the whole series closely. Most of the changes in v4 came from that review.
				</p>

				<p>
					<strong>Redundant initialization.</strong> Four functions called <code>strbuf_addstr(buf, "")</code>. A newly initialized strbuf is already NUL-terminated, so these calls did nothing. I had copied the first unnecessary call into the other three functions with impressive consistency.
				</p>

				<p>
					<strong>Missing relative-path tests.</strong> Some tests covered only the absolute form because they did not use the common helper. I added the corresponding relative cases.
				</p>

				<p>
					<strong>A better name.</strong> The original series used <code>path.superproject-working-tree</code>. Justin suggested <code>path.superproject-root</code>, which was shorter and described the value just as well. I changed it.
				</p>

				<p>
					<strong>Commit messages.</strong> Some messages tried too hard to identify particular users of the new keys. That made the motivation sound narrower than the interface actually was. I rewrote them to explain the behavior directly.
				</p>

				<p>
					<strong>Dropping <code>path.objects</code>.</strong> This was the more important design comment. A pluggable object-database backend may not have a directory that can be returned as an object path. Adding <code>path.objects</code> would expose the filesystem layout as if it were part of the permanent interface.
				</p>

				<p>
					The implementation was correct for Git's current object store. That did not make the interface a good idea. After discussing it with my mentors, I dropped the key from the series.
				</p>

				<p>
					<strong><code>core.hooksPath=/dev/null</code>.</strong> When hooks are disabled this way, <code>git rev-parse --git-path hooks</code> returns <code>/dev/null</code>. I considered returning an empty string instead, but that would give the empty value another meaning. Passing through <code>/dev/null</code> was simpler and more predictable.
				</p>

				<p>
					I added a test for it, except on MINGW, where <code>/dev/null</code> is not a native path that can be canonicalized in the same way.
				</p>

				<h2>v4: Rebase Time</h2>

				<p>
					While the series was under review, <code>struct repository</code> gained its own <code>prefix</code> member. The old <code>startup_info-&gt;prefix</code> disappeared from <code>master</code>.
				</p>

				<p>
					Every path implementation in my series used the old field, so v4 had to be rebased and updated. The code change was mechanical. Producing a clean replacement series was less so.
				</p>

				<h2>Preparing the Patch Series</h2>

				<p>
					I sent several drafts to myself before sending v4 to the list. This caught problems that neither the compiler nor the test suite could find.
				</p>

				<p>
					On the first attempt, I ran <code>format-patch</code> in a directory that still contained patches from an older version. The resulting mailbox had duplicate commits and two numbering schemes. The command had behaved correctly. I had given it a dirty output directory.
				</p>

				<p>
					On another attempt, dropping <code>path.objects</code> looked like accidental content loss. An interactive rebase had reused the old commit's position in a way that made the history difficult to understand. Since dropping the key was a deliberate design decision, the series needed to make that clear.
				</p>

				<p>
					I also managed to leave bracketed placeholder text in the "Changes since v3" section of the cover letter. It survived one review because I was reading what I expected to see instead of what was actually there.
				</p>

				<p>
					Finally, editing older commits directly to remove a few formatting leftovers caused avoidable conflicts. Creating fixup commits at <code>HEAD</code> and using <code>rebase --autosquash</code> was much easier than repeatedly editing commits in the middle of the series.
				</p>

				<p>
					None of these problems changed the C code. Any of them could still have made the submitted series confusing or wrong.
				</p>

				<h2>Final Checks</h2>

				<p>
					Before running <code>send-email</code>, I rebuilt Git and ran the relevant test file. All 69 tests passed.
				</p>

				<div class="code-block">
					<code># passed all 69 test(s)<br />1..69</code>
				</div>

				<p>
					I also checked that the cover letter's diffstat matched the patches being sent. This sounds unnecessary until the first time a stale patch directory proves otherwise.
				</p>

				<h2>What I Learned</h2>

				<p>
					When a reviewer finds a repeated mistake, fix the pattern, not only the instance they happened to mention.
				</p>

				<p>
					Also, "is this implemented correctly?" and "should this interface exist?" are different questions. <code>path.objects</code> answered the first one well enough. It did not have a good answer to the second.
				</p>

				<p>
					Finally, patch preparation is part of the change. A correct implementation can still arrive with stale patches, misleading commit messages, missing tests, or an inaccurate cover letter. The compiler cannot help with those.
				</p>

				<p>
					The C was the easy part. Shipping it cleanly was the part I had to learn this week.
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
	.blog-post-page {
		max-width: 100%;
		padding: 4rem 1.5rem;
		box-sizing: border-box;
	}
	.article-wrapper {
		max-width: 760px;
		margin: 0 auto;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #dccb8e;
		text-decoration: none;
		font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.9rem;
		transition: all 0.3s ease;
		margin-bottom: 3rem;
	}
	.back-link:hover {
		color: #f3ebd8;
		transform: translateX(-4px);
	}

	.post-header {
		margin-bottom: 3.5rem;
	}
	.post-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.category-badge {
		font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-weight: 500;
		color: #dccb8e;
	}
	.date {
		font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.85rem;
		color: rgba(243, 235, 216, 0.4);
	}

	.post-title {
		font-size: clamp(2rem, 5vw, 3.2rem);
		font-weight: 300;
		line-height: 1.25;
		margin: 0;
		color: #f3ebd8;
		letter-spacing: -0.02em;
	}

	.post-content {
		font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
		color: rgba(243, 235, 216, 0.85);
	}
	.post-content p {
		font-size: 1.05rem;
		line-height: 1.8;
		margin: 0 0 1.75rem 0;
	}
	.post-content p.lead {
		font-size: 1.2rem;
		line-height: 1.7;
		color: #f3ebd8;
		font-style: italic;
		margin-bottom: 2.5rem;
		font-family: "Cormorant Garamond", Georgia, serif;
	}

	.post-content h2 {
		font-family: "Cormorant Garamond", Georgia, serif;
		font-size: 1.8rem;
		font-weight: 400;
		color: #dccb8e;
		margin: 3.5rem 0 1.25rem 0;
		letter-spacing: -0.01em;
	}

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1);
		color: #dccb8e;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}

	.code-block {
		background: rgba(10, 10, 10, 0.8);
		border: 1px solid rgba(220, 203, 142, 0.15);
		padding: 1rem 1.25rem;
		border-radius: 8px;
		margin: 1.5rem 0 2rem 0;
		overflow-x: auto;
	}
	.code-block code {
		background: transparent;
		border: none;
		padding: 0;
		color: #e2d9bc;
		font-size: 0.9rem;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		margin: 5rem 0 2rem 0;
	}
	.line {
		flex: 1;
		height: 1px;
		background: rgba(243, 235, 216, 0.15);
	}
	.rule span {
		color: #dccb8e;
		font-size: 0.8rem;
		line-height: 1;
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		.blog-post-page { padding: 2.5rem 1rem; }
		.post-content p.lead { font-size: 1.1rem; }
		.post-content p { font-size: 1rem; }
	}
</style>
