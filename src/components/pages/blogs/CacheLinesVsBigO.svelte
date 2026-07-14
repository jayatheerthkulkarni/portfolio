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
					<span class="category-badge">Rust</span>
					<span class="date">March 2026</span>
				</div>
				<h1 class="post-title">Big O Notation Lied to You: Why O(N) in Rust Destroys O(1) HashMaps</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					In Computer Science 101, you are taught a fundamental truth: if you need to look something up fast, use a Hash Map. It provides <code>O(1)</code> constant time lookups. Arrays, on the other hand, require an <code>O(N)</code> linear scan. Therefore, Hash Maps are mathematically faster.
				</p>

				<p>
					But when you run the benchmarks on modern hardware, a simple <code>Vec&lt;T&gt;</code> linear scan in Rust will often completely obliterate a <code>HashMap&lt;K, V&gt;</code> for small to medium datasets. Welcome to the reality of mechanical sympathy.
				</p>

				<h2>The Memory Wall</h2>
				<p>
					Big O notation counts instructions. It assumes that executing an operation (like checking a value) takes a uniform amount of time. Modern CPUs do not work this way. Today, CPUs are blindingly fast, but RAM is agonizingly slow. We hit the "Memory Wall" decades ago.
				</p>
				<p>
					To fix this, CPU manufacturers added <code>L1</code>, <code>L2</code>, and <code>L3</code> caches directly onto the chip. Reading from the <code>L1</code> cache takes about 1 nanosecond. Reading from main memory (RAM) takes about 100 nanoseconds. A cache miss is 100 times slower than a cache hit.
				</p>

				<h2>The Cache Line: Fetching in Bulk</h2>
				<p>
					When you ask the CPU to read a single byte from RAM, it doesn't just grab one byte. That would be inefficient. Instead, the memory controller grabs a 64-byte chunk called a cache line.
				</p>

				<h2>Why the Vec Wins</h2>
				<p>
					A Rust <code>Vec&lt;T&gt;</code> guarantees that your data is stored contiguously in memory. If you are linearly scanning an array of 32-bit integers, pulling the very first integer from RAM drags the next 15 integers into the <code>L1</code> cache for free. The CPU prefetcher notices you are scanning linearly and starts fetching the next cache line before you even ask for it. The CPU is blazing through the loop without ever stalling.
				</p>

				<pre><code>// This O(N) scan has perfect data locality
let target = 42;
let found = my_vec.iter().find(|&&x| x == target);</code></pre>

				<h2>The HashMap Penalty</h2>
				<p>
					A <code>HashMap</code> scatters data randomly across memory based on the hash of the key. Looking up a value requires:
				</p>
				<ul>
					<li>Calculating a cryptographic-strength hash (<code>SipHash</code> by default in Rust).</li>
					<li>Jumping to a random memory address (guaranteeing a cache miss).</li>
					<li>Waiting 100ns for main memory to respond.</li>
				</ul>
				<p>
					For datasets under a few thousand elements, the CPU can sequentially compare hundreds of items in the <code>L1</code> cache in the exact same time it takes to wait for a single random RAM fetch to return.
				</p>

				<h2>The Takeaway</h2>
				<p>
					Big O notation describes asymptotic scaling as <code>N</code> approaches infinity. But your dataset isn't infinite. Before you reach for a <code>HashMap</code> to "optimize" a lookup of 50 items, remember: modern performance is about minimizing cache misses, not minimizing instructions.
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
