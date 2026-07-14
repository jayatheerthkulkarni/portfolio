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
					<span class="category-badge">Architecture</span>
					<span class="date">March 2026</span>
				</div>
				<h1 class="post-title">Time is an Illusion: Why Timestamps Are Ruining Your Distributed System</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					If you have two servers, and Server A records an event at 10:00:01 AM while Server B records an event at 10:00:02 AM, it is a natural human instinct to assume that Event B happened after Event A. In a distributed system, that assumption is a dangerous lie that leads to data corruption and inconsistent state.
				</p>

				<p>
					In distributed computing, "physical time" is unreliable. Between clock drift, leap seconds, and the inherent inaccuracy of the Network Time Protocol (NTP), your servers will never truly agree on what time it is. To build robust systems, we have to abandon the clock and embrace logical causality.
				</p>

				<h2>The Fallacy of Wall-Clock Time</h2>
				<p>
					Modern computers use quartz crystals to keep time, but these crystals vibrate at slightly different frequencies based on temperature and manufacturing. This results in clock drift. While NTP attempts to sync these clocks, it operates over a network with variable latency. If an NTP packet takes 50ms to arrive, your clock is already 50ms wrong the moment it’s set.
				</p>
				<p>
					In a high-throughput system, 50ms is an eternity. Thousands of database writes can happen in that window. If you rely on timestamps for "Last Write Wins" resolution, you will inevitably delete newer data because a server's clock was lagging.
				</p>

				<h2>Enter Lamport Clocks</h2>
				<p>
					In 1978, Leslie Lamport proposed a solution: if we can't agree on the time, let's agree on the order. A Lamport Clock is just a simple integer maintained by each process. The rules are simple:
				</p>
				<ul>
					<li>Every time a process performs an internal event, it increments its counter.</li>
					<li>When a process sends a message, it includes its counter value.</li>
					<li>When a process receives a message, it sets its counter to <code>max(local_counter, message_counter) + 1</code>.</li>
				</ul>
				<p>
					This creates a happened-before relationship. If Event A leads to Event B, Event B will always have a higher counter. We've replaced the untrustworthy physical clock with a reliable logical sequence.
				</p>

				<h2>Beyond Simple Counters: Vector Clocks</h2>
				<p>
					Lamport clocks tell us if one event might have caused another, but they can't detect when events happen independently (concurrency). For that, we use Vector Clocks, an array of counters representing the state of every node in the system.
				</p>
				<p>
					Vector clocks allow a system to detect conflicts. If two users edit the same document offline and then sync, the system can see that their version vectors are "incomparable," meaning neither change knew about the other. This is the foundation of how distributed databases like Riak and Cassandra handle multi-master replication without losing data.
				</p>

				<h2>The Takeaway</h2>
				<p>
					Stop trusting <code>System.currentTimeMillis()</code> for critical logic. In a world of distributed actors, the concept of "now" is local and subjective. Designing for causality instead of chronology is the difference between a system that flakes under pressure and one that is mathematically sound.
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
