<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";

	let searchQuery = "";
	let selectedCategory = "All";

	const blogs = [
		{
			title: "GSoC coding phase: Week 8",
			desc: "Dropping the query filtering system in favor of git repo info --all. Shifting focus to git repo structure, streaming distribution buckets, and Unicode bar charts.",
			link: "#/blogs/gsoc/week-8",
			category: "GSoC",
		},
		{
			title: "GSoC coding phase: Week 7",
			desc: "Expanding the path formatting framework. 7 patches sent to add toplevel, submodule superproject, index, hooks, objects, grafts, and prefix keys.",
			link: "#/blogs/gsoc/week-7",
			category: "GSoC",
		},
		{
			title: "GSoC coding phase: Week 6",
			desc: "Midterm evaluation passed. All three patch series merged into master.",
			link: "#/blogs/gsoc/week-6",
			category: "GSoC",
		},
		{
			title: "GSoC coding phase: Week 5",
			desc: "All three patch series merged into Git's next branch.",
			link: "#/blogs/gsoc/week-5",
			category: "GSoC",
		},
		{
			title: "Ancient Indian UI: The Design Language of This Portfolio",
			desc: "A breakdown of every deliberate design choice in this site: the indigo-navy palette, Cormorant Garamond typography, GSAP motion philosophy, glassmorphic accordions, and how classical Indian aesthetics shaped it all.",
			link: "#/blogs/ui/ancient-indian-ui",
			category: "UI",
		},
		{
			title: "GSoC coding phase: Week 4",
			desc: "Green flag from Junio and building the query system.",
			link: "#/blogs/gsoc/week-4-phase2",
			category: "GSoC",
		},
		{
			title: "GSoC coding phase: Week 3",
			desc: "Final patches and moving on to phase 2.",
			link: "#/blogs/gsoc/week-3-next-steps",
			category: "GSoC",
		},
		{
			title: "GSoC coding phase: Week 2",
			desc: "Addressing feedback for week 1 patches.",
			link: "#/blogs/gsoc/week-2-feedback1",
			category: "GSoC",
		},
		{
			title: "GSoC coding phase: Week 1",
			desc: "The official coding phase kicks off! Diving into the codebase, setting up the development environment, and tackling the first set of tasks and pull requests.",
			link: "#/blogs/gsoc/week-1-path-foundation",
			category: "GSoC",
		},
		{
			title: "GSoC community bonding period",
			desc: "The community bonding period marks the beginning of Google Summer of Code, where contributors connect with mentors, get familiar with the project workflow, and prepare for the coding phase.",
			link: "#/blogs/gsoc/community-bonding-period",
			category: "GSoC",
		},
		{
			title: "GSoC 2026: Contributing to Git",
			desc: "I’ve been selected for Google Summer of Code 2026 under the Git project. This post covers my journey through the mailing list, the work I’ve done so far, and what I’ll be building this summer.",
			link: "#/blogs/gsoc/gsoc-2026-selection",
			category: "GSoC",
		},
		{
			title: "The Weird Paths",
			desc: "From the recursive nightmares of symlinks to the hidden plumbing of virtual filesystems, paths aren't just strings, they're a lie your OS tells you to keep you sane. A journey through the dark corners of the VFS.",
			link: "#/blogs/systems/the-weird-paths",
			category: "Systems",
		},
		{
			title: "The Terminal is a Lie: PTYs and the Ghosts of 1970s Hardware",
			desc: "You think you're typing into a modern app, but your shell is actively pretending to be a physical 1970s teletype machine. The mind-bending architecture of /dev/pts and standard input.",
			link: "#/blogs/systems/the-terminal-is-a-lie",
			category: "Systems",
		},
		{
			title: "Big O Notation Lied to You: Why O(N) in Rust Destroys O(1) HashMaps",
			desc: "Computer Science classes teach you to use HashMaps for speed. Here is a deep dive into CPU cache lines, mechanical sympathy, and why a flat array lookup in Rust will absolutely smoke an O(1) hash map.",
			link: "#/blogs/rust/cache-lines-vs-big-o",
			category: "Rust",
		},
		{
			title: "Git Doesn't Store Diffs: The Genius of Packfile Heuristics",
			desc: "The biggest myth in version control is that Git stores changes. It actually stores full snapshots, until the Packfile algorithm executes one of the most brilliant compression tricks in computer science.",
			link: "#/blogs/git/packfile-heuristics",
			category: "Git",
		},
		{
			title: "Your Go Server is Lying to You: Unmasking the Goroutine Scheduler",
			desc: "Goroutines aren't OS threads, and they aren't magic. A visual breakdown of how the Go runtime hijacks execution, multiplexes threads, and pulls off asynchronous I/O without you ever noticing.",
			link: "#/blogs/go/unmasking-goroutines",
			category: "Go",
		},
		{
			title: "Time is an Illusion: Why Timestamps Are Ruining Your Distributed System",
			desc: "If your microservices rely on wall-clock time or NTP to order events, you are sitting on a ticking time bomb. Understanding Lamport clocks, Vector clocks, and why the concept of 'now' doesn't exist.",
			link: "#/blogs/architecture/illusion-of-time",
			category: "Architecture",
		},
	];

	// Extract unique categories dynamically
	const categories = ["All", ...new Set(blogs.map(b => b.category))];

	onMount(() => {
		window.scrollTo(0, 0);

		// Animate header and content on mount
		const tl = gsap.timeline();
		tl.from(".archive-header *", {
			opacity: 0,
			y: 30,
			duration: 0.8,
			stagger: 0.15,
			ease: "power3.out"
		});

		tl.from(".filter-section", {
			opacity: 0,
			y: 20,
			duration: 0.5,
			ease: "power2.out"
		}, "-=0.4");

		// Run card entrance animation immediately after mounting is complete
		triggerCardEntrance();
	});

	// Re-run card entry animation when category/search updates
	function triggerCardEntrance() {
		setTimeout(() => {
			gsap.fromTo(".blog-card",
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
			);
		}, 50);
	}

	function handleCategorySelect(cat) {
		selectedCategory = cat;
		triggerCardEntrance();
	}

	function handleSearchInput() {
		triggerCardEntrance();
	}
