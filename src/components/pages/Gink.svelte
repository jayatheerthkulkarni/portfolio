<script>
	import Navbar from "../Navbar.svelte";
	import Footer from "../Footer.svelte";
	import { onMount } from "svelte";
	import { gsap } from "gsap";

	let activePipelineStage = "Source";
	const stages = {
		Source: {
			title: "Source",
			desc: "Gink source code files (.gink). Human-readable, structured, and designed for absolute clarity."
		},
		Preprocessor: {
			title: "Preprocessor",
			desc: "Resolves modules, imports std libraries, and parses compile-time flags and conditional compilation blocks."
		},
		Compiler: {
			title: "Compiler",
			desc: "Translates Gink AST (Abstract Syntax Tree) into safe, optimized C representation, ensuring ownership rules are respected."
		},
		Assembler: {
			title: "Assembler",
			desc: "Invokes backend compilers to compile intermediate code into machine-specific object code files (.o)."
		},
		Linker: {
			title: "Linker",
			desc: "Combines object files and standard runtime libraries to generate a single, static binary file."
		},
		Executable: {
			title: "Executable",
			desc: "The final standalone runtime binary. Fully optimized, with zero runtime overhead or hidden allocations."
		}
	};

	let memoryCycle = 0;

	function toggleStep() {
		memoryCycle = memoryCycle === 0 ? 1 : 0;
	}

	onMount(() => {
		window.scrollTo(0, 0);

		const ctx = gsap.context(() => {
			gsap.from(".gink-hero-content *", {
				opacity: 0,
				y: 35,
				duration: 0.9,
				stagger: 0.15,
				ease: "power3.out"
			});
		});

		return () => {
			ctx.revert();
		};
	});

	function selectStage(stage) {
		activePipelineStage = stage;
	}
</script>

<Navbar />

<div class="gink-page">
	<div class="page-container">

		<section class="gink-hero">
			<div class="gink-hero-content">
				<span class="eyebrow">The Systems Language</span>
				<h1>Gink</h1>
				<p class="hero-subtitle">A systems programming language built around clarity.</p>

				<div class="hero-bullets">
					<div class="bullet-item">
						<span class="bullet-dot">❈</span>
						<p>Performance where it matters.</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-dot">❈</span>
						<p>Safety where it counts.</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-dot">❈</span>
						<p>Syntax that stays out of your way.</p>
					</div>
				</div>

				<a href="#philosophy" class="scroll-cta">
					<span>Read the Specification</span>
					<span class="arrow-down">↓</span>
				</a>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section id="philosophy" class="philosophy-section">
			<div class="philosophy-content">
				<span class="eyebrow">Philosophy</span>
				<h2>Why another language?</h2>
				<p class="philosophy-text">
					Programming languages often optimize for one thing. Performance. Safety. Productivity. Gink is an attempt to stop treating those as mutually exclusive.
				</p>
				<p class="philosophy-subtext">
					It is designed for developers who want predictable systems software without sacrificing the experience of writing it.
				</p>
			</div>
		</section>

		<section class="pillars-section">
			<div class="pillars-grid">
				<div class="pillar-card">
					<span class="pillar-num">I</span>
					<h3>Clarity</h3>
					<ul>
						<li>Readable syntax.</li>
						<li>One obvious way to write code.</li>
						<li>Predictability over cleverness.</li>
					</ul>
				</div>

				<div class="pillar-card">
					<span class="pillar-num">II</span>
					<h3>Ownership</h3>
					<ul>
						<li>Deterministic memory.</li>
						<li>No garbage collector.</li>
						<li>Explicit resource management.</li>
					</ul>
				</div>

				<div class="pillar-card">
					<span class="pillar-num">III</span>
					<h3>Tooling</h3>
					<ul>
						<li>Formatter.</li>
						<li>Package manager.</li>
						<li>Documentation.</li>
						<li>Compiler in one tool.</li>
					</ul>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="decisions-section">
			<div class="section-header">
				<span class="eyebrow">Design Decisions</span>
				<h2>Designed Intentionally</h2>
				<p class="section-desc">Instead of features.</p>
			</div>

			<div class="manifesto-grid">
				<div class="manifesto-item">
					<span class="star">❈</span>
					<p>No hidden allocations.</p>
				</div>
				<div class="manifesto-item">
					<span class="star">❈</span>
					<p>No shadowing.</p>
				</div>
				<div class="manifesto-item">
					<span class="star">❈</span>
					<p>No runtime surprises.</p>
				</div>
				<div class="manifesto-item">
					<span class="star">❈</span>
					<p>Everything has an owner.</p>
				</div>
				<div class="manifesto-item">
					<span class="star">❈</span>
					<p>Every rule has one interpretation.</p>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="language-section">
			<div class="language-grid">
				<div class="language-meta">
					<span class="eyebrow">The Language</span>
					<h2>Linked List Code</h2>
					<p class="lang-desc-text">Readable in seconds. Predictable for years.</p>
				</div>

				<div class="code-editor-wrapper">
					<div class="editor-header">
						<div class="editor-buttons">
							<span class="dot red"></span>
							<span class="dot yellow"></span>
							<span class="dot green"></span>
						</div>
						<span class="editor-file">linked_list.gink</span>
					</div>
					<pre class="code-block"><code><span class="keyword">import</span> std;

