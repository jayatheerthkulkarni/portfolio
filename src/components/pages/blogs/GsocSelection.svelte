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
				<h1 class="post-title">I've been accepted to Google Summer of Code 2026 with Git!</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					I am incredibly excited to announce that my proposal to improve the new <code>git repo</code> command has been accepted for Google Summer of Code 2026.
				</p>

				<p>
					As a junior Computer Science undergraduate with a focus on systems programming, getting the chance to work directly on the internals of version control is a huge milestone. I have been an active contributor to the Git mailing list since February 2025, navigating the patch lifecycle to merge fixes into master. Now, I get to dedicate my summer to a much larger architectural effort.
				</p>

				<h2>The Two Main Deliverables</h2>
				<p>
					My GSoC project takes on an idea directly from the 2026 Ideas list: expanding and optimizing the <code>git repo</code> command. There are two primary challenges I will be tackling:
				</p>
				<ul>
					<li><strong>Path Resolution:</strong> I will be implementing <code>path.*</code> keys for the <code>repo info</code> command. The architectural blocker here is ensuring the command can return both an absolute and a relative path in the exact same invocation. This covers vital paths like <code>path.git-dir</code> and <code>path.toplevel</code>.</li>
					<li><strong>Category-Based Querying:</strong> As the list of keys expands, the current "all-or-nothing" output becomes a bottleneck. Users shouldn't have to dump everything just to use tools like <code>grep</code>.</li>
				</ul>
				<p>
					To solve the querying bottleneck, I will be building a fast, prefix-based query system.
				</p>

				<h2>Optimizing with Binary Search</h2>
				<p>
					The internal <code>repo_info_fields</code> array is static and sorted lexicographically. This means I can build a fast lookup mechanism without relying on heavy data structures like hash maps.
				</p>

				<pre><code>$ git repo info layout
layout.bare=false
layout.shallow=false</code></pre>

				<p>
					I'll be writing a custom binary search algorithm to locate the exact start of the prefix group and enforce strict namespace boundaries. While a linear scan is fast enough for the 13 or so elements we currently have, this command is designed to grow. Establishing a scalable foundation today prevents performance bottlenecks tomorrow.
				</p>

				<h2>Diagnostics and What's Next</h2>
				<p>
					Git takes code review seriously, so stability is my top priority. I'll be submitting my work as an organized, unified patch series to respect the maintainers' time and ensure a clean review cycle.
				</p>
				<p>
					If time permits, I've also outlined a stretch goal to enhance the <code>repo structure</code> command with detailed diagnostics. Instead of just returning raw extreme maximums, I hope to implement a streaming bucketing system to visualize object size and entry distributions as ASCII bar charts.
				</p>
				<p>
					I'll be dedicating 35-40 hours a week to this project and documenting the entire journey right here. A huge thank you to the Git community for their mentorship so far. Let's get to work!
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

	.post-content pre {
		background: rgba(25, 25, 25, 0.4);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 8px;
		padding: 1.25rem;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.post-content pre code {
		background: transparent;
		border: none;
		padding: 0;
		font-size: 0.95rem;
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
