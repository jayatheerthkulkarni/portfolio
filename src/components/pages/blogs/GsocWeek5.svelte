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
					<span class="date">June 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026 Week 5: Surviving the Mailing List and Reaching the next Branch</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					This marks the 5th week into my coding period, and I am thrilled to share a major milestone: all three of my patch series have been merged into Git's <code>next</code> branch!
				</p>

				<p>
					Before diving into the technical specifics, I want to take a step back and share something fascinating about contributing to Git: how the project maintains its integration branches, and how the Git maintainer, Junio C Hamano, orchestrates the massive influx of patches on the mailing list.
				</p>

				<h2>The Scale of Git Development</h2>

				<p>
					One of the most surprising things I learned during my email exchanges with Junio was the sheer volume of traffic the Git mailing list receives. Unlike many projects that use GitHub pull requests, Git development happens almost entirely through an email-based workflow. Every patch submission, line-by-line review, and follow-up discussion takes place directly on the mailing list.
				</p>
				<p>
					In a recent email, Junio mentioned that the project received more than 2,000 messages in just four weeks.
				</p>
				<p>
					Managing distributed development at this scale requires a highly disciplined, well-defined, and consistent workflow. To coordinate this asynchronous process while maintaining stability, Git primarily relies on three integration branches: <code>seen</code>, <code>next</code>, and <code>master</code>.
				</p>

				<h2>The "What's Cooking" Reports</h2>

				<p>
					To keep the community aligned, Junio periodically sends out his famous "What's cooking in git.git" emails. These act as a public status tracker for the project, giving a bird's-eye view of the current state of development by categorizing patch series into different stages: topics that need review, those that have entered <code>seen</code>, patches progressing through <code>next</code>, and those preparing to graduate to <code>master</code>.
				</p>

				<h2>The Branching Pipeline</h2>

				<h3>1. <code>seen</code>: The Bleeding Edge</h3>
				<p>
					Most patch series first appear in <code>seen</code> before moving to <code>next</code>. The name literally means that Junio has seen the patch and considers it worth tracking. This is the most volatile integration branch, where patches often undergo significant revisions based on reviewer feedback. Some series spend considerable time here, iterating through v2, v3, or even v4, while others move forward much more quickly. Automated CI also helps catch portability and build issues across different platforms while patches are under evaluation.
				</p>

				<h3>2. <code>next</code>: The Integration Ground</h3>
				<p>
					Once the review cycles settle down and the patch series is considered to be in good shape, Junio promotes it to <code>next</code>. This branch serves as the primary integration ground between <code>seen</code> and <code>master</code>. Here, independent patch series are tested together to ensure they interact correctly before being promoted to the stable branch. Patches usually "cook" in <code>next</code> for a while so that any subtle regressions can be identified before moving forward.
				</p>

				<h3>3. <code>master</code>: The Stable Release</h3>
				<p>
					Finally, <code>master</code> is the stable branch that eventually becomes part of an official Git release. Every change here has survived extensive community review and integration testing. Each release follows a carefully coordinated development cycle before reaching users.
				</p>

				<h2>Looking Ahead</h2>

				<p>
					At the time of writing, all three of my patch series are successfully sitting and "cooking" in the <code>next</code> branch.
				</p>
				<p>
					Seeing my work survive the rigorous review process and reach this stage after just one month of coding has been an incredibly rewarding milestone.
				</p>
				<p>
					I am excited to continue contributing, address any edge cases that may arise, and watch these patches make their final journey toward <code>master</code>.
				</p>

				<h2>Patch Links</h2>

				<ul>
					<li><a href="https://lore.kernel.org/git/" target="_blank" rel="noopener noreferrer">path: introduce <code>append_formatted_path()</code></a></li>
					<li><a href="https://lore.kernel.org/git/" target="_blank" rel="noopener noreferrer">rev-parse: use <code>append_formatted_path()</code></a></li>
					<li><a href="https://lore.kernel.org/git/" target="_blank" rel="noopener noreferrer">repo: add <code>path.commondir</code> and <code>path.gitdir</code> keys</a></li>
				</ul>
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
	.post-content h3 { font-family: "Cormorant Garamond", serif; font-size: 1.3rem; font-weight: 400; color: rgba(220, 203, 142, 0.8); margin: 2rem 0 0.85rem 0; }

	.post-content ul { margin: 0 0 2rem 1.5rem; padding: 0; }
	.post-content li { font-size: 1.15rem; line-height: 1.8; margin-bottom: 0.75rem; color: rgba(243, 235, 216, 0.8); }

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1); color: #dccb8e;
		padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}

	.post-content a { color: #dccb8e; text-decoration: none; border-bottom: 1px solid rgba(220, 203, 142, 0.35); padding-bottom: 1px; transition: color 0.2s ease, border-color 0.2s ease; }
	.post-content a:hover { color: #f3ebd8; border-color: #f3ebd8; }

	.rule { display: flex; align-items: center; gap: 0.75rem; width: 100%; margin: 5rem 0 2rem 0; }
	.line { flex: 1; height: 1px; background: rgba(243, 235, 216, 0.15); }
	.rule span { color: #dccb8e; font-size: 0.8rem; line-height: 1; flex-shrink: 0; }

	@media (max-width: 768px) {
		.blog-post-page { padding: 2.5rem 1rem; }
		.post-content p.lead { font-size: 1.25rem; }
		.post-content p { font-size: 1.15rem; }
	}
</style>