<span class="keyword">struct</span> Node &#123;
    i32 data;
    *Node : next;
&#125;

main() &#123;
    *Node : head;

    *Node : temp := head; <span class="comment">// The pointers are copied.</span>
    *Node : nn;
    label;
    bool first = <span class="keyword">true</span>;
    
    <span class="comment">// This label defines scope.</span>
    <span class="keyword">for</span>(int i = 0; i &lt; 10; i++) &#123;
        nn &lt;&lt; <span class="keyword">new</span>(label) Node &#123;
            data := i;
        &#125;
        <span class="comment">// new (label) here label is quite literally the scope.</span>
        <span class="comment">// The &lt;&lt; thing takes ownership and doesn't invalidate the previous state</span>
        <span class="comment">// if you do x = y;</span>
        <span class="comment">// y is invalid and whatever was in x previously is obviously freed</span>
        <span class="keyword">if</span>(first) &#123;
            temp := nn;
            head := nn; <span class="comment">// You have to update the two pointers.</span>
            first = <span class="keyword">false</span>;
        &#125; <span class="keyword">else</span> &#123;
            temp-&gt;next = nn; <span class="comment">// Now things are moved from nn;</span>
        &#125;
    &#125;

    <span class="comment">// To print</span>
    nn = head;
    <span class="keyword">while</span>(<span class="keyword">true</span>) &#123;
        <span class="keyword">if</span>(is_null(nn)) &#123;
            <span class="keyword">break</span>;
        &#125;

        std.println(nn-&gt;data);

        nn &lt;&lt; nn-&gt;next; <span class="comment">// &lt;&lt; because ownership changed but the previous mem isn't freed...</span>
        <span class="comment">// The next maybe null so the compiler checks everytime here because it cannot directly prove unlike direct statements.</span>
    &#125;
