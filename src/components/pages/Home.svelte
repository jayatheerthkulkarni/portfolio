<script>
	import { Router } from "@mateothegreat/svelte5-router";

	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";

	const projects = [
		{
			title: "GSoC 2026 and Git internals",
			category: "Open Source",
			image: "/git.png",
			link: "#/gsoc",
		},
		{
			title: "Gink - Programming Language",
			category: "Compilers",
			image: "/gink.png",
			link: "#/gink",
		},
		{
			title: "An authentication framework in Go",
			category: "Open Source",
			image: "/auth.png",
			link: "https://github.com/jayatheerthkulkarni/auth",
		},
	];

	const articles = [
		{
			title: "GSoC mid term evaluation",
			date: "July 2026",
			readingTime: "1 min read",
			link: "#/blogs/gsoc/week-6",
		},
		{
			title: "Ancient Indian design",
			date: "June 2026",
			readingTime: "12 min read",
			link: "#/blogs/ui/ancient-indian-ui",
		},
		{
			title: "Google Summer of Code 2026",
			date: "May 2026",
			readingTime: "1 min read",
			link: "#/blogs/gsoc/gsoc-2026-selection",
		},
		{
			title: "The Weird Paths",
			date: "April 2026",
			readingTime: "3 min read",
			link: "#/blogs/systems/the-weird-paths/",
		},
		{
			title: "Time is an Illusion",
			date: "March 2026",
			readingTime: "2 min read",
			link: "#/blogs/architecture/illusion-of-time/",
		},
	];
</script>

<Navbar />

