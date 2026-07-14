<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	onMount(() => {
		window.scrollTo(0, 0);

		// GSAP premium entrance animation
		const tl = gsap.timeline();
		tl.from(".back-link", {
			opacity: 0,
			x: -20,
			duration: 0.5,
			ease: "power2.out"
		});
		tl.from(".post-header *", {
			opacity: 0,
			y: 25,
			duration: 0.8,
			stagger: 0.15,
			ease: "power3.out"
		}, "-=0.3");
		tl.from(".post-content > *", {
			opacity: 0,
			y: 20,
			duration: 0.6,
			stagger: 0.1,
			ease: "power2.out"
		}, "-=0.4");
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
					<span class="date">May 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026: Community Bonding Period</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					After being selected for Google Summer of Code 2026 with Git, the community bonding period gave me an opportunity to slow down, understand the project in greater depth, and prepare for the coding phase.
				</p>

				<p>
					Although the official coding period had not yet begun, a significant amount of work happened during these weeks. Most of my time was spent discussing design decisions, understanding existing implementations inside Git, and preparing prototype patches for the work ahead.
				</p>

				<h2>Meeting My Mentors</h2>
				<p>
					One of the most valuable parts of the bonding period was getting the opportunity to work closely with my mentors, Justin Tobler and Lucas Oshiro.
				</p>
				<p>
					Justin and I met over Zoom almost every week during the bonding period. These discussions were incredibly helpful because they allowed us to brainstorm different approaches, question assumptions, and think through the long-term design of the feature before writing large amounts of code.
				</p>
				<p>
					Lucas also provided valuable guidance throughout the process, reviewing ideas, discussing possible directions, and sharing lessons from his own experience working on similar Git features.
				</p>

				<h2>Understanding <code>path.*</code></h2>
				<p>
					A major focus of the bonding period was the new <code>path.*</code> namespace planned for <code>git repo info</code>.
				</p>
				<p>
					At first glance, exposing repository paths sounds straightforward. However, once we started discussing the details, several interesting questions emerged.
				</p>
				<ul>
					<li>Should paths be displayed as absolute or relative?</li>
					<li>Should users explicitly request a path format?</li>
					<li>How should <code>--all</code> behave when multiple path representations exist?</li>
					<li>Would a dedicated <code>--path-format</code> option improve the interface?</li>
					<li>How closely should the command mirror existing behavior from <code>git rev-parse</code>?</li>
				</ul>
				<p>
					Many of our meetings revolved around these questions. The discussions helped shape the direction of the implementation long before any code was submitted.
				</p>
				<p>
					One particularly interesting discussion revolved around how <code>git repo info --all</code> should behave when both relative and absolute path formats are available. What initially seemed like a simple implementation detail quickly turned into a broader conversation about user expectations, consistency, and long-term maintainability.
				</p>

				<h2>Prototype Patches</h2>
				<p>
					Alongside the discussions, I prepared several experimental patches to explore different approaches.
				</p>
				<p>
					The goal was not to immediately produce a final solution, but rather to create working prototypes that would help us evaluate the advantages and disadvantages of each design.
				</p>
				<p>
					I experimented with handling relative and absolute paths separately, reorganized parts of the path printing logic, and began drafting the tests and documentation that would eventually accompany the feature.
				</p>
				<p>
					These prototypes often generated even more interesting discussions than the code itself. Every design decision had implications for usability, maintainability, and future extensibility.
				</p>

				<h2>Meeting the 2026 Git GSoC Cohort</h2>
				<p>
					During the bonding period, the Git organization also held a meeting with the selected GSoC contributors and mentors.
				</p>
				<p>
					It was great to meet the other students who would be spending their summer contributing to Git. Although each project focused on a different area of the codebase, it was interesting to hear about the problems they would be tackling and the ideas they hoped to explore during the program.
				</p>
				<p>
					It was nice to put faces to names and learn more about the people behind the projects. Most of my interactions with Git contributors had previously been through emails, patch reviews, and code discussions, so meeting everyone directly was a great experience.
				</p>
				<p>
					The meeting also gave us an opportunity to introduce ourselves, discuss our project goals, and get a better sense of the work happening across the Git community this summer.
				</p>

				<h2>Looking Ahead</h2>
				<p>
					The bonding period may not have involved major code contributions, but it provided something equally important: clarity.
				</p>
				<p>
					I now have a much better understanding of the problem space, the expectations for the project, and the architectural decisions that will guide the implementation during the coding period.
				</p>
				<p>
					A huge thank you to my mentors, Justin Tobler and Lucas Oshiro, for their guidance throughout the bonding period. Their feedback on project architecture, patch organization, and overall direction has already taught me a tremendous amount.
				</p>
				<p>
					I'm excited to start turning these discussions into patches and begin the next phase of the project.
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
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		transition: all 0.3s ease;
		margin-bottom: 3rem;
	}

	.back-link:hover {
		color: #f3ebd8;
		transform: translateX(-4px);
	}

	.back-link .arrow {
		transition: transform 0.3s ease;
	}

	.post-header {
		margin-bottom: 3.5rem;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.category-badge {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		font-weight: 500;
	}

	.date {
		font-family: "Inter", sans-serif;
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
		font-family: "Inter", sans-serif;
		color: rgba(243, 235, 216, 0.85);
	}

	.post-content p {
		font-size: 1.05rem;
		line-height: 1.8;
		margin: 0 0 1.75rem 0;
		font-family: "Inter", sans-serif;
	}

	.post-content p.lead {
		font-size: 1.2rem;
		line-height: 1.7;
		color: #f3ebd8;
		font-style: italic;
		margin-bottom: 2.5rem;
		font-family: "Cormorant Garamond", serif;
	}

	.post-content h2 {
		font-family: "Cormorant Garamond", serif;
		font-size: 1.8rem;
		font-weight: 400;
		color: #dccb8e;
		margin: 3.5rem 0 1.25rem 0;
		letter-spacing: -0.01em;
	}

	.post-content ul {
		margin: 0 0 2rem 1.5rem;
		padding: 0;
	}

	.post-content li {
		font-size: 1rem;
		line-height: 1.8;
		margin-bottom: 0.75rem;
		color: rgba(243, 235, 216, 0.8);
		font-family: "Inter", sans-serif;
	}

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1);
		color: #dccb8e;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
		word-break: break-all;
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
		.blog-post-page {
			padding: 2.5rem 1rem;
		}

		.post-header {
			margin-bottom: 2.5rem;
		}

		.post-content p.lead {
			font-size: 1.1rem;
		}

		.post-content p {
			font-size: 1rem;
		}
	}
</style>