</script>

<Navbar />

<div class="archive-container">
	<header class="archive-header">
		<span class="eyebrow">Writing & Thoughts</span>
		<h1>Blogs Archive</h1>
		<div class="divider-decoration">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>
		<p class="subtitle">Deep dives into systems programming, compiler engineering, and distributed architectures.</p>
	</header>

	<section class="filter-section">
		<div class="search-box">
			<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
			<input
				type="text"
				placeholder="Search articles by keyword..."
				bind:value={searchQuery}
				on:input={handleSearchInput}
			/>
		</div>

		<div class="category-tabs">
			{#each categories as cat}
				<button
					class="tab-btn"
					class:active={selectedCategory === cat}
					on:click={() => handleCategorySelect(cat)}
				>
					{cat}
				</button>
			{/each}
		</div>
	</section>

	<main class="archive-grid">
		{#each blogs.filter(b =>
			(selectedCategory === "All" || b.category === selectedCategory) &&
			(b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			 b.desc.toLowerCase().includes(searchQuery.toLowerCase()))
		) as item}
			<a href={item.link} class="blog-card">
				<div class="card-header">
					<span class="card-badge">{item.category}</span>
				</div>
				<h3>{item.title}</h3>
				<p>{item.desc}</p>
				<span class="read-more">Read Post <span class="arrow">→</span></span>
			</a>
		{:else}
			<div class="empty-state">
				<span class="empty-icon">❈</span>
				<h3>No articles found</h3>
				<p>Try refining your search keyword or selecting a different category.</p>
			</div>
		{/each}
	</main>

	<div class="rule divider">
		<span>❈</span>
		<div class="line"></div>
		<span>❈</span>
	</div>
</div>

<Footer />

