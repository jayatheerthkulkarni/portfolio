import React, { useState, useRef } from "react";
import {
	Sun,
	Moon,
	ChevronLeft,
	ChevronRight,
	Download,
	ExternalLink,
	Github,
	Twitter,
	Linkedin,
} from "lucide-react";

const nav_json = [
	{ label: "Home", href: "https://jayatheerth.com/" },
	{ label: "About", href: "https://jayatheerth.com/about" },
	{ label: "Blogs", href: "https://jayatheerth.com/blogs" },
];

const features_json = [
	{
		title: "Memory-safe. No GC.",
		desc: "If it compiles, it doesn't leak. Ownership is tracked at compile time — not by a garbage collector running behind your back.",
		tag: "Safety",
		code: `i32: x = 10;\ni32: y = x;   // x is moved\n// x is now invalid`,
	},
	{
		title: "Errors are values.",
		desc: "No try/catch. No hidden jumps. Return your errors alongside your result and handle them in plain sight.",
		tag: "Ergonomics",
		code: `fun i32, bool: parse(i32: n) {\n  if (n < 0) { return 0, false; }\n  return n, true;\n}`,
	},
	{
		title: "No type inference.",
		desc: "Every variable says what it is. Code is read ten times more than written — types are documentation you can't forget.",
		tag: "Readability",
		code: `i32: count = 0;\nf64: ratio = 0.618;\nbool: ready = false;`,
	},
	{
		title: "Cleanup is a contract.",
		desc: "ensure + defer means you cannot forget to close a file. The compiler enforces it. Zero runtime cost.",
		tag: "Correctness",
		code: `fun i32: open(string: path) {\n  ensure(close());\n  return fd;\n}\ndefer { close(); }`,
	},
];

const syntax_tabs = [
	{
		label: "Hello World",
		code: `import std;\n\nfun main() {\n  std.println("Hello World");\n}`,
	},
	{
		label: "Ownership",
		code: `i32: a = 10;\ni32: b = a;     // a is moved\na = 50;         // revive a\ni32: c := b;   // explicit copy`,
	},
	{
		label: "Multi-return",
		code: `fun i32, bool: divide(i32: a, i32: b) {\n  if (b == 0) { return 0, false; }\n  return a / b, true;\n}\n\nresult, ok := divide(10, 2);`,
	},
	{
		label: "Generics",
		code: `fun type:: add(type:, type: a, type: b) {\n  return a + b;\n}\n\ni32: s = add(i32:, 10, 20);\nf32: f = add(f32:, 1.5, 2.5);`,
	},
];

const traits_json = [
	{ name: "Compiled" },
	{ name: "Statically typed" },
	{ name: "No GC" },
	{ name: "Move semantics" },
	{ name: "Explicit errors" },
	{ name: "C-inspired syntax" },
	{ name: "Built-in formatter" },
	{ name: "Package manager" },
];

