// Builds the site into _site/: copies everything, then turns blog/*.md into
// real pages for search engines, link previews and visitors without JavaScript.
// Run with `npm run build` (or `npm run dev` to build and preview on :8080).

import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import { esc, fixHref, formatDate, renderPost } from '../blog.js';

const SITE = 'https://hcbille.se';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '_site');
const SKIP = new Set(['.git', '.github', '.claude', '.gitignore', 'node_modules', '_site', 'scripts', 'package.json', 'package-lock.json']);

/* ── Read posts ──────────────────────────────────────── */

const posts = [];
const drafts = new Set();
// Files starting with _ (like _template.md) are never built or published
for (const file of (await readdir(join(ROOT, 'blog'))).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort()) {
  const slug = file.slice(0, -3);
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`blog/${file}: use lowercase letters, digits and dashes in the filename`);
  const { meta, html } = renderPost(Marked, await readFile(join(ROOT, 'blog', file), 'utf8'));
  if (meta.draft === true) { drafts.add(file); continue; }
  for (const key of ['title', 'date', 'description']) {
    if (!meta[key]) throw new Error(`blog/${file}: frontmatter is missing "${key}"`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`blog/${file}: date should look like 2026-11-03`);
  posts.push({ slug, meta, html });
}
posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.meta.title.localeCompare(b.meta.title));

/* ── Copy the site ───────────────────────────────────── */

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT);
for (const entry of await readdir(ROOT)) {
  if (SKIP.has(entry)) continue;
  await cp(join(ROOT, entry), join(OUT, entry), {
    recursive: true,
    filter: (src) => {
      if (!src.startsWith(join(ROOT, 'blog') + '/')) return true;
      const rel = src.slice(ROOT.length + 6);
      return !rel.startsWith('_') && !drafts.has(rel);
    },
  });
}
await cp(join(ROOT, 'node_modules/marked/lib/marked.esm.js'), join(OUT, 'vendor/marked.esm.js'));

/* ── Pages ───────────────────────────────────────────── */

const listHtml = [
  '<h1>Blog</h1>',
  `<p class="dim">${posts.length} ${posts.length === 1 ? 'post' : 'posts'} · <a href="/blog/feed.xml">rss</a></p>`,
  '<p class="blank"></p>',
  posts.length
    ? '<ul class="posts">\n' + posts.map((p) =>
        `<li><a href="/blog/${p.slug}/" data-post="${p.slug}">${esc(p.meta.title)}</a> <span class="dim">· ${esc(formatDate(p.meta.date))}</span><br>${esc(p.meta.description)}</li>`,
      ).join('\n') + '\n</ul>'
    : '<p>No posts yet.</p>',
  '<p class="tilde">~</p>',
].join('\n');

const template = (await readFile(join(ROOT, 'index.html'), 'utf8'))
  .replace('<!-- blog:list -->', listHtml);

// Swap one tag's attribute value, and fail loudly if index.html changed shape
function setAttr(html, selector, value) {
  const re = new RegExp(`(${selector}[^>]*?(?:content|href)=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`index.html: can't find ${selector}`);
  return html.replace(re, `$1${esc(value)}$2`);
}

function page({ title, description, path, type = 'profile', image, post }) {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setAttr(html, '<meta name="description"', description);
  html = setAttr(html, '<link rel="canonical"', SITE + path);
  html = setAttr(html, '<meta property="og:url"', SITE + path);
  html = setAttr(html, '<meta property="og:title"', title);
  html = setAttr(html, '<meta property="og:description"', description);
  html = setAttr(html, '<meta property="og:type"', type);
  if (image) {
    html = setAttr(html, '<meta property="og:image"', image.startsWith('http') ? image : SITE + fixHref(image));
    html = html.replace(/\s*<meta property="og:image:(width|height|alt)"[^>]*>/g, '');
  }
  html = html.replace('<html lang="en">', `<html lang="en" data-page="${post ? 'post' : 'blog'}">`);
  if (post) {
    html = html.replace('<!-- blog:post -->', post.html).replace('<section id="post"', `<section id="post" data-post="${post.slug}"`);
    html = html.replace('</head>', `  <meta property="article:published_time" content="${esc(post.meta.date)}">\n</head>`);
  }
  return html;
}

const SITE_TITLE = 'HC Bille · Systems Architect';
await writeFile(join(OUT, 'index.html'), template);
await mkdir(join(OUT, 'blog'), { recursive: true });
await writeFile(join(OUT, 'blog/index.html'), page({
  title: `Blog · ${SITE_TITLE}`,
  description: 'Writing by HC Bille on identity, Google Workspace, migrations and the tools around them.',
  path: '/blog/',
}));
for (const post of posts) {
  await mkdir(join(OUT, 'blog', post.slug), { recursive: true });
  await writeFile(join(OUT, 'blog', post.slug, 'index.html'), page({
    title: `${post.meta.title} · HC Bille`,
    description: post.meta.description,
    path: `/blog/${post.slug}/`,
    type: 'article',
    image: post.meta.image,
    post,
  }));
}

/* ── Feed and sitemap ────────────────────────────────── */

const rfc822 = (iso) => new Date(iso + 'T12:00:00Z').toUTCString();
await writeFile(join(OUT, 'blog/feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>HC Bille · Blog</title>
  <link>${SITE}/blog/</link>
  <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Writing by HC Bille</description>
  <language>en</language>
${posts.map((p) => `  <item>
    <title>${esc(p.meta.title)}</title>
    <link>${SITE}/blog/${p.slug}/</link>
    <guid>${SITE}/blog/${p.slug}/</guid>
    <pubDate>${rfc822(p.meta.date)}</pubDate>
    <description>${esc(p.meta.description)}</description>
  </item>`).join('\n')}
</channel>
</rss>
`);

const sitemap = await readFile(join(ROOT, 'sitemap.xml'), 'utf8');
const urls = [
  { loc: '/blog/', lastmod: posts[0]?.meta.date },
  ...posts.map((p) => ({ loc: `/blog/${p.slug}/`, lastmod: p.meta.date })),
].map((u) => `  <url>\n    <loc>${SITE}${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>\n`).join('');
await writeFile(join(OUT, 'sitemap.xml'), sitemap.replace('</urlset>', urls + '</urlset>'));

console.log(`Built ${posts.length} post(s)${drafts.size ? `, skipped ${drafts.size} draft(s)` : ''} into _site/`);
