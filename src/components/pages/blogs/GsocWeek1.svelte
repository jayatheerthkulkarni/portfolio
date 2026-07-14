<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import Navbar from "../../Navbar.svelte";
	import Footer from "../../Footer.svelte";

	let activeDiff = $state(null);

	function toggleDiff(index) {
		if (activeDiff === index) {
			activeDiff = null;
		} else {
			activeDiff = index;
		}
	}

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

	const diffs = [
		{
			title: "[PATCH 1/4] path: add strbuf_add_path for formatting paths",
			desc: "Extracts path-formatting and canonicalization algorithms from rev-parse into a reusable strbuf_add_path() helper inside path.c.",
			code: `[GSoC][PATCH 1/4] path: add strbuf_add_path for formatting paths

The \`print_path()\` function in \`builtin/rev-parse.c\` contains
logic for formatting paths as either absolute or relative based on user
preferences and default behaviors. However, this logic is currently
locked inside \`rev-parse\` and writes directly to stdout using \`puts()\`.

To allow other builtins (such as the new \`git repo\` command) to utilize
this same path-formatting logic, extract the core algorithm into a new
string-builder function, \`strbuf_add_path()\`, in \`path.c\`.

Additionally, extract the associated enums (\`format_type\` and
\`default_type\`), and prefix them with \`path_\` (e.g., \`path_format_type\`)
to safely expose them in \`path.h\` without polluting the global namespace.

Signed-off-by: K Jayatheerth <jayatheerthkulkarni2005@gmail.com>
Mentored-by: Justin Tobler <jltobler@gmail.com>
Mentored-by: Lucas Seiki Oshiro <lucasseikioshiro@gmail.com>
---
 path.c | 58 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 path.h | 16 ++++++++++++++++
 2 files changed, 74 insertions(+)

diff --git a/path.c b/path.c
index d7e17bf174..914812320f 100644
--- a/path.c
+++ b/path.c
@@ -1579,6 +1579,64 @@ char *xdg_cache_home(const char *filename)
 	return NULL;
 }
 
+void strbuf_add_path(struct strbuf *sb, const char *path, const char *prefix,
+		     enum path_format_type format, enum path_default_type def)
+{
+	char *cwd = NULL;
+
+	/*
+	 * We don't ever produce a relative path if prefix is NULL, so set the
+	 * prefix to the current directory so that we can produce a relative
+	 * path whenever possible. If we're using RELATIVE_IF_SHARED mode, then
+	 * we want an absolute path unless the two share a common prefix, so don't
+	 * set it in that case, since doing so causes a relative path to always
+	 * be produced if possible.
+	 */
+	if (!prefix && (format != PATH_FORMAT_DEFAULT || def != PATH_DEFAULT_RELATIVE_IF_SHARED))
+		prefix = cwd = xgetcwd();
+
+	if (format == PATH_FORMAT_DEFAULT && def == PATH_DEFAULT_UNMODIFIED) {
+		/* Case 1: Return the path exactly as-is without modifications */
+		strbuf_addstr(sb, path);
+	} else if (format == PATH_FORMAT_RELATIVE ||
+		   (format == PATH_FORMAT_DEFAULT && def == PATH_DEFAULT_RELATIVE)) {
+		/*
+		 * Case 2: Explicitly or implicitly relative.
+		 * inside relative_path(), both targets must be absolute paths
+		 * to compute a reliable relative tracking offset.
+		 */
+		struct strbuf buf = STRBUF_INIT, realbuf = STRBUF_INIT, prefixbuf = STRBUF_INIT;
+
+		if (!is_absolute_path(path)) {
+			strbuf_realpath_forgiving(&realbuf, path, 1);
+			path = realbuf.buf;
+		}
+		if (!is_absolute_path(prefix)) {
+			strbuf_realpath_forgiving(&prefixbuf, prefix, 1);
+			prefix = prefixbuf.buf;
+		}
+
+		strbuf_addstr(sb, relative_path(path, prefix, &buf));
+
+		strbuf_release(&buf);
+		strbuf_release(&realbuf);
+		strbuf_release(&prefixbuf);
+	} else if (format == PATH_FORMAT_DEFAULT && def == PATH_DEFAULT_RELATIVE_IF_SHARED) {
+		/* Case 3: Relative format if they share a common root pathway */
+		struct strbuf buf = STRBUF_INIT;
+		strbuf_addstr(sb, relative_path(path, prefix, &buf));
+		strbuf_release(&buf);
+	} else {
+		/* Case 4: Forced absolute / canonical format optimization */
+		struct strbuf buf = STRBUF_INIT;
+		strbuf_realpath_forgiving(&buf, path, 1);
+		strbuf_addbuf(sb, &buf);
+		strbuf_release(&buf);
+	}
+
+	free(cwd);
+}
+
 REPO_GIT_PATH_FUNC(squash_msg, "SQUASH_MSG")
 REPO_GIT_PATH_FUNC(merge_msg, "MERGE_MSG")
 REPO_GIT_PATH_FUNC(merge_rr, "MERGE_RR")
diff --git a/path.h b/path.h
index 0434ba5e07..b9b626ce4a 100644
--- a/path.h
+++ b/path.h
@@ -262,6 +262,22 @@ enum scld_error safe_create_leading_directories_no_share(char *path);
 int safe_create_file_with_leading_directories(struct repository *repo,
 					      const char *path);
 
+enum path_format_type {
+	PATH_FORMAT_DEFAULT,
+	PATH_FORMAT_RELATIVE,
+	PATH_FORMAT_CANONICAL
+};
+
+enum path_default_type {
+	PATH_DEFAULT_RELATIVE,
+	PATH_DEFAULT_RELATIVE_IF_SHARED,
+	PATH_DEFAULT_CANONICAL,
+	PATH_DEFAULT_UNMODIFIED
+};
+
+void strbuf_add_path(struct strbuf *buf, const char *path, const char *prefix,
+		     enum path_format_type format, enum path_default_type def);
+
 # ifdef USE_THE_REPOSITORY_VARIABLE
 #  include "strbuf.h"
 #  include "repository.h"
-- 
2.54.0`
		},
		{
			title: "[PATCH 2/4] rev-parse: use strbuf_add_path for path formatting",
			desc: "Removes duplicate localized formatting routines in builtin/rev-parse.c, converting print_path() to wrap the new shared path.h engine.",
			code: `[GSoC][PATCH 2/4] rev-parse: use strbuf_add_path for path formatting

Now that the core path-formatting logic has been abstracted into
strbuf_add_path() inside path.c, remove the duplicate localized
implementation from builtin/rev-parse.c.

Drop the local format_type and default_type enums from the builtin, and
update print_path() to act as a light wrapper around the new shared
strbuf engine. Update cmd_rev_parse() to use the new path_ format and
default enum types exposed via path.h.

Signed-off-by: K Jayatheerth <jayatheerthkulkarni2005@gmail.com>
Mentored-by: Justin Tobler <jltobler@gmail.com>
Mentored-by: Lucas Seiki Oshiro <lucasseikioshiro@gmail.com>
---
 builtin/rev-parse.c | 100 ++++++++++----------------------------------
 1 file changed, 21 insertions(+), 79 deletions(-)

diff --git a/builtin/rev-parse.c b/builtin/rev-parse.c
index 218b5f34d6..812cfd55ad 100644
--- a/builtin/rev-parse.c
+++ b/builtin/rev-parse.c
@@ -632,73 +632,15 @@ static void handle_ref_opt(const char *pattern, const char *prefix)
 	clear_ref_exclusions(&ref_excludes);
 }
 
-enum format_type {
-	/* We would like a relative path. */
-	FORMAT_RELATIVE,
-	/* We would like a canonical absolute path. */
-	FORMAT_CANONICAL,
-	/* We would like the default behavior. */
-	FORMAT_DEFAULT,
-};
-
-enum default_type {
-	/* Our default is a relative path. */
-	DEFAULT_RELATIVE,
-	/* Our default is a relative path if there's a shared root. */
-	DEFAULT_RELATIVE_IF_SHARED,
-	/* Our default is a canonical absolute path. */
-	DEFAULT_CANONICAL,
-	/* Our default is not to modify the item. */
-	DEFAULT_UNMODIFIED,
-};
-
-static void print_path(const char *path, const char *prefix, enum format_type format, enum default_type def)
+static void print_path(const char *path, const char *prefix,
+		       enum path_format_type format, enum path_default_type def)
 {
-	char *cwd = NULL;
-	/*
-	 * We don't ever produce a relative path if prefix is NULL, so set the
-	 * prefix to the current directory so that we can produce a relative
-	 * path whenever possible.  If we're using RELATIVE_IF_SHARED mode, then
-	 * we want an absolute path unless the two share a common prefix, so don't
-	 * set it in that case, since doing so causes a relative path to always
-	 * be produced if possible.
-	 */
-	if (!prefix && (format != FORMAT_DEFAULT || def != DEFAULT_RELATIVE_IF_SHARED))
-		prefix = cwd = xgetcwd();
-	if (format == FORMAT_DEFAULT && def == DEFAULT_UNMODIFIED) {
-		puts(path);
-	} else if (format == FORMAT_RELATIVE ||
-		  (format == FORMAT_DEFAULT && def == DEFAULT_RELATIVE)) {
-		/*
-		 * In order for relative_path to work as expected, we need to
-		 * make sure that both paths are absolute paths.  If we don't,
-		 * we can end up with an unexpected absolute path that the user
-		 * didn't want.
-		 */
-		struct strbuf buf = STRBUF_INIT, realbuf = STRBUF_INIT, prefixbuf = STRBUF_INIT;
-		if (!is_absolute_path(path)) {
-			strbuf_realpath_forgiving(&realbuf, path,  1);
-			path = realbuf.buf;
-		}
-		if (!is_absolute_path(prefix)) {
-			strbuf_realpath_forgiving(&prefixbuf, prefix, 1);
-			prefix = prefixbuf.buf;
-		}
-		puts(relative_path(path, prefix, &buf));
-		strbuf_release(&buf);
-		strbuf_release(&realbuf);
-		strbuf_release(&prefixbuf);
-	} else if (format == FORMAT_DEFAULT && def == DEFAULT_RELATIVE_IF_SHARED) {
-		struct strbuf buf = STRBUF_INIT;
-		puts(relative_path(path, prefix, &buf));
-		strbuf_release(&buf);
-	} else {
-		struct strbuf buf = STRBUF_INIT;
-		strbuf_realpath_forgiving(&buf, path, 1);
-		puts(buf.buf);
-		strbuf_release(&buf);
-	}
-	free(cwd);
+	struct strbuf sb = STRBUF_INIT;
+
+	strbuf_add_path(&sb, path, prefix, format, def);
+	puts(sb.buf);
+
+	strbuf_release(&sb);
 }
 
 int cmd_rev_parse(int argc,
@@ -717,7 +659,7 @@ int cmd_rev_parse(int argc,
 	const char *name = NULL;
 	struct strbuf buf = STRBUF_INIT;
 	int seen_end_of_options = 0;
-	enum format_type format = FORMAT_DEFAULT;
+	enum path_format_type format = PATH_FORMAT_DEFAULT;
 
 	show_usage_if_asked(argc, argv, builtin_rev_parse_usage);
 
@@ -798,7 +740,7 @@ int cmd_rev_parse(int argc,
 				print_path(repo_git_path_replace(the_repository, &buf,
 								 "%s", argv[i + 1]), prefix,
 						format,
-						DEFAULT_RELATIVE_IF_SHARED);
+						PATH_DEFAULT_RELATIVE_IF_SHARED);
 				i++;
 				continue;
 			}
@@ -820,9 +762,9 @@ int cmd_rev_parse(int argc,
 				if (!arg)
 					die(_("--path-format requires an argument"));
 				if (!strcmp(arg, "absolute")) {
-					format = FORMAT_CANONICAL;
+					format = PATH_FORMAT_CANONICAL;
 				} else if (!strcmp(arg, "relative")) {
-					format = FORMAT_RELATIVE;
+					format = PATH_FORMAT_RELATIVE;
 				} else {
 					die(_("unknown argument to --path-format: %s"), arg);
 				}
@@ -985,7 +927,7 @@ int cmd_rev_parse(int argc,
 			if (!strcmp(arg, "--show-toplevel")) {
 				const char *work_tree = repo_get_work_tree(the_repository);
 				if (work_tree)
-					print_path(work_tree, prefix, format, DEFAULT_UNMODIFIED);
+					print_path(work_tree, prefix, format, PATH_DEFAULT_UNMODIFIED);
 				else
 					die(_("this operation must be run in a work tree"));
 				continue;
@@ -993,7 +935,7 @@ int cmd_rev_parse(int argc,
 			if (!strcmp(arg, "--show-superproject-working-tree")) {
 				struct strbuf superproject = STRBUF_INIT;
 				if (get_superproject_working_tree(&superproject))
-					print_path(superproject.buf, prefix, format, DEFAULT_UNMODIFIED);
+					print_path(superproject.buf, prefix, format, PATH_DEFAULT_UNMODIFIED);
 				strbuf_release(&superproject);
 				continue;
 			}
@@ -1028,18 +970,18 @@ int cmd_rev_parse(int argc,
 				const char *gitdir = getenv(GIT_DIR_ENVIRONMENT);
 				char *cwd;
 				int len;
-				enum format_type wanted = format;
+				enum path_format_type wanted = format;
 				if (arg[2] == 'g') {	/* --git-dir */
 					if (gitdir) {
-						print_path(gitdir, prefix, format, DEFAULT_UNMODIFIED);
+						print_path(gitdir, prefix, format, PATH_DEFAULT_UNMODIFIED);
 						continue;
 					}
 					if (!prefix) {
-						print_path(".git", prefix, format, DEFAULT_UNMODIFIED);
+						print_path(".git", prefix, format, PATH_DEFAULT_UNMODIFIED);
 						continue;
 					}
 				} else {		/* --absolute-git-dir */
-					wanted = FORMAT_CANONICAL;
+					wanted = PATH_FORMAT_CANONICAL;
 					if (!gitdir && !prefix)
 						gitdir = ".git";
 					if (gitdir) {
@@ -1055,11 +997,11 @@ int cmd_rev_parse(int argc,
 				strbuf_reset(&buf);
 				strbuf_addf(&buf, "%s%s.git", cwd, len && cwd[len-1] != '/' ? "/" : "");
 				free(cwd);
-				print_path(buf.buf, prefix, wanted, DEFAULT_CANONICAL);
+				print_path(buf.buf, prefix, wanted, PATH_DEFAULT_CANONICAL);
 				continue;
 			}
 			if (!strcmp(arg, "--git-common-dir")) {
-				print_path(repo_get_common_dir(the_repository), prefix, format, DEFAULT_RELATIVE_IF_SHARED);
+				print_path(repo_get_common_dir(the_repository), prefix, format, PATH_DEFAULT_RELATIVE_IF_SHARED);
 				continue;
 			}
 			if (!strcmp(arg, "--is-inside-git-dir")) {
@@ -1089,7 +1031,7 @@ int cmd_rev_parse(int argc,
 				if (the_repository->index->split_index) {
 					const struct object_id *oid = &the_repository->index->split_index->base_oid;
 					const char *path = repo_git_path_replace(the_repository, &buf, "sharedindex.%s", oid_to_hex(oid));
-					print_path(path, prefix, format, DEFAULT_RELATIVE);
+					print_path(path, prefix, format, PATH_DEFAULT_RELATIVE);
 				}
 				continue;
 			}
-- 
2.54.0`
		},
		{
			title: "[PATCH 3/4] repo: add path.gitdir with absolute and relative suffix formatting",
			desc: "Exposes path.gitdir.absolute and path.gitdir.relative options to git repo info using specialized formatting callbacks and setups tests in t1900.",
			code: `[GSoC][PATCH 3/4] repo: add path.gitdir with absolute and relative suffix formatting

Introduce path-related metadata fields to \`git repo info\` by adding
explicit \`path.gitdir.absolute\` and \`path.gitdir.relative\` keys. This
replaces dynamic prefix parsing machinery with individual, predictable
lexicographically-sorted keys that map directly to dedicated formatting
callbacks.

To calculate paths relative to the current working directory, update
\`builtin/repo.c\` to include \`setup.h\` and supply \`startup_info->prefix\`
to the path-formatting engine. Both explicit variants automatically
populate bulk dumps via \`--all\` and output predictably under \`--keys\`.

Update \`t/t1900-repo-info.sh\` to use a modernized, function-based loop
helper (\`test_repo_info_path\`) and \`test_grep\` to cleanly assert separate
path variation lookups.

Signed-off-by: K Jayatheerth <jayatheerthkulkarni2005@gmail.com>
Mentored-by: Justin Tobler <jltobler@gmail.com>
Mentored-by: Lucas Seiki Oshiro <lucasseikioshiro@gmail.com>
---
 Documentation/git-repo.adoc |  6 ++++++
 builtin/repo.c              | 26 ++++++++++++++++++++++++++
 t/t1900-repo-info.sh        | 31 +++++++++++++++++++++++++++++++
 3 files changed, 63 insertions(+)

diff --git a/Documentation/git-repo.adoc b/Documentation/git-repo.adoc
index 42262c1983..a0dca7ce88 100644
--- a/Documentation/git-repo.adoc
+++ b/Documentation/git-repo.adoc
@@ -104,6 +104,12 @@ values that they return:
 \`object.format\`::
 	The object format (hash algorithm) used in the repository.
 
+\`path.gitdir.absolute\`::
+	The canonical absolute path to the Git repository directory (the \`.git\` directory).
+
+\`path.gitdir.relative\`::
+	The path to the Git repository directory relative to the current working directory.
+
 \`references.format\`::
 	The reference storage format. The valid values are:
 +
diff --git a/builtin/repo.c b/builtin/repo.c
index 71a5c1c29c..c141ef892a 100644
--- a/builtin/repo.c
+++ b/builtin/repo.c
@@ -7,12 +7,14 @@
 #include "hex.h"
 #include "odb.h"
 #include "parse-options.h"
+#include "path.h"
 #include "path-walk.h"
 #include "progress.h"
 #include "quote.h"
 #include "ref-filter.h"
 #include "refs.h"
 #include "revision.h"
+#include "setup.h"
 #include "strbuf.h"
 #include "string-list.h"
 #include "shallow.h"
@@ -75,6 +77,28 @@ static int get_object_format(struct repository *repo, struct strbuf *buf)
 	return 0;
 }
 
+static int get_path_gitdir_absolute(struct repository *repo, struct strbuf *buf)
+{
+	const char *git_dir = repo_get_git_dir(repo);
+
+	if (!git_dir)
+		return error(_("unable to get git directory"));
+
+	strbuf_add_path(buf, git_dir, startup_info->prefix, PATH_FORMAT_CANONICAL, PATH_DEFAULT_UNMODIFIED);
+	return 0;
+}
+
+static int get_path_gitdir_relative(struct repository *repo, struct strbuf *buf)
+{
+	const char *git_dir = repo_get_git_dir(repo);
+
+	if (!git_dir)
+		return error(_("unable to get git directory"));
+
+	strbuf_add_path(buf, git_dir, startup_info->prefix, PATH_FORMAT_RELATIVE, PATH_DEFAULT_UNMODIFIED);
+	return 0;
+}
+
 static int get_references_format(struct repository *repo, struct strbuf *buf)
 {
 	strbuf_addstr(buf,
@@ -87,6 +111,8 @@ static const struct repo_info_field repo_info_field[] = {
 	{ "layout.bare", get_layout_bare },
 	{ "layout.shallow", get_layout_shallow },
 	{ "object.format", get_object_format },
+	{ "path.gitdir.absolute", get_path_gitdir_absolute },
+	{ "path.gitdir.relative", get_path_gitdir_relative },
 	{ "references.format", get_references_format },
 };
 
diff --git a/t/t1900-repo-info.sh b/t/t1900-repo-info.sh
index 39bb77dda0..7c7dfbb052 100755
--- a/t/t1900-repo-info.sh
+++ b/t/t1900-repo-info.sh
@@ -155,4 +155,35 @@ test_expect_success 'git repo info -h shows only repo info usage' '
 	test_grep ! "git repo structure" actual
 '
 
+test_repo_info_path () {
+	field_name=$1
+	expect_relative=$2
+
+	test_expect_success "query individual key: path.$field_name.absolute" '
+		(
+			cd test-repo/sub &&
+			expect_absolute=$(cd .. && pwd)/.git &&
+			echo "path.$field_name.absolute=$expect_absolute" >expect &&
+			git repo info path.$field_name.absolute >actual &&
+			test_cmp expect actual
+		)
+	'
+
+	test_expect_success "query individual key: path.$field_name.relative" '
+		(
+			cd test-repo/sub &&
+			echo "path.$field_name.relative=$expect_relative" >expect &&
+			git repo info path.$field_name.relative >actual &&
+			test_cmp expect actual
+		)
+	'
+}
+
+test_expect_success 'setup test repository layout for path fields' '
+	git init test-repo &&
+	mkdir -p test-repo/sub
+'
+
+test_repo_info_path 'gitdir' '../.git'
+
 test_done
-- 
2.54.0`
		},
		{
			title: "[PATCH 4/4] repo: add path.commondir with absolute and relative suffix formatting",
			desc: "Introduces path.commondir.absolute and path.commondir.relative keys to track the common shared directory across worktrees, preserving proper sort order.",
			code: `[GSoC][PATCH 4/4] repo: add path.commondir with absolute and relative suffix formatting

Introduce \`path.commondir.absolute\` and \`path.commondir.relative\` keys
to \`git repo info\`. These track the repository's common directory path,
extending the path metadata engine alongside the existing \`gitdir\` fields.

Update \`repo_info_field\` to store the new keys in proper lexicographical
order to protect binary search operations, and expand the test matrix in
\`t/t1900-repo-info.sh\` to validate separate queries, bulk dumps, and
key listings.

Signed-off-by: K Jayatheerth <jayatheerthkulkarni2005@gmail.com>
Mentored-by: Justin Tobler <jltobler@gmail.com>
Mentored-by: Lucas Seiki Oshiro <lucasseikioshiro@gmail.com>
---
 Documentation/git-repo.adoc |  9 +++++++++
 builtin/repo.c              | 24 ++++++++++++++++++++++++
 t/t1900-repo-info.sh        |  1 +
 3 files changed, 34 insertions(+)

diff --git a/Documentation/git-repo.adoc b/Documentation/git-repo.adoc
index a0dca7ce88..ed7d80c690 100644
--- a/Documentation/git-repo.adoc
+++ b/Documentation/git-repo.adoc
@@ -104,6 +104,15 @@ values that they return:
 \`object.format\`::
 	The object format (hash algorithm) used in the repository.
 
+\`path.commondir.absolute\`::
+	The canonical absolute path to the Git repository's common
+	directory (the shared \`.git\` directory containing objects,
+	refs, and global configuration).
+
+\`path.commondir.relative\`::
+	The path to the Git repository's common directory relative to
+	the current working directory.
+
 \`path.gitdir.absolute\`::
 	The canonical absolute path to the Git repository directory (the \`.git\` directory).
 
diff --git a/builtin/repo.c b/builtin/repo.c
index c141ef892a..be24a5a8e8 100644
--- a/builtin/repo.c
+++ b/builtin/repo.c
@@ -77,6 +77,28 @@ static int get_object_format(struct repository *repo, struct strbuf *buf)
 	return 0;
 }
 
+static int get_path_commondir_absolute(struct repository *repo, struct strbuf *buf)
+{
+	const char *common_dir = repo_get_common_dir(repo);
+
+	if (!common_dir)
+		return error(_("unable to get common directory"));
+
+	strbuf_add_path(buf, common_dir, startup_info->prefix, PATH_FORMAT_CANONICAL, PATH_DEFAULT_UNMODIFIED);
+	return 0;
+}
+
+static int get_path_commondir_relative(struct repository *repo, struct strbuf *buf)
+{
+	const char *common_dir = repo_get_common_dir(repo);
+
+	if (!common_dir)
+		return error(_("unable to get common directory"));
+
+	strbuf_add_path(buf, common_dir, startup_info->prefix, PATH_FORMAT_RELATIVE, PATH_DEFAULT_UNMODIFIED);
+	return 0;
+}
+
 static int get_path_gitdir_absolute(struct repository *repo, struct strbuf *buf)
 {
 	const char *git_dir = repo_get_git_dir(repo);
@@ -111,6 +133,8 @@ static const struct repo_info_field repo_info_field[] = {
 	{ "layout.bare", get_layout_bare },
 	{ "layout.shallow", get_layout_shallow },
 	{ "object.format", get_object_format },
+	{ "path.commondir.absolute", get_path_commondir_absolute },
+	{ "path.commondir.relative", get_path_commondir_relative },
 	{ "path.gitdir.absolute", get_path_gitdir_absolute },
 	{ "path.gitdir.relative", get_path_gitdir_relative },
 	{ "references.format", get_references_format },
diff --git a/t/t1900-repo-info.sh b/t/t1900-repo-info.sh
index 7c7dfbb052..dd2706e1f7 100755
--- a/t/t1900-repo-info.sh
+++ b/t/t1900-repo-info.sh
@@ -184,6 +184,7 @@ test_expect_success 'setup test repository layout for path fields' '
 	mkdir -p test-repo/sub
 '
 
+test_repo_info_path 'commondir' '../.git'
 test_repo_info_path 'gitdir' '../.git'
 
 test_done
-- 
2.54.0`
		}
	];
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
					<span class="category-badge">GSoC</span>
					<span class="date">June 2026</span>
				</div>
				<h1 class="post-title">GSoC 2026 Week 1: Building the Foundation for path.*</h1>
			</header>

			<section class="post-content">
				<p class="lead">
					If you were following the mailing list before GSoC began, you would know how chaotic the <code>git repo</code> patches were.
				</p>

				<p>
					Three to four people were sending patches at the same time for the same idea. One of them was Eslam. You can follow that discussion in the archive here.
				</p>
				<p>
					Before going further into the architecture, I want to explain my project in layman's terms so that I can reach out to a broad range of people.
				</p>
				<p>
					My project is about <code>git repo info</code>. <code>git repo info</code> is a command used to get information about any git repository. It provides various data points in multiple formats that can be used by machines to write scripts around them.
				</p>
				<p>
					My job is to improve this command, and Phase 1 is to add <code>path.*</code> keys.
				</p>
				<p>
					<code>path.*</code> keys are used to get different paths in a repository. For example, you might want to know where your <code>.git</code> is actually residing.
				</p>
				<p>
					Say you are building a text editor. You should know where your git repository is, shouldn't you? This key is supposed to hand over paths to these text editors.
				</p>
				<p>
					It is not just the git dir, but rather a whole bunch of path keys.
				</p>
				<p>
					In week 1, I specifically explored these two keys: <code>gitdir</code> and <code>commondir</code>.
				</p>
				<p>
					The git dir is the path where the <code>.git</code> directory resides. <code>commondir</code> tells you where the repository's shared Git data lives.
				</p>
				<p>
					In a normal repository, they are usually the same path. In repositories using Git worktrees, <code>gitdir</code> points to worktree-specific metadata while <code>commondir</code> points to the main shared repository directory.
				</p>
				<p>
					Now that my project is clear, let us discuss what there is to debate about it.
				</p>
				<p>
					Something you must know is that paths are very different in Windows and POSIX (Unix, Linux, and Mac). We must have clear clarity on whether we should return an absolute path or a relative path.
				</p>
				<p>
					Now, the questions that should arise in your mind are these:
				</p>
				<ol>
					<li>Should there still be a <code>--path-format</code> flag?</li>
					<li>Should we consider a default option? Currently, we have <code>path.gitdir.absolute</code>; should we consider an option where a plain <code>path.gitdir</code> returns some default?</li>
					<li>Should we keep the default the same as <code>rev-parse</code>? Or should either relative or absolute be the default?</li>
					<li>When printing using <code>--all</code>, should the default be printed, or should we print both absolute and relative?</li>
					<li>Is printing both absolute and relative in a single call using <code>--all</code> acceptable?</li>
					<li>If no, what is a better approach?</li>
				</ol>
				<p>
					Don't worry if you do not understand these questions. Your takeaway should be is that without discussing these, you cannot get this project done.
				</p>
				<p>
					That is where Lucas (also my mentor for GSoC 2026) came in with a series of patches that covered a good chunk of these discussions and provided direction for my project. Note that these discussions were from Feb 2026 (yes, long before GSoC began).
				</p>
				<p>
					From there, a series of discussions happened. One notable discussion was between Tian Yuchen and me. You can read them in the mailing list archive.
				</p>
				<p>
					From there, it was softly established that adding both absolute and relative paths in a single call is a good idea.
				</p>
				<p>
					Since <code>git repo info</code> is also built to free up <code>git rev-parse</code>, which is clogged by multiple commands that supersede its expectation and, quite frankly, its need as well, it was also clear that we do not need to recreate what <code>git rev-parse</code> did. We should instead learn from its mistakes and build what we call a "Better git rev-parse".
				</p>
				<p>
					That is almost all the lore behind <code>git repo info</code>. Interesting, right?
				</p>
				<p>
					So, what did I do at the end of the day? I added both absolute and relative path keys. So whenever you call <code>git repo info --all</code>, it will print all the data:
				</p>

				<pre><code>$ git repo info --all
