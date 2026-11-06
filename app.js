// Interactivity for hcbille.se. Without this script the page still shows every section.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const GITHUB_USER = 'hcbille';
const GITHUB_HEADERS = { headers: { Accept: 'application/vnd.github+json' } };
const CAREER_START = new Date(2017, 2, 1); // March 2017

const sections = $$('[data-section]');
const ids = sections.map((s) => s.id);
const tabLabels = Object.fromEntries($$('.tab-list a').map((a) => [a.dataset.tab, a.textContent]));
const SITE_TITLE = 'HC Bille · Systems Architect';
const postSection = $('#post');

/* ── Addresses ───────────────────────────────────────── */
// Tabs use #about-style addresses on the root page. The blog uses real paths:
// /blog/ for the list and /blog/<name>/ for a post, which the build also
// writes as pages. Returns null for addresses that aren't part of the site's tabs.

function parseRoute(url) {
  const p = url.pathname.replace(/index\.html$/, '');
  if (p === '/') {
    const h = url.hash.slice(1);
    return h === 'blog' ? { id: 'blog' } : { id: ids.includes(h) ? h : 'overview' };
  }
  if (p === '/blog/' || p === '/blog') return { id: 'blog' };
  const m = p.match(/^\/blog\/([a-z0-9-]+)\/?$/);
  return m ? { id: 'blog', post: m[1] } : null;
}

function urlFor(id, post) {
  if (post) return `/blog/${post}/`;
  if (id === 'overview') return '/';
  if (id === 'blog') return '/blog/';
  return '/#' + id;
}

/* ── Blog posts ──────────────────────────────────────── */
// A built post page arrives with its post already in #post. Anything else is
// fetched as markdown and rendered here with the same code the build uses.

let postLoad = 0; // ignores a slow fetch if another post was opened meanwhile

async function loadPost(slug) {
  if (postSection.dataset.post === slug) return;
  const mine = ++postLoad;
  postSection.dataset.post = slug;
  postSection.innerHTML = `<p class="loading">loading blog/${slug}.md…</p>`;
  let html;
  try {
    const [{ Marked }, blog, res] = await Promise.all([
      import('/vendor/marked.esm.js'),
      import('/blog.js'),
      fetch(`/blog/${slug}.md`),
    ]);
    if (!res.ok) throw new Error(res.status);
    html = blog.renderPost(Marked, await res.text()).html;
  } catch (e) {
    html = `<h1>Not found</h1><p class="blank"></p><p>cat: blog/${slug}.md: No such file or directory</p>` +
      '<p class="blank"></p><p><a href="/blog/">← cd ..</a> <span class="dim">· all posts</span></p><p class="tilde">~</p>';
  }
  if (mine !== postLoad) return;
  postSection.innerHTML = html;
  if (location.pathname === urlFor('blog', slug)) document.title = postTitle();
}

const postTitle = () => {
  const h1 = $('h1', postSection);
  return h1 && !$('.loading', postSection) ? `${h1.textContent} · HC Bille` : `blog/${postSection.dataset.post}.md · ${SITE_TITLE}`;
};

/* ── Tabs ─────────────────────────────────────────────── */

