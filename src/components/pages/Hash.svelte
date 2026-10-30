<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";

	let email = $state("");
	let hash = $state("");
	let isCopied = $state(false);
	let copyTimeout = null;

	async function computeSHA256(message) {
		if (!message) return "";
		
		const normalizedEmail = message.trim().toLowerCase();
		
		const encoder = new TextEncoder();
		const data = encoder.encode(normalizedEmail);
		
		const hashBuffer = await crypto.subtle.digest(
			"SHA-256",
			data
		);
		
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		
		return hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	}

	$effect(() => {
		const currentEmail = email;
		if (!currentEmail) {
			hash = "";
			return;
		}

		let active = true;
		computeSHA256(currentEmail).then((result) => {
			if (active) {
				hash = result;
			}
		});

		return () => {
			active = false;
		};
	});

	async function copyToClipboard() {
		if (!hash) return;
		try {
			await navigator.clipboard.writeText(hash);
			isCopied = true;
			if (copyTimeout) clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				isCopied = false;
			}, 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}

	onMount(() => {
		window.scrollTo(0, 0);

		const ctx = gsap.context(() => {
			gsap.from(".hash-hero *", {
				opacity: 0,
				y: 30,
				duration: 0.8,
				stagger: 0.12,
				ease: "power3.out"
			});

			gsap.from(".card-container", {
				opacity: 0,
				y: 35,
				duration: 0.9,
				delay: 0.3,
				ease: "power3.out"
			});
		});

		return () => {
			ctx.revert();
			if (copyTimeout) clearTimeout(copyTimeout);
		};
	});
</script>

<Navbar />