<style>
	.archive-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 4rem 2rem;
		min-height: 80vh;
	}

	.archive-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.eyebrow {
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: #dccb8e;
		display: block;
		margin-bottom: 1rem;
	}

	.archive-header h1 {
		font-size: clamp(2.8rem, 6vw, 4.5rem);
		margin: 0 0 1.5rem 0;
		font-weight: 300;
		color: #f3ebd8;
		letter-spacing: -0.02em;
	}

	.divider-decoration {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 150px;
		margin: 0 auto 2rem auto;
	}

	.divider-decoration .line {
		flex: 1;
		height: 1px;
		background: rgba(220, 203, 142, 0.3);
	}

	.divider-decoration span {
		color: #dccb8e;
		font-size: 0.85rem;
	}

	.subtitle {
		font-size: 1.35rem;
		color: rgba(243, 235, 216, 0.7);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
		font-style: italic;
	}

	.filter-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 4rem;
		align-items: center;
	}

	.search-box {
		position: relative;
		width: 100%;
		max-width: 600px;
	}

	.search-icon {
		position: absolute;
		left: 1.25rem;
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		color: #dccb8e;
		opacity: 0.6;
		pointer-events: none;
	}

	.search-box input {
		width: 100%;
		padding: 1.1rem 1.5rem 1.1rem 3.2rem;
		background: rgba(18, 21, 59, 0.3);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 30px;
		color: #f3ebd8;
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		transition: all 0.3s ease;
		box-sizing: border-box;
		outline: none;
	}

	.search-box input:focus {
		border-color: #dccb8e;
		box-shadow: 0 0 15px rgba(220, 203, 142, 0.15);
		background: rgba(18, 21, 59, 0.5);
	}

	.category-tabs {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.tab-btn {
		background: transparent;
		border: 1px solid rgba(220, 203, 142, 0.15);
		color: rgba(243, 235, 216, 0.75);
		padding: 0.6rem 1.2rem;
		border-radius: 20px;
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.tab-btn:hover {
		border-color: #dccb8e;
		color: #f3ebd8;
		background: rgba(220, 203, 142, 0.05);
	}

	.tab-btn.active {
		background: rgba(220, 203, 142, 0.15);
		border-color: #dccb8e;
		color: #dccb8e;
		box-shadow: 0 0 10px rgba(220, 203, 142, 0.1);
	}

	.archive-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2.5rem;
		margin-bottom: 5rem;
	}

	.blog-card {
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: #f3ebd8;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		cursor: pointer;
		box-sizing: border-box;
	}

	.blog-card:hover {
		border: 1px solid #dccb8e !important;
		transform: translateY(-6px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
		background: rgba(18, 21, 59, 0.4);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.card-badge {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		font-weight: 500;
	}

	.blog-card h3 {
		font-size: 1.7rem;
		margin: 0 0 1.25rem 0;
		font-weight: 400;
		line-height: 1.3;
		transition: color 0.3s ease;
	}

	.blog-card:hover h3 {
		color: #dccb8e;
	}

	.blog-card p {
		font-family: "Inter", sans-serif;
		font-size: 0.95rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.65);
		margin: 0 0 2rem 0;
		flex-grow: 1;
	}

	.read-more {
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #dccb8e;
		font-weight: 500;
		margin-top: auto;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.read-more .arrow {
		transition: transform 0.3s ease;
	}

	.blog-card:hover .read-more .arrow {
		transform: translateX(5px);
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 5rem 2rem;
		border: 1px dashed rgba(220, 203, 142, 0.2);
		border-radius: 12px;
		background: rgba(18, 21, 59, 0.15);
	}

	.empty-icon {
		font-size: 2rem;
		color: #dccb8e;
		opacity: 0.6;
		display: block;
		margin-bottom: 1.5rem;
	}

	.empty-state h3 {
		font-size: 1.8rem;
		margin: 0 0 0.75rem 0;
		font-weight: 400;
	}

	.empty-state p {
		color: rgba(243, 235, 216, 0.6);
		margin: 0;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		margin: 4rem 0 2rem 0;
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
		.archive-container {
			padding: 3rem 1.5rem;
		}

		.archive-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.blog-card {
			padding: 2rem;
		}
	}
</style>
