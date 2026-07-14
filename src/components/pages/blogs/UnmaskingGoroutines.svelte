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
					<span class="category-badge">Go</span>
					<span class="date">March 2026</span>
				</div>
				<h1 class="post-title">Your Go Server is Lying to You: Unmasking the Goroutine Scheduler</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					You write an HTTP handler in Go, use the <code>go</code> keyword to spin off a background task, and invoke a database query. The code reads top-to-bottom, exactly like a blocking, synchronous script. But underneath the hood, the Go runtime is orchestrating a massive, asynchronous lie.
				</p>

				<p>
					Goroutines are not OS threads. They aren't even threads in the traditional sense. When you boot up a Go binary, it completely hijacks execution, multiplexing thousands of your "threads" onto a tiny handful of actual OS threads using a brilliant mechanism known as the <code>M:N</code> scheduler.
				</p>

				<h2>The M, P, and G</h2>
				<p>
					To understand the lie, you have to understand the three pillars of the Go runtime:
				</p>
				<ul>
					<li><strong><code>M</code> (Machine):</strong> A real, heavy OS thread managed by the kernel.</li>
					<li><strong><code>G</code> (Goroutine):</strong> A lightweight execution context (just a few KB of stack space).</li>
					<li><strong><code>P</code> (Processor):</strong> A logical processor representing the context required to execute Go code. By default, there is one <code>P</code> for every core on your CPU (defined by <code>GOMAXPROCS</code>).</li>
				</ul>
				<p>
					An OS thread (<code>M</code>) cannot execute a Goroutine (<code>G</code>) unless it holds a logical Processor (<code>P</code>). The <code>P</code> contains a local run-queue of Goroutines waiting for their turn.
				</p>

				<h2>The Great Work Stealing Heist</h2>
				<p>
					What happens when a logical processor (<code>P</code>) runs out of Goroutines to execute? It doesn't just sit idle while other cores do all the work. It initiates a work-stealing algorithm.
				</p>
				<p>
					The idle <code>P</code> will literally peek into the run-queues of other busy <code>P</code>'s and steal half of their pending Goroutines. This ensures that across thousands of concurrent web requests, your CPU cores are perpetually load-balanced without you ever writing a single lock or mutex for thread orchestration.
				</p>

				<h2>The Network Illusion (netpoller)</h2>
				<p>
					Here is where the magic really happens. Let's say your Goroutine makes an HTTP request to an external API:
				</p>

				<pre><code>resp, err := http.Get("https://api.example.com")
// It looks like your thread halts here. It doesn't.</code></pre>

				<p>
					If Go actually blocked the OS thread (<code>M</code>) waiting for a slow network response, your server would choke under high traffic. Instead, the runtime intercepts the network call. It registers the file descriptor with the OS's asynchronous event loop (like <code>epoll</code> on Linux or <code>kqueue</code> on macOS).
				</p>
				<p>
					The runtime then parks your Goroutine, detaches it from the OS thread (<code>M</code>), and instantly slaps a new Goroutine onto that thread. Your thread never stops crunching numbers. Later, when the network data finally arrives, the <code>netpoller</code> wakes your original Goroutine back up, puts it back in the run-queue, and resumes execution right where it left off.
				</p>

				<h2>The Ultimate Abstraction</h2>
				<p>
					You get the massive performance benefits of an asynchronous, event-driven architecture (like Node.js or Rust's Tokio), but you get to write code that looks entirely synchronous and linear. The Go runtime is lying to you, and it's the best lie in modern software engineering.
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
