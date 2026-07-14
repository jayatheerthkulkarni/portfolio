<script>
	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";
	import { onMount } from "svelte";
	import { gsap } from "gsap";

	const galleryFiles = import.meta.glob(
		"/public/gallery/**/*.{png,jpg,jpeg,webp,svg,gif,PNG,JPG,JPEG,WEBP,SVG,GIF}",
		{ eager: true, query: "?url", import: "default" }
	);

	const galleryImages = Object.keys(galleryFiles).map((path) =>
		path.replace(/^\/public/, "").replace(/\?url$/, "")
	);

	let activeImage = null;

	function openLightbox(img) {
		activeImage = img;
	}

	function closeLightbox() {
		activeImage = null;
	}

	function getCleanFilename(path) {
		const parts = path.split('/');
		const filenameWithExt = parts[parts.length - 1];
		const filename = filenameWithExt.split('.')[0];
		return filename
			.replace(/[-_]/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	function getImageCredit(path) {
		const parts = path.split('/');
		const galleryIndex = parts.indexOf("gallery");
		if (galleryIndex !== -1 && parts.length > galleryIndex + 2) {
			const folderName = parts[galleryIndex + 1];
			return folderName.charAt(0).toUpperCase() + folderName.slice(1);
		}
		return null;
	}

	let pageContainer;
	onMount(() => {
		window.scrollTo(0, 0);
		const ctx = gsap.context(() => {
			gsap.from(".gallery-title *", {
				opacity: 0,
				y: 30,
				duration: 0.8,
				stagger: 0.15,
				ease: "power3.out"
			});

			gsap.from(".gallery-item", {
				opacity: 0,
				y: 40,
				duration: 0.8,
				stagger: 0.1,
				ease: "power2.out"
			});
		}, pageContainer);

		return () => ctx.revert();
	});
</script>

<Navbar />

<div class="gallery-page" bind:this={pageContainer}>
	<div class="page-container">
		<section class="gallery-hero">
			<div class="gallery-title">
				<span class="eyebrow">The Complete Collection</span>
				<h1>The Gallery</h1>
				<div class="rule">
					<span>❈</span>
					<div class="line"></div>
					<span>❈</span>
				</div>
			</div>
		</section>

		<section class="gallery-grid-section">
			{#if galleryImages.length === 0}
				<div class="empty-gallery">
					<div class="empty-box">
						<span>❈</span>
						<p>The archive is currently empty.</p>
					</div>
				</div>
			{:else}
				<div class="gallery-grid">
					{#each galleryImages as img}
						<button
							class="gallery-item"
							on:click={() => openLightbox(img)}
							aria-label="View larger image"
						>
							<div class="image-wrapper">
								<img src={img} alt={getCleanFilename(img)} loading="lazy" />
								<div class="image-overlay">
									<span class="view-tag">View Image ❈</span>
								</div>
							</div>
							<div class="gallery-caption">
								{#if getImageCredit(img)}
									<span class="gallery-tag">Shot by {getImageCredit(img)}</span>
								{:else}
									<span class="gallery-tag">Snapshot</span>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</section>

		<div class="back-footer">
			<a href="#/about" class="back-btn">
				← Return to About
			</a>
		</div>
	</div>
</div>

<Footer />

{#if activeImage}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-interactive-supports-focus -->
	<div
		class="lightbox"
		on:click={closeLightbox}
		role="dialog"
		tabindex="-1"
		aria-label="Close image lightbox"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="lightbox-content" on:click|stopPropagation>
			<button class="close-btn" on:click={closeLightbox} aria-label="Close modal">×</button>
			<img src={activeImage} alt={getCleanFilename(activeImage)} />
			<div class="lightbox-caption">
				{#if getImageCredit(activeImage)}
					<span class="gallery-tag">Shot by {getImageCredit(activeImage)}</span>
				{:else}
					<span class="gallery-tag">Snapshot</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		background-color: #12153b !important;
	}

	.gallery-page {
		min-height: 100vh;
		color: #f3ebd8;
		font-family: "Cormorant Garamond", serif;
		padding: 4rem 2rem;
		box-sizing: border-box;
	}

	.page-container {
		width: min(1200px, 100%);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.gallery-hero {
		text-align: center;
		padding-top: 4rem;
	}

	.eyebrow {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.25em;
		color: #dccb8e;
		display: block;
		margin-bottom: 1rem;
	}

	.gallery-hero h1 {
		margin: 0;
		font-size: clamp(3.5rem, 6vw, 6rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		margin-top: 1.5rem;
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

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2.5rem;
	}

	.gallery-item {
		background: none;
		border: 1px solid rgba(220, 203, 142, 0.12);
		padding: 0;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		text-align: left;
		border-radius: 8px;
		overflow: hidden;
		transition: border-color 0.3s ease, transform 0.3s ease;
	}

	.gallery-item:hover {
		border-color: rgba(220, 203, 142, 0.45);
		transform: translateY(-4px);
	}

	.image-wrapper {
		position: relative;
		aspect-ratio: 4/3;
		overflow: hidden;
		background: #181818;
		width: 100%;
	}

	.image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
		filter: grayscale(15%) contrast(102%);
	}

	.gallery-item:hover .image-wrapper img {
		transform: scale(1.05);
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		background: rgba(18, 21, 59, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.gallery-item:hover .image-overlay {
		opacity: 1;
	}

	.view-tag {
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		border: 1px solid rgba(220, 203, 142, 0.4);
		padding: 0.5rem 1rem;
		border-radius: 4px;
	}

	.gallery-caption {
		padding: 1.25rem;
		background: rgba(25, 25, 25, 0.4);
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border-top: 1px solid rgba(220, 203, 142, 0.08);
	}

	.gallery-caption h3 {
		margin: 0;
		font-family: "Cormorant Garamond", serif;
		font-size: 1.35rem;
		font-weight: 400;
		color: #f3ebd8;
	}

	.gallery-tag {
		font-family: "Inter", sans-serif;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(243, 235, 216, 0.4);
	}

	.empty-gallery {
		display: flex;
		justify-content: center;
	}

	.empty-box {
		border: 1px dashed rgba(220, 203, 142, 0.25);
		padding: 3rem;
		text-align: center;
		width: 100%;
		max-width: 500px;
	}

	.empty-box span {
		font-size: 1.5rem;
		color: #dccb8e;
		display: block;
		margin-bottom: 1rem;
	}

	.empty-box p {
		font-family: "Inter", sans-serif;
		color: rgba(243, 235, 216, 0.6);
		margin: 0;
	}

	.back-footer {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	.back-btn {
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #dccb8e;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.back-btn:hover {
		color: #f3ebd8;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		background: rgba(12, 12, 12, 0.95);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		padding: 2rem;
		cursor: zoom-out;
		width: 100vw;
		height: 100vh;
	}

	.lightbox-content {
		position: relative;
		max-width: 90vw;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: default;
	}

	.lightbox-content img {
		max-width: 100%;
		max-height: 75vh;
		object-fit: contain;
		border: 1px solid rgba(220, 203, 142, 0.3);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
		background: #181818;
	}

	.lightbox-caption {
		margin-top: 1.25rem;
		text-align: center;
	}

	.lightbox-caption h3 {
		margin: 0;
		font-family: "Cormorant Garamond", serif;
		font-size: 1.75rem;
		font-weight: 400;
		color: #f3ebd8;
	}

	.close-btn {
		position: absolute;
		top: -45px;
		right: 0;
		background: none;
		border: none;
		color: #f3ebd8;
		font-size: 2.5rem;
		font-family: "Inter", sans-serif;
		font-weight: 300;
		cursor: pointer;
		line-height: 1;
		transition: color 0.3s ease;
	}

	.close-btn:hover {
		color: #dccb8e;
	}

	@media (max-width: 1024px) {
		.gallery-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem;
		}
	}

	@media (max-width: 768px) {
		.gallery-page {
			padding: 2rem 1rem;
		}
		.page-container {
			gap: 4rem;
		}
		.gallery-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
</style>
