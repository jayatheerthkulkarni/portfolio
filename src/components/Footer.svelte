<footer class="footer-section">
	<div class="footer-container">
		<div class="footer-grid">
			<div class="footer-column">
				<h3>Connect</h3>
				<a
					href="mailto:jayatheerthkulkarni2005@gmail.com"
					class="footer-link">Email</a
				>
				<a
					href="https://x.com/k_jayatheerth"
					target="_blank"
					rel="noopener noreferrer"
					class="footer-link"
					>Twitter <span class="dead-tag"
						>(dead asf 🥀)</span
					></a
				>
				<a
					href="https://www.linkedin.com/in/jayatheerth/"
					target="_blank"
					rel="noopener noreferrer"
					class="footer-link">LinkedIn</a
				>
			</div>

			<div class="footer-column">
				<h3>Projects</h3>
				<a
					href="https://github.com/jayatheerthkulkarni"
					target="_blank"
					rel="noopener noreferrer"
					class="footer-link">GitHub Profile</a
				>
				<a href="https://github.com/jayatheerthkulkarni/auth" target="_blank" rel="noopener noreferrer" class="footer-link">Auth</a>
				<a
					href="/jayatheerth_kulkarni_resume.pdf"
					download
					class="footer-link">Resume</a
				>
			</div>

			<div class="footer-column">
				<h3>More links</h3>
				<a
					href="https://github.com/git/git/commits/master/?author=jayatheerthkulkarni"
					target="_blank"
					rel="noopener noreferrer"
					class="footer-link">My Git Commits</a
				>
				<a
					href="https://git.github.io/rev_news/2025/06/30/edition-124/"
					target="_blank"
					rel="noopener noreferrer"
					class="footer-link">Git Rev News</a
				>
				<a
					href="https://jayatheerth.com"
					class="footer-link">jayatheerth.com</a
				>
			</div>
		</div>

		<div class="footer-bottom">
			<p>
				© 2026 Jayatheerth. No Rights Reserved, Copy it,
				Go nuts.
			</p>
		</div>
	</div>
</footer>

<style>
	.footer-section {
		width: 100%;
		border-top: 1px solid rgba(220, 203, 142, 0.1);
		padding-top: 6rem;
		margin-top: 6rem;
		box-sizing: border-box;
	}

	.footer-container {
		width: min(1200px, 100%);
		margin: 0 auto;
		padding: 0 2rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		width: 100%;
	}

	.footer-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.footer-column h3 {
		margin: 0 0 0.5rem 0;
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
	}

	.footer-link {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(243, 235, 216, 0.6);
		text-decoration: none;
		width: fit-content;
		transition: color 0.3s ease;
	}

	.footer-link:hover {
		color: #f3ebd8;
	}

	.dead-tag {
		font-size: 0.85rem;
		color: rgba(243, 235, 216, 0.35);
		margin-left: 0.25rem;
	}

	.footer-bottom {
		border-top: 1px solid rgba(220, 203, 142, 0.05);
		padding-top: 2rem;
		padding-bottom: 2rem;
	}

	.footer-bottom p {
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		color: rgba(243, 235, 216, 0.4);
		margin: 0;
	}

	@media (max-width: 768px) {
		.footer-section {
			padding-top: 4rem;
			margin-top: 4rem;
		}

		.footer-container {
			gap: 4rem;
			padding: 0 1.25rem;
		}

		.footer-grid {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.footer-bottom {
			padding-top: 1.5rem;
			padding-bottom: 1.5rem;
		}
	}
</style>
