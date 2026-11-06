---
# ── Required ─────────────────────────────────────────
# Shown as the post's heading, in the list and in link previews.
title: Post title
# YYYY-MM-DD. Posts are listed newest first.
date: 2026-01-01
# One sentence for the list, search results and link previews.
description: One sentence on what this post is about.

# ── Optional ─────────────────────────────────────────
# Link-preview image, relative to blog/ (put it in blog/img/). Defaults to og.png.
# image: img/my-post.png
# Keeps the post off the site until you delete this line. Still visible on GitHub.
draft: true
---

<!--
HOW TO START A POST  (this box is hidden on the site; delete it whenever you like)

1. In the website folder (the first time only, run npm install), run:
       npm run new my-post-name
   This copies this template to blog/my-post-name.md with today's date.
   The file name becomes the address: hcbille.se/blog/my-post-name/
   Use lowercase letters, digits and dashes only.
   (Or copy this file by hand and change the title and date yourself.)

2. Fill in title, date and description at the top, between the --- lines.

3. Write the post below. Keep the examples you need and delete the rest.
   Images go in blog/img/.

4. Preview it locally:
       npm run dev
   then open http://localhost:8080/blog/
   Drafts don't show up, so delete the "draft: true" line to see it there.
   After each change, stop it with Ctrl+C and run npm run dev again.

5. Publish: make sure "draft: true" is gone, then commit and push to main.
   The site updates about a minute later. If the build fails, the old site
   stays up and the commit gets a red X on GitHub with the reason.
-->

Opening paragraph. The title and date above are added automatically, so start straight with the text. Delete any section below you don't need.

## Section heading

Regular text with **bold**, *italic*, ~~strikethrough~~ and `inline code`.
A single line break inside a paragraph is ignored; leave an empty line to start a new paragraph.

### Smaller heading

A [link to another site](https://github.com/hcbille), and a [link to another post](reading-nov26.md).

## Lists

- A bullet
- Another bullet
  - Indented two spaces for a nested bullet

1. A numbered step
2. Another step
3. The numbers can all be `1.` and still count up

## Quote

> A quote or callout. Every line starts with `>`.

## Code

```bash
# Any language name after the three backticks
gam print users fields primaryemail > users.csv
```

## Table

| System    | Owner | Status |
|-----------|-------|--------|
| Workspace | IT    | done   |
| Okta      | IT    | next   |

## Image

<!-- Anything inside these markers is hidden from the page, so use them for notes to yourself.
     For an image, put the file in blog/img/, then move this line out of the comment:
![What the image shows, for screen readers](img/my-image.png)
-->

## Fold-out section

<details>
<summary>Click to expand</summary>

Raw HTML works too, for things markdown can't do. Leave an empty line on both sides of markdown inside it.

</details>

---

A line with `---` on its own draws a divider, like the one above.
