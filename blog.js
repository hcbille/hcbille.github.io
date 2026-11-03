// Turns a blog post's markdown into the site's .doc HTML.
// Shared by the build (scripts/build-blog.mjs) and the browser (app.js),
// so a post looks the same whether it was built or opened in place.

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Reads the "---" block at the top of a post: one "key: value" per line.
export function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    meta[kv[1]] = value === 'true' ? true : value === 'false' ? false : value;
  }
  return { meta, body: src.slice(m[0].length) };
}

// "2026-11-03" → "3 Nov 2026", like now.md
export function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

// Posts are written with paths relative to blog/ (img/x.jpg, other-post.md).
// Pages live at /blog/<name>/, so point those at the right place.
export function fixHref(href) {
  if (!href || /^([a-z][a-z0-9+.-]*:|\/|#|\?)/i.test(href)) return href;
  const [path, hash] = href.split('#');
  const post = path.match(/^(?:\.\/)?([a-z0-9-]+)\.md$/i);
  const url = post ? `/blog/${post[1]}/` : '/blog/' + path.replace(/^\.\//, '');
  return hash ? `${url}#${hash}` : url;
}

// Pass in the Marked class (from npm in the build, from vendor/ in the browser).
export function renderPost(Marked, src) {
  const { meta, body } = parseFrontmatter(src);
  const marked = new Marked({ gfm: true });
  const tokens = marked.lexer(body);
  marked.walkTokens(tokens, (t) => {
    if (t.type === 'link' || t.type === 'image') t.href = fixHref(t.href);
  });
  // One block per "line" of the file, with a blank line between, like the other tabs
  // HTML comments are notes to self: left out entirely, not even a blank line
  const isComment = (t) => t.type === 'html' && /^\s*<!--[\s\S]*?-->\s*$/.test(t.raw);
  const blocks = tokens
    .filter((t) => t.type !== 'space' && !isComment(t))
    .map((t) => {
      const html = marked.parser(Object.assign([t], { links: tokens.links })).trim();
      // A wrapper keeps the line number beside the table and lets wide tables scroll
      return t.type === 'table' ? `<div class="table">${html}</div>` : html;
    });
  const html = [
    `<h1>${esc(meta.title || 'Untitled')}</h1>`,
    meta.date ? `<p class="dim">${esc(formatDate(meta.date))}</p>` : '',
    '<p class="blank"></p>',
    blocks.join('\n<p class="blank"></p>\n'),
    '<p class="blank"></p>',
    '<p><a href="/blog/">← cd ..</a> <span class="dim">· all posts</span></p>',
    '<p class="tilde">~</p>',
  ].filter(Boolean).join('\n');
  return { meta, html };
}
