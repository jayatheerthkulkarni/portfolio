import React, { useState, useEffect } from "react";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";

// Reusing the exact nav_json from your App.js
const nav_json = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Blogs", href: "https://jayatheerth.com/blogs" },
];

function Navbar({ nav_json, darkMode, toggleTheme }) {
	const [menu, setMenu] = useState(false);
	return (
		<nav
			className={`
			sticky top-4 z-50 mx-auto mb-12
			flex flex-col md:flex-row items-center justify-between
			px-5 py-3 backdrop-blur-xl border rounded-xl tracking-tight
			transition-all duration-300 w-full md:w-fit
			${darkMode ? "bg-black/30 text-neutral-200 border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.06)]" : "bg-white/30 text-neutral-800 border-neutral-200 shadow-lg shadow-black/5"}
		`}
		>
			<div className="flex items-center justify-between w-full md:w-auto gap-4">
				<a
					href="/"
					className="font-medium select-none whitespace-nowrap"
				>
					jayatheerth
				</a>

				<div className="hidden md:flex items-center gap-5">
					{nav_json.map((item) => (
						<li
							key={item.label}
							className="list-none text-sm opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap"
						>
							<a href={item.href}>
								{item.label}
							</a>
						</li>
					))}
				</div>

				<div
					className={`hidden md:block h-4 w-px ${darkMode ? "bg-white/20" : "bg-neutral-300"}`}
				/>

				<button
					onClick={toggleTheme}
					className={`cursor-pointer p-1.5 rounded-lg transition-all duration-300 ${darkMode ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-black/5 text-neutral-600 hover:text-black"}`}
					aria-label="Toggle theme"
				>
					{darkMode ? (
						<Sun size={17} />
					) : (
						<Moon size={17} />
					)}
				</button>

				<button
					onClick={() => setMenu(!menu)}
					className="md:hidden p-2 rounded-lg cursor-pointer transition hover:bg-white/5"
					aria-label="Toggle menu"
				>
					{!menu ? (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					) : (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					)}
				</button>
			</div>

			<div
				className={`md:hidden overflow-hidden transition-all duration-300 w-full ${menu ? "max-h-56 mt-3" : "max-h-0"}`}
			>
				<ul
					className={`flex flex-col rounded-lg border p-3 gap-2 text-center shadow-md ${darkMode ? "bg-black/40 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "bg-white/90 border-neutral-200 shadow-black/5"}`}
				>
					{nav_json.map((item) => (
						<li key={item.label}>
							<a
								href={item.href}
								onClick={() =>
									setMenu(
										false,
									)
								}
								className="cursor-pointer block py-2 opacity-90 hover:opacity-100 transition"
							>
								{item.label}
							</a>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}

export default function About() {
	const [darkMode, setDarkMode] = useState(() => {
		const stored = localStorage.getItem("theme");
		return stored ? stored === "dark" : true;
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
	}, [darkMode]);

	const toggleTheme = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);
		localStorage.setItem("theme", newMode ? "dark" : "light");
	};

	return (
		<div
			className={`min-h-screen font-sans transition-colors duration-500 ease-in-out ${darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#ffffff] text-neutral-800"}`}
		>
			<div className="max-w-4xl mx-auto px-6 pb-24">
				<Navbar
					nav_json={nav_json}
					darkMode={darkMode}
					toggleTheme={toggleTheme}
				/>

				<main className="space-y-16">
					<section className="flex flex-col-reverse md:flex-row gap-10 items-center mt-12">
						<div className="flex-1 space-y-6">
							<h1
								className={`text-4xl font-semibold transition-colors duration-300 ${darkMode ? "text-white" : "text-black"}`}
							>
								More than just
								code.
							</h1>
							<p
								className={`text-lg leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}
							>
								I am
								Jayatheerth, a
								systems engineer
								and compiler
								enthusiast.
								While most
								people are happy
								with high-level
								abstractions, I
								prefer digging
								into the kernel,
								managing memory
								manually, and
								arguing about
								Git internals.
							</p>
							<div className="flex gap-4">
								<button
									className={`cursor-pointer rounded-full px-6 py-2 text-sm font-medium shadow-md transition-all duration-300 ${darkMode ? "bg-[#0B1736] text-white hover:bg-[#0c1d48]" : "bg-[#0B1736] text-white hover:bg-[#0c1d48]"}`}
									onClick={() =>
										window.open(
											"https://github.com/jayatheerthkulkarni",
											"_blank",
										)
									}
								>
									GitHub
								</button>
								<button
									className={`cursor-pointer rounded-full px-6 py-2 text-sm font-medium border transition-all duration-300 ${darkMode ? "border-white/10 hover:bg-white/5" : "border-neutral-300 hover:bg-neutral-100"}`}
									onClick={() =>
										window.open(
											"https://www.linkedin.com/in/jayatheerth-k-0a3685297/",
											"_blank",
										)
									}
								>
									LinkedIn
								</button>
							</div>
						</div>
						<div className="w-full md:w-80 h-80 relative group">
							<div
								className={`absolute inset-0 rounded-2xl rotate-6 opacity-50 transition-transform duration-500 group-hover:rotate-12 ${darkMode ? "bg-white/5" : "bg-black/5"}`}
							></div>
							<img
								src="./me.jpeg"
								alt="Jayatheerth"
								className={`relative w-full h-full object-cover rounded-2xl shadow-2xl transition-all duration-500 ${darkMode ? "border border-white/10" : "border border-black/5"}`}
							/>
						</div>
					</section>

					<section>
						<h2
							className={`text-3xl mb-8 ${darkMode ? "text-white" : "text-neutral-900"}`}
						>
							What I Actually Do
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Card 1: Systems */}
							<div
								className={`p-6 rounded-xl border transition duration-300 ${darkMode ? "bg-white/5 border-white/10" : "bg-neutral-50 border-neutral-200"}`}
							>
								<h3
									className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}
								>
									Systems
									Programming
								</h3>
								<p className="text-sm opacity-70 leading-relaxed">
									I write
									production-grade
									C and
									Go. My
									focus is
									on
									memory
									safety,
									concurrency
									models,
									and
									low-level
									optimization.
								</p>
							</div>
							{/* Card 2: Compilers */}
							<div
								className={`p-6 rounded-xl border transition duration-300 ${darkMode ? "bg-white/5 border-white/10" : "bg-neutral-50 border-neutral-200"}`}
							>
								<h3
									className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}
								>
									Compiler
									Design
								</h3>
								<p className="text-sm opacity-70 leading-relaxed">
									I built
									Gink, a
									statically
									typed
									language.
									I love
									designing
									type
									systems,
									lexers,
									and
									parsers
									from
									scratch.
								</p>
							</div>
							{/* Card 3: Backend */}
							<div
								className={`p-6 rounded-xl border transition duration-300 ${darkMode ? "bg-white/5 border-white/10" : "bg-neutral-50 border-neutral-200"}`}
							>
								<h3
									className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}
								>
									Backend
									Architecture
								</h3>
								<p className="text-sm opacity-70 leading-relaxed">
									Experienced
									in
									handling
									large
									datasets
									(160k+
									rows)
									and
									optimizing
									database
									queries
									for
									sub-millisecond
									latency.
								</p>
							</div>
						</div>
					</section>

					<section className="space-y-10">
						<h2
							className={`text-3xl ${darkMode ? "text-white" : "text-neutral-900"}`}
						>
							The Journey
						</h2>

						<div
							className={`relative border-l pl-8 space-y-12 ${darkMode ? "border-white/10" : "border-neutral-300"}`}
						>
							<div className="relative">
								<div
									className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 ${darkMode ? "bg-white border-[#0a0a0a]" : "bg-black border-white"}`}
								></div>
								<span className="text-sm font-mono opacity-50 mb-1 block">
									May 2025
									-
									Present
								</span>
								<h3
									className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"}`}
								>
									Contributor
									@ Git
								</h3>
								<p className="mt-2 text-base opacity-80 max-w-2xl leading-relaxed">
									I
									actively
									contribute
									to the
									Git
									source
									code (C
									Language).
									I've
									authored
									patches
									impacting
									millions
									of
									developers,
									fixed
									critical
									submodule
									bugs,
									and
									optimized
									core
									functions
									like
									module_add
									to
									prevent
									namespace
									collisions.
									My work
									was
									featured
									in Git
									Rev News
									(Edition
									124).
								</p>
							</div>

							<div className="relative">
								<div
									className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 ${darkMode ? "bg-neutral-500 border-[#0a0a0a]" : "bg-neutral-400 border-white"}`}
								></div>
								<span className="text-sm font-mono opacity-50 mb-1 block">
									Sept
									2025 -
									Present
								</span>
								<h3
									className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"}`}
								>
									President
									@ GCET
									Open
									Source
									Foundation
								</h3>
								<p className="mt-2 text-base opacity-80 max-w-2xl leading-relaxed">
									Founded
									the
									community
									and
									scaled
									it to
									50+
									active
									student
									developers.
									I manage
									CI/CD
									workflows,
									review
									10+ PRs
									weekly,
									and
									mentor
									juniors
									on Git
									internals
									and Go
									programming.
								</p>
							</div>

							<div className="relative">
								<div
									className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 ${darkMode ? "bg-neutral-500 border-[#0a0a0a]" : "bg-neutral-400 border-white"}`}
								></div>
								<span className="text-sm font-mono opacity-50 mb-1 block">
									Oct 2024
									- July
									2025
								</span>
								<h3
									className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"}`}
								>
									Software
									Engineer
									Intern @
									Robot
									Paac
								</h3>
								<p className="mt-2 text-base opacity-80 max-w-2xl leading-relaxed">
									Designed
									a
									digital
									Inventory
									Management
									System
									replacing
									manual
									filing.
									Tested
									with
									160,000+
									data
									rows and
									optimized
									queries
									to
									ensure
									sub-millisecond
									latency
									during
									peak
									updates.
									Reduced
									operational
									overhead
									by 40+
									hours
									per
									week.
								</p>
							</div>
						</div>
					</section>
				</main>
			</div>

			{/* Exact Footer from App.js */}
			<footer
				className={`mt-20 border-t pt-10 pb-8 transition-colors ${
					darkMode
						? "border-white/10 text-neutral-300"
						: "border-neutral-300 text-neutral-700"
				}`}
			>
				<div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
					{/* Column 1: Connect */}
					<div className="space-y-3">
						<h3
							className={`text-lg font-semibold ${darkMode ? "text-white" : "text-neutral-900"}`}
						>
							Connect
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="mailto:jayatheerthkulkarni2005@gmail.com"
									className="hover:opacity-90"
								>
									jayatheerthkulkarni2005@gmail.com
								</a>
							</li>
							<li>
								<a
									href="https://x.com/k_jayatheerth"
									target="_blank"
									rel="noreferrer"
									className="hover:opacity-90"
								>
									Twitter
									(dead
									asf 🥀)
								</a>
							</li>
							<li>
								<a
									href="https://www.linkedin.com/in/jayatheerth-k-0a3685297/"
									target="_blank"
									rel="noreferrer"
									className="hover:opacity-90"
								>
									LinkedIn
								</a>
							</li>
						</ul>
					</div>

					{/* Column 2: Projects */}
					<div className="space-y-3">
						<h3
							className={`text-lg font-semibold ${darkMode ? "text-white" : "text-neutral-900"}`}
						>
							Projects
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="https://github.com/jayatheerthkulkarni"
									target="_blank"
									rel="noreferrer"
									className="hover:opacity-90"
								>
									GitHub
									Profile
								</a>
							</li>
							<li>
								<a
									href="https://github.com/GCET-Open-Source-Foundation/auth"
									target="_blank"
									className="hover:opacity-90"
								>
									Auth
								</a>
							</li>
							<li>
								<a
									href="https://jayatheerth.com/resume"
									target="_blank"
									rel="noreferrer"
									className="hover:opacity-90"
								>
									Resume
								</a>
							</li>
						</ul>
					</div>

					{/* Column 3: More links (Restored exactly) */}
					<div className="space-y-3">
						<h3
							className={`text-lg font-semibold ${darkMode ? "text-white" : "text-neutral-900"}`}
						>
							More links
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="https://github.com/git/git/commits/master/?author=jayatheerthkulkarni"
									target="_blank"
									rel="noreferrer"
									className="hover:opacity-90"
								>
									My Git
									Commits
								</a>
							</li>
							<li>
								<a
									href="https://git.github.io/rev_news/2025/06/30/edition-124/"
									target="_blank"
									rel="noreferrer"
									className="hover:opacity-90"
								>
									Git Rev
									News
									Mention
								</a>
							</li>
							<li>
								<a
									href="https://jayatheerth.com"
									className="hover:opacity-90"
								>
									jayatheerth.com
								</a>
							</li>
							<li>
								<a
									href="https://jayatheerth.com/blogs"
									className="hover:opacity-90"
								>
									blogs
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Line */}
				<div className="text-center text-sm opacity-70 mt-10">
					© {new Date().getFullYear()}{" "}
					Jayatheerth. No Rights Reserved, Copy
					it, Go nuts.
				</div>
			</footer>
		</div>
	);
}
