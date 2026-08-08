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
				<h1 class="post-title">GSoC 2026 Week 9: A Locale Bug, and Everything I Learned About Git History</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					This week was supposed to be a small follow-up: add Unicode box-drawing characters to <code>git repo structure</code>'s table output. The rendering change was straightforward, but it exposed a bug in Git's UTF-8 locale detection and required some careful history rewriting.
				</p>

				<h2>1. The Feature Itself Was the Easy Part</h2>

				<p>
					The core change was small. <code>git repo structure</code> renders its statistics table using ASCII pipes, dashes, and asterisks. Since most terminals support box-drawing characters, the plan was to detect a UTF-8 locale and use Unicode output there, while retaining ASCII everywhere else.
				</p>

				<div class="code-block">
					<code>const int utf8 = is_utf8_locale();<br />const char *bullet_l0 = utf8 ? "•" : "*";<br />const char *border_left = utf8 ? "│ " : "| ";</code>
				</div>

				<p>
					I added tests and set <code>LC_ALL=C</code> for the existing ASCII tests so their output would not depend on the contributor's locale.
				</p>

				<h2>2. Bug One: I Forgot to Delete the Old Code</h2>

				<p>
					CI failed immediately. I had added the new conditional variables without removing the old hardcoded ASCII output. In the ASCII path, this printed the border twice. The divider between the header and body had the same problem: the old unconditional <code>printf</code> block still ran before the new conditional one.
				</p>

				<p>
					The fix was simple: remove the code that the new logic replaced. The tests then passed locally.
				</p>

				<h2>3. Bug Two: Windows CI Kept Failing Anyway</h2>

				<p>
					Two ASCII-path tests still failed on the Windows runner, even though both explicitly set <code>LC_ALL=C</code>. I initially suspected that the Windows/MSYS environment was ignoring <code>LC_ALL</code> and selecting UTF-8 anyway.
				</p>

				<p>
					Without direct access to the Windows runner, I added temporary diagnostics to show what <code>is_utf8_locale()</code> was reading. I also ran the failing tests locally before making further changes.
				</p>

				<h2>4. Bug Three: The Real Problem Was the Opposite Direction</h2>

				<p>
					Local testing showed the opposite failure. With <code>LC_ALL=C.utf8</code> set and the locale installed, <code>is_utf8_locale()</code> still reported ASCII.
				</p>

				<p>
					This ruled out the theory that Windows was ignoring <code>LC_ALL</code>. The actual problem was when <code>is_utf8_locale()</code> ran relative to gettext initialization.
				</p>

				<p>
					In <code>gettext.c</code>, <code>git_setup_gettext()</code> returns early when it cannot find the compiled-in locale directory. This commonly happens when Git is run directly from a source build without <code>make install</code>. Because of that early return, <code>init_gettext_charset()</code> never initializes the internal <code>charset</code> variable.
				</p>

				<p>
					<code>is_utf8_locale()</code> has fallback logic that reads <code>LC_ALL</code>, <code>LC_CTYPE</code>, and <code>LANG</code> when <code>charset</code> is unset. However, that fallback was inside <code>#ifdef NO_GETTEXT</code>. It was therefore absent from normal gettext-enabled builds.
				</p>

				<p>
					If gettext setup returned early, <code>is_utf8_locale()</code> had no fallback and always returned false, regardless of the environment. This was not a Windows-specific issue. It could affect any gettext-enabled source build whose locale directory was unavailable.
				</p>

				<h2>5. Checking Whether the Fix Was Actually Safe</h2>

				<p>
					Before changing shared code in <code>gettext.c</code>, I checked whether the <code>NO_GETTEXT</code> guard was intentional. Using <code>git log -p --follow</code>, I traced the code to the commit that introduced <code>is_utf8_locale()</code>.
				</p>

				<p>
					The fallback was added for builds without gettext. The case where gettext was enabled but initialization returned early did not appear to have been considered.
				</p>

				<p>
					There was also precedent in the same file. The native Windows implementation of <code>locale_charset()</code> already reads <code>LC_ALL</code>, <code>LC_CTYPE</code>, and <code>LANG</code> directly as a fallback.
				</p>

				<p>
					I also checked CVE-2023-25815 because it modified initialization handling in the same file. That fix prevents translation functions from using uninitialized state. My change only affects locale encoding detection, so the two concerns do not overlap.
				</p>

				<h2>6. The Fix, and Why It Deserved Its Own Commit</h2>

				<p>
					The fix removes the <code>#ifdef NO_GETTEXT</code> guard around the environment fallback. The fallback now runs whenever <code>charset</code> is unset, regardless of whether gettext support is enabled.
				</p>

				<p>
					The diff is small, but its scope is wider than <code>git repo structure</code>. <code>is_utf8_locale()</code> is also used by <code>grep.c</code> and <code>gettext_width()</code>.
				</p>

				<p>
					For that reason, I kept the locale fix in a separate commit before the Unicode feature commit. This makes the dependency clear and gives the infrastructure change its own explanation.
				</p>

				<h2>7. Writing a Test That Actually Proves It</h2>

				<p>
					My original Unicode test did not reliably exercise the fallback. On a normal CI system with a valid locale directory, <code>git_setup_gettext()</code> succeeds and initializes <code>charset</code>. The fallback is never used.
				</p>

				<p>
					To test it directly, I set <code>GIT_TEXTDOMAINDIR</code> to a path that cannot exist. This forces gettext setup to return early on any system. The test then verifies that UTF-8 is still detected through <code>LC_ALL</code>.
				</p>

				<p>
					Without the fix, the test fails even on a correctly installed build. The regression test now checks the broken path directly instead of depending on the tester's environment.
				</p>

				<h2>8. Git Gymnastics</h2>

				<p>
					With two separate commits, the locale fix needed to come before the feature that depended on it. Reordering them caused a conflict because both commits modified the same test file.
				</p>

				<p>
					I first tried an interactive rebase, followed by a hand-generated patch with <code>git am</code>. The simpler solution was to return to a clean state, perform the rebase carefully, and resolve the conflict in place.
				</p>

				<p>
					I also used <code>git format-patch</code> as a final check. Writing both patches to disk made it easy to review the exact diffs and commit messages before pushing.
				</p>

				<h2>What I'd Do Differently</h2>

				<p>
					I would reproduce the failure locally before forming a theory from CI logs. I initially treated the Windows failure as evidence that <code>LC_ALL</code> was being ignored. Local testing showed that the real problem was the absence of a fallback.
				</p>

				<p>
					I would also inspect the history earlier when modifying shared infrastructure. <code>git log -p</code> clarified why the guard existed and provided the context needed to justify removing it.
				</p>

				<p>
					Next, I will watch the PR's CI results and ask my mentors whether the <code>gettext.c</code> fix has the expected scope or whether there is additional upstream context behind the original guard.
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
