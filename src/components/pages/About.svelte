<script>
	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";
	import { onMount } from "svelte";
	import { gsap } from "gsap";


	let useImagePlaceholder = $state(false);
	function handleImageError() {
		useImagePlaceholder = true;
	}



	const galleryFiles = import.meta.glob(
		"/public/gallery/**/*.{png,jpg,jpeg,webp,svg,gif,PNG,JPG,JPEG,WEBP,SVG,GIF}",
		{ eager: true, query: "?url", import: "default" }
	);

	const galleryImages = Object.keys(galleryFiles).map((path) =>
		path.replace(/^\/public/, "").replace(/\?url$/, "")
	);

	let activeImage = $state(null);

	function openLightbox(img) {
		activeImage = img;
	}

	function closeLightbox() {
		activeImage = null;
	}

	let carouselRef;
	function scrollLeft() {
		if (carouselRef) {
			carouselRef.scrollBy({ left: -380, behavior: "smooth" });
		}
	}

	function scrollRight() {
		if (carouselRef) {
			carouselRef.scrollBy({ left: 380, behavior: "smooth" });
		}
	}

	let songs = $state([
		{
			youtubeUrl: "https://www.youtube.com/watch?v=n-Jl71LY5tc",
			title: "Loading...",
			artist: "Loading..."
		},
		{
			youtubeUrl: "https://youtu.be/-U4VnWX1ZD4?si=ogCGxJF_LndLo79N",
			title: "Loading...",
			artist: "Loading..."
		},
		{
			youtubeUrl: "https://www.youtube.com/watch?v=43OxI27c5as",
			title: "Loading...",
			artist: "Loading..."
		},
		{
			youtubeUrl: "https://youtu.be/0NKUpo_xKyQ?si=yQDV4SKAZeknZN0q",
			title: "Loading...",
			artist: "Loading..."
		},
		{
			youtubeUrl: "https://www.youtube.com/watch?v=QtXby3twMmI",
			title: "Loading...",
			artist: "Loading..."
		},
		{
			youtubeUrl: "https://www.youtube.com/watch?v=_9bw_VtMUGA",
			title: "Loading...",
			artist: "Loading..."
		}
	]);

	const songFallbacks = {
		"-U4VnWX1ZD4": { title: "Fusion", artist: "Home" },
		"8GW6sLrK40k": { title: "Resonance", artist: "Home" }
	};

	function getYoutubeThumbnail(url) {
		if (!url) return "";
		try {
			const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			const match = url.match(regExp);
			if (match && match[2].length === 11) {
				const videoId = match[2];
				return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
			}
		} catch (e) {
			console.error("Invalid YouTube URL", e);
		}
		return "";
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

	function getYoutubeVideoId(url) {
		if (!url) return null;
		try {
			const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			const match = url.match(regExp);
			if (match && match[2].length === 11) {
				return match[2];
			}
		} catch (e) {
			console.error("Invalid YouTube URL", e);
		}
		return null;
	}

	async function fetchSongInfo(url) {
		const videoId = getYoutubeVideoId(url);
		const fallback = songFallbacks[videoId] || { title: "Unknown Song", artist: "Unknown Artist" };
		try {
			const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
			if (response.ok) {
				const data = await response.json();
				let rawTitle = data.title || fallback.title;
				let artist = data.author_name || fallback.artist;
				let title = rawTitle;

				const splitters = [" - ", " – ", " — ", ": "];
				for (const splitter of splitters) {
					if (rawTitle.includes(splitter)) {
						const parts = rawTitle.split(splitter);
						artist = parts[0].trim();
						title = parts.slice(1).join(splitter).trim();
						break;
					}
				}

				title = title.replace(/\s*[\(\[][^)]*[\)\]]/g, "").trim();
				artist = artist.replace(/\s*[\(\[][^)]*[\)\]]/g, "").trim();

				return { title, artist };
			}
		} catch (e) {
			console.error("Failed to fetch song info, using fallback:", e);
		}
		return fallback;
	}


	let pageContainer;
	onMount(() => {
		window.scrollTo(0, 0);

		// Dynamic songs fetching
		Promise.all(
			songs.map(async (song) => {
				const info = await fetchSongInfo(song.youtubeUrl);
				song.title = info.title;
				song.artist = info.artist;
			})
		);

		const ctx = gsap.context(() => {

			gsap.from(".hero-content *", {
				opacity: 0,
				y: 30,
				duration: 0.8,
				stagger: 0.15,
				ease: "power3.out"
			});


			gsap.from(".bio-grid > *", {
				opacity: 0,
				y: 30,
				duration: 0.8,
				stagger: 0.15,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".bio-section",
					start: "top 80%"
				}
			});


			gsap.from(".gallery-item", {
				opacity: 0,
				y: 40,
				duration: 0.8,
				stagger: 0.12,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".gallery-section",
					start: "top 80%"
				}
			});


			gsap.from(".song-card", {
				opacity: 0,
				y: 40,
				duration: 0.8,
				stagger: 0.15,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".songs-section",
					start: "top 80%"
				}
			});


			gsap.from(".contact-content *", {
				opacity: 0,
				y: 30,
				duration: 0.8,
				stagger: 0.12,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".contact-section",
					start: "top 80%"
				}
			});
		}, pageContainer);

		return () => ctx.revert();
	});
