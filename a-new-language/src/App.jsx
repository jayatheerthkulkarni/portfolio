import React, { useState, useRef } from "react";
import {
	Sun,
	Moon,
	ChevronLeft,
	ChevronRight,
	Download,
	Github,
	Twitter,
	Linkedin,
	Mail,
	ExternalLink,
} from "lucide-react";

// --- Data ---
const nav_json = [
	{ label: "Home", href: "https://jayatheerth.com/" },
	{ label: "About", href: "https://jayatheerth.com/about" },
	{ label: "Blogs", href: "https://jayatheerth.com/blogs" },
];

const features_json = [
	{
		title: "Memory-safe. No GC.",
		desc: "Ownership is tracked at compile time — not by a garbage collector.",
		tag: "Safety",
		code: `i32: x = 10;\ni32: y = x; // moved`,
	},
	{
		title: "Errors are values.",
		desc: "No try/catch. Return errors alongside your result.",
		tag: "Ergonomics",
		code: `fun i32, bool: parse(i32: n) {\n  if (n < 0) { return 0, false; }\n  return n, true;\n}`,
	},
];

const syntax_tabs = [
	{
		label: "Hello",
		code: `import std;\n\nfun main() {\n  std.println("Hello World");\n}`,
	},
	{
		label: "Ownership",
		code: `i32: a = 10;\ni32: b = a; // moved\na = 50;     // revive\ni32: c := b; // copy`,
	},
];

const traits_json = [
	{ name: "Compiled" },
	{ name: "No GC" },
	{ name: "Statically typed" },
	{ name: "Move semantics" },
	{ name: "C-inspired" },
	{ name: "Fast" },
];

// --- Sub-components ---

