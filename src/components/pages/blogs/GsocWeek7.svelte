<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	let activeDiff = $state(null);
	let patchContents = $state(["Loading...", "Loading...", "Loading...", "Loading...", "Loading...", "Loading...", "Loading..."]);

	function toggleDiff(index) {
		if (activeDiff === index) {
			activeDiff = null;
		} else {
			activeDiff = index;
		}
	}

	const diffs = [
		{
			title: "[GSoC Patch 1/7] repo: add path.toplevel with absolute and relative suffix formatting",
			desc: "Adds path.toplevel.absolute and path.toplevel.relative keys to git repo info, allowing scripts to easily discover the repository's working tree root directory without calling rev-parse. Returns empty in a bare repository.",
			src: "/week7/1.patch"
		},
		{
			title: "[GSoC Patch 2/7] repo: add path.superproject-working-tree with absolute and relative suffixes",
			desc: "Adds path.superproject-working-tree.absolute and path.superproject-working-tree.relative keys to discover the root working tree of a superproject when inside a submodule. Returns empty when not in a submodule.",
			src: "/week7/2.patch"
		},
		{
			title: "[GSoC Patch 3/7] repo: add path.objects with absolute and relative suffix formatting",
			desc: "Introduces path.objects.absolute and path.objects.relative keys to retrieve the active object database location, respecting the GIT_OBJECT_DIRECTORY environment variable override.",
			src: "/week7/3.patch"
		},
		{
			title: "[GSoC Patch 4/7] repo: add path.hooks with absolute and relative suffix formatting",
			desc: "Introduces path.hooks.absolute and path.hooks.relative keys to resolve the location of Git hooks, taking into account any custom configurations like core.hooksPath.",
			src: "/week7/4.patch"
		},
		{
			title: "[GSoC Patch 5/7] repo: add path.index with absolute and relative suffix formatting",
			desc: "Adds path.index.absolute and path.index.relative keys to find the location of the active index file, respecting the GIT_INDEX_FILE environment override.",
			src: "/week7/5.patch"
		},
		{
			title: "[GSoC Patch 6/7] repo: add path.grafts with absolute and relative suffix formatting",
			desc: "Adds path.grafts.absolute and path.grafts.relative keys for query tools or history rewrites to retrieve the active grafts file path, respecting the GIT_GRAFT_FILE environment override.",
			src: "/week7/6.patch"
		},
		{
			title: "[GSoC Patch 7/7] repo: add path.git-prefix path key validation",
			desc: "Introduces path.git-prefix key to print the relative path from the working tree root to the current directory (including trailing slash), or empty if at the root.",
			src: "/week7/7.patch"
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
					<span class="date">July 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026 Week 7: Expanding the Path Keys</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					With the foundations of the <code>path.*</code> keys fully merged into Git's master branch, Week 7 is all about expansion.
				</p>

				<p>
					Now that our generic path formatting helper is stable and in place, adding new path configurations to <code>git repo info</code> is incredibly straightforward. Instead of wrestling with redundant directory formatting code or directory resolution edge cases, we can simply hook our helper up to Git's core API interfaces.
				</p>

				<p>
					In this update, I sent a 7-patch series to the mailing list introducing multiple highly requested path keys. These keys allow scripts, tools, and build configurations to query core environment locations safely and cleanly.
				</p>

				<h2>The Patches</h2>

				<p>
					Here is the complete patch series detailing the addition of the new path keys:
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

				<h2>Key Capabilities Added</h2>

				<p>
					This series implements:
				</p>

				<ul>
					<li><strong>Working Trees & Submodules:</strong> Discovering the top-level repository working tree root (<code>path.toplevel</code>) and resolving the superproject root path from within active submodule structures (<code>path.superproject-working-tree</code>).</li>
					<li><strong>Hooks & Databases:</strong> Exposing the directory of the repository hooks (<code>path.hooks</code>), the object store (<code>path.objects</code>), the active index file (<code>path.index</code>), and the history grafts metadata file (<code>path.grafts</code>).</li>
					<li><strong>Relative Offsets:</strong> Retrieving the relative offset depth inside the repository tree layout (<code>path.git-prefix</code>).</li>
				</ul>

				<p>
					These keys strictly respect standard environment variable overrides (like <code>GIT_OBJECT_DIRECTORY</code>, <code>GIT_INDEX_FILE</code>, <code>GIT_GRAFT_FILE</code>) and configurations (such as <code>core.hooksPath</code>). This ensures that scripts invoking <code>git repo info</code> get the exact same path resolution context that Git uses internally.
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

	.category-badge {
		font-family: "Inter", sans-serif; font-size: 0.75rem;
		text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500;
		color: #dccb8e;
	}
	.date { font-family: "Inter", sans-serif; font-size: 0.85rem; color: rgba(243, 235, 216, 0.4); }

	.post-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 300; line-height: 1.25; margin: 0; color: #f3ebd8; letter-spacing: -0.02em; }

	.post-content { font-family: "Inter", sans-serif; color: rgba(243, 235, 216, 0.85); }
	.post-content p { font-size: 1.05rem; line-height: 1.8; margin: 0 0 1.75rem 0; }
	.post-content p.lead { font-size: 1.2rem; line-height: 1.7; color: #f3ebd8; font-style: italic; margin-bottom: 2.5rem; font-family: "Cormorant Garamond", serif; }

	.post-content h2 { font-family: "Cormorant Garamond", serif; font-size: 1.8rem; font-weight: 400; color: #dccb8e; margin: 3.5rem 0 1.25rem 0; letter-spacing: -0.01em; }

	.post-content ul { margin: 0 0 2rem 1.5rem; padding: 0; }
	.post-content li { font-size: 1.05rem; line-height: 1.8; margin-bottom: 0.75rem; color: rgba(243, 235, 216, 0.8); }
	.post-content li strong { color: #f3ebd8; }

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1); color: #dccb8e;
		padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}

	.diffs-accordion { margin-top: 1.5rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }

	.accordion-item { background: rgba(25, 25, 25, 0.4); border: 1px solid rgba(220, 203, 142, 0.1); border-radius: 12px; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.2); backdrop-filter: blur(10px); }
	.accordion-item:hover { border-color: rgba(220, 203, 142, 0.3); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
	.accordion-item.active { border-color: rgba(220, 203, 142, 0.4); background: rgba(30, 30, 30, 0.6); }

	.accordion-header { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; color: #f3ebd8; font-family: "Inter", sans-serif; font-size: 1.05rem; cursor: pointer; user-select: none; }
	.diff-title { font-weight: 500; line-height: 1.4; }
	.accordion-indicator { color: #dccb8e; font-size: 1.5rem; font-weight: 300; margin-left: 1rem; flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }

	.accordion-content { padding: 0 1.5rem 1.5rem 1.5rem; animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

	.diff-desc { font-family: "Inter", sans-serif !important; font-size: 0.95rem !important; line-height: 1.6 !important; color: rgba(243, 235, 216, 0.75) !important; margin-bottom: 1.5rem !important; padding-top: 0.5rem; }

	.diff-code-block { background: rgba(10, 10, 10, 0.8) !important; border: 1px solid rgba(220, 203, 142, 0.08) !important; max-height: 450px; overflow-y: auto; margin: 0 !important; padding: 1.25rem !important; border-radius: 8px !important; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
	.diff-code-block code {
		font-family: "Courier New", Courier, monospace;
		font-size: 0.82rem;
		line-height: 1.5;
		color: #e2d9bc;
		word-break: normal;
		white-space: pre;
		background: transparent !important;
		border: none !important;
		padding: 0 !important;
		border-radius: 0 !important;
	}
	.diff-code-block::-webkit-scrollbar { width: 8px; height: 8px; }
	.diff-code-block::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
	.diff-code-block::-webkit-scrollbar-thumb { background: rgba(220, 203, 142, 0.2); border-radius: 4px; }
	.diff-code-block::-webkit-scrollbar-thumb:hover { background: rgba(220, 203, 142, 0.4); }

	.rule { display: flex; align-items: center; gap: 0.75rem; width: 100%; margin: 5rem 0 2rem 0; }
	.line { flex: 1; height: 1px; background: rgba(243, 235, 216, 0.15); }
	.rule span { color: #dccb8e; font-size: 0.8rem; line-height: 1; flex-shrink: 0; }

	@media (max-width: 768px) {
		.blog-post-page { padding: 2.5rem 1rem; }
		.post-content p.lead { font-size: 1.1rem; }
		.post-content p { font-size: 1rem; }
	}
</style>
