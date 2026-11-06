# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and recruiters for solutions, customer and partner engineering roles (Stockholm or remote). They usually arrive from HC's CV, LinkedIn or an application, and spend a few minutes deciding whether HC has done this work at scale and is worth a conversation.

Secondary (not designed for first): engineers and open-source peers who find the site through Crest, Inner Dialogue, GitHub, Mastodon or the blog.

## Product Purpose

hcbille.se is HC Bille's personal site and portfolio: who she is, what she has run, what she is working on now, and how to reach her. It exists to support a move from in-house IT/systems architecture into customer- and solutions-facing engineering.

Success means the visitor remembers HC. Being distinct and memorable matters more than any single action; getting in touch and downloading the CV follow from that.

## Positioning

A systems architect who has sat on the customer side: ran Google Workspace, identity and endpoint platforms for up to 9,000 users (Klarna, Arrive, Instabee, Bonnier News), led tenant consolidations and a secret same-moment rebrand of 4,500+ accounts, and also ships production Swift, C# and C++ (Chromium) in open source. The site itself is built as a terminal, which is how HC actually works.

## Operating Context

- Visitors usually come with a CV or LinkedIn profile already open, and compare what the site shows against it.
- Content is a set of terminal "tabs": overview, about.md, now.md, experience.md, case-study.md, projects.md, skills.md, blog.md.
- now.md pulls public pull requests live from GitHub; the page must still show every section without JavaScript.
- The blog is plain markdown in `blog/`, started with `npm run new` and published with `git push`.

## Capabilities and Constraints

- Static site: hand-written `index.html`, `style.css`, `solarized.css`, `app.js`; the blog is built into `_site/` by `scripts/build-blog.mjs` (uses `marked`).
- Hosting: GitHub Pages via Actions today, with Cloudflare Workers (static assets, `wrangler.jsonc`) being set up; custom domain hcbille.se.
- Progressive enhancement: works without JavaScript; blog posts have real paths (`/blog/<name>/`), tabs use `/#<id>`.
- Offline support via a small service worker (`sw.js`).
- Self-hosted Cousine font; vendored WebTUI CSS.

## Brand Commitments

- **Binding:** the terminal concept and the Solarized palette are part of HC's identity online. Future work keeps them.
- Name: HC Bille, she/her, Systems Architect, Stockholm.
- Voice: plain, first-person, concrete, numbers over adjectives, a little dry humour ("the parts of a company nobody notices when they work"). Terminal idioms (`$ whoami`, neofetch-style card, `cat: … No such file or directory`) are part of the voice.

## Evidence on Hand

- `resume.md` and `resume.pdf`: full CV, the source of truth for roles, dates and numbers.
- Case study: EasyPark → Arrive rebrand (4,500+ users, 35 countries, three weeks, no downtime), in `index.html`.
- Open source: Crest (★1,000+, 30+ merged PRs) and Inner Dialogue (★100+, eight extensions); live PR list from GitHub.
- Blog: `blog/reading-nov26.md` (a reading list).
- `og.png`, `favicon.svg`.
- No testimonials, references or employer logos on hand. Do not invent them, or any metrics beyond those in `resume.md`.

## Product Principles

1. Memorable first: a visitor should leave able to describe the site and the person to someone else.
2. Proof over claims: every assertion traces to a real number, project or pull request.
3. The terminal is honest, not a costume: it reflects how HC works, so it must stay fast, readable and usable.
4. Recruiter-friendly underneath: role, location, what she's looking for and contact details are never more than a glance away.
5. Works everywhere: no JavaScript, slow networks and offline still get the whole story.

## Accessibility & Inclusion

Solarized accents are already adjusted for 4.5:1 text contrast; keep at least WCAG AA contrast. Content must stay readable and navigable without JavaScript and by keyboard.
