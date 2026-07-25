<script>
	import { Router } from "@mateothegreat/svelte5-router";
	import Home from "./components/pages/Home.svelte";
	import About from "./components/pages/About.svelte";
	import Gallery from "./components/pages/Gallery.svelte";
	import Gink from "./components/pages/Gink.svelte";
	import Gsoc from "./components/pages/Gsoc.svelte";
	import Blogs from "./components/pages/Blogs.svelte";

	// Blog Page Imports
	import GsocWeek8 from "./components/pages/blogs/GsocWeek8.svelte";
	import GsocWeek7 from "./components/pages/blogs/GsocWeek7.svelte";
	import GsocWeek6 from "./components/pages/blogs/GsocWeek6.svelte";
	import GsocWeek5 from "./components/pages/blogs/GsocWeek5.svelte";
	import GsocWeek4 from "./components/pages/blogs/GsocWeek4.svelte";
	import GsocWeek3 from "./components/pages/blogs/GsocWeek3.svelte";
	import GsocWeek2 from "./components/pages/blogs/GsocWeek2.svelte";
	import GsocWeek1 from "./components/pages/blogs/GsocWeek1.svelte";
	import GsocCommunityBonding from "./components/pages/blogs/GsocCommunityBonding.svelte";
	import GsocSelection from "./components/pages/blogs/GsocSelection.svelte";
	import WeirdPaths from "./components/pages/blogs/WeirdPaths.svelte";
	import TerminalIsLie from "./components/pages/blogs/TerminalIsLie.svelte";
	import CacheLinesVsBigO from "./components/pages/blogs/CacheLinesVsBigO.svelte";
	import PackfileHeuristics from "./components/pages/blogs/PackfileHeuristics.svelte";
	import UnmaskingGoroutines from "./components/pages/blogs/UnmaskingGoroutines.svelte";
	import IllusionOfTime from "./components/pages/blogs/IllusionOfTime.svelte";
	import AncientIndianUI from "./components/pages/blogs/AncientIndianUI.svelte";
	import NotFound from "./components/pages/NotFound.svelte";

	const routes = [
		{ path: "/", component: Home },
		{ path: "/about", component: About },
		{ path: "/gallery", component: Gallery },
		{ path: "/gink", component: Gink },
		{ path: "/gsoc", component: Gsoc },
		{ path: "/git", component: Gsoc },
		{ path: "/blogs", component: Blogs },

		// Blog Routes
		{ path: "/blogs/gsoc/week-8", component: GsocWeek8 },
		{ path: "/blogs/gsoc/week-7", component: GsocWeek7 },
		{ path: "/blogs/gsoc/week-6", component: GsocWeek6 },
		{ path: "/blogs/gsoc/week-5", component: GsocWeek5 },
		{ path: "/blogs/gsoc/week-4-phase2", component: GsocWeek4 },
		{ path: "/blogs/gsoc/week-3-next-steps", component: GsocWeek3 },
		{ path: "/blogs/gsoc/week-2-feedback1", component: GsocWeek2 },
		{ path: "/blogs/gsoc/week-1-path-foundation", component: GsocWeek1 },
		{ path: "/blogs/gsoc/community-bonding-period", component: GsocCommunityBonding },
		{ path: "/blogs/gsoc/gsoc-2026-selection", component: GsocSelection },
		{ path: "/blogs/systems/the-weird-paths", component: WeirdPaths },
		{ path: "/blogs/systems/the-terminal-is-a-lie", component: TerminalIsLie },
		{ path: "/blogs/rust/cache-lines-vs-big-o", component: CacheLinesVsBigO },
		{ path: "/blogs/git/packfile-heuristics", component: PackfileHeuristics },
		{ path: "/blogs/go/unmasking-goroutines", component: UnmaskingGoroutines },
		{ path: "/blogs/architecture/illusion-of-time", component: IllusionOfTime },
		{ path: "/blogs/ui/ancient-indian-ui", component: AncientIndianUI },
	];

	const statuses = {
		404: {
			component: NotFound
		}
	};
</script>

<Router {routes} {statuses} />

<style>
	@font-face {
		font-family: "Inter";
		src: url("./fonts/Inter/Inter-VariableFont_opsz,wght.woff2")
			format("woff2");
		font-style: normal;
		font-weight: 100 900;
		font-display: swap;
	}

	@font-face {
		font-family: "Inter";
		src: url("./fonts/Inter/Inter-Italic-VariableFont_opsz,wght.woff2")
			format("woff2");
		font-style: italic;
		font-weight: 100 900;
		font-display: swap;
	}

	@font-face {
		font-family: "Cormorant Garamond";
		src: url("./fonts/Cormorant-Garamond/CormorantGaramond-VariableFont_wght.woff2")
			format("woff2");
		font-style: normal;
		font-weight: 300 700;
		font-display: swap;
	}

	@font-face {
		font-family: "Cormorant Garamond";
		src: url("./fonts/Cormorant-Garamond/CormorantGaramond-Italic-VariableFont_wght.woff2")
			format("woff2");
		font-style: italic;
		font-weight: 300 700;
		font-display: swap;
	}

	:global(body) {
		margin: 0;
		padding: 0;

		background-color: #12153b;
		color: #f3ebd8;
		font-family: "Cormorant Garamond", serif;
	}

	:global(p) {
		font-family: "Inter", sans-serif;
	}

	:global(::selection) {
		background: #d4be7f;
		color: #12153b;
	}

	:global(::-moz-selection) {
		background: #d4be7f;
		color: #12153b;
	}
</style>
