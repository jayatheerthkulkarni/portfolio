<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";

	onMount(() => {
		window.scrollTo(0, 0);

		const tl = gsap.timeline();
		tl.from(".error-code", { opacity: 0, y: -30, duration: 1, ease: "power3.out" });
		tl.from(".error-title", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, "-=0.5");
		tl.from(".error-desc", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, "-=0.6");
		tl.from(".divider", { opacity: 0, scaleX: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
		tl.from(".back-btn", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.4");
	});
</script>

<Navbar />

<div class="not-found-page">
	<div class="error-container">
		<h1 class="error-code">404</h1>
		<h2 class="error-title">Path Uncharted</h2>
		<p class="error-desc">
			The directory or page you are looking for does not exist in this architecture. It may have been moved, deleted, or never compiled.
		</p>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<a href="#/" class="back-btn">
			<span class="arrow">←</span> Return to Base
		</a>
	</div>
</div>

<Footer />

<style>
	.not-found-page {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rem 1.5rem;
		box-sizing: border-box;
	}

	.error-container {
		max-width: 600px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.error-code {
		font-family: "Cormorant Garamond", serif;
		font-size: clamp(6rem, 15vw, 10rem);
		font-weight: 300;
		color: #dccb8e;
		margin: 0;
		line-height: 0.9;
		letter-spacing: -0.05em;
		text-shadow: 0 4px 20px rgba(220, 203, 142, 0.15);
	}

	.error-title {
		font-family: "Cormorant Garamond", serif;
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		font-weight: 300;
		color: #f3ebd8;
		margin: 1.5rem 0 1rem 0;
		letter-spacing: -0.01em;
	}

	.error-desc {
		font-family: "Inter", sans-serif;
		font-size: 1.1rem;
		line-height: 1.7;
		color: rgba(243, 235, 216, 0.7);
		margin: 0 0 2rem 0;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		max-width: 250px;
		margin: 1rem 0 2.5rem 0;
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

	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		background: rgba(220, 203, 142, 0.05);
		border: 1px solid rgba(220, 203, 142, 0.2);
		padding: 0.8rem 1.8rem;
		border-radius: 30px;
		color: #dccb8e;
		text-decoration: none;
		font-family: "Inter", sans-serif;
		font-size: 0.95rem;
		font-weight: 500;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.back-btn:hover {
		background: rgba(220, 203, 142, 0.15);
		border-color: #dccb8e;
		color: #f3ebd8;
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
	}

	.back-btn .arrow {
		transition: transform 0.3s ease;
	}

	.back-btn:hover .arrow {
		transform: translateX(-4px);
	}
</style>
