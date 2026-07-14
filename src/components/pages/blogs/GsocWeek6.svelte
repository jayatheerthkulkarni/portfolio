<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	onMount(() => {
		window.scrollTo(0, 0);
		const tl = gsap.timeline();
		tl.from(".back-link", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" });
		tl.from(".post-header *", { opacity: 0, y: 25, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.3");
		tl.from(".post-content > *", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4");
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
					<span class="date">July 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026 Week 6: Halfway There</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					Week 6 of Google Summer of Code. I can't believe we're already halfway through.
				</p>

				<p>
					I'm happy to share that I have successfully passed my midterm evaluation. The first half of GSoC has been an incredible learning experience, and I am also glad to announce that all three of my patch series have been merged into <code>master</code>.
				</p>

				<p>
					Watching patches travel the full journey, from a draft on the mailing list, through <code>seen</code>, into <code>next</code>, and finally land in <code>master</code>, is one of those things you have to experience to fully appreciate. It's slow, deliberate, and unforgiving, and that's exactly what makes it meaningful.
				</p>

				<p>
					A huge thank you to my mentors, <strong>Justin Tobler</strong> and <strong>Lucas Seiki Oshiro</strong>, for their patience, detailed feedback, and mentorship throughout this journey. Their reviews pushed me to think more carefully about API design, test coverage, and backward compatibility than I ever had before.
				</p>

				<p>
					Six weeks in. Six more to go. I'm excited to keep contributing.
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
	.blog-post-page { max-width: 100%; padding: 4rem 1.5rem; box-sizing: border-box; }
	.article-wrapper { max-width: 760px; margin: 0 auto; }

	.back-link {
		display: inline-flex; align-items: center; gap: 0.5rem;
		color: #dccb8e; text-decoration: none; font-family: "Inter", sans-serif;
		font-size: 0.9rem; transition: all 0.3s ease; margin-bottom: 3rem;
	}
	.back-link:hover { color: #f3ebd8; transform: translateX(-4px); }

	.post-header { margin-bottom: 3.5rem; }
	.post-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }

	.category-badge, .week-badge {
		font-family: "Inter", sans-serif; font-size: 0.75rem;
		text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500;
	}
	.category-badge { color: #dccb8e; }
	.week-badge {
		color: rgba(220, 203, 142, 0.7);
		border: 1px solid rgba(220, 203, 142, 0.25);
		padding: 0.2rem 0.6rem; border-radius: 20px;
	}
	.date { font-family: "Inter", sans-serif; font-size: 0.85rem; color: rgba(243, 235, 216, 0.4); }

	.post-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 300; line-height: 1.25; margin: 0; color: #f3ebd8; letter-spacing: -0.02em; }

	.post-content { font-family: "Inter", sans-serif; color: rgba(243, 235, 216, 0.85); }

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

	.post-content strong { color: #f3ebd8; font-weight: 600; }

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1); color: #dccb8e;
		padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}

	.rule { display: flex; align-items: center; gap: 0.75rem; width: 100%; margin: 5rem 0 2rem 0; }
	.line { flex: 1; height: 1px; background: rgba(243, 235, 216, 0.15); }
	.rule span { color: #dccb8e; font-size: 0.8rem; line-height: 1; flex-shrink: 0; }

	@media (max-width: 768px) {
		.blog-post-page { padding: 2.5rem 1rem; }
		.post-content p.lead { font-size: 1.1rem; }
		.post-content p { font-size: 1rem; }
	}
</style>
