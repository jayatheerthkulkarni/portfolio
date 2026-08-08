<script>
	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";
	import { onMount } from "svelte";
	import { gsap } from "gsap";

	let activeJournalWeek = 1;
	let carouselContainer;

	function scrollCarousel(direction) {
		if (carouselContainer) {
			const scrollAmount = 352; // card width + gap
			carouselContainer.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth"
			});
		}
	}

	const journalWeeks = [
			{
				week: 1,
				title: "Coding Phase Kicks Off",
				desc: "The official coding phase kicks off! Diving into the codebase, setting up the development environment, and tackling the first set of tasks.",
				link: "#/blogs/gsoc/week-1-path-foundation"
			},
			{
				week: 2,
				title: "Patch Review & Feedback",
				desc: "Addressing mailing list review feedback for the Week 1 patch series and refining the path resolution implementations.",
				link: "#/blogs/gsoc/week-2-feedback1"
			},
			{
				week: 3,
				title: "Finalizing Phase 1 Patches",
				desc: "Finalizing initial path patches and preparing the groundwork to transition into phase 2 features.",
				link: "#/blogs/gsoc/week-3-next-steps"
			},
			{
				week: 4,
				title: "Query System & Feedback",
				desc: "Receiving green flags from Junio C Hamano and beginning work on building the query filtering system.",
				link: "#/blogs/gsoc/week-4-phase2"
			},
			{
				week: 5,
				title: "Merging to 'next'",
				desc: "A major milestone reached as all three initial patch series get merged into Git's 'next' integration branch.",
				link: "#/blogs/gsoc/week-5"
			},
			{
				week: 6,
				title: "Merged to Master & Midterm",
				desc: "Passed the GSoC midterm evaluation smoothly with all three patch series successfully merged directly into master.",
				link: "#/blogs/gsoc/week-6"
			},
			{
				week: 7,
				title: "Expanding Path Keys",
				desc: "Expanding the path formatting framework with a 7-patch series adding toplevel, superproject, index, hooks, objects, grafts, and prefix keys.",
				link: "#/blogs/gsoc/week-7"
			},
			{
				week: 8,
				title: "Pivoting Scope & Bar Charts",
				desc: "Ditching the query system after mailing list consensus. Pivoting scope to git repo structure, object distribution buckets, and Unicode bar charts.",
				link: "#/blogs/gsoc/week-8"
			},
			{
				week: 9,
				title: "Unicode Output & Locale Detection",
				desc: "Adding Unicode box-drawing output to git repo structure, fixing UTF-8 locale detection, and writing a reliable regression test.",
				link: "#/blogs/gsoc/week-9"
			},
			{
				week: 10,
				title: "New Path Keys for git repo info",
				desc: "Adding new path keys, refining the interface through review, and preparing a clean four-revision patch series.",
				link: "#/blogs/gsoc/week-10"
			},
		];

	function scrollToSection(id) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	}

	onMount(() => {
		window.scrollTo(0, 0);

		const ctx = gsap.context(() => {
			gsap.from(".gsoc-hero-content *", {
				opacity: 0,
				y: 35,
				duration: 0.9,
				stagger: 0.15,
				ease: "power3.out"
			});
		});

		return () => ctx.revert();
	});
</script>

<Navbar />