<div class="sticky-wrapper">
	<section class="hero">
		<div class="hero-bg">
			<img src="/banner.png" alt="" aria-hidden="true" />
		</div>

		<div class="hero-content">
			<h1>Jayatheerth Kulkarni</h1>

			<p class="subtitle">
				Open Source <span>❈</span>
				Systems <span>❈</span>
				Compilers
			</p>
		</div>
	</section>

	<section class="section-two">
		<div class="content-container">
			<div>
				<h2>Selected Work</h2>
				<div class="projects-grid">
					{#each projects as project}
						<a
							href={project.link}
							class="project-card"
							target={project.link.startsWith("http") ? "_blank" : undefined}
							rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
						>
							<div
								class="card-bg"
								style="background-image: url({project.image});"
							></div>
							<div
								class="card-overlay"
							></div>

							<div
								class="card-content"
							>
								<span
									class="card-tag"
									>{project.category}</span
								>
								<h3>
									{project.title}
								</h3>
								<span
									class="card-arrow"
									>→</span
								>
							</div>
						</a>
					{/each}
				</div>
			</div>

			<div class="recruiter-section">
				<h2>To the recruiters</h2>
				<p>
					Looking for someone specializing in
					low-level systems, compiler
					architecture, and open-source
					ecosystems? Let's build something robust
					together.
				</p>
				<a
					href="/jayatheerth_kulkarni_resume.pdf"
					download
					class="cv-button"
				>
					Download CV
					<span class="btn-arrow">↓</span>
				</a>
			</div>

			<div class="now-section">
				<h2>Currently Doing</h2>
				<div class="now-content">
					<p>
						Building <a
							href="#/gink"
							class="inline-link"
							>Gink</a
						>, studying for the GRE, and
						spending a lot of time solving
						algorithmic challenges on
						CodeChef.
					</p>
				</div>
			</div>

			<div class="writing-section">
				<h2>Featured Writing</h2>
				<p class="writing-intro">
					I feature one blog each month detailing
					deep architecture dives, low-level
					system quirks, and design methodologies.
				</p>
				<div class="writing-list">
					{#each articles as article}
						<a
							href={article.link}
							class="writing-item"
						>
							<div
								class="writing-meta"
							>
								<span
									>{article.date}</span
								>
								<span
									class="meta-dot"
									>·</span
								>
								<span
									>{article.readingTime}</span
								>
							</div>
							<h3>{article.title}</h3>
							<span
								class="writing-arrow"
								>→</span
							>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<Footer />
</div>

<style>
	:global(html) {
		scrollbar-width: thin;
		scrollbar-color: #dccb8e #121212;
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #121212;
		overflow-x: hidden;
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #121212;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: rgba(220, 203, 142, 0.3);
		border-radius: 4px;
		border: 2px solid #121212;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background-color: rgba(220, 203, 142, 0.6);
	}

	.sticky-wrapper {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		height: 280vh;
		position: relative;
	}

	.hero,
	.section-two {
		grid-column: 1;
		grid-row: 1;
		width: 100%;
		box-sizing: border-box;
	}

	.hero {
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-inline: 2rem;
		overflow: hidden;
		z-index: 2;

		animation: dissolve linear both;
		animation-timeline: scroll(root);
		animation-range: 0vh 80vh;
	}

	.section-two {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		color: #f3ebd8;
		z-index: 1;
		margin-top: 100vh;
		padding: 6rem 2rem;
	}

	@keyframes dissolve {
		to {
			opacity: 0;
			transform: scale(0.96);
			visibility: hidden;
		}
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 0;
		pointer-events: none;
	}

	.hero-bg img {
		width: min(1200px, 95vw);
		height: auto;
		object-fit: contain;
		opacity: 0.16;
		user-select: none;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.hero h1,
	.section-two h2 {
		margin: 0;
		font-family: "Cormorant Garamond", serif;
		font-size: clamp(3.5rem, 6vw, 6rem);
		font-weight: 500;
		line-height: 0.95;
		letter-spacing: -0.03em;
		color: #f3ebd8;
		text-wrap: balance;
	}

	.subtitle {
		margin-top: 2rem;
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		letter-spacing: 0.35em;
		text-transform: uppercase;
		color: rgba(243, 235, 216, 0.72);
	}

	.subtitle span {
		margin-inline: 0.8rem;
		color: #dccb8e;
	}

	.content-container {
		width: min(1200px, 100%);
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		width: 100%;
		margin-top: 3.5rem;
	}

	.project-card {
		position: relative;
		height: 420px;
		border-radius: 12px;
		overflow: hidden;
		display: flex;
		align-items: flex-end;
		padding: 2rem;
		box-sizing: border-box;
		text-decoration: none;
		border: 1px solid rgba(220, 203, 142, 0.15);
		transition:
			border-color 0.4s ease,
			transform 0.4s ease;
	}

	.card-bg {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		filter: grayscale(40%) contrast(110%);
		opacity: 0.4;
		transition:
			transform 0.6s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.4s ease;
		z-index: 0;
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(18, 18, 18, 0.95) 10%,
			rgba(18, 18, 18, 0.4) 100%
		);
		z-index: 1;
		transition: background 0.4s ease;
	}

	.card-content {
		position: relative;
		z-index: 2;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-tag {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: #dccb8e;
		opacity: 0.8;
	}

	.project-card h3 {
		margin: 0;
		font-family: "Cormorant Garamond", serif;
		font-size: 2rem;
		font-weight: 400;
		color: #f3ebd8;
		line-height: 1.2;
	}

	.card-arrow {
		font-size: 1.5rem;
		color: #dccb8e;
		opacity: 0;
		transform: translateX(-10px);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		margin-top: 0.5rem;
	}

	.project-card:hover {
		border-color: rgba(220, 203, 142, 0.5);
		transform: translateY(-4px);
	}

	.project-card:hover .card-bg {
		transform: scale(1.06);
		opacity: 0.55;
	}

	.project-card:hover .card-overlay {
		background: linear-gradient(
			to top,
			rgba(18, 18, 18, 0.98) 20%,
			rgba(18, 18, 18, 0.2) 100%
		);
	}

	.project-card:hover .card-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	.recruiter-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
		max-width: 600px;
		border-top: 1px solid rgba(220, 203, 142, 0.1);
		padding-top: 4rem;
	}

	.recruiter-section p {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.75);
		margin: 0;
	}

	.cv-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #121212;
		background-color: #dccb8e;
		padding: 1rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		transition:
			background-color 0.3s ease,
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.btn-arrow {
		font-size: 1.1rem;
		transition: transform 0.3s ease;
	}

	.cv-button:hover {
		background-color: #f3ebd8;
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(220, 203, 142, 0.15);
	}

	.cv-button:hover .btn-arrow {
		transform: translateY(2px);
	}

	.now-section {
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
		border-top: 1px solid rgba(220, 203, 142, 0.1);
		padding-top: 4rem;
	}

	.now-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 720px;
	}

	.now-content p {
		font-family: "Inter", sans-serif;
		font-size: 1.1rem;
		line-height: 1.7;
		color: rgba(243, 235, 216, 0.8);
		margin: 0;
	}

	.inline-link {
		color: #dccb8e;
		text-decoration: none;
		border-bottom: 1px dashed rgba(220, 203, 142, 0.4);
		transition: border-color 0.3s ease;
	}

	.inline-link:hover {
		border-bottom-style: solid;
		border-bottom-color: #dccb8e;
	}

	.writing-section {
		display: flex;
		flex-direction: column;
		border-top: 1px solid rgba(220, 203, 142, 0.1);
		padding-top: 4rem;
	}

	.writing-intro {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.7);
		margin: 1.5rem 0 3.5rem 0;
		max-width: 600px;
	}

	.writing-list {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.writing-item {
		display: grid;
		grid-template-columns: 200px 1fr auto;
		align-items: center;
		padding: 2rem 0;
		border-bottom: 1px solid rgba(220, 203, 142, 0.1);
		text-decoration: none;
		transition: padding-left 0.3s ease;
	}

	.writing-item:first-child {
		border-top: 1px solid rgba(220, 203, 142, 0.1);
	}

	.writing-meta {
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		color: rgba(243, 235, 216, 0.5);
		display: flex;
		align-items: center;
	}

	.meta-dot {
		margin-inline: 0.5rem;
		color: rgba(220, 203, 142, 0.3);
	}

	.writing-item h3 {
		margin: 0;
		font-family: "Cormorant Garamond", serif;
		font-size: 1.6rem;
		font-weight: 400;
		color: #f3ebd8;
		transition: color 0.3s ease;
		padding-right: 2rem;
	}

	.writing-arrow {
		font-size: 1.5rem;
		color: #dccb8e;
		opacity: 0;
		transform: translateX(-10px);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.writing-item:hover {
		padding-left: 0.5rem;
	}

	.writing-item:hover h3 {
		color: #dccb8e;
	}

	.writing-item:hover .writing-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	@media (max-width: 1024px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.sticky-wrapper {
			height: auto;
		}
		.section-two {
			margin-top: 100vh;
			height: auto;
			min-height: 100vh;
		}
	}

	@media (max-width: 768px) {
		.hero,
		.section-two {
			padding-inline: 1.5rem;
		}

		.hero-bg img {
			width: 140%;
			opacity: 0.12;
		}

		.subtitle {
			font-size: 0.75rem;
			letter-spacing: 0.22em;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			margin-top: 2rem;
		}

		.project-card {
			height: 340px;
		}

		.writing-intro {
			margin: 1rem 0 2rem 0;
		}

		.writing-item {
			grid-template-columns: 1fr auto;
			gap: 0.5rem;
			padding: 1.5rem 0;
		}

		.writing-meta {
			grid-column: 1 / -1;
			margin-bottom: 0.25rem;
		}

		.writing-item h3 {
			font-size: 1.35rem;
			padding-right: 1rem;
		}

		.writing-arrow {
			opacity: 1;
			transform: none;
		}

		.now-content p {
			font-size: 1rem;
		}

		.content-container {
			gap: 4rem;
		}

		.writing-section,
		.now-section {
			gap: 0rem;
			padding-top: 3rem;
		}

		.now-section {
			gap: 2rem;
		}

		.recruiter-section {
			padding-top: 3rem;
		}
	}

	@media (max-width: 480px) {
		.hero h1 {
			font-size: clamp(3rem, 12vw, 4.5rem);
		}

		.hero-bg img {
			width: 180%;
		}
	}
</style>