layout.bare=false
layout.shallow=false
object.format=sha1
path.commondir.absolute=/home/gink/Desktop/Code/git/.git
path.commondir.relative=.git
path.gitdir.absolute=/home/gink/Desktop/Code/git/.git
path.gitdir.relative=.git
references.format=files</code></pre>

				<p>
					It will print both <code>path.&lt;something&gt;.absolute</code> and <code>path.&lt;something&gt;.relative</code>.
				</p>
				<p>
					If you want to call it individually, however, you must specify whether it is <code>path.&lt;something&gt;.absolute</code> or <code>path.&lt;something&gt;.relative</code>.
				</p>
				<p>
					This is currently on the mailing list. You can view the full thread here.
				</p>
				<p>
					Of course, I still expect a lot of debate around this, and things might change in the future. This is just what I did in week 1 of the GSoC coding period. In the next few weeks, I will defend this architecture and try to get it merged as soon as possible. Once these two keys are merged, it will not be that hard to merge more <code>path.*</code> keys.
				</p>
				<p>
					Further keys I plan on including are:
				</p>
				<ul>
					<li><code>path.toplevel</code>: The absolute top-level directory of the working tree. Matches <code>rev-parse --show-toplevel</code>.</li>
					<li><code>path.superproject-working-tree</code>: The root of the superproject’s working tree if the current repository is a submodule. Matches <code>rev-parse --show-superproject-working-tree</code>.</li>
					<li><code>path.objects</code>: The object database path. Accounts for the <code>GIT_OBJECT_DIRECTORY</code> variable.</li>
					<li><code>path.hooks</code>: The hooks directory path. Respects <code>core.hooksPath</code> if set.</li>
					<li><code>path.index</code>: The current index file path. Reflects <code>GIT_INDEX_FILE</code> overrides.</li>
					<li><code>path.grafts</code>: The repository grafts file path.</li>
					<li><code>path.git-prefix</code>: The path from the top-level of the working tree to the current directory. Matches <code>rev-parse --show-prefix</code>.</li>
				</ul>
				<p>
					For the technical ones, I am adding all the patches below. You can expand each of them to read how it works under the hood. In case you want to learn more, you can always reach out to me at <a href="mailto:jayatheerthkulkarni2005@gmail.com">jayatheerthkulkarni2005@gmail.com</a>.
				</p>

				<h2 class="diffs-heading">Patches</h2>
				
				<div class="diffs-accordion">
					{#each diffs as diff, index}
						<div class="accordion-item {activeDiff === index ? 'active' : ''}">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div class="accordion-header" on:click={() => toggleDiff(index)}>
								<span class="diff-title">{diff.title}</span>
								<span class="accordion-indicator">{activeDiff === index ? '−' : '+'}</span>
							</div>
							{#if activeDiff === index}
								<div class="accordion-content">
									<p class="diff-desc">{diff.desc}</p>
									<pre class="diff-code-block"><code>{diff.code}</code></pre>
								</div>
							{/if}
						</div>
					{/each}
				</div>
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

	.post-content ul, .post-content ol {
		margin: 0 0 2rem 1.5rem;
		padding: 0;
	}

	.post-content li {
		font-size: 1rem;
		line-height: 1.8;
		margin-bottom: 0.75rem;
		color: rgba(243, 235, 216, 0.8);
		font-family: "Inter", sans-serif;
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

	.post-content a {
		color: #dccb8e;
		text-decoration: none;
		border-bottom: 1px solid rgba(220, 203, 142, 0.35);
		padding-bottom: 1px;
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.post-content a:hover {
		color: #f3ebd8;
		border-color: #f3ebd8;
	}

	.diffs-heading {
		margin-top: 4rem !important;
	}

	.diffs-accordion {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.accordion-item {
		background: rgba(25, 25, 25, 0.4);
		border: 1px solid rgba(220, 203, 142, 0.1);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
	}

	.accordion-item:hover {
		border-color: rgba(220, 203, 142, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
	}

	.accordion-item.active {
		border-color: rgba(220, 203, 142, 0.4);
		background: rgba(30, 30, 30, 0.6);
	}

	.accordion-header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		color: #f3ebd8;
		font-family: "Inter", sans-serif;
		font-size: 1.05rem;
		cursor: pointer;
		user-select: none;
	}

	.diff-title {
		font-weight: 500;
		line-height: 1.4;
	}

	.accordion-indicator {
		color: #dccb8e;
		font-size: 1.5rem;
		font-weight: 300;
		margin-left: 1rem;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		transition: transform 0.3s ease;
	}

	.accordion-content {
		padding: 0 1.5rem 1.5rem 1.5rem;
		animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.diff-desc {
		font-family: "Inter", sans-serif;
		font-size: 0.95rem !important;
		line-height: 1.6 !important;
		color: rgba(243, 235, 216, 0.75) !important;
		margin-bottom: 1.5rem !important;
		padding-top: 0.5rem;
	}

	.diff-code-block {
		background: rgba(10, 10, 10, 0.8) !important;
		border: 1px solid rgba(220, 203, 142, 0.08) !important;
		max-height: 450px;
		overflow-y: auto;
		margin: 0 !important;
		border-radius: 8px !important;
		box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
	}

	.diff-code-block code {
		font-family: "Courier New", Courier, monospace;
		font-size: 0.85rem;
		line-height: 1.5;
		color: #e2d9bc;
		word-break: normal;
		white-space: pre;
	}

	.diff-code-block::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.diff-code-block::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}

	.diff-code-block::-webkit-scrollbar-thumb {
		background: rgba(220, 203, 142, 0.2);
		border-radius: 4px;
	}

	.diff-code-block::-webkit-scrollbar-thumb:hover {
		background: rgba(220, 203, 142, 0.4);
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