<div class="gsoc-page">
	<div class="page-container">

		<section class="gsoc-hero">
			<div class="gsoc-hero-content">
				<span class="eyebrow">Google Summer of Code 2026</span>
				<h1>Improving Git,</h1>
				<h1 class="accent-title">one patch at a time.</h1>
				<p class="hero-subtitle">Proposal accepted for improving the new <code>git repo</code> command.</p>

				<div class="hero-meta">
					<span class="meta-item">Git Project</span>
					<span class="meta-separator">❈</span>
					<span class="meta-item">2026</span>
				</div>

				<button on:click={() => scrollToSection("context")} class="scroll-cta">
					<span>Read Proposal</span>
					<span class="arrow-down">↓</span>
				</button>
			</div>
		</section>

		<section class="status-section">
			<div class="status-card">
				<div class="status-header">
					<span class="status-title-icon">❈</span>
					<h3>Live Status</h3>
					<span class="status-year">SUMMER 2026</span>
				</div>
				<div class="status-timeline">
					<div class="status-item done">
						<span class="status-icon">✓</span>
						<span class="status-label">Proposal Submitted</span>
					</div>
					<div class="status-item done">
						<span class="status-icon">✓</span>
						<span class="status-label">Community Bonding</span>
					</div>
					<div class="status-item done">
						<span class="status-icon">✓</span>
						<span class="status-label">Coding Phase</span>
					</div>
					<div class="status-item done">
						<span class="status-icon">✓</span>
						<span class="status-label">Midterm</span>
					</div>
					<div class="status-item active">
						<span class="status-icon">✦</span>
						<span class="status-label">Second Half (ongoing)</span>
					</div>
					<div class="status-item pending">
						<span class="status-icon">○</span>
						<span class="status-label">Final Evaluation</span>
					</div>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section id="context" class="context-section">
			<div class="context-content">
				<span class="eyebrow">The Journey</span>
				<p class="context-text">
					It started with a simple search for a real-world C codebase to study and contribute to.
				</p>
				<p class="context-subtext">
					That search led me to Git, where what began as an exploration of C quickly evolved into a fascination with version control systems and software collaboration.
				</p>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="objectives-section">
			<div class="section-header">
				<span class="eyebrow">Deliverables</span>
				<h2>Proposal Objectives</h2>
				<p class="section-desc">The proposal naturally breaks into these three deliverables.</p>
			</div>

			<div class="objectives-grid">
				<div class="objective-card">
					<span class="obj-num">Objective 01</span>
					<h3>Path Resolution</h3>
					<p>Implement <code>path.*</code> keys for <code>git repo info</code>, enabling developers to query resolved paths inside worktree environments.</p>
				</div>

				<div class="objective-card">
					<span class="obj-num">Objective 02</span>
					<h3>Unicode & Histograms</h3>
					<p>Adding unicode character safety and histogram representation support inside the git repo structure.</p>
				</div>

				<div class="objective-card stretch">
					<span class="obj-num">Stretch Goal</span>
					<h3>Repository Diagnostics</h3>
					<p>Repository health metrics through distribution-based diagnostic calculations to monitor repository bloating over time.</p>
				</div>
			</div>
		</section>



		<section class="numbers-section">
			<div class="numbers-grid">
				<div class="number-card">
					<span class="num-val">10+</span>
					<span class="num-lbl">Merged Patches</span>
				</div>
				<div class="number-card">
					<span class="num-val">4</span>
					<span class="num-lbl">Major Patch Series</span>
				</div>
				<div class="number-card">
					<span class="num-val">35-40</span>
					<span class="num-lbl">Hours Every Week</span>
				</div>
				<div class="number-card">
					<span class="num-val">13</span>
					<span class="num-lbl">Weeks duration</span>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="proposal-preview-section">
			<div class="preview-card">
				<div class="proposal-book-render">
					<div class="book-spine"></div>
					<div class="book-cover">
						<div class="book-title">
							<span>❈</span>
							<h2>PROPOSAL</h2>
							<span class="book-sub">9 PAGES</span>
						</div>
					</div>
				</div>

				<div class="proposal-info">
					<span class="eyebrow">Read Accepted PDF</span>
					<h2>Improve the new git repo command</h2>
					<p class="proposal-desc-text">
						A detailed overview of GSoC objectives, deliverables, scheduling milestones, and Git codebase structure.
					</p>
					<a href="/git_repo_proposal.pdf" target="_blank" class="read-btn">
						Read PDF →
					</a>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="what-building-section">
			<div class="section-header">
				<span class="eyebrow">Architecture</span>
				<h2>What I'm Building</h2>
			</div>

			<div class="animated-flow-wrapper">
				<div class="flow-node">
					<span class="node-icon">❈</span>
					<span class="node-title">git repo</span>
				</div>
				<div class="flow-line"></div>
				<div class="flow-node">
					<span class="node-icon">❈</span>
					<span class="node-title">repo info</span>
				</div>
				<div class="flow-line"></div>
				<div class="flow-node">
					<span class="node-icon">❈</span>
					<span class="node-title">path.*</span>
				</div>
				<div class="flow-line"></div>
				<div class="flow-node">
					<span class="node-icon">❈</span>
					<span class="node-title">unicode & histogram</span>
				</div>
				<div class="flow-line"></div>
				<div class="flow-node highlight">
					<span class="node-icon">✦</span>
					<span class="node-title">better tooling</span>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="journal-section">
			<div class="section-header journal-header">
				<div class="header-text">
					<span class="eyebrow">Development log</span>
					<h2>Weekly Journal</h2>
				</div>
				<div class="carousel-controls">
					<button class="control-btn" on:click={() => scrollCarousel('left')} aria-label="Scroll left">←</button>
					<button class="control-btn" on:click={() => scrollCarousel('right')} aria-label="Scroll right">→</button>
				</div>
			</div>

			<div class="journal-carousel-wrapper">
				<div class="journal-carousel" bind:this={carouselContainer}>
					{#each journalWeeks as item}
						<a href={item.link} class="journal-blog-card">
							<span class="card-week">Week {item.week}</span>
							<h3>{item.title}</h3>
							<p>{item.desc}</p>
							<span class="card-link">Read Blog →</span>
						</a>
					{/each}
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="lessons-section">
			<div class="lessons-content">
				<span class="eyebrow">Lessons</span>
				<h2>What Git taught me</h2>
				<p class="lessons-text">
					Building software asynchronously. I learned how global scale systems are coordinated and maintained entirely through mailing lists, email patches, and decentralized reviews.
				</p>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="gsoc-quote-section">
			<div class="quote-content">
				<blockquote>
					"The best way to understand software is to help build it."
				</blockquote>
			</div>
		</section>

	</div>
</div>

<Footer />

<style>
	:global(body) {
		background-color: #12153b !important;
	}

	.gsoc-page {
		min-height: 100vh;
		color: #f3ebd8;
		font-family: "Cormorant Garamond", serif;
		padding: 4rem 2rem;
		box-sizing: border-box;
	}

	.page-container {
		width: min(1200px, 100%);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.gsoc-hero {
		min-height: 70vh;
		display: flex;
		align-items: center;
		padding-top: 4rem;
	}

	.gsoc-hero-content {
		max-width: 900px;
	}

	.eyebrow {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.25em;
		color: #dccb8e;
		display: block;
		margin-bottom: 1.5rem;
	}

	.gsoc-hero-content h1 {
		font-size: clamp(3.5rem, 6.5vw, 6rem);
		font-weight: 500;
		margin: 0;
		line-height: 1.1;
	}

	.accent-title {
		color: #dccb8e;
		font-style: italic;
	}

	.hero-subtitle {
		font-family: "Inter", sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		color: rgba(243, 235, 216, 0.75);
		margin: 2rem 0 3rem 0;
		line-height: 1.6;
		max-width: 600px;
	}

	.hero-meta {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.meta-item {
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
	}

	.meta-separator {
		color: rgba(220, 203, 142, 0.3);
		font-size: 0.8rem;
	}

	.scroll-cta {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		color: #dccb8e;
		text-decoration: none;
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		transition: color 0.3s ease;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.scroll-cta:hover {
		color: #f3ebd8;
	}

	.arrow-down {
		font-size: 1.1rem;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(5px); }
	}

	.status-section {
		padding: 2rem 0;
	}

	.status-card {
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 3rem;
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid rgba(220, 203, 142, 0.1);
		padding-bottom: 1.25rem;
	}

	.status-title-icon {
		color: #dccb8e;
		font-size: 0.9rem;
	}

	.status-header h3 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		flex-grow: 1;
	}

	.status-year {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		color: rgba(243, 235, 216, 0.4);
	}

	.status-timeline {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 1.5rem;
	}

	.status-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
	}

	.status-icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: "Inter", sans-serif;
		font-weight: bold;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.status-item.done .status-icon {
		border: 1px solid #a8dccb;
		background: rgba(168, 220, 203, 0.12);
		color: #a8dccb;
	}

	.status-item.active .status-icon {
		border: 1px solid #dccb8e;
		background: rgba(220, 203, 142, 0.15);
		color: #dccb8e;
		box-shadow: 0 0 15px rgba(220, 203, 142, 0.25);
	}

	.status-item.pending .status-icon {
		border: 1px dashed rgba(243, 235, 216, 0.2);
		color: rgba(243, 235, 216, 0.3);
	}

	.status-label {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		line-height: 1.4;
		color: rgba(243, 235, 216, 0.6);
	}

	.status-item.active .status-label {
		color: #dccb8e;
		font-weight: 500;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
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

	.context-section {
		padding: 4rem 0;
	}

	.context-content {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	.context-text {
		font-size: 1.85rem;
		line-height: 1.5;
		color: #f3ebd8;
		margin-bottom: 2rem;
		font-style: italic;
	}

	.context-subtext {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(243, 235, 216, 0.65);
		max-width: 600px;
		margin: 0 auto;
	}

	.section-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.section-header h2 {
		margin: 0 0 1rem 0;
		font-size: clamp(2.5rem, 4vw, 3.5rem);
		font-weight: 400;
	}

	.section-desc {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(243, 235, 216, 0.6);
		margin: 0;
	}

	.objectives-section {
		padding: 2rem 0;
	}

	.objectives-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 3rem;
	}

	.objective-card {
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 3.5rem 3rem;
		transition: border-color 0.3s ease, transform 0.3s ease;
	}

	.objective-card:hover {
		border-color: rgba(220, 203, 142, 0.45);
		transform: translateY(-4px);
	}

	.objective-card.stretch {
		grid-column: 1 / -1;
		width: min(600px, 100%);
		margin: 0 auto;
	}

	.obj-num {
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		color: #dccb8e;
		display: block;
		margin-bottom: 1.5rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-weight: 500;
	}

	.objective-card h3 {
		font-size: 2.1rem;
		margin: 0 0 1.5rem 0;
		font-weight: 400;
	}

	.objective-card p {
		font-family: "Inter", sans-serif;
		font-size: 0.95rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.7);
		margin: 0;
	}

	.contributions-section {
		padding: 2rem 0;
	}

	.contributions-flow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.flow-step {
		display: flex;
		align-items: center;
		gap: 2rem;
		width: 100%;
		padding: 0.75rem 0;
	}

	.flow-date {
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		font-weight: bold;
		color: #dccb8e;
		width: 100px;
		text-align: right;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.flow-circle {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(243, 235, 216, 0.3);
		border: 2px solid #12153b;
		outline: 1px solid rgba(243, 235, 216, 0.3);
		flex-shrink: 0;
	}

	.flow-circle.active {
		background: #dccb8e;
		outline-color: #dccb8e;
		box-shadow: 0 0 10px #dccb8e;
	}

	.flow-desc {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(243, 235, 216, 0.75);
	}

	.flow-desc.highlight {
		color: #dccb8e;
		font-weight: bold;
	}

	.flow-connector {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(220, 203, 142, 0.4);
		margin-left: 100px;
		transform: translateX(6px);
		height: 16px;
		line-height: 16px;
	}

	.numbers-section {
		padding: 2rem 0;
	}

	.numbers-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
	}

	.number-card {
		text-align: center;
	}

	.num-val {
		font-size: clamp(3.5rem, 5vw, 5.5rem);
		font-weight: bold;
		color: #dccb8e;
		display: block;
		line-height: 1;
		margin-bottom: 0.75rem;
	}

	.num-lbl {
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: rgba(243, 235, 216, 0.6);
	}

	.proposal-preview-section {
		padding: 2rem 0;
		display: flex;
		justify-content: center;
	}

	.preview-card {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 4rem;
		align-items: center;
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 4rem;
		max-width: 800px;
		width: 100%;
	}

	.proposal-book-render {
		position: relative;
		width: 180px;
		height: 250px;
		background: #142a22;
		border-radius: 4px 12px 12px 4px;
		box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.5);
		display: flex;
		overflow: hidden;
		justify-self: center;
	}

	.book-spine {
		width: 15px;
		background: #0d1e18;
		height: 100%;
		border-right: 1px solid rgba(220, 203, 142, 0.15);
	}

	.book-cover {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1rem 0.5rem;
	}

	.book-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
	}

	.book-title span {
		color: #dccb8e;
		font-size: 1.1rem;
	}

	.book-title h2 {
		margin: 0;
		font-size: 1.4rem;
		letter-spacing: 0.1em;
		font-weight: 300;
		line-height: 1.1;
	}

	.book-sub {
		font-family: "Inter", sans-serif;
		font-size: 0.55rem;
		letter-spacing: 0.1em;
		color: rgba(243, 235, 216, 0.5);
	}

	.proposal-info h2 {
		font-size: clamp(2rem, 4vw, 2.8rem);
		margin: 0 0 0.5rem 0;
		font-weight: 400;
	}

	.proposal-desc-text {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.7);
		margin: 0 0 2.5rem 0;
	}

	.read-btn {
		display: inline-flex;
		align-items: center;
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #12153b;
		background-color: #dccb8e;
		padding: 0.85rem 1.75rem;
		border-radius: 6px;
		text-decoration: none;
		transition: background-color 0.3s ease, transform 0.3s ease;
	}

	.read-btn:hover {
		background-color: #f3ebd8;
		transform: translateY(-2px);
	}

	.what-building-section {
		padding: 2rem 0;
	}

	.animated-flow-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		padding: 3rem;
		background: rgba(25, 25, 25, 0.15);
		border: 1px solid rgba(220, 203, 142, 0.1);
		border-radius: 12px;
		flex-wrap: wrap;
	}

	.flow-node {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: rgba(18, 21, 59, 0.5);
		border: 1px solid rgba(220, 203, 142, 0.25);
		padding: 1rem 1.5rem;
		border-radius: 6px;
	}

	.flow-node.highlight {
		border-color: #dccb8e;
		background: rgba(220, 203, 142, 0.1);
		box-shadow: 0 0 15px rgba(220, 203, 142, 0.15);
	}

	.node-icon {
		color: #dccb8e;
		font-size: 0.85rem;
	}

	.node-title {
		font-family: "Inter", sans-serif;
		font-size: 0.95rem;
		color: #f3ebd8;
		font-weight: 500;
	}

	.flow-node.highlight .node-title {
		color: #dccb8e;
	}

	.flow-line {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 24px;
	}

	.flow-line::before {
		content: "→";
		color: rgba(220, 203, 142, 0.6);
		font-size: 1.2rem;
		font-family: "Inter", sans-serif;
	}

	.journal-section {
		padding: 2rem 0;
	}

	.journal-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 3rem;
	}

	.journal-header .header-text {
		text-align: left;
	}

	.carousel-controls {
		display: flex;
		gap: 1rem;
	}

	.control-btn {
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.2);
		color: #dccb8e;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-family: "Inter", sans-serif;
		font-size: 1.1rem;
		transition: all 0.3s ease;
	}

	.control-btn:hover {
		border-color: #dccb8e;
		background: rgba(220, 203, 142, 0.15);
		color: #f3ebd8;
		transform: scale(1.05);
	}

	.journal-carousel-wrapper {
		width: 100%;
		overflow: hidden;
		padding: 1.5rem 0;
	}

	.journal-carousel {
		display: flex;
		gap: 2rem;
		overflow-x: auto;
		scroll-behavior: smooth;
		padding: 1.5rem 1rem;
		margin: -1.5rem -1rem;
		scrollbar-width: thin;
		scrollbar-color: rgba(220, 203, 142, 0.3) rgba(243, 235, 216, 0.05);
	}

	.journal-carousel::-webkit-scrollbar {
		height: 4px;
	}

	.journal-carousel::-webkit-scrollbar-track {
		background: rgba(243, 235, 216, 0.05);
		border-radius: 4px;
	}

	.journal-carousel::-webkit-scrollbar-thumb {
		background: rgba(220, 203, 142, 0.3);
		border-radius: 4px;
	}

	.journal-carousel::-webkit-scrollbar-thumb:hover {
		background: #dccb8e;
	}

	.journal-blog-card {
		width: 320px;
		flex-shrink: 0;
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 2.5rem 2rem;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: #f3ebd8;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		cursor: pointer;
		box-sizing: border-box;
	}

	.journal-blog-card:hover {
		border: 1px solid #dccb8e !important;
		transform: translateY(-6px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
		background: rgba(18, 21, 59, 0.4);
	}

	.card-week {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		margin-bottom: 1rem;
		display: block;
	}

	.journal-blog-card h3 {
		font-size: 1.6rem;
		margin: 0 0 1.25rem 0;
		font-weight: 400;
		line-height: 1.2;
		transition: color 0.3s ease;
	}

	.journal-blog-card:hover h3 {
		color: #dccb8e;
	}

	.journal-blog-card p {
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.65);
		margin: 0 0 2rem 0;
		flex-grow: 1;
	}

	.card-link {
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #dccb8e;
		font-weight: 500;
		margin-top: auto;
		display: inline-block;
	}

	.gallery-section {
		padding: 2rem 0;
	}

	.gallery-cards-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2.5rem;
	}

	.gallery-card-item {
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		background: rgba(25, 25, 25, 0.2);
		overflow: hidden;
		transition: border-color 0.3s ease, transform 0.3s ease;
	}

	.gallery-card-item:hover {
		border-color: rgba(220, 203, 142, 0.4);
		transform: translateY(-4px);
	}

	.gallery-card-item.double-width {
		grid-column: 1 / -1;
	}

	.card-img-placeholder {
		padding: 4rem 2rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.card-img-placeholder .icon {
		font-size: 2.5rem;
		color: #dccb8e;
		opacity: 0.8;
	}

	.card-img-placeholder h4 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 400;
		color: #f3ebd8;
	}

	.lessons-section {
		padding: 4rem 0;
		text-align: center;
	}

	.lessons-content {
		max-width: 700px;
		margin: 0 auto;
	}

	.lessons-content h2 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		margin: 0 0 2rem 0;
	}

	.lessons-text {
		font-size: clamp(1.4rem, 3vw, 2.2rem);
		line-height: 1.5;
		color: #f3ebd8;
		font-style: italic;
		font-weight: 300;
	}

	.gsoc-quote-section {
		padding: 4rem 0;
		text-align: center;
	}

	blockquote {
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1.4;
		margin: 0 0 3.5rem 0;
		font-style: italic;
		font-weight: 300;
	}

	.quote-meta p {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(243, 235, 216, 0.5);
		margin: 0;
	}

	@media (max-width: 1024px) {
		.status-timeline {
			grid-template-columns: repeat(3, 1fr);
			gap: 2rem;
		}

		.objectives-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.numbers-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem;
		}

		.preview-card {
			grid-template-columns: 1fr;
			gap: 3rem;
			padding: 3rem;
		}

		.gallery-cards-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.gsoc-page {
			padding: 2rem 1rem;
		}

		.page-container {
			gap: 4rem;
		}

		.gsoc-hero {
			min-height: auto;
			padding-top: 2rem;
		}

		.status-card {
			padding: 1.5rem 1rem;
		}

		.status-timeline {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}

		.objective-card {
			padding: 1.75rem 1.25rem;
		}

		.preview-card {
			padding: 1.75rem 1.25rem;
			gap: 2rem;
		}

		.animated-flow-wrapper {
			flex-direction: column;
			gap: 1rem;
			padding: 1.5rem 1rem;
		}

		.flow-line {
			width: 24px;
			height: 24px;
		}

		.flow-line::before {
			content: "↓";
		}

		.journal-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1.5rem;
		}

		.context-section {
			padding: 2rem 0;
		}
	}

	@media (max-width: 480px) {
		.journal-blog-card {
			width: calc(100vw - 3.5rem);
			max-width: 290px;
			padding: 1.75rem 1.25rem;
		}

		.numbers-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}

		.num-val {
			font-size: clamp(2.5rem, 8vw, 4rem);
		}
	}
</style>
