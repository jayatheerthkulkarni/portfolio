import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";

const nav_json = [
	{ label: "Home", href: "https://jayatheerth.com/" },
	{ label: "About", href: "https://jayatheerth.com/about" },
	{ label: "Blogs", href: "https://jayatheerth.com/blogs" },
];

const skills_json = [
	{ name: "Go", img: "./go.png" },
	{ name: "JavaScript", img: "./js.png" },
	{ name: "React", img: "./react.png" },
	{ name: "PostgreSQL", img: "./pg.png" },
	{ name: "Git", img: "./git.png" },
	{ name: "C", img: "./c.png" },
	{ name: "Java", img: "./java.png" },
];

const blog_json = [
	{
		title: "How does a mailing list work?",
		desc: "The UI of a mailing list isn't very intuitive; it's very different from what we see in Gmail. Here's a simple explanation of how it actually functions under the hood.",
		img: "./mailinglist.png",
		link: "https://jayatheerth.com/blogs/git/how-does-a-mailing-list-work",
		site: "https://blog.jayatheerth.com",
	},
	{
		title: "Why Git Works the Way It Does",
		desc: "Git’s internals feel magical until you peek inside. A walkthrough of blobs, trees, commits, and how Git stores your project like a content-addressable database.",
		img: "./gitinternals.png",
		link: "https://jayatheerth.com/blogs/git/why-git-works-the-way-it-does",
		site: "https://jayatheerth.com",
	},
];

