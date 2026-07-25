<script lang="ts">
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";

	gsap.registerPlugin(ScrollTrigger);

	let nav: HTMLElement;
	let divider: HTMLDivElement;
	let isScrolled = false;

	onMount(() => {
		const tl = gsap.timeline();
		tl.from(nav, {
			y: -12,
			opacity: 0,
			duration: 0.8,
			ease: "power2.out",
		});

		tl.from(
			divider,
			{
				scaleX: 0,
				transformOrigin: "center",
				duration: 0.8,
				ease: "power2.out",
			},

			"-=0.4",
		);

		ScrollTrigger.create({
			trigger: "body",
			start: "top+=10 top",
			onEnter: () => (isScrolled = true),
			onLeaveBack: () => (isScrolled = false),
		});
	});
</script>

<nav bind:this={nav} class:scrolled={isScrolled}>
	<div class="nav-container">
		<div class="nav-content">
			<a href="/" class="brand">
				<h2>Jayatheerth</h2>
			</a>

			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="#/about">About</a></li>
				<li><a href="#/blogs">Blogs</a></li>
			</ul>
		</div>

		<div class="rule">
			<span>❈</span>

			<div class="line" bind:this={divider}></div>

			<span>❈</span>
		</div>
	</div>
</nav>

<div class="nav-spacer"></div>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 100;

		pointer-events: none;
		padding: 0.75rem 0;
		background: rgba(18, 21, 59, 0);
		backdrop-filter: blur(0px);
		-webkit-backdrop-filter: blur(0px);

		transition:
			background-color 0.4s ease,
			backdrop-filter 0.4s ease,
			-webkit-backdrop-filter 0.4s ease,
			mask-image 0.4s ease,
			-webkit-mask-image 0.4s ease;
	}

	.scrolled {
		background: rgba(18, 21, 59, 0.4);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		mask-image: radial-gradient(
			ellipse at top,
			black 20%,
			transparent 70%
		);
		-webkit-mask-image: radial-gradient(
			ellipse at top,
			black 20%,
			transparent 70%
		);
	}

	.nav-container {
		width: 40%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		pointer-events: auto;
	}

	.nav-spacer {
		height: 70px;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		margin-top: 0.4rem;
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

	.brand h2 {
		margin: 0;
		font-weight: 600;
		font-size: 1.35rem;
	}

	ul {
		display: flex;
		gap: 2rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		color: #f3ebd8;
		text-decoration: none;
		font-size: 0.9rem;
	}

	a:hover {
		color: #dccb8e;
	}

	@media (max-width: 1024px) {
		.nav-container {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.nav-container {
			width: 80%;
		}

		nav {
			padding: 0.6rem 0;
		}

		.scrolled {
			mask-image: none;
			-webkit-mask-image: none;
		}
	}

	@media (max-width: 480px) {
		.nav-container {
			width: 90%;
		}

		ul {
			gap: 1.25rem;
		}
	}
</style>