// focus: move keyboard and screen reader focus to the new section.
// Used when the visitor picks a tab, not on page load or back/forward.
function show(id, { post, push = true, focus = false } = {}) {
  if (!ids.includes(id)) id = 'overview';
  if (id !== 'blog') post = undefined;
  const section = post ? postSection : $('#' + id);
  sections.forEach((s) => s.classList.toggle('active', s === section));
  postSection.classList.toggle('active', !!post);
  document.documentElement.dataset.tab = id; // lets CSS show the credits on the overview only
  $$('.tab-list a').forEach((a) => {
    if (a.dataset.tab === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  // On phones the tab row scrolls sideways: keep the current tab in view
  const tab = $(`.tab-list a[data-tab="${id}"]`);
  const row = tab.parentElement;
  if (row.scrollWidth > row.clientWidth) {
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2 });
  }
  const n = ids.indexOf(id) + 1;
  $('#file').textContent = post ? `blog/${post}.md` : tabLabels[id];
  $('#pos').textContent = `[${n}/${ids.length}]`;
  $('#menu-pos').textContent = `${n}/${ids.length}`;
  const url = urlFor(id, post);
  if (push && url !== location.pathname + location.hash) history.pushState(null, '', url);
  if (post) loadPost(post);
  document.title = post ? postTitle() : id === 'overview' ? SITE_TITLE : `${tabLabels[id]} · ${SITE_TITLE}`;
  window.scrollTo(0, 0);
  if (focus) {
    const target = $('h1', section) || section;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

const go = (url, opts) => {
  const r = parseRoute(url);
  show(r ? r.id : 'overview', { post: r && r.post, ...opts });
};

document.addEventListener('click', (e) => {
  // Let Cmd/Ctrl/Shift-click open the link in a new tab or window as usual
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a || a.target || a.hasAttribute('download')) return;
  const url = new URL(a.href);
  if (url.origin !== location.origin || !parseRoute(url)) return;
  e.preventDefault();
  go(url, { focus: true });
});
window.addEventListener('popstate', () => go(new URL(location.href), { push: false }));
// Old #blog links move to /blog/; anything else keeps its address
{
  const url = new URL(location.href);
  const r = parseRoute(url);
  go(url, { push: false });
  if (r && r.id === 'blog' && url.hash === '#blog') history.replaceState(null, '', '/blog/');
}

/* ── Clock and uptime ────────────────────────────────── */

const clockFormat = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

function uptime(now) {
  let months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + now.getMonth() - CAREER_START.getMonth();
  return `${Math.floor(months / 12)}y ${months % 12}m`;
}

function tick() {
  const now = new Date();
  $('#clock').textContent = 'sthlm ' + clockFormat.format(now);
  $$('.uptime').forEach((el) => (el.textContent = uptime(now)));
}
tick();
setInterval(tick, 1000);

/* ── Downloads ───────────────────────────────────────── */

function download(file) {
  const a = document.createElement('a');
  a.href = file;
  a.download = file;
  document.body.append(a);
  a.click();
  a.remove();
}

/* ── Command palette ─────────────────────────────────── */

const palette = $('#palette');
const input = $('#palette-input');
const list = $('#palette-list');
const menuButton = $('#menu');
let selected = 0;
let matches = [];
let returnFocus = null;
const touchScreen = matchMedia('(pointer: coarse)');

const commands = [
  ...ids.map((id, i) => ({ name: 'open ' + tabLabels[id], hint: String(i + 1), run: () => show(id, { focus: true }) })),
  ...$$('#blog a[data-post]').map((a) => ({ name: 'read ' + a.textContent.toLowerCase(), hint: '', run: () => show('blog', { post: a.dataset.post, focus: true }) })),
  { name: 'export resume.pdf', hint: '↓', run: () => download('resume.pdf') },
  { name: 'export resume.md', hint: '↓', run: () => download('resume.md') },
  { name: 'print resume', hint: '', run: () => window.print() },
  { name: 'mail hc', hint: '↗', run: () => (location.href = 'mailto:hcbille@gmail.com') },
  { name: 'github', hint: '↗', run: () => window.open('https://github.com/hcbille', '_blank', 'noopener') },
];

function renderPalette() {
  const q = input.value.trim().toLowerCase();
  matches = commands.filter((c) => c.name.includes(q));
  selected = Math.min(Math.max(selected, 0), Math.max(matches.length - 1, 0));
  list.replaceChildren(
    ...(matches.length
      ? matches.map((c, i) => {
          const li = document.createElement('li');
          li.id = 'cmd-' + i;
          li.setAttribute('role', 'option');
          li.setAttribute('aria-selected', String(i === selected));
          li.dataset.index = i;
          const name = document.createElement('span');
          name.textContent = c.name;
          const hint = document.createElement('span');
          hint.className = 'hint';
          hint.setAttribute('aria-hidden', 'true');
          hint.textContent = c.hint;
          li.append(name, hint);
          return li;
        })
      : [Object.assign(document.createElement('li'), { textContent: 'no match', className: 'dim' })]),
  );
  // Screen readers announce the highlighted command as the arrow keys move
  if (matches.length) input.setAttribute('aria-activedescendant', 'cmd-' + selected);
  else input.removeAttribute('aria-activedescendant');
}

function setMode(command) {
  const mode = $('#mode');
  mode.textContent = command ? 'COMMAND' : 'NORMAL';
  mode.classList.toggle('command', command);
}

function openPalette() {
  returnFocus = document.activeElement;
  palette.hidden = false;
  menuButton.setAttribute('aria-expanded', 'true');
  input.value = '';
  selected = 0;
  renderPalette();
  // On touch screens, focusing the box would open the on-screen keyboard over
  // the list. Typing still works there: paletteKey() feeds keys into the box.
  if (touchScreen.matches) palette.focus();
  else input.focus();
  setMode(true);
}

// restore: put focus back where it was before the palette opened
function closePalette({ restore = true } = {}) {
  palette.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  setMode(false);
  if (restore && returnFocus && returnFocus !== document.body && document.contains(returnFocus)) returnFocus.focus();
  else input.blur();
  returnFocus = null;
}

function runSelected(i = selected) {
  const cmd = matches[i];
  closePalette();
  if (cmd) cmd.run();
}

input.addEventListener('input', () => { selected = 0; renderPalette(); });

// Handles keys while the palette is open. Works even if focus never reached
// the text box (it can't when the window isn't in front), by typing into it here.
function paletteKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
  else if (e.key === 'Tab') e.preventDefault(); // keep focus inside the dialog
  else if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, matches.length - 1); renderPalette(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); renderPalette(); }
  else if (e.key === 'Enter') { e.preventDefault(); runSelected(); }
  else if (e.target !== input && !e.metaKey && !e.ctrlKey) {
    if (e.key === 'Backspace') input.value = input.value.slice(0, -1);
    else if (e.key.length === 1) input.value += e.key;
    else return;
    e.preventDefault();
    selected = 0;
    renderPalette();
  }
}
list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-index]');
  if (li) runSelected(Number(li.dataset.index));
});
document.addEventListener('mousedown', (e) => {
  if (!palette.hidden && !palette.contains(e.target)) closePalette({ restore: false });
});
menuButton.addEventListener('click', openPalette);