function Navbar({ darkMode, toggleTheme }) {
	const [menu, setMenu] = useState(false);
	return (
		<nav
			className={`sticky top-4 z-50 mx-auto mb-10 flex flex-col md:flex-row items-center justify-between px-4 py-2 backdrop-blur-2xl border rounded-2xl transition-all duration-500 w-full md:w-fit ${darkMode ? "bg-black/40 text-neutral-200 border-white/10 shadow-2xl" : "bg-white/60 text-neutral-800 border-neutral-200 shadow-xl"}`}
		>
			<div className="flex items-center justify-between w-full md:w-auto gap-4">
				<a
					href="/"
					className="font-bold text-base tracking-tighter"
				>
					jayatheerth
				</a>
				<div className="flex items-center gap-1">
					<button
						onClick={toggleTheme}
						className={`p-2 rounded-xl ${darkMode ? "text-yellow-500" : "text-indigo-600"}`}
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
			<div className="hidden md:flex items-center gap-6 md:ml-8">
				{nav_json.map((item) => (
					<a
						key={item.label}
						href={item.href}
						className="text-[13px] font-medium opacity-60 hover:opacity-100"
					>
						{item.label}
					</a>
				))}
			</div>
			<div
				className={`md:hidden overflow-hidden transition-all duration-300 w-full ${menu ? "max-h-64 mt-2" : "max-h-0"}`}
			>
				<ul className="flex flex-col gap-1 pb-2">
					{nav_json.map((item) => (
						<li key={item.label}>
							<a
								href={item.href}
								className="block py-2 text-center text-sm font-medium hover:bg-white/5"
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
		"defer",
		"ensure",
		"type",
	];
	const types = ["i32", "i64", "f32", "f64", "bool", "string"];

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
						className="text-neutral-500 italic"
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
						className="text-blue-300"
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
							className="text-red-400 font-semibold"
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
							className="text-sky-400"
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
			className="hide-scrollbar w-full overflow-x-auto p-4 text-[11px] md:text-[13px] leading-relaxed font-mono"
			style={{ color: dark ? "#c9d1d9" : "#24292f" }}
		>
			{code.split("\n").map((line, i) => (
				<div
					key={i}
					className="flex whitespace-pre min-w-fit"
				>
					<span className="opacity-20 select-none mr-4 w-4 text-right">
						{i + 1}
					</span>
					{tokenize(line)}
				</div>
			))}
		</pre>
	);
}

// --- Main App ---

export default function App() {
	const [darkMode, setDarkMode] = useState(true);
	const [activeTab, setActiveTab] = useState(0);
	const traitsRef = useRef(null);

	const scrollCar = (dir) => {
		if (traitsRef.current)
			traitsRef.current.scrollBy({
				left: dir * 200,
				behavior: "smooth",
			});
	};

	return (
		<div
			className={`min-h-screen overflow-x-hidden transition-colors duration-700 ${darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#fafafa] text-neutral-900"}`}
		>
			<style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

			<div className="max-w-4xl mx-auto px-4 md:px-6 pt-6">
				<Navbar
					darkMode={darkMode}
					toggleTheme={() =>
						setDarkMode(!darkMode)
					}
				/>

				{/* Hero */}
				<section className="relative mb-16 mt-8">
					<div
						className={`p-8 md:p-16 rounded-[2rem] border text-center relative overflow-hidden ${darkMode ? "bg-neutral-900/50 border-white/5" : "bg-white border-neutral-200 shadow-sm"}`}
					>
						<h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-2">
							gink
						</h1>
						<p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-8">
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
									className="px-3 py-1 rounded-full text-[9px] md:text-[11px] font-bold border border-[#c8a96e]40 text-[#c8a96e] bg-[#c8a96e]10 uppercase"
								>
									{tag}
								</span>
							))}
						</div>
					</div>
				</section>

				{/* Author */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
					<div className="max-w-md">
						<p className="text-xl md:text-2xl opacity-50 font-light">
							Built by
						</p>
						<h2 className="text-3xl md:text-5xl font-bold mb-4">
							Jayatheerth Kulkarni
						</h2>
						<p className="opacity-60 leading-relaxed">
							Known online as{" "}
							<span className="text-[#c8a96e] italic font-medium">
								Gink
							</span>
							. A language built for
							the sweet spot between
							performance and safety.
						</p>
					</div>
					<a
						href="./gink.pdf"
						download
						className="w-full md:w-auto bg-[#0B1736] text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
					>
						<Download size={18} /> Download
						Spec
					</a>
				</div>

				{/* Syntax Explorer */}
				<section className="mb-24">
					<div
						className={`rounded-3xl border overflow-hidden ${darkMode ? "bg-black border-white/10" : "bg-neutral-50 border-neutral-200"}`}
					>
						<div className="flex border-b border-inherit overflow-x-auto hide-scrollbar">
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
										className={`whitespace-nowrap px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === i ? "text-[#c8a96e] bg-[#c8a96e]10 border-b-2 border-[#c8a96e]" : "opacity-40 hover:opacity-100"}`}
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
									]
										?.code ||
									""
								}
								dark={darkMode}
							/>
						</div>
					</div>
				</section>

				{/* Features Grid */}
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
					{features_json.map((f) => (
						<div
							key={f.title}
							className={`p-6 rounded-[2rem] border flex flex-col gap-4 ${darkMode ? "bg-neutral-900/40 border-white/5" : "bg-white border-neutral-200"}`}
						>
							<span className="w-fit text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#c8a96e]20 text-[#c8a96e]">
								{f.tag}
							</span>
							<h4 className="text-lg font-bold">
								{f.title}
							</h4>
							<p className="text-sm opacity-60 leading-relaxed">
								{f.desc}
							</p>
							<div
								className={`rounded-xl border overflow-hidden ${darkMode ? "bg-black/50 border-white/5" : "bg-neutral-50 border-neutral-200"}`}
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
				</section>

				{/* Traits Slider */}
				<section className="mb-24">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-bold">
							The Checklist
						</h3>
						<div className="flex gap-2">
							<button
								onClick={() =>
									scrollCar(
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
						className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x"
					>
						{traits_json.map((t) => (
							<div
								key={t.name}
								className={`snap-start px-6 py-4 rounded-2xl border whitespace-nowrap text-xs font-medium flex-shrink-0 ${darkMode ? "bg-white/5 border-white/10" : "bg-neutral-100 border-neutral-200"}`}
							>
								{t.name}
							</div>
						))}
					</div>
				</section>

				{/* Footer */}
				<footer
					className={`border-t pt-10 pb-20 opacity-70 ${darkMode ? "border-white/10" : "border-neutral-200"}`}
				>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">
						<div className="space-y-4">
							<h3 className="font-bold uppercase tracking-widest text-[10px]">
								Connect
							</h3>
							<div className="flex flex-col gap-2">
								<a
									href="mailto:jayatheerthkulkarni2005@gmail.com"
									className="flex items-center gap-2"
								>
									<Mail
										size={
											14
										}
									/>{" "}
									Email
								</a>
								<a
									href="https://x.com/k_jayatheerth"
									className="flex items-center gap-2"
								>
									<Twitter
										size={
											14
										}
									/>{" "}
									Twitter
								</a>
								<a
									href="https://linkedin.com"
									className="flex items-center gap-2"
								>
									<Linkedin
										size={
											14
										}
									/>{" "}
									LinkedIn
								</a>
							</div>
						</div>
						<div className="space-y-4">
							<h3 className="font-bold uppercase tracking-widest text-[10px]">
								Development
							</h3>
						</div>
					</div>
					<p className="mt-16 text-center text-[10px] opacity-40">
						© {new Date().getFullYear()}{" "}
						Jayatheerth. No Rights Reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}
