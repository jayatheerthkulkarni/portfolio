import React, { useState, useEffect } from "react";
import { Sun, Moon, ArrowUpRight } from "lucide-react";

// --- GLOBAL DATA ---
const nav_json = [
	{ label: "Home", href: "https://jayatheerth.com/" },
	{ label: "About", href: "https://jayatheerth.com/about" },
	{ label: "Blogs", href: "https://jayatheerth.com/blogs" },
];

const blog_json = [
	{
		title: "How does a mailing list work?",
		desc: "The UI of a mailing list isn't very intuitive; it's very different from what we see in Gmail. Here's a simple explanation of how it actually functions under the hood.",
		img: "./mailinglist.png",
		link: "https://jayatheerth.com/blogs/git/how-does-a-mailing-list-work",
		category: "Git",
		date: "Feb 20, 2025",
	},
	{
		title: "Why Git Works the Way It Does",
		desc: "Git’s internals feel magical until you peek inside. A walkthrough of blobs, trees, commits, and how Git stores your project like a content-addressable database.",
		img: "./gitinternals.png",
		link: "https://jayatheerth.com/blogs/git/why-git-works-the-way-it-does",
		category: "Git",
		date: "Feb 21, 2024",
	},
];

function Navbar({ nav_json, darkMode, toggleTheme }) {
	const [menu, setMenu] = useState(false);
	return (
		<nav
			className={`sticky top-4 z-50 mx-auto mb-2 flex flex-col md:flex-row items-center justify-between px-5 py-3 backdrop-blur-xl border rounded-xl tracking-tight transition-all duration-300 w-full md:w-fit ${darkMode ? "bg-black/30 text-neutral-200 border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.06)]" : "bg-white/30 text-neutral-800 border-neutral-200 shadow-lg shadow-black/5"}`}
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

export default function BlogApp() {
	const [darkMode, setDarkMode] = useState(() => {
		const stored = localStorage.getItem("theme");
		return stored ? stored === "dark" : true;
	});
	const [activeCategory, setActiveCategory] = useState("All");

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
	}, [darkMode]);

	const toggleTheme = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);
		localStorage.setItem("theme", newMode ? "dark" : "light");
	};

	const categories = [
		"All",
		...new Set(blog_json.map((post) => post.category)),
	];
	const filteredPosts =
		activeCategory === "All"
			? blog_json
			: blog_json.filter(
					(post) =>
						post.category ===
						activeCategory,
				);

	return (
		<div
			className={`min-h-screen font-sans transition-colors duration-500 ease-in-out ${darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#ffffff] text-neutral-800"}`}
		>
			<div className="max-w-6xl mx-auto px-6 pb-24">
				<Navbar
					nav_json={nav_json}
					darkMode={darkMode}
					toggleTheme={toggleTheme}
				/>

				<header className="mt-16 mb-12 space-y-4">
					<h1
						className={`text-6xl font-bold tracking-tighter ${darkMode ? "text-white" : "text-black"}`}
					>
						The Archive
					</h1>
					<p
						className={`text-xl max-w-2xl font-light ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}
					>
						Deep dives into Git internals,
						backend systems in Go, and
						fixing tools that everyone
						quietly complains about.
					</p>
				</header>

				<div className="flex gap-2 mb-16 overflow-x-auto pb-2 hide-scrollbar">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() =>
								setActiveCategory(
									cat,
								)
							}
							className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap cursor-pointer ${
								activeCategory ===
								cat
									? darkMode
										? "bg-white text-black border-white"
										: "bg-black text-white border-black"
									: darkMode
										? "bg-white/5 border-white/10 text-neutral-400 hover:border-white/30"
										: "bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-neutral-400"
							}`}
						>
							{cat}
						</button>
					))}
				</div>

				<main className="space-y-24">
					{activeCategory === "All" &&
						blog_json.length > 0 && (
							<section className="group">
								<a
									href={
										blog_json[0]
											.link
									}
									className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
								>
									<div className="lg:col-span-7 overflow-hidden rounded-2xl border border-white/10 aspect-[16/9]">
										<img
											src={
												blog_json[0]
													.img
											}
											className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
											alt="Featured"
										/>
									</div>
									<div className="lg:col-span-5 space-y-6">
										<div className="flex items-center gap-4">
											<span className="text-blue-500 font-mono text-xs uppercase tracking-[0.2em]">
												{
													blog_json[0]
														.category
												}
											</span>
											<span className="text-neutral-500 text-xs font-mono">
												{
													blog_json[0]
														.date
												}
											</span>
										</div>
										<h2
											className={`text-4xl font-bold leading-tight ${darkMode ? "text-white" : "text-black"}`}
										>
											{
												blog_json[0]
													.title
											}
										</h2>
										<p
											className={`text-lg leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}
										>
											{
												blog_json[0]
													.desc
											}
										</p>
										<div className="flex items-center gap-2 font-medium group-hover:gap-4 transition-all">
											Read
											Article{" "}
											<ArrowUpRight
												size={
													18
												}
											/>
										</div>
									</div>
								</a>
							</section>
						)}

					<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
						{filteredPosts.map(
							(post, i) =>
								(activeCategory !==
									"All" ||
									i !==
										0) && (
									<article
										key={
											post.title
										}
										className="group cursor-pointer flex flex-col"
									>
										<a
											href={
												post.link
											}
											className="flex-1"
										>
											<div className="relative aspect-video mb-6 overflow-hidden rounded-xl border border-white/10">
												<img
													src={
														post.img
													}
													className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
													alt={
														post.title
													}
												/>
											</div>
											<div className="space-y-3">
												<div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-neutral-500">
													<span>
														{
															post.category
														}
													</span>
													<span>
														{
															post.date
														}
													</span>
												</div>
												<h3
													className={`text-xl font-bold leading-snug group-hover:underline decoration-neutral-500 underline-offset-4 ${darkMode ? "text-neutral-100" : "text-neutral-900"}`}
												>
													{
														post.title
													}
												</h3>
												<p
													className={`text-sm line-clamp-2 ${darkMode ? "text-neutral-500" : "text-neutral-600"}`}
												>
													{
														post.desc
													}
												</p>
											</div>
										</a>
									</article>
								),
						)}
					</section>
				</main>
			</div>

			<footer
				className={`mt-20 border-t pt-10 pb-8 transition-colors ${darkMode ? "border-white/10 text-neutral-300" : "border-neutral-300 text-neutral-700"}`}
			>
				<div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
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
						</ul>
					</div>
				</div>
				<div className="text-center text-sm opacity-70 mt-10">
					© {new Date().getFullYear()}{" "}
					Jayatheerth. No Rights Reserved, Copy
					it, Go nuts.
				</div>
			</footer>

			<style>{`
				.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
				.hide-scrollbar::-webkit-scrollbar { display: none; }
				.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
			`}</style>
		</div>
	);
}
