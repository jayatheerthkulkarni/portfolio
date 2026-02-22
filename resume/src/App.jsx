import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Sun, Moon } from "lucide-react";

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

export default function ResumePage() {
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
			className={`${darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-white text-neutral-900"} min-h-screen font-sans transition-colors duration-500`}
		>
			<div className="max-w-4xl mx-auto px-6 pb-24 pt-6">
				{/* NAV */}
				<Navbar
					nav_json={[
						{ label: "Home", href: "/" },
						{
							label: "About",
							href: "https://jayatheerth.com/about",
						},
						{
							label: "Blogs",
							href: "https://blog.jayatheerth.com",
						},
					]}
					darkMode={darkMode}
					toggleTheme={toggleTheme}
				/>

				{/* HEADER */}
				<section className="relative w-full mt-12 mb-6 group">
					<img
						src="./art.png"
						alt="Resume Art"
						className={`relative w-full h-60 sm:h-80 object-cover rounded-xl shadow-2xl transition-all duration-500 ${darkMode ? "border border-white/10" : "border border-black/5"}`}
					/>
				</section>

				{/* DOWNLOAD BUTTON */}
				<div className="mb-8">
					<a
						href="./jayatheerth_kulkarni_resume.pdf"
						download
						className={`flex items-center gap-2 w-fit px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 ${darkMode ? "bg-[#0B1736] text-white hover:bg-[#102252]" : "bg-[#0B1736] text-white hover:bg-[#102252]"}`}
					>
						<Download size={18} /> Download
						PDF
					</a>
				</div>

				{/* BEAUTIFUL RESUME FRAME */}
				<div
					className={`rounded-xl overflow-hidden border shadow-2xl transition-all duration-500 ${darkMode ? "border-white/10 bg-black/20 shadow-[0_0_40px_rgba(255,255,255,0.08)]" : "border-neutral-300 bg-white shadow-xl"}`}
				>
					<iframe
						src="/jayatheerth_kulkarni_resume.pdf"
						className="w-full h-[88vh]"
						title="Resume PDF"
					/>
				</div>
			</div>

			{/* FOOTER */}
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
									className="hover:opacity-90"
								>
									Twitter
								</a>
							</li>
							<li>
								<a
									href="https://www.linkedin.com/in/jayatheerth-k-0a3685297/"
									target="_blank"
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
									className="hover:opacity-90"
								>
									GitHub
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
									href="/resume"
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
									className="hover:opacity-90"
								>
									Git
									Commits
								</a>
							</li>
							<li>
								<a
									href="https://git.github.io/rev_news/2025/06/30/edition-124/"
									target="_blank"
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
							<li>
								<a
									href="https://blog.jayatheerth.com"
									className="hover:opacity-90"
								>
									blog.jayatheerth.com
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="text-center text-sm opacity-70 mt-10">
					© {new Date().getFullYear()}{" "}
					Jayatheerth. All rights reserved.
				</div>
			</footer>
		</div>
	);
}
