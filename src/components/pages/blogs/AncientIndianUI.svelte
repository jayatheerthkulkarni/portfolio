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
					<span class="category-badge">UI</span>
					<span class="date">June 2026</span>
				</div>
				<h1 class="post-title">Ancient Indian UI: The Design Language of This Portfolio</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					Most developer portfolios look the same. Dark background, accent color, a grid of cards, and a hero section that says "Hi, I'm X." I wanted something different. Something that felt like it belonged to me specifically, not to a template.
				</p>

				<p>
					This is a breakdown of every deliberate design decision made in building this site: the palette, the typography, the motion, the layout, and the philosophy that ties it all together.
				</p>

				<h2>The Philosophy: Restraint Over Decoration</h2>

				<p>
					The single guiding principle behind this design is restraint. Every element on the page should earn its right to exist. Nothing is added for the sake of looking busy. If something can be removed without losing meaning, it gets removed.
				</p>
				<p>
					This comes directly from classical Indian aesthetics, particularly from the concept of <em>rasa</em>: the idea that a work of art should evoke a single, dominant emotional experience rather than a chaotic mixture of sensations. The dominant rasa here is <em>shanta</em>: tranquility, stillness, and quiet confidence.
				</p>
				<p>
					A portfolio is not a product page. It does not need to shout. It needs to communicate clearly, trust the reader, and get out of the way.
				</p>

				<h2>The Colour Palette</h2>

				<p>
					The entire site runs on four colours. That is it.
				</p>

				<div class="swatch-row">
					<div class="swatch">
						<div class="swatch-block" style="background: #12153b;"></div>
						<code>#12153b</code>
						<span>Deep Navy</span>
					</div>
					<div class="swatch">
						<div class="swatch-block" style="background: #f3ebd8; border: 1px solid rgba(220,203,142,0.2);"></div>
						<code>#f3ebd8</code>
						<span>Parchment Cream</span>
					</div>
					<div class="swatch">
						<div class="swatch-block" style="background: #dccb8e;"></div>
						<code>#dccb8e</code>
						<span>Antique Gold</span>
					</div>
					<div class="swatch">
						<div class="swatch-block" style="background: #d4be7f;"></div>
						<code>#d4be7f</code>
						<span>Selection Gold</span>
					</div>
				</div>

				<p>
					The background <code>#12153b</code> is a deep indigo-navy. It is not pure black, which reads as harsh and cold. The blue undertone gives it warmth and depth, evoking the night sky over Mysore, the colour of the hour before dawn.
				</p>
				<p>
					The primary text colour <code>#f3ebd8</code> is a warm parchment cream. Reading white text on a dark screen produces eye strain because pure white emits all wavelengths at full intensity. Shifting to a warm off-white dramatically reduces fatigue for long-form reading, which is exactly what blog posts demand.
				</p>
				<p>
					The accent colour <code>#dccb8e</code> is an antique gold. In classical Indian temple architecture and manuscript illumination, gold was the colour of significance. It marked headings, borders, and decorative motifs. Here it performs the same function: it draws the eye to the things that matter without being aggressive.
				</p>
				<p>
					Finally, <code>#d4be7f</code> is used exclusively for text selection highlights. The site even customises the browser's native <code>::selection</code> pseudo-element, so that when you select text the highlight matches the palette rather than defaulting to an incongruous browser blue.
				</p>

				<h2>Typography</h2>

				<p>
					Two typefaces. No more.
				</p>

				<h3>Cormorant Garamond</h3>
				<p>
					The primary typeface for all headings and long-form body copy. Cormorant Garamond is a high-contrast serif with roots in the French Renaissance tradition. Its thin strokes, sharp serifs, and elegant proportions carry the same sensibility as the manuscript scripts used in classical Indian texts. It is a typeface that communicates scholarly depth without being stiff.
				</p>
				<p>
					It is loaded as a variable font in both Roman and Italic cuts, from local <code>woff2</code> files. No external CDN calls, no layout shift, no flash of unstyled text.
				</p>

				<h3>Inter</h3>
				<p>
					Inter handles all interface chrome: navigation, badges, metadata, captions, buttons, and filter controls. It is a grotesque sans-serif designed specifically for screen legibility at small sizes. Its neutrality is the point. It provides the structural scaffolding that lets Cormorant Garamond breathe.
				</p>
				<p>
					The pairing works because the two typefaces occupy completely different roles. They never compete. Cormorant carries meaning; Inter carries structure.
				</p>

				<h3>Courier New for Code</h3>
				<p>
					All inline code and code blocks use <code>Courier New</code>, a monospaced typeface available on every operating system without a download. The decision to use a system font here was deliberate: code should feel utilitarian, distinct from prose. The background tint <code>rgba(220, 203, 142, 0.1)</code> and a subtle gold border pull it into the palette without making it decorative.
				</p>

				<h2>Motion and Animation</h2>

				<p>
					Every page uses GSAP (GreenSock Animation Platform) for its entrance animation. The pattern is always the same:
				</p>
				<ol>
					<li>The back-link fades in and slides from the left.</li>
					<li>The page header elements stagger upward with a gentle easing curve.</li>
					<li>The content block's direct children cascade in with a short stagger.</li>
				</ol>
				<p>
					The easing functions used are <code>power2.out</code> and <code>power3.out</code>. These are decelerating curves, meaning elements accelerate quickly and then gently slow into their resting position. This mimics the physics of objects settling naturally, which the human visual system reads as calm and intentional rather than abrupt.
				</p>
				<p>
					The GSAP selector targets <code>.post-content > *</code> rather than <code>.post-content *</code>. This is a critical technical detail: the universal descendant selector would animate every single nested element including inline <code>code</code> tags, list items inside paragraphs, and interactive elements like accordions. This caused a conflict where GSAP would lock those elements at <code>opacity: 0</code> after the timeline completed, making them permanently invisible. Targeting only direct children avoids this entirely.
				</p>

				<h2>The Accordion Component</h2>

				<p>
					The patch accordion used in the GSoC week posts is a deliberately minimal interactive element. It uses a glassmorphism aesthetic: a dark, semi-transparent background (<code>rgba(25, 25, 25, 0.4)</code>), a <code>backdrop-filter: blur(10px)</code>, and a single-pixel gold border.
				</p>
				<p>
					The header uses a <code>div</code> rather than a <code>button</code>. This was a pragmatic decision after discovering that Brave Browser's Shields applied cosmetic filtering rules that matched CSS class names containing the word <code>patch</code>, hiding the elements entirely. Additionally, browser-default <code>button</code> styles were overriding layout properties in ways that required excessive CSS resets.
				</p>
				<p>
					The accordion state is managed by a single Svelte 5 reactive variable: <code>let activeDiff = $state(null)</code>. Only one panel can be open at a time. Clicking an open panel closes it. The content fades and slides in via a CSS keyframe animation rather than a GSAP tween, so it works independently of the page entrance timeline.
				</p>
				<p>
					Patch files are loaded dynamically via <code>fetch()</code> at runtime rather than being inlined as JavaScript string literals. This keeps each Svelte component file small and avoids Svelte's template parser attempting to interpret <code>&#123;</code> and <code>&#125;</code> characters inside code blocks as template expressions.
				</p>

				<h2>Layout and Spacing</h2>

				<p>
					All blog article content is constrained to a maximum width of <code>760px</code> and centred on the page. This is not arbitrary. Research on reading comfort consistently places the optimal line length at 60 to 75 characters per line. At typical body font sizes, 760px produces lines comfortably within that range.
				</p>
				<p>
					The page padding scales from <code>4rem</code> on desktop down to <code>2.5rem</code> on mobile. Heading margins are generous: <code>3.5rem</code> above each <code>h2</code> so that sections feel like distinct, breathable chapters rather than a single wall of text.
				</p>

				<h2>The Decorative Divider</h2>

				<p>
					Every page ends with the same element:
				</p>
				<div class="demo-divider">
					<span>❈</span>
					<div class="demo-line"></div>
					<span>❈</span>
				</div>
				<p>
					The <code>❈</code> character (U+2748, HEAVY SPARKLE) is a Unicode floral ornament. In classical Indian typography and manuscript design, floral motifs mark the end of a section. It is the typographic equivalent of closing a chapter before the next begins. The thin horizontal rule on either side is implemented with a single <code>div</code> set to <code>height: 1px</code> and <code>flex: 1</code>, so it fills the available space symmetrically.
				</p>

				<h2>The ❈ Symbol as System Identity</h2>

				<p>
					The heavy sparkle appears not just in the divider but also in the empty state of the blogs archive, in the navigation decorations on the home page, and as the favicon concept. It acts as the site's visual signature, a motif that recurs quietly throughout the experience.
				</p>
				<p>
					This kind of system-wide repetition of a single element is borrowed directly from classical Indian architecture, where a single motif such as a lotus or a kalasha would appear at every scale: on the gopuram, on the pillars, on the doorframe, and on the lamps. The repetition is not laziness. It is coherence.
				</p>

				<h2>What This All Adds Up To</h2>

				<p>
					The design is not trying to look like ancient India. It is trying to think like it. The palette draws from manuscript ink and temple gold. The typography pairs a Renaissance serif with a modern grotesque. The motion is calm. The layout is generous. The ornaments are sparse but consistent.
				</p>
				<p>
					The goal was a site that felt genuinely personal: not a template, not a trend, but a considered aesthetic that reflects a specific sensibility. Whether that comes through is, ultimately, for the reader to decide.
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

	.category-badge {
		font-family: "Inter", sans-serif; font-size: 0.75rem;
		text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500;
		color: #dccb8e;
	}
	.date { font-family: "Inter", sans-serif; font-size: 0.85rem; color: rgba(243, 235, 216, 0.4); }

	.post-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 300; line-height: 1.25; margin: 0; color: #f3ebd8; letter-spacing: -0.02em; }

	.post-content { font-family: "Inter", sans-serif; color: rgba(243, 235, 216, 0.85); }
	.post-content p { font-size: 1.05rem; line-height: 1.8; margin: 0 0 1.75rem 0; font-family: "Inter", sans-serif; }
	.post-content p.lead { font-size: 1.2rem; line-height: 1.7; color: #f3ebd8; font-style: italic; margin-bottom: 2.5rem; font-family: "Cormorant Garamond", serif; }
	.post-content em { font-style: italic; color: #f3ebd8; }

	.post-content h2 { font-family: "Cormorant Garamond", serif; font-size: 1.8rem; font-weight: 400; color: #dccb8e; margin: 3.5rem 0 1.25rem 0; letter-spacing: -0.01em; }
	.post-content h3 { font-family: "Cormorant Garamond", serif; font-size: 1.3rem; font-weight: 500; color: rgba(220, 203, 142, 0.85); margin: 2rem 0 0.85rem 0; }

	.post-content ol { margin: 0 0 2rem 1.5rem; padding: 0; }
	.post-content li { font-size: 1rem; line-height: 1.8; margin-bottom: 0.6rem; color: rgba(243, 235, 216, 0.8); font-family: "Inter", sans-serif; }

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1); color: #dccb8e;
		padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
	}

	.post-content a { color: #dccb8e; text-decoration: none; border-bottom: 1px solid rgba(220, 203, 142, 0.35); padding-bottom: 1px; transition: color 0.2s ease, border-color 0.2s ease; }
	.post-content a:hover { color: #f3ebd8; border-color: #f3ebd8; }

	/* Colour swatches */
	.swatch-row {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin: 2rem 0 2.5rem 0;
	}
	.swatch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		font-family: "Inter", sans-serif;
	}
	.swatch-block {
		width: 72px;
		height: 72px;
		border-radius: 10px;
		box-shadow: 0 4px 16px rgba(0,0,0,0.4);
	}
	.swatch code {
		font-size: 0.75rem;
		background: none;
		border: none;
		color: rgba(243, 235, 216, 0.6);
		padding: 0;
	}
	.swatch span {
		font-size: 0.72rem;
		color: rgba(243, 235, 216, 0.4);
		text-align: center;
		letter-spacing: 0.05em;
	}

	/* Inline divider demo */
	.demo-divider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0.5rem 0 2rem 0;
	}
	.demo-line {
		flex: 1;
		height: 1px;
		background: rgba(243, 235, 216, 0.15);
	}
	.demo-divider span {
		color: #dccb8e;
		font-size: 0.8rem;
	}

	/* Page footer divider */
	.rule { display: flex; align-items: center; gap: 0.75rem; width: 100%; margin: 5rem 0 2rem 0; }
	.line { flex: 1; height: 1px; background: rgba(243, 235, 216, 0.15); }
	.rule span { color: #dccb8e; font-size: 0.8rem; line-height: 1; flex-shrink: 0; }

	@media (max-width: 768px) {
		.blog-post-page { padding: 2.5rem 1rem; }
		.post-content p.lead { font-size: 1.1rem; }
		.post-content p { font-size: 1rem; }
		.swatch-row { gap: 1rem; }
		.swatch-block { width: 56px; height: 56px; }
	}
</style>