function Navbar({ darkMode, toggleTheme }) {
	const [menu, setMenu] = useState(false);
	return (
		<nav
			className={`sticky top-6 z-50 mx-auto mb-10 flex flex-col md:flex-row items-center justify-between px-6 py-3 backdrop-blur-2xl border rounded-2xl transition-all duration-500 w-full md:w-fit ${darkMode ? "bg-black/40 text-neutral-200 border-white/10 shadow-2xl shadow-black" : "bg-white/60 text-neutral-800 border-neutral-200 shadow-xl shadow-black/5"}`}
		>
			<div className="flex items-center justify-between w-full md:w-auto gap-8">
				<a
					href="/"
					className="font-bold text-lg tracking-tighter select-none whitespace-nowrap"
				>
					jayatheerth
				</a>
				<div className="hidden md:flex items-center gap-6">
					{nav_json.map((item) => (
						<a
							key={item.label}
							href={item.href}
							className="text-[13px] font-medium opacity-60 hover:opacity-100 transition-all"
						>
							{item.label}
						</a>
					))}
				</div>
				<div
					className={`hidden md:block h-4 w-px ${darkMode ? "bg-white/10" : "bg-neutral-300"}`}
				/>
				<div className="flex items-center gap-2">
					<button
						onClick={toggleTheme}
						className={`p-2 rounded-xl transition-all duration-300 ${darkMode ? "hover:bg-white/10 text-yellow-500" : "hover:bg-black/5 text-indigo-600"}`}
					>
						{darkMode ? (
							<Sun size={18} />
						) : (
							<Moon size={18} />
						)}
					</button>
					<button
						onClick={() => setMenu(!menu)}
						className="md:hidden p-2"
					>
						<div
							className={`w-5 h-0.5 mb-1 transition-all ${darkMode ? "bg-white" : "bg-black"} ${menu ? "rotate-45 translate-y-1.5" : ""}`}
						/>
						<div
							className={`w-5 h-0.5 transition-all ${darkMode ? "bg-white" : "bg-black"} ${menu ? "opacity-0" : ""}`}
						/>
						<div
							className={`w-5 h-0.5 mt-1 transition-all ${darkMode ? "bg-white" : "bg-black"} ${menu ? "-rotate-45 -translate-y-1.5" : ""}`}
						/>
					</button>
				</div>
			</div>
			{/* Mobile Menu */}
			<div
				className={`md:hidden overflow-hidden transition-all duration-500 w-full ${menu ? "max-h-64 mt-4 opacity-100" : "max-h-0 opacity-0"}`}
			>
				<ul className="flex flex-col gap-2 pb-2">
					{nav_json.map((item) => (
						<li key={item.label}>
							<a
								href={item.href}
								className="block py-3 text-center text-sm font-medium rounded-xl hover:bg-white/5"
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

function CodeSnippet({ code, dark }) {
	const keywords = [
		"fun",
		"import",
		"return",
		"if",
		"for",
		"while",
		"const",
		"inline",
		"pub",
		"use",
		"check",
		"defer",
		"ensure",
		"unsafe",
		"struct",
		"package",
		"type",
	];
	const types = [
		"i32",
		"i64",
		"f32",
		"f64",
		"bool",
		"char",
		"string",
		"void",
		"u32",
		"u64",
		"u8",
		"i8",
		"f16",
		"f128",
	];

	const tokenize = (line) => {
		const out = [];
		let rem = line,
			k = 0;
		while (rem.length > 0) {
			let hit = false;
			if (rem.startsWith("//")) {
				out.push(
					<span
						key={k++}
						style={{
							color: "#636e7b",
							fontStyle: "italic",
						}}
					>
						{rem}
					</span>,
				);
				rem = "";
				hit = true;
			}
			if (!hit && /^"[^"]*"/.test(rem)) {
				const m = rem.match(/^"[^"]*"/)[0];
				out.push(
					<span
						key={k++}
						style={{ color: "#a5d6ff" }}
					>
						{m}
					</span>,
				);
				rem = rem.slice(m.length);
				hit = true;
			}
			for (const kw of keywords) {
				if (!hit && new RegExp(`^${kw}\\b`).test(rem)) {
					out.push(
						<span
							key={k++}
							style={{
								color: "#ff7b72",
								fontWeight: 600,
							}}
						>
							{kw}
						</span>,
					);
					rem = rem.slice(kw.length);
					hit = true;
					break;
				}
			}
			for (const t of types) {
				if (!hit && new RegExp(`^${t}\\b`).test(rem)) {
					out.push(
						<span
							key={k++}
							style={{
								color: "#79c0ff",
							}}
						>
							{t}
						</span>,
					);
					rem = rem.slice(t.length);
					hit = true;
					break;
				}
			}
			if (!hit) {
				out.push(<span key={k++}>{rem[0]}</span>);
				rem = rem.slice(1);
			}
		}
		return out;
	};

	return (
		<pre
			className="hide-scrollbar"
			style={{
				margin: 0,
				padding: "20px",
				fontSize: 13,
				lineHeight: 1.6,
				fontFamily: "var(--font-mono)",
				background: "transparent",
				color: dark ? "#c9d1d9" : "#24292f",
				overflowX: "auto",
			}}
		>
			{code.split("\n").map((line, i) => (
				<div key={i} className="flex">
					<span className="opacity-20 select-none mr-4 w-4 text-right">
						{i + 1}
					</span>
					{tokenize(line)}
				</div>
			))}
		</pre>
	);
}

export default function App() {
	const [darkMode, setDarkMode] = useState(true);
	const [activeTab, setActiveTab] = useState(0);
	const carouselRef = useRef(null);
	const traitsRef = useRef(null);

	const toggleTheme = () => setDarkMode(!darkMode);

	const scrollCar = (ref, dir) => {
		if (!ref.current) return;
		ref.current.scrollBy({ left: dir * 300, behavior: "smooth" });
	};

	const accent = "#c8a96e";
	const bg = darkMode ? "#0a0a0a" : "#fafafa";
	const cardBg = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)";
	const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

	return (
		<div
			className={`min-h-screen transition-colors duration-700 pb-20`}
			style={{
				background: bg,
				color: darkMode ? "#e5e7eb" : "#111827",
				fontFamily: "Inter, system-ui, sans-serif",
			}}
		>
			<style>{`
				:root { --font-mono: 'JetBrains Mono', monospace; }
				.hide-scrollbar::-webkit-scrollbar { display: none; }
				.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
				.hero-gradient { background: radial-gradient(circle at center, ${accent}15 0%, transparent 70%); }
				.btn-primary { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
				.btn-primary:active { transform: scale(0.95); }
				.card-hover { transition: all 0.3s ease; }
				.card-hover:hover { border-color: ${accent}40 !important; transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
			`}</style>

			<div className="max-w-4xl mx-auto px-6 pt-6">
				<Navbar
					darkMode={darkMode}
					toggleTheme={toggleTheme}
				/>

				{/* Hero */}
				<section className="relative mb-24 mt-12">
					<div className="absolute inset-0 hero-gradient -z-10" />
					<div
						className={`p-16 rounded-[2rem] border text-center relative overflow-hidden ${darkMode ? "bg-neutral-900/50 border-white/5 shadow-3xl" : "bg-white border-neutral-200 shadow-xl"}`}
					>
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8a96e] to-transparent opacity-50" />
						<h1 className="text-8xl md:text-[120px] font-black tracking-tighter mb-4">
							gink
						</h1>
						<p
							className={`text-xs uppercase tracking-[0.3em] font-light mb-8 ${darkMode ? "text-neutral-500" : "text-neutral-400"}`}
						>
							a programming language
						</p>
						<div className="flex flex-wrap justify-center gap-2">
							{[
								"compiled",
								"memory-safe",
								"no gc",
							].map((tag) => (
								<span
									key={
										tag
									}
									className="px-4 py-1.5 rounded-full text-[11px] font-semibold border border-[#c8a96e]30 text-[#c8a96e] bg-[#c8a96e]10 uppercase tracking-wider"
								>
									{tag}
								</span>
							))}
						</div>
					</div>
				</section>

				<div className="grid md:grid-cols-[1fr_auto] gap-12 items-end mb-20">
					<div>
						<p className="text-3xl font-light text-neutral-500 mb-2">
							Built by
						</p>
						<h2 className="text-5xl font-bold tracking-tight mb-4">
							Jayatheerth Kulkarni
						</h2>
						<p className="text-xl text-neutral-500 max-w-xl leading-relaxed">
							Known online as{" "}
							<span className="text-[#c8a96e] font-medium italic">
								Gink
							</span>
							. This language is the
							honest pursuit of the
							sweet spot between
							performance and safety.
						</p>
					</div>
					<a
						href="./gink.pdf"
						download
						className="btn-primary group flex items-center gap-3 bg-[#0B1736] text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:bg-[#142654] transition-all"
					>
						<Download size={20} />
						Download Spec (PDF)
					</a>
				</div>

				{/* Syntax Explorer */}
				<section className="mb-24">
					<div
						className={`rounded-3xl border overflow-hidden ${darkMode ? "bg-black border-white/10" : "bg-neutral-50 border-neutral-200"}`}
					>
						<div className="flex border-b border-inherit overflow-x-auto hide-scrollbar bg-inherit">
							{syntax_tabs.map(
								(t, i) => (
									<button
										key={
											t.label
										}
										onClick={() =>
											setActiveTab(
												i,
											)
										}
										className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === i ? `text-[#c8a96e] bg-[#c8a96e]10 border-b-2 border-[#c8a96e]` : "text-neutral-500 hover:text-neutral-300"}`}
									>
										{
											t.label
										}
									</button>
								),
							)}
						</div>
						<div
							className={
								darkMode
									? "bg-[#0d0d0b]"
									: "bg-white"
							}
						>
							<CodeSnippet
								code={
									syntax_tabs[
										activeTab
									].code
								}
								dark={darkMode}
							/>
						</div>
					</div>
				</section>

				{/* Features Grid */}
				<section className="mb-24">
					<h3 className="text-3xl font-bold mb-10 tracking-tight">
						Core Philosophies
					</h3>
					<div className="grid md:grid-cols-2 gap-6">
						{features_json.map((f) => (
							<div
								key={f.title}
								className={`card-hover p-8 rounded-[2rem] border flex flex-col gap-6 ${darkMode ? "bg-neutral-900/40 border-white/5" : "bg-white border-neutral-200"}`}
							>
								<div className="flex justify-between items-center">
									<span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-[#c8a96e]20 text-[#c8a96e]">
										{
											f.tag
										}
									</span>
								</div>
								<div>
									<h4 className="text-xl font-bold mb-3">
										{
											f.title
										}
									</h4>
									<p className="text-neutral-500 text-sm leading-relaxed">
										{
											f.desc
										}
									</p>
								</div>
								<div
									className={`rounded-2xl border overflow-hidden ${darkMode ? "bg-black border-white/5" : "bg-neutral-50 border-neutral-200"}`}
								>
									<CodeSnippet
										code={
											f.code
										}
										dark={
											darkMode
										}
									/>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Traits */}
				<section className="mb-24 overflow-hidden">
					<div className="flex items-center justify-between mb-8">
						<h3 className="text-2xl font-bold">
							The Checklist
						</h3>
						<div className="flex gap-2">
							<button
								onClick={() =>
									scrollCar(
										traitsRef,
										-1,
									)
								}
								className="p-2 rounded-full border border-neutral-700 hover:bg-white/5"
							>
								<ChevronLeft
									size={
										16
									}
								/>
							</button>
							<button
								onClick={() =>
									scrollCar(
										traitsRef,
										1,
									)
								}
								className="p-2 rounded-full border border-neutral-700 hover:bg-white/5"
							>
								<ChevronRight
									size={
										16
									}
								/>
							</button>
						</div>
					</div>
					<div
						ref={traitsRef}
						className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
					>
						{traits_json.map((t) => (
							<div
								key={t.name}
								className={`px-8 py-4 rounded-2xl border whitespace-nowrap text-sm font-medium ${darkMode ? "bg-white/5 border-white/10" : "bg-neutral-100 border-neutral-200"}`}
							>
								{t.name}
							</div>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className="relative">
					<div
						className={`p-12 md:p-20 rounded-[3rem] text-center overflow-hidden border ${darkMode ? "bg-neutral-900 border-white/10 shadow-3xl" : "bg-neutral-100 border-neutral-200"}`}
					>
						<div className="absolute top-0 right-0 w-64 h-64 bg-[#c8a96e] blur-[120px] opacity-10 -z-10" />
						<h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
							The complete
							specification.
						</h2>
						<p className="text-neutral-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
							Ownership, types,
							modules, and error
							handling — all defined
							in the first draft.
						</p>
						<a
							href="./gink.pdf"
							download
							className="inline-flex items-center gap-3 bg-[#c8a96e] text-black px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
						>
							Download gink.pdf{" "}
							<Download size={20} />
						</a>
					</div>
				</section>
			</div>

			{/* Footer */}
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
