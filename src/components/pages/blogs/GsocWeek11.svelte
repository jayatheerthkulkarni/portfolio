<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	onMount(() => {
		window.scrollTo(0, 0);

		// GSAP entrance animation sequence
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
			<span class="arrow">&larr;</span> Back to Archive
		</a>

		<article class="blog-post-container">
			<header class="post-header">
				<div class="post-meta">
					<span class="category-badge">GSoC</span>
					<span class="date">August 2026</span>
				</div>
				<h1 class="post-title">How cdup Came Into the Picture</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					The interesting part about adding <code>cdup</code> to the project is that it was not part of the original plan.
				</p>

				<p>
					The original change was to expose <code>path.git-prefix</code> through <code>git repo info</code>. The motivation was to make the path from the repository's working-tree root to the current directory available as structured repository information.
				</p>

				<p>
					During review, Lucas Oshiro raised a concern about whether this information really belonged under repository information. The argument was that <code>git-prefix</code> describes the current directory, rather than the repository itself.
				</p>

				<p>
					That led to a discussion about what exactly we consider "repository information."
				</p>

				<h2>The Missing Inverse Direction</h2>

				<p>
					Junio Hamano pointed out that Git already has a closely related concept in:
				</p>

				<pre><code>git rev-parse --show-cdup</code></pre>

				<p>
					<code>--show-cdup</code> gives the relative path from the current directory back to the root of the working tree. For example, if we are currently in:
				</p>

				<pre><code>repo/src/foo/bar/</code></pre>

				<p>
					then <code>--show-cdup</code> gives:
				</p>

				<pre><code>../../../</code></pre>

				<p>
					On the other hand, <code>git-prefix</code> describes the same relationship in the opposite direction:
				</p>

				<pre><code>repo/
└── src/foo/bar/</code></pre>

				<p>
					The prefix is <code>src/foo/bar/</code>. So the two values are effectively inverses of each other:
				</p>

				<ul>
					<li>
						<strong><code>git-prefix</code>:</strong> Working-tree root &rarr; current directory
					</li>
					<li>
						<strong><code>cdup</code>:</strong> Current directory &rarr; working-tree root
					</li>
				</ul>

				<h2>Refining the Interface</h2>

				<p>
					This was the key point in the review. Junio's argument was that the fact that <code>cdup</code> is relative to the current directory does not make it any less relevant to the repository. It describes where the current directory is relative to the working-tree root, which is still repository-related information.
				</p>

				<p>
					He then made the natural follow-up suggestion: if <code>git-prefix</code> is being exposed through <code>git repo info</code>, <code>cdup</code> should be exposed as well.
				</p>

				<p>
					Originally, I was thinking about <code>git-prefix</code> as one useful piece of path information. The review made it clear that there is a more complete and consistent interface available if both directions are represented:
				</p>

				<ul>
					<li>
						<strong><code>path.git-prefix</code>:</strong> Where am I relative to the working-tree root?
					</li>
					<li>
						<strong><code>path.cdup</code>:</strong> How do I get back to the working-tree root?
					</li>
				</ul>

				<h2>Takeaways from Upstream Review</h2>

				<p>
					The important part is that this is not introducing a completely new concept to Git. <code>git rev-parse --show-cdup</code> already provides the information. The change is about making that information available through the structured <code>git repo info</code> interface alongside <code>git-prefix</code>.
				</p>

				<p>
					In that sense, the addition of <code>cdup</code> was a good example of how upstream review can improve an interface beyond the original proposal.
				</p>

				<div class="insight-box">
					<p>
						<strong>The initial patch asked:</strong> "Can we expose git-prefix?"
					</p>
					<p>
						<strong>The review led to a better question:</strong> "If we expose this relationship in one direction, shouldn't we expose the other direction too?"
					</p>
				</div>

				<p>
					And that is how <code>cdup</code> ended up becoming part of the next revision.
				</p>
			</section>
		</article>

		<div class="rule divider">
			<span>&#10056;</span>
			<div class="line"></div>
			<span>&#10056;</span>
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
	}

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1);
		color: #dccb8e;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}

	.post-content pre {
		background: rgba(25, 25, 25, 0.6);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 8px;
		padding: 1.25rem;
		overflow-x: auto;
		margin: 0 0 1.75rem 0;
	}

	.post-content pre code {
		background: transparent;
		border: none;
		padding: 0;
		color: #f3ebd8;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.insight-box {
		background: rgba(220, 203, 142, 0.05);
		border-left: 3px solid #dccb8e;
		border-radius: 0 8px 8px 0;
		padding: 1.5rem;
		margin: 2.5rem 0;
	}

	.insight-box p {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
	}

	.insight-box p:last-child {
		margin-bottom: 0;
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