/* ── Keyboard shortcuts ──────────────────────────────── */

document.addEventListener('keydown', (e) => {
  if (!palette.hidden) return paletteKey(e);
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target instanceof Element && e.target.closest('input, textarea, [contenteditable]')) return;
  if (e.key === ':' || e.key === '/') { e.preventDefault(); openPalette(); }
  else if (/^[1-9]$/.test(e.key) && ids[Number(e.key) - 1]) show(ids[Number(e.key) - 1], { focus: true });
});

/* ── GitHub ──────────────────────────────────────────── */
// The page ships with recent numbers and PRs. These swap in live data when
// GitHub answers, cached for the browser session. If GitHub is down or rate
// limited, the shipped content stays.

// Returns the cached or fetched value as a string, or null if GitHub said no.
async function cachedGitHub(key, url, pick) {
  try {
    const hit = sessionStorage.getItem(key);
    if (hit != null) return hit;
  } catch (e) {}
  const res = await fetch(url, GITHUB_HEADERS);
  if (!res.ok) return null;
  const value = String(pick(await res.json()));
  try { sessionStorage.setItem(key, value); } catch (e) {}
  return value;
}

/* Public pull requests: open and merged, never closed-unmerged */

// Leaves out this site's own repo: housekeeping, not proof
const OWN_REPO = 'hcbille/hcbille.github.io';

