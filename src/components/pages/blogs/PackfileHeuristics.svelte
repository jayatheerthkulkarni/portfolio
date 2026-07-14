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
					<span class="category-badge">Git</span>
					<span class="date">March 2026</span>
				</div>
				<h1 class="post-title">Git Doesn't Store Diffs: The Genius of Packfile Heuristics</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					Most developers imagine Git as a diff engine. Commit A creates a file. Commit B adds a line. Therefore, Git must store the original file and a mathematical diff showing the new line. It makes logical sense, but it is entirely false.
				</p>

				<p>
					If you look inside the <code>.git/objects</code> directory, you won't find diffs. You will find complete, fully intact snapshots of your files at every single commit. Git is not a time machine of changes; it is a content-addressable key-value database.
				</p>

				<h2>The Storage Paradox</h2>
				<p>
					If Git stores a full copy of every file in every commit, why doesn't a 10-year-old codebase consume terabytes of hard drive space? The answer lies in one of the most brilliant compression algorithms in modern software: the Packfile.
				</p>
				<p>
					When you are actively working, Git stores "loose objects." These are individually <code>zlib</code>-compressed snapshots. But periodically, like when you run <code>git gc</code> or push to a remote server, Git realizes it is wasting space and triggers a packing routine.
				</p>

				<h2>Finding the Deltas</h2>
				<p>
					The packing engine scans your history looking for objects with similar content. It doesn't care about filenames; it only cares about raw bytes. When it finds two files that share massive amounts of data (like a v1 and a v2 of a source file), it decides to compress them together.
				</p>
				<p>
					But here is the genius twist: Git does not store the old file and a diff to create the new file. It does the exact opposite.
				</p>

				<h2>Going Backwards in Time</h2>
				<p>
					Git stores the newest version of the file completely intact. Then, it creates a "delta" (a diff) that explains how to mutate the newest file backwards to recreate the older version.
				</p>
				<p>
					Why? Because 99% of the time, developers are checking out the <code>HEAD</code> of the master branch. By keeping the latest objects fully intact, Git guarantees <code>O(1)</code> checkout speeds for the code you actually care about, trading off slightly more CPU computation for the rare occasions you need to dig five years into the past.
				</p>

				<h2>The Ultimate Architecture</h2>
				<p>
					By separating the logical model (full snapshots) from the storage model (reverse delta-chain packfiles), Linus Torvalds created a system that is both mathematically sound and ferociously fast. Git doesn't store diffs, until it absolutely has to.
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
