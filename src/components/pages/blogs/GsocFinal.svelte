<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	let activeDiff = $state(null);

	function toggleDiff(index) {
		if (activeDiff === index) {
			activeDiff = null;
		} else {
			activeDiff = index;
		}
	}

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

	const patchGroups = [
		{
			series: "[GSoC Patch v8 0/3] teach git repo info to handle path keys",
			status: "Merged",
			patches: [
				{
					id: "v8 1/3",
					name: "path: extract format_path() and use in rev-parse",
					msgId: "m201a0dc0c1bb4b82a83ccbbd7fda6d044836b650"
				},
				{
					id: "v8 2/3",
					name: "repo: add path.commondir with absolute and relative suffix formatting",
					msgId: "m0d7f5d450b58f6a53800598b550c81188382c38c"
				},
				{
					id: "v8 3/3",
					name: "repo: add path.gitdir with absolute and relative suffix formatting",
					msgId: "meab82fd15c0fc0bf43ae65d5877d2ff4adc6d401"
				}
			]
		},
		{
			series: "[GSoC PATCH v4] add more path keys to git repo info",
			status: "Submitted to Mailing List",
			patches: [
				{
					id: "v4 1/7",
					name: "repo: add path.toplevel with absolute and relative suffix formatting",
					msgId: "m27027d35e62d23bb52a2c3b036999aff07ca3269"
				},
				{
					id: "v4 2/7",
					name: "repo: add path.superproject-root with absolute and relative suffixes",
					msgId: "m05f102a543ad7255cfce522e40abb43035a51a5f"
				},
				{
					id: "v4 3/7",
					name: "repo: add path.hooks with absolute and relative suffix formatting",
					msgId: "m8055556f97e9926d24eb8e58eddb61cf3ff734d7"
				},
				{
					id: "v4 4/7",
					name: "repo: add path.index with absolute and relative suffix formatting",
					msgId: "m976e8e19702d4b107f36aa601fc191ead06e3dda"
				},
				{
					id: "v4 5/7",
					name: "repo: add path.grafts with absolute and relative suffix formatting",
					msgId: "m291290c357d01782f8fb5734a054c5c3b0daa972"
				},
				{
					id: "v4 6/7",
					name: "repo: add path.git-prefix",
					msgId: "mb819632f68e828b86e2c42489f31bc39abb08921"
				},
				{
					id: "v4 7/7",
					name: "repo: remove unused setup.h include",
					msgId: "m8d9200ccc8d065bda971c8e3e0cd330cc8c0a76e"
				}
			]
		},
		{
			series: "[GSoC Patch 0/2] add unicode support to git repo structure",
			status: "Submitted to Mailing List",
			patches: [
				{
					id: "v1 1/2",
					name: "gettext: fall back to env-derived charset when unset",
					msgId: "m67144957c637224b91855e1b0d5f8fe2c61ab745"
				},
				{
					id: "v1 2/2",
					name: "repo: add Unicode support for repo structure output",
					msgId: "m0548b42612997879d5a8393a637063f1bc5e0198"
				}
			]
		}
	];

	function getLoreUrl(msgId) {
		return `https://lore.kernel.org/git/20260605163012.181089-5-jayatheerthkulkarni2005@gmail.com/T/#${msgId}`;
	}
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
				<h1 class="post-title">GSoC 2026 Wrap-Up: Improving the git repo Command</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					The Google Summer of Code 2026 coding period has officially come to a close! Over the past three months, I have had the opportunity to work directly on Git core, focusing on modernizing and expanding the capabilities of the new <code>git repo</code> command.
				</p>

				<h2>Project Goals</h2>
				<p>
					The goal of this project was twofold: make path-based repository configuration flexible for external tools, editors, and scripts, and modernize terminal output rendering for better human readability.
				</p>

				<ul>
					<li>
						<strong>Flexible Path Metadata (<code>path.*</code>):</strong> Introduced standardized configuration keys to expose essential directory locations across a workspace. By pairing explicit <code>.absolute</code> and <code>.relative</code> suffixes, machines can query repository metadata without recalculating complex offset logic internally.
					</li>
					<li>
						<strong>Unicode Structure Visuals:</strong> Upgraded <code>git repo structure</code> to print clean Unicode box-drawing characters and bullets when running under UTF-8 locales, while providing an automatic fallback to standard ASCII characters for environments lacking full UTF-8 capabilities.
					</li>
				</ul>

				<h2>Patches and Contributions</h2>
				<p>
					Here is the final status breakdown of the patch series submitted to the Git mailing list during the project:
				</p>

				<div class="table-container">
					<table class="patches-table">
						<thead>
							<tr>
								<th>Patch</th>
								<th>Description</th>
								<th>Status</th>
								<th>Mailing List</th>
							</tr>
						</thead>
						<tbody>
							{#each patchGroups as group}
								{#each group.patches as patch, i}
									<tr>
										<td class="patch-id">{patch.id}</td>
										<td class="patch-name">{patch.name}</td>
										{#if i === 0}
											<td class="patch-status" rowspan={group.patches.length}>
												<span class="status-badge {group.status === 'Merged' ? 'merged' : 'pending'}">
													{group.status}
												</span>
											</td>
										{/if}
										<td class="patch-link">
											<a href={getLoreUrl(patch.msgId)} target="_blank" rel="noopener noreferrer">
												View Thread
											</a>
										</td>
									</tr>
								{/each}
							{/each}
						</tbody>
					</table>
				</div>

				<h2>Archive and Retrospective</h2>
				<p>
					If you would like to trace the full evolution of these patches, from early architectural debates on the mailing list to final reviews, you can browse all my weekly posts in the archive. Head over to <a href="https://jayatheerth.com/#/blogs">jayatheerth.com/#/blogs</a> and filter by the <code>GSoC</code> tag.
				</p>

				<h2>Acknowledgments</h2>
				<p>
					I want to express my deepest gratitude to my mentors, <strong>Justin Tobler</strong> and <strong>Lucas Oshiro</strong>. Their thorough code reviews, patience, and guidance on navigating the Git community made this three-month journey an incredible learning experience.
				</p>

				<p>
					If you have questions about the design choices, implementation details, or patch series, feel free to reach out via email at <a href="mailto:jayatheerthkulkarni2005@gmail.com">jayatheerthkulkarni2005@gmail.com</a>!
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
		background: rgba(220, 203, 142, 0.08);
		color: #dccb8e;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}

	.post-content a {
		color: #dccb8e;
		text-decoration: none;
		border-bottom: 1px solid rgba(220, 203, 142, 0.35);
		padding-bottom: 1px;
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.post-content a:hover {
		color: #f3ebd8;
		border-color: #f3ebd8;
	}

	/* Refined Dark Table Styling */
	.table-container {
		width: 100%;
		overflow-x: auto;
		margin: 2.5rem 0 3.5rem 0;
		border: 1px solid rgba(220, 203, 142, 0.12);
		border-radius: 8px;
		background: rgba(18, 18, 18, 0.6);
	}

	.patches-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
	}

	.patches-table th {
		background: rgba(220, 203, 142, 0.04);
		color: #dccb8e;
		font-weight: 500;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid rgba(220, 203, 142, 0.12);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.patches-table td {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid rgba(243, 235, 216, 0.04);
		vertical-align: middle;
		transition: background 0.2s ease;
	}

	.patches-table tr:hover td {
		background: rgba(220, 203, 142, 0.02);
	}

	.patches-table tr:last-child td {
		border-bottom: none;
	}

	.patch-id {
		font-family: "Courier New", Courier, monospace;
		color: #dccb8e;
		white-space: nowrap;
		font-size: 0.85rem;
	}

	.patch-name {
		color: rgba(243, 235, 216, 0.9);
		line-height: 1.5;
	}

	.status-badge {
		display: inline-block;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.25rem 0.6rem;
		border-radius: 4px;
		font-weight: 600;
		white-space: nowrap;
	}

	.status-badge.merged {
		background: rgba(74, 180, 110, 0.12);
		color: #8edca5;
		border: 1px solid rgba(74, 180, 110, 0.25);
	}

	.status-badge.pending {
		background: rgba(220, 203, 142, 0.12);
		color: #dccb8e;
		border: 1px solid rgba(220, 203, 142, 0.25);
	}

	.patch-link a {
		font-size: 0.85rem;
		white-space: nowrap;
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