const prSearch = (qualifier) =>
  `https://api.github.com/search/issues?q=author:${GITHUB_USER}+type:pr+is:public+-repo:${OWN_REPO}+${qualifier}&sort=updated&order=desc&per_page=10`;

const toPR = (state) => (i) => ({
  title: i.title,
  url: i.html_url,
  number: i.number,
  repo: i.repository_url.split('/repos/').pop(), // owner/repo
  state,
  updated: i.updated_at,
});

// Up to n PRs: about half merged, the rest open, newest first
function pickPRs(data, n) {
  let merged = data.merged.slice(0, Math.ceil(n / 2));
  const open = data.open.slice(0, n - merged.length);
  merged = data.merged.slice(0, n - open.length);
  return [...open, ...merged].sort((a, b) => b.updated.localeCompare(a.updated));
}

async function searchPRs(qualifier) {
  const res = await fetch(prSearch(qualifier), GITHUB_HEADERS);
  if (!res.ok) throw new Error('GitHub ' + res.status);
  return res.json();
}

async function loadPullRequests() {
  const key = 'prs-v6';
  let data;
  try { data = JSON.parse(sessionStorage.getItem(key)); } catch (e) {}
  if (!data) {
    const [open, merged] = await Promise.all([searchPRs('is:open'), searchPRs('is:merged')]);
    data = {
      total: open.total_count + merged.total_count,
      open: open.items.map(toPR('open')),
      merged: merged.items.map(toPR('merged')),
    };
    try { sessionStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }

  $$('.pr-count').forEach((el) => (el.textContent = data.total));

  $$('ul[data-prs]').forEach((ul) => {
    const full = ul.classList.contains('prs-full');
    ul.replaceChildren(
      ...pickPRs(data, Number(ul.dataset.prs)).map((pr) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = pr.url;
        const span = (className, text) => Object.assign(document.createElement('span'), { className, textContent: text });
        if (full) {
          const badge = span('st-' + pr.state, pr.state);
          badge.setAttribute('is-', 'badge');
          a.append(badge, ' ');
        }
        // Spaces are invisible in the flex row but keep copied text readable
        a.append(span('yellow', '#' + pr.number), ' ', span('title', pr.title), ' ', span('repo', '- ' + pr.repo));
        li.append(a);
        return li;
      }),
    );
  });
}

loadPullRequests().catch(() => {}); // rate limited or offline: keep the snapshot

/* Merged PR counts and star counts per project */
// [data-merged="owner/repo"]: how many of HC's PRs were merged there.
// [data-stars="owner/repo"]: stars rounded down to the nearest hundred, like
// "★1,000+". Under 100 shows the exact number.
// Each lookup is separate, so one failure doesn't stop the others.

async function loadMergedCounts() {
  for (const el of $$('[data-merged]')) {
    const repo = el.dataset.merged;
    try {
      const count = await cachedGitHub(
        'merged-v1:' + repo,
        `https://api.github.com/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged+repo:${repo}&per_page=1`,
        (json) => json.total_count,
      );
      if (count != null) el.textContent = count;
    } catch (e) {}
  }
}

async function loadStars() {
  const repos = [...new Set($$('[data-stars]').map((el) => el.dataset.stars))];
  for (const repo of repos) {
    try {
      const stars = await cachedGitHub('stars-v1:' + repo, `https://api.github.com/repos/${repo}`, (json) => json.stargazers_count);
      if (stars == null) continue;
      const n = Number(stars);
      const label = n < 100 ? `★${n}` : `★${(Math.floor(n / 100) * 100).toLocaleString('en')}+`;
      $$(`[data-stars="${repo}"]`).forEach((el) => (el.textContent = label));
    } catch (e) {}
  }
}

loadMergedCounts();
loadStars();
