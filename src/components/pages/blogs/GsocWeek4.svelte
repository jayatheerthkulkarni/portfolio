<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	let activeDiff = $state(null);
	let patchContent = $state("Loading...");

	function toggleDiff() {
		activeDiff = activeDiff === 0 ? null : 0;
	}

	onMount(async () => {
		window.scrollTo(0, 0);

		const tl = gsap.timeline();
		tl.from(".back-link", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" });
		tl.from(".post-header *", { opacity: 0, y: 25, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.3");
		tl.from(".post-content > *", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4");

		patchContent = await fetch("/week4/1.patch").then(r => r.text()).catch(() => "Could not load patch.");
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
				<h1 class="post-title">GSoC 2026 Week 4: Green Flag and the Query System</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					With Week 4, the version on the mailing list finally got a green flag from Junio.
				</p>

				<p>
					There is one final nitpick I have to resolve with the initial flags, but these things take time. We are dealing with the absolute foundation here.
				</p>
				<p>
					That said, I have started working on the query system.
				</p>

				<h2>What is the Query System?</h2>

				<p>
					Initially, the problem was that you had to either get <code>--all</code> the keys, or type out every individual key yourself.
				</p>
				<p>
					That was one issue. The other workaround was to pipe <code>--all</code> through <code>grep</code>. While <code>grep</code> works, keep in mind that this is a plumbing command. It is supposed to be predictable, and scripts generally prefer it when the native command itself provides the correct output format.
				</p>
				<p>
					This is why we are adding the query system. Before this, if someone ran:
				</p>
				<pre><code>git repo info layout</code></pre>
				<p>It would not work. With the query system, it prints:</p>
				<pre><code>layout.bare=false
layout.shallow=false</code></pre>
				<p>Much simpler. And not a lot of code had to change either.</p>

				<h2>Binary Search vs. Linear Search</h2>

				<p>
					This is a single patch that, when merged, will introduce these changes.
				</p>
				<p>
					My initial implementation used a binary search, because Lucas had previously used the <code>bsearch()</code> function, and I now had to hardcode a custom binary search on top of that.
				</p>
				<p>
					After discussing the tradeoffs between hard-to-read code and the number of iterations, a linear search turned out to be the much better option — the opposite of what I had proposed.
				</p>
				<p>
					Maybe in the future, when the number of keys grows large enough, a <code>bsearch</code> will make sense. But for now it is overkill.
				</p>
				<p>
					Here is the patch using the linear search approach:
				</p>

				<div class="diffs-accordion">
					<div class="accordion-item {activeDiff === 0 ? 'active' : ''}">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="accordion-header" on:click={toggleDiff}>
							<span class="diff-title">[GSoC Patch] repo: support category-based prefix querying for info keys</span>
							<span class="accordion-indicator">{activeDiff === 0 ? '−' : '+'}</span>
						</div>
						{#if activeDiff === 0}
							<div class="accordion-content">
								<p class="diff-desc">
									Introduces category-based prefix querying to <code>git repo info</code>. Users can now pass a namespace prefix like <code>layout</code> to retrieve all keys in that group, using a simple linear search that short-circuits once it steps outside the matching prefix block.
								</p>
								<pre class="diff-code-block"><code>{patchContent}</code></pre>
							</div>
						{/if}
					</div>
				</div>

				<p>That's my Week 4!</p>
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

	.diffs-accordion { margin-top: 1rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }

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