&#125;</code></pre>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="pipeline-section">
			<div class="section-header">
				<span class="eyebrow">Compilation</span>
				<h2>Compilation Pipeline</h2>
				<p class="section-desc">From source code to executable. Hover or select a stage to inspect details.</p>
			</div>

			<div class="pipeline-display">
				<div class="pipeline-flow">
					{#each Object.keys(stages) as stage}
						<button
							class="pipeline-node"
							class:active={activePipelineStage === stage}
							on:click={() => selectStage(stage)}
							on:mouseenter={() => selectStage(stage)}
						>
							<span class="node-title">{stage}</span>
						</button>
						{#if stage !== "Executable"}
							<div class="pipeline-connector">↓</div>
						{/if}
					{/each}
				</div>

				<div class="pipeline-details-panel">
					<div class="panel-inner">
						<span class="stage-badge">Stage</span>
						<h3>{stages[activePipelineStage].title}</h3>
						<p>{stages[activePipelineStage].desc}</p>
					</div>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="memory-section">
			<div class="section-header">
				<span class="eyebrow">Resource Control</span>
				<h2>Memory Without Magic</h2>
			</div>

			<div class="memory-visualizer">
				<div class="visualizer-stage-wrapper">
					<div class="visualizer-stage">
						<div class="visualizer-nodes-container">
							<!-- Node x -->
							<div class="var-node-wrapper" class:invalid={memoryCycle === 1} class:active={memoryCycle === 0}>
								<span class="var-name">x</span>
								<div class="circle-node">
									{#if memoryCycle === 1}
										<div class="invalid-cross">×</div>
									{/if}
								</div>
							</div>

							<!-- Memory Circle (slides between x and y) -->
							<div class="memory-circle" class:state-0={memoryCycle === 0} class:state-1={memoryCycle === 1}>
								<span>Memory</span>
							</div>

							<!-- Node y -->
							<div class="var-node-wrapper" class:active={memoryCycle === 1}>
								<span class="var-name">y</span>
								<div class="circle-node"></div>
							</div>
						</div>
					</div>

					<div class="interactive-controls">
						<button on:click={toggleStep} class="control-btn next-btn highlight">
							{#if memoryCycle === 0}
								Execute: y = x
							{:else}
								Reset Animation
							{/if}
						</button>
					</div>
				</div>

				<div class="visualizer-explanation">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="step-card" class:active={memoryCycle === 0} on:click={() => memoryCycle = 0}>
						<span class="step-num">Step 1</span>
						<h4>x owns memory</h4>
						<p>Variable <code>x</code> is initialized. The circle representing the allocated memory is held by <code>x</code>.</p>
					</div>

					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="step-card" class:active={memoryCycle === 1} on:click={() => memoryCycle = 1}>
						<span class="step-num">Step 2</span>
						<h4>y = x (ownership moves & x is invalidated)</h4>
						<p>Ownership of the memory circle moves to <code>y</code>. Variable <code>x</code> automatically becomes invalid, and accessing it is a compile-time compiler error.</p>
					</div>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="principles-section">
			<div class="principles-content">
				<span class="eyebrow">Core Principles</span>
				<h2>Instead of Features</h2>
				<div class="principles-list">
					<div class="principle-item">
						<span class="label">One Owner.</span>
					</div>
					<div class="principle-item">
						<span class="label">One Formatter.</span>
					</div>
					<div class="principle-item">
						<span class="label">One Package Manager.</span>
					</div>
					<div class="principle-item">
						<span class="label">One Style.</span>
					</div>
					<div class="principle-item">
						<span class="label">One Predictable Language.</span>
					</div>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="documentation-section">
			<div class="doc-card">
				<div class="doc-book-render">
					<div class="book-spine"></div>
					<div class="book-cover">
						<div class="book-title">
							<span>❈</span>
							<h2>GINK</h2>
							<span class="book-sub">SPECIFICATION</span>
						</div>
					</div>
				</div>

				<div class="doc-info">
					<span class="eyebrow">Documentation</span>
					<h2>Specification</h2>
					<span class="page-count">93 PAGES</span>
					<p class="doc-summary">
						Syntax. Semantics. Design rationale. Read the comprehensive, complete specification.
					</p>
					<a href="/gink.pdf" target="_blank" class="read-btn">
						Read the Book
					</a>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="roadmap-section">
			<div class="section-header">
				<span class="eyebrow">Timeline</span>
				<h2>Roadmap</h2>
			</div>

			<div class="roadmap-timeline">
				<div class="timeline-step completed">
					<div class="step-check">✓</div>
					<div class="step-desc">
						<h4>Language Design</h4>
						<p>Establishing semantic rules, ownership rules, and syntax specs.</p>
					</div>
				</div>

				<div class="timeline-step completed">
					<div class="step-check">✓</div>
					<div class="step-desc">
						<h4>Specification Draft</h4>
						<p>Writing and compiling the complete 93-page document outlining compiler behavior.</p>
					</div>
				</div>

				<div class="timeline-step current">
					<div class="step-check">✦</div>
					<div class="step-desc">
						<h4>Transpiler Development</h4>
						<p>Building an AST translator that converts Gink source code into structured C intermediate code.</p>
					</div>
				</div>
			</div>
		</section>

		<div class="rule divider">
			<span>❈</span>
			<div class="line"></div>
			<span>❈</span>
		</div>

		<section class="quote-section">
			<div class="quote-content">
				<blockquote>
					"Programming languages are interfaces. Gink tries to make that interface disappear."
				</blockquote>

				<div class="quote-meta">
					<a href="https://github.com/jayatheerthkulkarni/gink" target="_blank" rel="noopener noreferrer" class="source-link">
						View Source <span class="arrow">→</span>
					</a>
				</div>
			</div>
		</section>

	</div>
</div>

<Footer />

<style>
	:global(body) {
		background-color: #12153b !important;
	}

	.gink-page {
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

	.gink-hero {
		min-height: 80vh;
		display: flex;
		align-items: center;
		padding-top: 4rem;
	}

	.gink-hero-content {
		max-width: 800px;
	}

	.eyebrow {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.25em;
		color: #dccb8e;
		display: block;
		margin-bottom: 1.5rem;
	}

	.gink-hero-content h1 {
		font-size: clamp(4rem, 8vw, 7.5rem);
		font-weight: 500;
		margin: 0;
		line-height: 1;
	}

	.hero-subtitle {
		font-size: clamp(1.5rem, 3vw, 2.2rem);
		color: rgba(243, 235, 216, 0.85);
		margin: 2rem 0 3rem 0;
		line-height: 1.3;
	}

	.hero-bullets {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-bottom: 4.5rem;
	}

	.bullet-item {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.bullet-dot {
		color: #dccb8e;
		font-size: 0.9rem;
	}

	.bullet-item p {
		margin: 0;
		font-size: 1.25rem;
		font-style: italic;
		color: rgba(243, 235, 216, 0.75);
	}

	.scroll-cta {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		color: #dccb8e;
		text-decoration: none;
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		transition: color 0.3s ease;
	}

	.scroll-cta:hover {
		color: #f3ebd8;
	}

	.arrow-down {
		font-size: 1.1rem;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(5px); }
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
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

	.philosophy-section {
		padding: 4rem 0;
	}

	.philosophy-content {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	.philosophy-content h2 {
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 400;
		margin: 0 0 2rem 0;
	}

	.philosophy-text {
		font-size: 1.6rem;
		line-height: 1.6;
		color: #f3ebd8;
		margin-bottom: 2rem;
		font-style: italic;
	}

	.philosophy-subtext {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(243, 235, 216, 0.65);
		max-width: 600px;
		margin: 0 auto;
	}

	.pillars-section {
		padding: 2rem 0;
	}

	.pillars-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3rem;
	}

	.pillar-card {
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 3rem 2.5rem;
		transition: border-color 0.3s ease, transform 0.3s ease;
	}

	.pillar-card:hover {
		border-color: rgba(220, 203, 142, 0.45);
		transform: translateY(-4px);
	}

	.pillar-num {
		font-size: 2rem;
		color: #dccb8e;
		display: block;
		margin-bottom: 1.5rem;
		font-family: "Inter", sans-serif;
		font-weight: 200;
	}

	.pillar-card h3 {
		font-size: 1.85rem;
		margin: 0 0 1.5rem 0;
		font-weight: 400;
	}

	.pillar-card ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.pillar-card li {
		font-family: "Inter", sans-serif;
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba(243, 235, 216, 0.7);
	}

	.section-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.section-header h2 {
		margin: 0 0 1rem 0;
		font-size: clamp(2.5rem, 4vw, 3.5rem);
		font-weight: 400;
	}

	.section-desc {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(243, 235, 216, 0.6);
		margin: 0;
	}

	.decisions-section {
		padding: 2rem 0;
	}

	.manifesto-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.manifesto-item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.5rem;
		align-items: center;
		padding: 1.25rem 0;
		border-bottom: 1px solid rgba(220, 203, 142, 0.12);
	}

	.manifesto-item:last-child {
		border-bottom: none;
	}

	.manifesto-item .star {
		color: #dccb8e;
		font-size: 0.8rem;
	}

	.manifesto-item p {
		margin: 0;
		font-size: 1.4rem;
		font-style: italic;
	}

	.language-section {
		padding: 2rem 0;
	}

	.language-grid {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		align-items: center;
	}

	.language-meta {
		text-align: center;
		max-width: 700px;
	}

	.language-meta h2 {
		font-size: clamp(2.2rem, 4vw, 3.2rem);
		margin: 0 0 1.5rem 0;
		font-weight: 400;
	}

	.lang-desc-text {
		font-size: 1.5rem;
		color: #dccb8e;
		font-style: italic;
		line-height: 1.5;
	}

	.code-editor-wrapper {
		width: 100%;
		max-width: 900px;
		background: #181938;
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
	}

	.editor-header {
		background: rgba(18, 21, 59, 0.6);
		padding: 0.75rem 1.25rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(220, 203, 142, 0.1);
	}

	.editor-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.editor-buttons .dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.editor-buttons .red { background: #ff5f56; }
	.editor-buttons .yellow { background: #ffbd2e; }
	.editor-buttons .green { background: #27c93f; }

	.editor-file {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		color: rgba(243, 235, 216, 0.5);
	}

	.code-block {
		margin: 0;
		padding: 1.5rem 2rem;
		font-family: "Courier New", Courier, monospace;
		font-size: 1rem;
		line-height: 1.6;
		overflow-x: auto;
	}

	.code-block .keyword {
		color: #dccb8e;
		font-weight: bold;
	}

	.code-block .string {
		color: #a8dccb;
	}

	.code-block .comment {
		color: rgba(243, 235, 216, 0.45);
		font-style: italic;
	}

	.pipeline-section {
		padding: 2rem 0;
	}

	.pipeline-display {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}

	.pipeline-flow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.pipeline-node {
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.2);
		border-radius: 8px;
		padding: 1rem 2rem;
		width: 100%;
		max-width: 320px;
		cursor: pointer;
		text-align: center;
		transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
	}

	.pipeline-node:hover, .pipeline-node.active {
		background: #dccb8e;
		border-color: #dccb8e;
		transform: scale(1.03);
	}

	.pipeline-node:hover .node-title, .pipeline-node.active .node-title {
		color: #12153b;
	}

	.node-title {
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #f3ebd8;
		font-weight: 500;
	}

	.pipeline-connector {
		font-size: 1.2rem;
		color: rgba(220, 203, 142, 0.4);
		margin: 0.25rem 0;
	}

	.pipeline-details-panel {
		background: rgba(18, 21, 59, 0.3);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 3rem;
		min-height: 250px;
		display: flex;
		align-items: center;
	}

	.stage-badge {
		font-family: "Inter", sans-serif;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		display: block;
		margin-bottom: 0.75rem;
	}

	.panel-inner h3 {
		font-size: 2.2rem;
		margin: 0 0 1rem 0;
		font-weight: 400;
	}

	.panel-inner p {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(243, 235, 216, 0.75);
		margin: 0;
	}

	.memory-section {
		padding: 2rem 0;
	}

	.memory-visualizer {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
		background: rgba(25, 25, 25, 0.15);
		border: 1px solid rgba(220, 203, 142, 0.1);
		border-radius: 16px;
		padding: 4rem;
	}

	.visualizer-stage-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
		border-right: 1px solid rgba(220, 203, 142, 0.1);
		padding-right: 2rem;
	}

	.visualizer-stage {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		width: 100%;
	}

	.visualizer-nodes-container {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 320px;
		height: 100px;
	}

	.var-node-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		position: relative;
	}

	.var-name {
		font-family: "Inter", sans-serif;
		font-size: 1.1rem;
		font-weight: bold;
		color: #f3ebd8;
	}

	.circle-node {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 2px solid rgba(220, 203, 142, 0.25);
		background: rgba(25, 25, 25, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.5s ease;
		position: relative;
	}

	.var-node-wrapper.active .circle-node {
		border-color: #dccb8e;
		box-shadow: 0 0 15px rgba(220, 203, 142, 0.2);
	}

	.var-node-wrapper.invalid .circle-node {
		border-color: rgba(243, 235, 216, 0.15) !important;
		border-style: dashed;
		background: rgba(25, 25, 25, 0.05);
	}

	.invalid-cross {
		font-family: "Inter", sans-serif;
		font-size: 2.5rem;
		color: rgba(243, 235, 216, 0.2);
		line-height: 1;
	}

	.memory-circle {
		position: absolute;
		width: 56px;
		height: 56px;
		background: #dccb8e;
		color: #12153b;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		box-shadow: 0 0 15px rgba(220, 203, 142, 0.4);
		transition: left 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s ease;
		top: 36px;
		pointer-events: none;
		z-index: 2;
	}

	.memory-circle.state-0 {
		left: 12px;
	}

	.memory-circle.state-1, .memory-circle.state-2 {
		left: 252px;
	}

	.interactive-controls {
		display: flex;
		gap: 1rem;
		width: 100%;
		justify-content: center;
	}

	.control-btn {
		font-family: "Inter", sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		border: 1px solid rgba(220, 203, 142, 0.3);
		background: transparent;
		color: #dccb8e;
		padding: 0.6rem 1.25rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.control-btn:hover:not(:disabled) {
		background: rgba(220, 203, 142, 0.1);
		border-color: #dccb8e;
	}

	.control-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.control-btn.highlight {
		background: #dccb8e;
		color: #12153b;
		border-color: #dccb8e;
		font-weight: 500;
	}

	.control-btn.highlight:hover {
		background: #f3ebd8;
		border-color: #f3ebd8;
	}

	.visualizer-explanation {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.step-card {
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid transparent;
		background: rgba(18, 21, 59, 0.1);
		transition: all 0.5s ease;
	}

	.step-card.active {
		background: rgba(18, 21, 59, 0.4);
		border-color: rgba(220, 203, 142, 0.3);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.step-num {
		font-family: "Inter", sans-serif;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(243, 235, 216, 0.4);
		display: block;
		margin-bottom: 0.25rem;
	}

	.step-card.active .step-num {
		color: #dccb8e;
	}

	.step-card h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1.3rem;
		font-weight: 400;
	}

	.step-card p {
		font-family: "Inter", sans-serif;
		font-size: 0.9rem;
		line-height: 1.5;
		color: rgba(243, 235, 216, 0.6);
		margin: 0;
	}

	.principles-section {
		padding: 2rem 0;
		text-align: center;
	}

	.principles-content {
		max-width: 700px;
		margin: 0 auto;
	}

	.principles-content h2 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		margin: 0 0 3.5rem 0;
	}

	.principles-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
	}

	.principle-item {
		font-size: clamp(1.5rem, 3.5vw, 2.5rem);
		font-style: italic;
		color: rgba(243, 235, 216, 0.85);
		border-bottom: 1px solid rgba(220, 203, 142, 0.1);
		padding-bottom: 0.5rem;
		width: 100%;
		max-width: 500px;
	}

	.principle-item:last-child {
		border-bottom: none;
	}

	.documentation-section {
		padding: 2rem 0;
		display: flex;
		justify-content: center;
	}

	.doc-card {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 4rem;
		align-items: center;
		background: rgba(25, 25, 25, 0.2);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 12px;
		padding: 4rem;
		max-width: 800px;
		width: 100%;
	}

	.doc-book-render {
		position: relative;
		width: 180px;
		height: 250px;
		background: #1e224e;
		border-radius: 4px 12px 12px 4px;
		box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.5);
		display: flex;
		overflow: hidden;
		justify-self: center;
	}

	.book-spine {
		width: 15px;
		background: #141738;
		height: 100%;
		border-right: 1px solid rgba(220, 203, 142, 0.15);
	}

	.book-cover {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1rem 0.5rem;
	}

	.book-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
	}

	.book-title span {
		color: #dccb8e;
		font-size: 1.1rem;
	}

	.book-title h2 {
		margin: 0;
		font-size: 1.6rem;
		letter-spacing: 0.1em;
		font-weight: 300;
		line-height: 1.1;
	}

	.book-sub {
		font-family: "Inter", sans-serif;
		font-size: 0.55rem;
		letter-spacing: 0.1em;
		color: rgba(243, 235, 216, 0.5);
	}

	.doc-info h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin: 0 0 0.5rem 0;
		font-weight: 400;
	}

	.page-count {
		font-family: "Inter", sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #dccb8e;
		display: block;
		margin-bottom: 1.5rem;
	}

	.doc-summary {
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.7);
		margin: 0 0 2.5rem 0;
	}

	.read-btn {
		display: inline-flex;
		align-items: center;
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #12153b;
		background-color: #dccb8e;
		padding: 0.85rem 1.75rem;
		border-radius: 6px;
		text-decoration: none;
		transition: background-color 0.3s ease, transform 0.3s ease;
	}

	.read-btn:hover {
		background-color: #f3ebd8;
		transform: translateY(-2px);
	}

	.roadmap-section {
		padding: 2rem 0;
	}

	.roadmap-timeline {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		max-width: 700px;
		margin: 0 auto;
	}

	.timeline-step {
		display: grid;
		grid-template-columns: 48px 1fr;
		gap: 2rem;
		align-items: start;
	}

	.step-check {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		font-weight: bold;
	}

	.completed .step-check {
		background: rgba(168, 220, 203, 0.15);
		border: 1px solid #a8dccb;
		color: #a8dccb;
	}

	.current .step-check {
		background: rgba(220, 203, 142, 0.15);
		border: 1px solid #dccb8e;
		color: #dccb8e;
		box-shadow: 0 0 12px rgba(220, 203, 142, 0.4);
	}

	.step-desc h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1.4rem;
		font-weight: 400;
	}

	.completed .step-desc h4 {
		color: rgba(243, 235, 216, 0.85);
	}

	.current .step-desc h4 {
		color: #dccb8e;
	}

	.step-desc p {
		font-family: "Inter", sans-serif;
		font-size: 0.95rem;
		line-height: 1.6;
		color: rgba(243, 235, 216, 0.65);
		margin: 0;
	}

	.quote-section {
		padding: 4rem 0;
		text-align: center;
	}

	.quote-content {
		max-width: 800px;
		margin: 0 auto;
	}

	blockquote {
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1.4;
		margin: 0 0 3.5rem 0;
		font-style: italic;
		font-weight: 300;
	}

	.quote-meta p {
		font-family: "Inter", sans-serif;
		font-size: 1rem;
		color: rgba(243, 235, 216, 0.5);
		margin: 0 0 1.5rem 0;
	}

	.source-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #dccb8e;
		text-decoration: none;
		font-family: "Inter", sans-serif;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.source-link:hover {
		color: #f3ebd8;
	}

	.source-link .arrow {
		transition: transform 0.3s ease;
	}

	.source-link:hover .arrow {
		transform: translateX(4px);
	}

	@media (max-width: 1024px) {
		.pillars-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.language-grid {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.pipeline-display {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.memory-visualizer {
			grid-template-columns: 1fr;
			gap: 3rem;
			padding: 2.5rem;
		}

		.visualizer-stage-wrapper {
			border-right: none;
			border-bottom: 1px solid rgba(220, 203, 142, 0.1);
			padding-right: 0;
			padding-bottom: 2.5rem;
		}

		.doc-card {
			grid-template-columns: 1fr;
			gap: 3rem;
			padding: 3rem;
		}
	}

	@media (max-width: 768px) {
		.gink-page {
			padding: 2rem 1rem;
		}

		.page-container {
			gap: 4rem;
		}

		.gink-hero {
			min-height: auto;
			padding-top: 2rem;
		}

		.philosophy-section {
			padding: 2rem 0;
		}
	}
</style>
