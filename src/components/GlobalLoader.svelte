<script>
	import { gsap } from "gsap";

	let { key = 0 } = $props();

	let progress = $state(0);
	let visible = $state(true);

	// Reactively trigger whenever the key (route) changes
	$effect(() => {
		if (key !== undefined) {
			visible = true;
			progress = 0;

			const counter = { val: 0 };

			gsap.to(counter, {
				val: 100,
				duration: 0.5, // 500ms rapid count
				ease: "power2.out",
				onUpdate: () => {
					progress = Math.round(counter.val);
				},
				onComplete: () => {
					gsap.to(".glass-loader", {
						opacity: 0,
						duration: 0.3,
						ease: "power2.inOut",
						onComplete: () => {
							visible = false;
						}
					});
				}
			});
		}
	});
</script>

{#if visible}
	<div class="glass-loader">
		<div class="loader-content">
			<span class="progress-number">{progress}%</span>
		</div>
	</div>
{/if}

<style>
	.glass-loader {
		position: fixed;
		inset: 0;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(18, 18, 18, 0.45);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		pointer-events: none;
	}

	.loader-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.progress-number {
		font-family: "Cormorant Garamond", serif;
		font-size: clamp(3rem, 8vw, 5rem);
		font-weight: 300;
		color: #dccb8e;
		letter-spacing: 0.05em;
		user-select: none;
	}
</style>
