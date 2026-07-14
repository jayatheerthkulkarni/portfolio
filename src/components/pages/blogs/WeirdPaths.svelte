<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	onMount(() => {
		window.scrollTo(0, 0);

		// GSAP premium entrance animation
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
					<span class="category-badge">Systems</span>
					<span class="date">April 2026</span>
				</div>
				<h1 class="post-title">The Weird Paths: Dirent, Win32, and the Illusion of Folders</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					When you observe the behavior of directory traversal in a systems context, you must first discard the desktop metaphor of a folder. A directory does not physically contain files. It is merely a specialized file maintained by the filesystem layer. It acts as an associative array mapping human-readable names to internal filesystem identifiers.
				</p>

				<h2>The Mechanics of UNIX Directories</h2>
				<p>
					On POSIX-compliant systems, the namespace is strictly decoupled from the physical storage of metadata. A directory holds a sequence of directory entries. Each entry pairs a string literal with an inode number.
				</p>
				<p>
					The user-space function <code>readdir()</code> from <code>&lt;dirent.h&gt;</code> is a wrapper around the <code>getdents64</code> system call. If you examine the actual data structure returned by the kernel to user space, the abstraction becomes obvious.
				</p>

				<pre><code>struct linux_dirent64 &#123;
    ino64_t        d_ino;    /* 64-bit inode number */
    off64_t        d_off;    /* 64-bit offset to next structure */
    unsigned short d_reclen; /* Size of this dirent */
    unsigned char  d_type;   /* File type */
    char           d_name[]; /* Filename (null-terminated) */
&#125;;</code></pre>

				<p>
					Notice <code>d_reclen</code>. Directory entries are not fixed-size structures because filenames have variable lengths. The kernel packs these structures into a buffer, and <code>readdir()</code> advances a pointer by <code>d_reclen</code> bytes on each invocation. Furthermore, the directory entry owns nothing except the name and the pointer to the inode. If you move a file to a new directory on the same filesystem partition, the kernel simply unlinks the <code>linux_dirent64</code> struct from one list and writes a new one into another. The underlying inode remains untouched.
				</p>

				<h2>The NT Kernel and the Stat Storm</h2>
				<p>
					The Win32 approach diverges significantly. Windows does not adhere to the "everything is a file" philosophy in the same strict sense. When you iterate a directory in Windows using <code>&lt;windows.h&gt;</code>, you do not open a stream. You execute a stateful kernel query.
				</p>
				<p>
					The functions <code>FindFirstFile</code> and <code>FindNextFile</code> populate a <code>WIN32_FIND_DATA</code> structure. This struct is substantially heavier than a POSIX directory entry.
				</p>

				<pre><code>typedef struct _WIN32_FIND_DATA &#123;
    DWORD    dwFileAttributes;
    FILETIME ftCreationTime;
    FILETIME ftLastAccessTime;
    FILETIME ftLastWriteTime;
    DWORD    nFileSizeHigh;
    DWORD    nFileSizeLow;
    DWORD    dwReserved0;
    DWORD    dwReserved1;
    TCHAR    cFileName[MAX_PATH];
    TCHAR    cAlternateFileName;
&#125; WIN32_FIND_DATA;</code></pre>

				<p>
					Under the hood, these Win32 APIs wrap the <code>NtQueryDirectoryFile</code> system call. The NT kernel retrieves not just the filename, but the timestamps, attributes, and file sizes in a single pass.
				</p>
				<p>
					This design choice creates a fundamental performance dichotomy. In UNIX, listing just the names of a million files is extremely fast because <code>getdents64</code> only reads the directory file. However, if your application needs the size of each file, it must execute a separate <code>stat()</code> system call for every single entry, causing severe performance degradation known as a "stat storm".
				</p>
				<p>
					Conversely, Windows incurs a higher base cost to enumerate a directory because it must fetch metadata from the Master File Table (MFT) during the initial query. However, if the application needs that metadata, the total operation completes faster because the data was retrieved in bulk without supplementary system calls.
				</p>

				<h2>Cross-Platform Iteration</h2>
				<p>
					To write portable C code that lists directory contents, you must rely on the preprocessor to bridge these architectural differences. The <code>_WIN32</code> macro indicates compilation under a Windows environment.
				</p>

				<pre><code>#include &lt;stdio.h&gt;

#ifdef _WIN32
    #include &lt;windows.h&gt;
#else
    #include &lt;dirent.h&gt;
#endif

void list_dir(const char* path) &#123;
#ifdef _WIN32
    WIN32_FIND_DATA data;
    /* Windows requires a wildcard pattern appended to the path */
    HANDLE h = FindFirstFile(path, &data);
    if (h != INVALID_HANDLE_VALUE) &#123;
        do &#123;
            printf("%s\n", data.cFileName);
        &#125; while (FindNextFile(h, &amp;data));
        FindClose(h);
    &#125;
#else
    struct dirent *de;
    DIR *dr = opendir(path);
    if (dr != NULL) &#123;
        while ((de = readdir(dr)) != NULL) &#123;
            printf("%s\n", de-&gt;d_name);
        &#125;
        closedir(dr);
    &#125;
#endif
&#125;</code></pre>

				<p>
					By studying the data structures that the respective kernels expose, the behavior of user-space tools becomes highly predictable. Paths are merely navigation parameters submitted to these lower-level retrieval mechanisms.
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

	.back-link .arrow {
		transition: transform 0.3s ease;
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
		font-family: "Inter", sans-serif;
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

	.post-content code {
		font-family: "Courier New", Courier, monospace;
		background: rgba(220, 203, 142, 0.1);
		color: #dccb8e;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85em;
		border: 1px solid rgba(220, 203, 142, 0.15);
		word-break: break-all;
	}

	.post-content pre {
		background: rgba(25, 25, 25, 0.4);
		border: 1px solid rgba(220, 203, 142, 0.15);
		border-radius: 8px;
		padding: 1.25rem;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.post-content pre code {
		background: transparent;
		border: none;
		padding: 0;
		font-size: 0.95rem;
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
