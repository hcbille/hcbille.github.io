---
title: Hello from the terminal
date: 2026-11-03
description: A first post, and a tour of what a post on this site can hold.
---

This blog is plain markdown. Each post is one `.md` file in the repo, and the site renders it right here in the terminal frame, with the same line numbers as every other tab.

## Why markdown

I already write everything else in it: notes, runbooks, migration plans. A blog that takes the same files means the distance between *"I should write this up"* and a published post is one `git push`.

> The best documentation is the one you actually keep up to date.

## What a post can hold

Lists, for one:

- Headings, **bold** and *italic* text
- [Links](https://github.com/hcbille), including to [other posts](hello-from-the-terminal.md)
- Inline `code` and full code blocks

Numbered steps work too:

1. Write `blog/my-post.md`
2. Add a title, date and description at the top
3. Push

And code, for the scripts that end up doing most of the work:

```bash
# Every user, with whether they're suspended, as a CSV
gam print users fields primaryemail,suspended > users.csv
```

---

More soon.