function Navbar({ nav_json, darkMode, toggleTheme }) {
	const [menu, setMenu] = useState(false);
	return (
		<nav
			className={`
			sticky top-4 z-50 mx-auto mb-2
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

export default function App() {
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

	const carouselRef = useRef(null);

	const scrollLeft = () => {
		if (!carouselRef.current) return;
		const amount = Math.floor(
			carouselRef.current.clientWidth * 0.7,
		);
		carouselRef.current.scrollBy({
			left: -amount,
			behavior: "smooth",
		});
	};

	const scrollRight = () => {
		if (!carouselRef.current) return;
		const amount = Math.floor(
			carouselRef.current.clientWidth * 0.7,
		);
		carouselRef.current.scrollBy({
			left: amount,
			behavior: "smooth",
		});
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

				<section className="relative w-full mt-12 mb-16 group">
					<img
						src="./art.jpg"
						alt="Abstract Digital Art"
						className={`relative w-full h-60 sm:h-80 object-cover rounded-xl shadow-2xl transition-all duration-500 ${darkMode ? "border border-white/10" : "border border-black/5"}`}
					/>
				</section>

				<main className="space-y-8">
					<div className="space-y-2">
						<p
							className={`text-4xl transition-colors duration-300 ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}
						>
							Hi,
						</p>

						<h1
							className={`text-4xl transition-colors duration-300 ${darkMode ? "text-white" : "text-black"}`}
						>
							I am Jayatheerth
						</h1>

						<p
							className={`text-xl transition-colors duration-300 ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}
						>
							Some people online call
							me Gink. I’ve stopped
							fighting it at this
							point.
						</p>
					</div>

					<button
						className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium shadow-md transition-all duration-300 ${darkMode ? "bg-[#0B1736] text-white hover:bg-[#0c1d48]" : "bg-[#0B1736] text-white hover:bg-[#0c1d48]"}`}
						onClick={() =>
							(window.location.href =
								"https://jayatheerth.com/resume")
						}
					>
						Resume
					</button>

					<div className="space-y-6 max-w-2xl">
						<p
							className={`text-2xl sm:text-3xl font-light leading-relaxed transition-colors duration-300 ${darkMode ? "text-neutral-100" : "text-neutral-800"}`}
						>
							People say first
							impressions matter, so
							here’s mine.
						</p>

						<p
							className={`text-lg leading-8 transition-colors duration-300 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}
						>
							I build backend systems
							in{" "}
							<span
								className={`font-semibold ${darkMode ? "text-white" : "text-neutral-900"}`}
							>
								Go
							</span>{" "}
							and fix tools everyone
							quietly complains about.
							I’ve contributed code to{" "}
							<span
								className={`font-semibold ${darkMode ? "text-white" : "text-neutral-900"}`}
							>
								Git core
							</span>{" "}
							which is fun, humbling,
							and slightly terrifying.
							Currently leading the
							Open Source Foundation
							at GCET.
						</p>
					</div>

					<button
						onClick={() =>
							(window.location.href =
								"https://jayatheerth.com/a-new-language/")
						}
						className="cursor-pointer relative group w-full rounded-xl overflow-hidden mt-4"
					>
						<img
							src="./hero_project.jpg"
							alt="State of the art project"
							className="w-full h-auto rounded-xl transition duration-300 group-hover:opacity-30"
						/>
						<span
							className={`absolute inset-0 flex items-center justify-center text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm ${darkMode ? "/80 text-white border border-white/10" : "/80 text-neutral-900 border border-neutral-200"}`}
						>
							See Project
						</span>
					</button>
					{/* Blog carousel */}
					<section className="mt-20">
						<h2
							className={`text-3xl  ${darkMode ? "text-white" : "text-neutral-900"}`}
						>
							Featured Reads
						</h2>

						<div className="mt-6 relative">
							<button
								onClick={
									scrollLeft
								}
								aria-label="Scroll left"
								className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-black/50 text-white cursor-pointer"
							>
								<ChevronLeft
									size={
										18
									}
								/>
							</button>

							<div
								ref={
									carouselRef
								}
								className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 hide-scrollbar"
							>
								{blog_json.map(
									(
										post,
										idx,
									) => (
										<a
											key={
												post.title
											}
											href={
												post.link
											}
											target="_blank"
											rel="noreferrer"
											className={`snap-start shrink-0 w-[260px] h-[420px] rounded-xl overflow-hidden relative border transition ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"}`}
										>
											<img
												src={
													post.img
												}
												alt={
													post.title
												}
												className="w-full h-[260px] object-cover"
											/>
											<div
												className={`p-4 ${darkMode ? "text-white" : "text-neutral-900"}`}
											>
												<h3 className="text-lg font-semibold line-clamp-2">
													{
														post.title
													}
												</h3>
												<p className="mt-2 text-sm opacity-80 line-clamp-3">
													{
														post.desc
													}
												</p>
												<div className="mt-4 flex items-center justify-between text-xs opacity-80">
													<span>
														{
															new URL(
																post.site,
															)
																.hostname
														}
													</span>
													<span>
														#
														{idx +
															1}
													</span>
												</div>
											</div>
											<a
												href={
													post.site
												}
												target="_blank"
												rel="noreferrer"
												className="absolute top-3 right-3 text-xs opacity-80 px-2 py-1 rounded bg-black/20 text-white"
											>
												Open
											</a>
										</a>
									),
								)}
							</div>

							<button
								onClick={
									scrollRight
								}
								aria-label="Scroll right"
								className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-black/50 text-white cursor-pointer"
							>
								<ChevronRight
									size={
										18
									}
								/>
							</button>
						</div>
					</section>
					{/* Featured Work */}
					<section className="mt-20 space-y-10">
						<h2
							className={`text-3xl ${darkMode ? "text-white" : "text-neutral-900"}`}
						>
							Things I Build So You
							Don't Have To
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
							{/* Card 1 */}
							<div className="relative group rounded-xl overflow-hidden cursor-pointer max-w-sm w-full">
								<img
									src="./auth.png"
									alt="Auth project"
									className="w-full h-auto object-contain rounded-xl transition duration-300 group-hover:opacity-30"
								/>
								<div
									className={`
									absolute inset-0 px-6 py-8 flex flex-col justify-center
									transition-all duration-300 backdrop-blur-sm
									opacity-100 sm:opacity-0 sm:group-hover:opacity-100
									${darkMode ? "text-white bg-black/30" : "text-neutral-900 bg-white/30"}
									`}
								>
									<h3 className="text-xl font-semibold">
										Auth
										as
										a
										library
										but
										industrial
										grade
									</h3>
									<p className="mt-2 text-sm opacity-90 max-w-md">
										A
										Go
										authentication
										library
										that
										eliminates
										boilerplate.
									</p>
									<button
										onClick={() =>
											(window.location.href =
												"https://github.com/GCET-Open-Source-Foundation/auth")
										}
										className="cursor-pointer mt-4 self-start rounded-full px-5 py-2 text-sm font-medium shadow-md transition-all duration-300 bg-[#0B1736] text-white hover:bg-[#0c1d48]"
									>
										View
										Project
									</button>
								</div>
							</div>

							{/* Card 2 */}
							<div className="relative group rounded-xl overflow-hidden cursor-pointer max-w-sm w-full">
								<img
									src="./OSS.webp"
									alt="Forum project"
									className="w-full h-auto object-contain rounded-xl transition duration-300 group-hover:opacity-30"
								/>
								<div
									className={`
									absolute inset-0 px-6 py-8 flex flex-col justify-center
									transition-all duration-300 backdrop-blur-sm
									opacity-100 sm:opacity-0 sm:group-hover:opacity-100
									${darkMode ? "text-white bg-black/30" : "text-neutral-900 bg-white/30"}
									`}
								>
									<h3 className="text-xl font-semibold">
										Project
										Forum
										but
										smarter
									</h3>
									<p className="mt-2 text-sm opacity-90 max-w-md">
										Matches
										students
										to
										projects
										like
										a
										productive
										Tinder
										swipe.
									</p>
									<button
										onClick={() =>
											(window.location.href =
												"https://github.com/GCET-Open-Source-Foundation/project_forum")
										}
										className="cursor-pointer mt-4 self-start rounded-full px-5 py-2 text-sm font-medium shadow-md transition-all duration-300 bg-[#0B1736] text-white hover:bg-[#0c1d48]"
									>
										View
										Project
									</button>
								</div>
							</div>
						</div>
					</section>

					{/* Skills */}
					<section className="mt-20 pb-10">
						<h2
							className={`text-3xl mb-8 ${
								darkMode
									? "text-white"
									: "text-neutral-900"
							}`}
						>
							Skills That Should Pay
							the Bills
						</h2>

						<div className="relative">
							{/* Left Arrow */}
							<button
								onClick={() => {
									const el =
										document.getElementById(
											"skills-scroll",
										);
									if (!el)
										return;
									const amount =
										Math.floor(
											el.clientWidth *
												0.7,
										);
									el.scrollBy(
										{
											left: -amount,
											behavior: "smooth",
										},
									);
								}}
								aria-label="Scroll left"
								className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-black/50 text-white cursor-pointer"
							>
								<ChevronLeft
									size={
										18
									}
								/>
							</button>

							{/* Scrollable Row */}
							<div
								id="skills-scroll"
								className="flex gap-5 overflow-x-auto py-2 hide-scrollbar"
							>
								{skills_json.map(
									(
										skill,
									) => (
										<div
											key={
												skill.name
											}
											className={`flex flex-col items-center min-w-[100px] gap-2 p-4 rounded-lg text-sm font-medium border transition ${
												darkMode
													? "border-white/10 bg-white/5 text-white"
													: "border-neutral-300 bg-neutral-50 text-neutral-800"
											}`}
										>
											<img
												src={
													skill.img
												}
												alt={
													skill.name
												}
												className="w-12 h-12 opacity-90 rounded-md"
											/>
											{
												skill.name
											}
										</div>
									),
								)}
							</div>

							{/* Right Arrow */}
							<button
								onClick={() => {
									const el =
										document.getElementById(
											"skills-scroll",
										);
									if (!el)
										return;
									const amount =
										Math.floor(
											el.clientWidth *
												0.7,
										);
									el.scrollBy(
										{
											left: amount,
											behavior: "smooth",
										},
									);
								}}
								aria-label="Scroll right"
								className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-black/50 text-white cursor-pointer"
							>
								<ChevronRight
									size={
										18
									}
								/>
							</button>
						</div>
					</section>
				</main>
			</div>
			<footer
				className={`mt-20 border-t pt-10 pb-8 transition-colors ${
					darkMode
						? "border-white/10 text-neutral-300"
						: "border-neutral-300 text-neutral-700"
				}`}
			>
				<div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
					{/* Column 1   Connect */}
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

					{/* Column 2   Projects */}
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

					{/* Column 3   Open Source */}
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

			<style>{`
					.hide-scrollbar {
						-ms-overflow-style: none;
						scrollbar-width: none;
					}
					.hide-scrollbar::-webkit-scrollbar {
						display: none;
					}
					.line-clamp-2 {
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
					}
					.line-clamp-3 {
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						overflow: hidden;
					}
				`}</style>
		</div>
	);
}
