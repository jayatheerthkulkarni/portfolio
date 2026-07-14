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
					<span class="category-badge">Systems</span>
					<span class="date">March 2026</span>
				</div>
				<h1 class="post-title">The Terminal is a Lie: PTYs and the Ghosts of 1970s Hardware</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					You boot up your Macbook, open iTerm2, and type <code>ls</code>. It feels like a modern graphical application interacting with a text interface. But it’s a lie. Your modern shell is actively pretending to be a mechanical teletypewriter from the 1970s.
				</p>

				<p>
					In the early days of UNIX, computers were massive mainframes. Users interacted with them via Teletypewriters (TTYs), literal physical printers with keyboards attached via serial cables. When you pressed a key, an electrical pulse went to the mainframe. The mainframe processed it and sent an electrical pulse back, which triggered a mechanical hammer to strike an ink ribbon, printing the character on paper.
				</p>
				<p>
					Today, those physical printers are gone, but the UNIX kernel never forgot them. Every time you open a terminal window, the OS creates a Pseudo-Terminal (PTY).
				</p>

				<h2>The Master and the Slave</h2>
				<p>
					A PTY consists of two parts: a master and a slave. When you open a terminal emulator (like GNOME Terminal or Alacritty), it grabs the master end. The shell (<code>bash</code>, <code>zsh</code>) is attached to the slave end, usually something like <code>/dev/pts/0</code>.
				</p>
				<p>
					The shell doesn't know it's talking to a modern GUI. As far as <code>zsh</code> is concerned, it is communicating with a piece of hardware over a copper wire. The terminal emulator reads your keystrokes, translates them into bytes, and shoves them into the master file descriptor. The kernel passes them to the slave, and the shell reacts.
				</p>

				<h2>In-Band Signaling: The Madness of ANSI</h2>
				<p>
					Because the original TTYs only had a single serial line, there was no separate channel for "metadata" like text color or cursor position. Everything had to be sent in the same stream as the text. This is called in-band signaling.
				</p>
				<p>
					If a program wants to print red text today, it doesn't call an API like <code>setTextColor("red")</code>. Instead, it prints literal escape characters to standard output:
				</p>

				<pre><code>echo -e "\033[31mThis is red text\033[0m"</code></pre>

				<p>
					The terminal emulator parses this stream, spots the <code>\033</code> (the ASCII ESC character), intercepts the command, changes its internal rendering state to red, and then prints the subsequent text. If you redirect that output to a file and open it in a basic text editor, you'll just see garbage characters.
				</p>

				<h2>Why Does This Matter?</h2>
				<p>
					Understanding PTYs is the secret to understanding why background jobs stop when they try to read from <code>stdin</code>, how tools like <code>tmux</code> multiplex sessions, and why <code>SSH</code> works perfectly across the globe. We built a digital abstraction of physical hardware, and we built the entire internet on top of it.
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