</script>

<Navbar />

<div class="about-page" bind:this={pageContainer}>
	<div class="page-container">

		<section class="about-hero">
			<div class="hero-content">
				<span class="eyebrow">The Persona</span>
				<h1>About Me</h1>
				<div class="rule">
					<span>❈</span>
					<div class="line"></div>
					<span>❈</span>
				</div>
			</div>
		</section>


		<section class="bio-section">
			<div class="bio-grid">
				<div class="profile-frame-container">
					<div class="profile-frame">
						{#if useImagePlaceholder}
							<div class="profile-placeholder">
								<div class="seal-inner">
									<span class="seal-initials">JK</span>
									<span class="seal-ring">❈ JAYATHEERTH ❈</span>
								</div>
							</div>
						{:else}
							<img
								src="/jayatheerth.jpeg"
								alt="Jayatheerth Kulkarni"
								class="profile-img"
								on:error={handleImageError}
							/>
						{/if}
						<div class="corner-ornament tl"></div>
						<div class="corner-ornament tr"></div>
						<div class="corner-ornament bl"></div>
						<div class="corner-ornament br"></div>
					</div>
				</div>

				<div class="bio-content">
					<h2>The Human Behind the Screen</h2>
					<p class="highlight-text">
						The reason I enjoy programming is simple. The computer listens.
					</p>
					<p>
						There is something satisfying about working with a machine that does exactly what it is asked to do. That gives me the freedom to build, experiment, and spend hours exploring ideas that begin as nothing more than curiosity.
					</p>
					<p>
						That curiosity has taken me through open source, compilers, systems programming, web applications, and everything in between. The domain rarely matters. The process always does.
					</p>
					<p>
						Away from the terminal, I spend my time reading, playing chess, and looking up at the sky with a camera in hand. I have also found myself drawn to typography, layout, and the details that shape how software feels long before anyone notices them.
					</p>
					<p>
						I keep a copy of <em>Dark Matter</em> close by. <em>The Chain</em> is next on the shelf. Horses have always held my attention for reasons I have never tried to explain.
					</p>
					<p>
						Most of all, I enjoy making things.
					</p>
					<div class="bio-list">
						<span>❈ Sometimes they become tools.</span>
						<span>❈ Sometimes they become ideas.</span>
						<span>❈ Sometimes they become websites like this one.</span>
					</div>
				</div>
			</div>
		</section>


		<div class="rule section-divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>


		<section class="gallery-section">
			<div class="section-header">
				<span class="eyebrow">Visual Fragments</span>
				<h2>The Gallery</h2>
				<p class="section-desc">
					Visual fragments, cataloged and archived over time.
				</p>
			</div>

			{#if galleryImages.length === 0}
				<div class="empty-gallery">
					<div class="empty-box">
						<span>❈</span>
						<p>The archive is currently empty.</p>
					</div>
				</div>
			{:else}
				<div class="carousel-container">
					<button class="carousel-nav prev" on:click={scrollLeft} aria-label="Previous slide">
						<span>←</span>
					</button>

					<div class="carousel-track" bind:this={carouselRef}>
						{#each galleryImages as img}
							<button
								class="gallery-item carousel-slide"
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

					<button class="carousel-nav next" on:click={scrollRight} aria-label="Next slide">
						<span>→</span>
					</button>
				</div>

				<div class="gallery-footer">
					<a href="#/gallery" class="see-all-btn">
						See All Archive <span class="btn-arrow">→</span>
					</a>
				</div>
			{/if}
		</section>


		<div class="rule section-divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>


		<section class="songs-section">
			<div class="section-header">
				<span class="eyebrow">Aural Landscapes</span>
				<h2>Songs I listen these days</h2>
				<p class="section-desc">
					A curated selection of soundscapes.
				</p>
			</div>

			<div class="songs-grid">
				{#each songs as song}
					<a
						href={song.youtubeUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="song-card"
					>
						<div class="song-thumbnail-wrapper">
							{#if getYoutubeThumbnail(song.youtubeUrl)}
								<img
									src={getYoutubeThumbnail(song.youtubeUrl)}
									alt={song.title}
									class="song-thumbnail"
									loading="lazy"
								/>
							{:else}
								<div class="song-thumbnail-fallback">
									<span>♫</span>
								</div>
							{/if}
							<div class="play-overlay">
								<div class="play-button-circle">
									<span class="play-icon">▶</span>
								</div>
							</div>
						</div>
						<div class="song-info">
							<span class="song-artist">{song.artist}</span>
							<h3>{song.title}</h3>
						</div>
					</a>
				{/each}
			</div>
		</section>


		<div class="rule section-divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>


		<section class="contact-section">
			<div class="contact-content">
				<span class="eyebrow">Let's Connect</span>
				<h2>Get In Touch</h2>
				<p class="contact-intro">
					Have an interesting systems programming problem, a compiler design concept, or just want to chat about Git internals? Reach out through any of the channels below.
				</p>

				<div class="contact-channels">
					<a href="mailto:jayatheerthkulkarni2005@gmail.com" class="channel-link">
						<span class="channel-label">Email</span>
						<span class="channel-value">jayatheerthkulkarni2005@gmail.com</span>
						<span class="channel-arrow">→</span>
					</a>
					<a href="https://www.linkedin.com/in/jayatheerth/" target="_blank" rel="noopener noreferrer" class="channel-link">
						<span class="channel-label">LinkedIn</span>
						<span class="channel-value">linkedin.com/in/jayatheerth</span>
						<span class="channel-arrow">→</span>
					</a>
					<a href="https://github.com/jayatheerthkulkarni" target="_blank" rel="noopener noreferrer" class="channel-link">
						<span class="channel-label">GitHub</span>
						<span class="channel-value">github.com/jayatheerthkulkarni</span>
						<span class="channel-arrow">→</span>
					</a>
				</div>
			</div>
		</section>
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

	.about-page {
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


	.about-hero {
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

	.about-hero h1 {
		margin: 0;
		font-size: clamp(3.5rem, 6vw, 6rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
		color: #f3ebd8;
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

	.section-divider {
		margin: 2rem 0;
	}


	.bio-grid {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 4rem;
		align-items: center;
	}

	.profile-frame-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.profile-frame {
		position: relative;
		width: min(340px, 100%);
		aspect-ratio: 1;
		border: 1px solid rgba(220, 203, 142, 0.25);
		padding: 1rem;
		background: rgba(18, 21, 59, 0.2);
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.profile-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(20%) contrast(105%);
		border: 1px solid rgba(220, 203, 142, 0.15);
	}


	.profile-placeholder {
		width: 100%;
		height: 100%;
		background: #191c44;
		border: 1px solid rgba(220, 203, 142, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.seal-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px dashed rgba(220, 203, 142, 0.4);
		border-radius: 50%;
		width: 80%;
		height: 80%;
		position: relative;
	}

	.seal-initials {
		font-size: 3.5rem;
		font-weight: 300;
		color: #dccb8e;
		letter-spacing: 0.1em;
	}

	.seal-ring {
		font-family: "Inter", sans-serif;
		font-size: 0.55rem;
		color: rgba(243, 235, 216, 0.6);
		letter-spacing: 0.25em;
		text-transform: uppercase;
		position: absolute;
		bottom: 15%;
	}


	.corner-ornament {
		position: absolute;
		width: 10px;
		height: 10px;
		border: 1.5px solid #dccb8e;
		box-sizing: border-box;
	}

	.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
	.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
	.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
	.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

	.bio-content h2 {
		margin: 0 0 1.5rem 0;
		font-size: clamp(2rem, 3.5vw, 3rem);
		font-weight: 400;
		color: #f3ebd8;
		line-height: 1.1;
	}

	.bio-content p {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(243, 235, 216, 0.75);
		margin: 0 0 1.5rem 0;
	}

	.bio-content p:last-child {
		margin-bottom: 0;
	}

	.highlight-text {
		font-size: 1.25rem !important;
		font-family: "Cormorant Garamond", serif !important;
		line-height: 1.5 !important;
		color: #dccb8e !important;
		font-style: italic;
	}

	.bio-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1.5rem;
		font-family: "Cormorant Garamond", serif;
		font-size: 1.15rem;
		font-style: italic;
		color: #dccb8e;
	}


	.section-header {
		text-align: center;
		margin-bottom: 3.5rem;
	}

	.section-header h2 {
		margin: 0 0 1rem 0;
		font-size: clamp(2.5rem, 4vw, 3.5rem);
		font-weight: 400;
		color: #f3ebd8;
	}

	.section-desc {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(243, 235, 216, 0.6);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}




	.carousel-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		gap: 1rem;
	}

	.carousel-track {
		display: flex;
		overflow-x: auto;
		scroll-behavior: smooth;
		gap: 2.5rem;
		padding: 1rem 0;
		width: 100%;
		scrollbar-width: none;
	}

	.carousel-track::-webkit-scrollbar {
		display: none;
	}

	.carousel-slide {
		flex: 0 0 calc(33.333% - 1.67rem);
		min-width: 280px;
	}

	.carousel-nav {
		background: rgba(18, 21, 59, 0.4);
		border: 1px solid rgba(220, 203, 142, 0.25);
		color: #f3ebd8;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 1.25rem;
		transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
		flex-shrink: 0;
		z-index: 10;
	}

	.carousel-nav:hover {
		background-color: #dccb8e;
		border-color: #dccb8e;
		color: #12153b;
	}

	.gallery-footer {
		display: flex;
		justify-content: center;
		margin-top: 3.5rem;
	}

	.see-all-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #12153b;
		background-color: #dccb8e;
		padding: 1rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
	}

	.see-all-btn:hover {
		background-color: #f3ebd8;
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(220, 203, 142, 0.15);
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




	.songs-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2.5rem;
	}

	.song-card {
		background: rgba(25, 25, 25, 0.4);
		border: 1px solid rgba(220, 203, 142, 0.1);
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		transition: border-color 0.3s ease, transform 0.3s ease;
	}

	.song-card:hover {
		border-color: rgba(220, 203, 142, 0.45);
		transform: translateY(-4px);
	}

	.song-thumbnail-wrapper {
		position: relative;
		aspect-ratio: 16/9;
		background: #181818;
		overflow: hidden;
	}

	.song-thumbnail {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(80%) contrast(105%);
		transition: transform 0.6s ease;
	}

	.song-card:hover .song-thumbnail {
		transform: scale(1.04);
	}

	.song-thumbnail-fallback {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		color: rgba(220, 203, 142, 0.25);
		background: #191c44;
	}

	.play-overlay {
		position: absolute;
		inset: 0;
		background: rgba(18, 18, 18, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.song-card:hover .play-overlay {
		opacity: 1;
	}

	.play-button-circle {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #dccb8e;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: scale(0.9);
		transition: transform 0.3s ease;
	}

	.song-card:hover .play-button-circle {
		transform: scale(1);
	}

	.play-icon {
		color: #121212;
		font-size: 0.9rem;
		margin-left: 3px;
	}

	.song-info {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.song-artist {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		margin-bottom: 0.4rem;
		display: block;
	}

	.song-info h3 {
		margin: 0;
		font-family: "Cormorant Garamond", serif;
		font-size: 1.6rem;
		font-weight: 400;
		color: #f3ebd8;
		line-height: 1.2;
	}

	.song-comment {
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.65);
		margin: 0 0 1.5rem 0;
		font-style: italic;
	}

	.song-footer {
		margin-top: auto;
		border-top: 1px solid rgba(220, 203, 142, 0.08);
		padding-top: 1rem;
	}

	.listen-link {
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #dccb8e;
		transition: color 0.3s ease;
	}

	.song-card:hover .listen-link {
		color: #f3ebd8;
	}


	.contact-section {
		display: flex;
		justify-content: center;
		text-align: center;
		padding-bottom: 4rem;
	}

	.contact-content {
		width: 100%;
		max-width: 650px;
	}

	.contact-content h2 {
		margin: 0 0 1.5rem 0;
		font-size: clamp(2.5rem, 4vw, 3.5rem);
		font-weight: 400;
		color: #f3ebd8;
	}

	.contact-intro {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.7);
		margin-bottom: 3.5rem;
	}

	.contact-channels {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.channel-link {
		display: grid;
		grid-template-columns: 120px 1fr auto;
		align-items: center;
		padding: 1.75rem 0;
		border-bottom: 1px solid rgba(220, 203, 142, 0.12);
		text-decoration: none;
		text-align: left;
		transition: padding-left 0.3s ease;
	}

	.channel-link:first-child {
		border-top: 1px solid rgba(220, 203, 142, 0.12);
	}

	.channel-label {
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: rgba(243, 235, 216, 0.5);
	}

	.channel-value {
		font-family: "Cormorant Garamond", serif;
		font-size: 1.4rem;
		color: #f3ebd8;
		transition: color 0.3s ease;
	}

	.channel-arrow {
		font-size: 1.4rem;
		color: #dccb8e;
		opacity: 0;
		transform: translateX(-10px);
		transition: opacity 0.3s ease, transform 0.3s ease;
	}

	.channel-link:hover {
		padding-left: 0.75rem;
	}

	.channel-link:hover .channel-value {
		color: #dccb8e;
	}

	.channel-link:hover .channel-arrow {
		opacity: 1;
		transform: translateX(0);
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
		.bio-grid {
			gap: 3rem;
		}

		.carousel-slide {
			flex: 0 0 calc(50% - 1.25rem);
		}

		.songs-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem;
		}
	}

	@media (max-width: 768px) {
		.about-page {
			padding: 2rem 1rem;
		}

		.page-container {
			gap: 4rem;
		}

		.bio-grid {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.profile-frame {
			width: min(280px, 100%);
		}

		.carousel-slide {
			flex: 0 0 calc(100% - 0.5rem);
		}

		.carousel-nav {
			display: none;
		}

		.carousel-container {
			gap: 0;
		}

		.songs-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.channel-link {
			grid-template-columns: 1fr auto;
			gap: 0.5rem;
			padding: 1.5rem 0;
		}

		.channel-label {
			grid-column: 1 / -1;
			margin-bottom: 0.25rem;
		}

		.channel-value {
			font-size: 1.2rem;
		}

		.channel-arrow {
			opacity: 1;
			transform: none;
		}
	}
</style>