<main class="hash-page">
	<div class="hash-hero">
		<span class="page-tag">Cryptography & Tools</span>
		<h1 class="page-title">SHA-256 Generator</h1>
		<p class="page-subtitle">
			Deterministic cryptographic hashing using standard 256-bit SHA-2. Enter an email address to compute its vanilla hexadecimal digest in real-time.
		</p>
		<div class="rule">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>
	</div>

	<div class="card-container">
		<div class="hash-card">
			<div class="form-group">
				<label for="email-input">
					<span>Email Address</span>
					<span class="label-hint">Input UTF-8 string</span>
				</label>
				<div class="input-wrapper">
					<input
						id="email-input"
						type="email"
						placeholder="name@example.com"
						bind:value={email}
						autocomplete="off"
						spellcheck="false"
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="hash-output">
					<span>SHA-256 Digest</span>
					<span class="label-hint">64 hexadecimal characters</span>
				</label>
				<div class="output-wrapper">
					<div
						id="hash-output"
						class="hash-display"
						class:empty={!hash}
					>
						{hash || "Digest will appear here..."}
					</div>

					<button
						type="button"
						class="copy-btn"
						onclick={copyToClipboard}
						disabled={!hash}
						aria-label="Copy SHA256 digest"
						title={hash ? "Copy SHA-256" : "Enter email first"}
					>
						{#if isCopied}
							<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
							<span>Copied!</span>
						{:else}
							<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
							</svg>
							<span>Copy</span>
						{/if}
					</button>
				</div>
			</div>

			<div class="card-footer">
				<div class="meta-item">
					<span class="meta-label">Algorithm:</span>
					<span class="meta-value">SHA-256 (FIPS 180-4)</span>
				</div>
				<div class="meta-item">
					<span class="meta-label">Output Length:</span>
					<span class="meta-value">256 bits (32 bytes)</span>
				</div>
				<div class="meta-item">
					<span class="meta-label">Execution:</span>
					<span class="meta-value">Client-side Web Crypto API</span>
				</div>
			</div>
		</div>

		<div class="info-box">
			<div class="info-header">
				<span class="info-glyph">✦</span>
				<h3>About Vanilla SHA-256</h3>
			</div>
			<p>
				Vanilla SHA-256 computes an unkeyed, raw cryptographic hash directly over the UTF-8 byte encoding of your input without any HMAC keys, salting, or normalization wrappers. It is calculated entirely in your browser with zero network requests.
			</p>
		</div>
	</div>
</main>

<Footer />

<style>
	.hash-page {
		min-height: calc(100vh - 180px);
		padding: 5rem 1.5rem 6rem;
		max-width: 860px;
		margin: 0 auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hash-hero {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2.5rem;
		width: 100%;
	}

	.page-tag {
		display: inline-block;
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		background: rgba(220, 203, 142, 0.08);
		border: 1px solid rgba(220, 203, 142, 0.2);
		padding: 0.35rem 1rem;
		border-radius: 20px;
		margin-bottom: 1.2rem;
	}

	.page-title {
		font-family: "Cormorant Garamond", serif;
		font-size: clamp(2.5rem, 5vw, 3.8rem);
		font-weight: 300;
		color: #f3ebd8;
		margin: 0 0 1rem 0;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.page-subtitle {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(243, 235, 216, 0.7);
		max-width: 640px;
		margin: 0 0 2rem 0;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		max-width: 320px;
		margin: 0 auto;
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

	.card-container {
		width: 100%;
		max-width: 720px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.hash-card {
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(243, 235, 216, 0.1);
		border-radius: 16px;
		padding: 2.5rem 2rem;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
		transition: border-color 0.3s ease;
	}

	.hash-card:hover {
		border-color: rgba(220, 203, 142, 0.25);
	}

	.form-group {
		margin-bottom: 2rem;
	}

	.form-group:last-of-type {
		margin-bottom: 2.2rem;
	}

	label {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.75rem;
		font-family: "Inter", sans-serif;
		font-size: 0.92rem;
		font-weight: 500;
		color: #f3ebd8;
		letter-spacing: 0.02em;
	}

	.label-hint {
		font-size: 0.78rem;
		color: rgba(243, 235, 216, 0.45);
		font-weight: 400;
	}

	.input-wrapper input {
		width: 100%;
		box-sizing: border-box;
		background: rgba(10, 12, 32, 0.6);
		border: 1px solid rgba(243, 235, 216, 0.16);
		border-radius: 10px;
		padding: 0.95rem 1.25rem;
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: #f3ebd8;
		outline: none;
		transition: all 0.25s ease;
	}

	.input-wrapper input::placeholder {
		color: rgba(243, 235, 216, 0.3);
	}

	.input-wrapper input:focus {
		border-color: #dccb8e;
		background: rgba(15, 18, 48, 0.85);
		box-shadow: 0 0 0 3px rgba(220, 203, 142, 0.12);
	}

	.output-wrapper {
		display: flex;
		gap: 0.75rem;
		align-items: stretch;
	}

	.hash-display {
		flex: 1;
		background: rgba(10, 12, 32, 0.6);
		border: 1px solid rgba(243, 235, 216, 0.16);
		border-radius: 10px;
		padding: 0.95rem 1.25rem;
		font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
		font-size: 0.88rem;
		line-height: 1.5;
		color: #dccb8e;
		word-break: break-all;
		user-select: all;
		display: flex;
		align-items: center;
		min-height: 52px;
		box-sizing: border-box;
	}

	.hash-display.empty {
		color: rgba(243, 235, 216, 0.3);
		font-family: "Inter", sans-serif;
		font-size: 0.92rem;
		user-select: none;
	}

	.copy-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: rgba(220, 203, 142, 0.08);
		border: 1px solid rgba(220, 203, 142, 0.25);
		border-radius: 10px;
		padding: 0 1.4rem;
		color: #dccb8e;
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.25s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.copy-btn:hover:not(:disabled) {
		background: rgba(220, 203, 142, 0.2);
		border-color: #dccb8e;
		color: #fff;
		transform: translateY(-1px);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
	}

	.copy-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.copy-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		border-color: rgba(243, 235, 216, 0.1);
	}

	.btn-icon {
		width: 16px;
		height: 16px;
	}

	.card-footer {
		border-top: 1px solid rgba(243, 235, 216, 0.08);
		padding-top: 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem 2rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
	}

	.meta-label {
		color: rgba(243, 235, 216, 0.45);
	}

	.meta-value {
		color: #f3ebd8;
		font-weight: 500;
	}

	.info-box {
		background: rgba(255, 255, 255, 0.015);
		border: 1px solid rgba(243, 235, 216, 0.07);
		border-radius: 12px;
		padding: 1.5rem 1.75rem;
	}

	.info-header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}

	.info-glyph {
		color: #dccb8e;
		font-size: 0.85rem;
	}

	.info-header h3 {
		font-family: "Cormorant Garamond", serif;
		font-size: 1.25rem;
		font-weight: 400;
		color: #f3ebd8;
		margin: 0;
	}

	.info-box p {
		font-family: "Inter", sans-serif;
		font-size: 0.88rem;
		line-height: 1.65;
		color: rgba(243, 235, 216, 0.65);
		margin: 0;
	}

	@media (max-width: 600px) {
		.hash-card {
			padding: 1.75rem 1.25rem;
		}

		.output-wrapper {
			flex-direction: column;
		}

		.copy-btn {
			padding: 0.85rem;
		}

		.card-footer {
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>
