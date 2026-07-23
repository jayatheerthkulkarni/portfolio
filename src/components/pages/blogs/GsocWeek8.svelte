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
					<span class="date">July 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026 Week 8: Pivoting to Repository Structure & Unicode Visualizations</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					Week 8 may seem relatively quiet on the surface, but it brought several crucial decisions regarding the trajectory of my project.
				</p>

				<h2>1. Dropping the Query System</h2>

				<p>The reasoning here is straightforward:</p>

				<p>
					<code>git repo info</code> is intended to serve as a scripting command. Adding "user-friendly" filtering features to a scripting-focused tool introduces unnecessary complexity without adding true utility.
				</p>

				<p>
					When I originally submitted the patch to the Git mailing list, the idea was to allow users to execute commands such as:
				</p>

				<div class="code-block">
					<code>git repo info layout</code>
				</div>

				<p>
					This command would then filter and stream out all layout-related keys.
				</p>

				<p>
					However, upon reviewing the submission, Junio suggested using pathspecs instead.
				</p>

				<p>
					This aligned with earlier feedback from Karthik Nayak prior to the start of GSoC. Although I was initially hesitant given how <code>path.*</code> keys are currently structured, leveraging pathspecs made sense in principle.
				</p>

				<p>
					<strong>Why abandon this approach then? What does this mean for the rest of GSoC?</strong>
				</p>

				<p>
					Ultimately, we decided to drop the query system because it addresses the right issue in the wrong architectural layer.
				</p>

				<p>
					Consider a Python script querying Git path locations: a developer can simply write a function to pull all <code>path.*</code> keys once and cache or process them.
				</p>

				<p>
					Relying strictly on <code>path.*</code> pathspecs introduces potential fragility—if new path keys are added in future Git releases, existing custom scripts might fail if not explicitly written to handle unmapped keys.
				</p>

				<p>
					Furthermore, executing pathspec filtering offers no measurable performance advantage over simply querying with <code>--all</code>.
				</p>

				<p>
					After reviewing these points in a team sync, my mentors and I concluded that querying all keys via <code>--all</code> is the cleaner, more reliable path forward.
				</p>

				<h2>2. Next Steps: Expanding Beyond `path.*` Keys</h2>

				<p>While establishing the <code>path.*</code> keys is essential, that alone does not justify a 12-week timeline.</p>

				<p>
					To address this, I am expanding my scope to work directly on <code>git repo structure</code>.
				</p>

				<p>
					My primary focus is adding Unicode support to the command, followed by implementing histogram-based outputs for repository size buckets.
				</p>

				<p>
					While <code>git repo structure</code> recently gained the ability to expose basic object counts and peak sizes through Justin Tobler's patch series, the command currently outputs data only as raw, isolated extremes.
				</p>

				<p>
					In the coming week, I will publish a detailed breakdown of how <code>git repo structure</code> operates internally and what these new additions will look like in practice.
				</p>

				<p>
					As discussed on the mailing list by Patrick Steinhardt and Junio, extreme maximums are useful, but distributions provide the real picture of repository health. I will implement a streaming bucketing system during the object walk to track size distributions (for example, blob sizes) and entry distributions (for example, tree entry counts). These will be formatted into an optional UNICODE bar chart output to visualize repository shape.
				</p>

				<p>
					Navigating the internal codebase for <code>git repo structure</code> presents a steeper learning curve given my relative experience, but I am excited to tackle the challenge head-on.
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
