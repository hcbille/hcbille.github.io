---
name: hcbille.se
description: HC Bille's personal site, built as a working Solarized Dark terminal.
colors:
  base03: "#002b36"
  base02: "#073642"
  base01: "#586e75"
  base00: "#657b83"
  base0: "#839496"
  base1: "#93a1a1"
  base2: "#eee8d5"
  blue: "#268bd2"
  blue-text: "#3e96d2"
  blue-bar: "#56a1d3"
  yellow: "#b58900"
  yellow-bar: "#bc951c"
  orange-text: "#d4754a"
  cyan: "#2aa198"
  cyan-bar: "#42aa9f"
  green: "#859900"
  magenta-text: "#db6899"
  violet-text: "#9496c9"
  red: "#dc322f"
  trans-blue: "#5bcefa"
  trans-pink: "#f5a9b8"
  trans-white: "#ffffff"
typography:
  body:
    fontFamily: "Cousine, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  headline:
    fontFamily: "Cousine, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.55
  label:
    fontFamily: "Cousine, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  ascii-art:
    fontFamily: "Cousine, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  box: "3px"
spacing:
  half-line: "0.5lh"
  line: "1lh"
  section: "2lh"
  gutter: "2ch"
  column-gap: "3ch"
components:
  tab:
    textColor: "{colors.base1}"
    typography: "{typography.label}"
    padding: "0.25lh 1.5ch"
  tab-active:
    backgroundColor: "{colors.base03}"
    textColor: "{colors.base2}"
    typography: "{typography.headline}"
    padding: "0.25lh 1.5ch"
  box:
    backgroundColor: "{colors.base03}"
    rounded: "{rounded.box}"
    padding: "1lh 2ch"
  box-label:
    backgroundColor: "{colors.base03}"
    textColor: "{colors.yellow}"
    padding: "0 1ch"
  badge-open:
    backgroundColor: "{colors.green}"
    textColor: "{colors.base03}"
    height: "1lh"
  badge-merged:
    backgroundColor: "{colors.violet-text}"
    textColor: "{colors.base03}"
    height: "1lh"
  badge-mode:
    backgroundColor: "{colors.blue-text}"
    textColor: "{colors.base03}"
    height: "1lh"
  status-line:
    backgroundColor: "{colors.base02}"
    textColor: "{colors.base1}"
    padding: "0 1ch"
  palette:
    backgroundColor: "{colors.base02}"
    textColor: "{colors.base1}"
    padding: "0.5lh 1.5ch"
    width: "min(60ch, calc(100vw - 4ch))"
  palette-item-selected:
    backgroundColor: "{colors.base03}"
    textColor: "{colors.base2}"
---

# Design System: hcbille.se

## Overview

**Creative North Star: "The Working Terminal"**

The site is HC's actual daily environment opened to visitors: a tmux-style tab bar across the top, a vim-style status line at the bottom, a neofetch card on the overview, and every page shown as a markdown file with line numbers. Nothing is staged as "terminal-flavoured web design". Each element behaves like something a real terminal would draw, and the site still works as a fast, accessible web page underneath.

Everything sits on one character grid. There is one typeface at one size; hierarchy comes from colour, weight and markdown syntax (`#`, `##`, `- `, `>`), not from scale. Space is measured in character widths (`ch`) and line heights (`lh`), so every gap lines up with the text. Boxes, rules and badges look drawn in characters: 1px lines, labels sitting on borders, badges as filled text cells. The palette is Solarized Dark, and only dark: the identity is a commitment (see PRODUCT.md), not a theme option.

The one deliberate break from Solarized is the logo, banded in trans flag colours. It is personal and it stays.

**Key Characteristics:**
- Solarized Dark only; no light mode (print is the one exception).
- One monospace face (Cousine), one size per breakpoint, weight 400 and 700 only.
- Spacing in `ch` and `lh`; nothing in arbitrary pixels.
- Flat: no shadows, no gradients except the code-fence gutter.
- Terminal chrome: sticky tab bar, sticky status line with a mode badge, `:` command palette.
- Markdown made visible: line-number gutters, `#` heading marks, `~` end-of-file lines.
- Works without JavaScript; every section shows.

## Colors

Canonical Solarized Dark, with a small set of accent variants lightened just enough to pass 4.5:1 text contrast.

### Primary
- **Solarized Blue** (`blue`): focus rings and the command palette border. Decoration and outlines, never text.
- **Link Blue** (`blue-text`): every link on the main background, the field names in the neofetch card, and the NORMAL mode badge. Lightened from Solarized Blue for contrast on base03.
- **Bar Blue** (`blue-bar`): the same role on the base02 bars.

### Secondary
- **Solarized Yellow** (`yellow`): box labels sitting on borders, `##` headings in documents, the COMMAND mode badge.
- **Bar Yellow** (`yellow-bar`): the phone menu button on the tab bar.
- **Burnt Orange** (`orange-text`): link hover everywhere, and `#` page titles in documents. Orange is the "you're touching this" colour.

### Tertiary
- **Solarized Cyan** (`cyan`): `###` headings, inline code, the ASCII logo's base colour. **Bar Cyan** (`cyan-bar`) is the tab-bar clock.
- **Solarized Green** (`green`): the shell prompt `$`, the palette's selection caret, "open" badges.
- **Soft Violet** (`violet-text`): "merged" badges and the status-line accent.
- **Soft Magenta** (`magenta-text`): the resume download links only.
- **Solarized Red** (`red`): "closed" badges only.
- **Trans Blue, Trans Pink, White** (`trans-blue`, `trans-pink`, `trans-white`): the banded ASCII logo, and nowhere else.

### Neutral
- **Deep Teal Night** (`base03`): the page background; also cut-outs behind box labels and the active tab.
- **Teal Shadow** (`base02`): the bars (tab bar, status line, command palette) and the code-fence fill.
- **Slate Grey** (`base01`): decoration only. Box borders, line numbers, `~` lines, the logo's drop shadow, rules.
- **Sea Grey** (`base00`): available as `--background3`; rarely used.
- **Body Grey** (`base0`): body paragraphs and list items, secondary text, dates (4.75:1).
- **Light Grey** (`base1`): primary text, headings without colour, tab labels, bold text.
- **Parchment** (`base2`): the brightest text. Active tab, selected palette item, hovered tab, phone intro name.

### Named Rules
**The Decoration Grey Rule.** Slate Grey (base01) never carries readable text. It is for borders, line numbers and markers only; any text a visitor must read is base0 or brighter.

**The Lightened Accent Rule.** Accent text on base03 uses its `-text` variant and on base02 its `-bar` variant. The raw Solarized hue is for borders, badges and decoration, unless it already passes 4.5:1 there.

**The Solarized-Only Rule.** No colour outside Solarized and its contrast variants, except the trans flag colours in the logo. Print swaps to black on white; the screen never does.

## Typography

**Body Font:** Cousine (self-hosted woff2, latin and latin-ext, 400 and 700), falling back to ui-monospace, SF Mono, Menlo, monospace.

**Character:** a plain, even monospace with clear letterforms. It reads like a real terminal font, not a "coding aesthetic" font, and keeps long CV prose comfortable.

### Hierarchy
- **Headline** (700, 14px, 1.55): every heading, from page title to section. Distinguished by colour (orange `#`, yellow `##`, cyan `###`) and the visible markdown mark, never by size.
- **Body** (400, 14px, 1.55): paragraphs and lists in Body Grey; documents cap at 90ch, the main area at 120ch.
- **Label** (400, 14px, 1.55): tabs, box labels, status line, badges, `dt` keys. Same face and size as body; colour and placement do the work.
- **ASCII art** (400, 14px, 1.2): the neofetch logo only, tighter so the art holds together; 11px on phones.

Phones (≤760px) step the whole system to 15px. Print sets 9.5pt with a 15pt name in the print header.

### Named Rules
**The One Size Rule.** All screen text is one size per breakpoint. If something needs more emphasis, use bold, a brighter neutral, an accent, or a markdown mark. Never a bigger font.

**The Visible Syntax Rule.** Document headings, list items, quotes and rules show their markdown characters (`# `, `- `, `> `, `---`). These marks are hidden from screen readers with empty alt text.

## Layout

The page is a full-height column: sticky tab bar, a centred main area (max 120ch, padding 2lh 2ch), and a sticky bottom with the credits line and the status line. With JavaScript, one section shows at a time, like switching tabs. Without it, all sections stack with 3lh between them.

The overview opens with the intro, then a grid of framed boxes with 2lh between rows: the neofetch card and the case-study box full width, then paired rows that split 1.25fr / 1fr with a 3ch column gap. Documents (experience, about, blog posts) run in a single column up to 90ch with a 5ch line-number gutter.

Rhythm runs in line heights: 0.5lh between list items and small blocks, 1lh inside boxes, 2lh between sections. Horizontal space runs in characters: 1ch, 1.5ch, 2ch, 3ch, 4ch.

**Phones (≤760px):** tabs become one row that scrolls sideways, and the clock and spacer drop out. The grid collapses to one column in this order: the who-and-what intro, the contact box, the case-study box, then the rest. Credits scroll with the page; only the status line stays pinned. The gutter shrinks to 4ch. PR rows put the badge, number and repo on one line and the title below it, full width and clamped to two lines.

**Print:** a plain black-on-white A4 resume (14mm × 16mm margins). Chrome, overview, now, case study and blog are hidden; line numbers and markdown marks go away.

### Named Rules
**The Grid Unit Rule.** Spacing is in `ch` and `lh`. If a value can't be written in those units, it probably doesn't belong.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth comes from two tones only: base03 for content and base02 for chrome (bars, palette, code fences). The command palette, the one floating layer, is set apart by a 1px Solarized Blue border, not a shadow. The ASCII logo's "drop shadow" is drawn in characters (base01), which is the only kind of shadow this system allows.

### Named Rules
**The Two-Tone Rule.** Something is either content (base03) or chrome (base02). A third surface tone or a box-shadow means the design has left the terminal.

## Shapes

Square, line-drawn forms. Boxes have a 1px Slate Grey border with a barely softened 3px corner, like a TUI box-drawing frame, and their label sits on the top border with a background cut-out. Tab-bar buttons have a 1px border and square corners. Badges are filled text cells exactly 1lh tall, inset 1ch on each side. Rules are drawn with characters (`────`, `---`), or a single 1px line at most.

## Components

Every component looks drawn in a character grid: 1px rules, labels on borders, filled text cells, no soft UI.

### Tab Bar
- **Style:** sticky, base02 background, tab labels named like files (`~ overview`, `about.md`).
- **States:** default Light Grey; hover Parchment; active tab cuts through to base03 with bold Parchment text (`aria-current="page"`).
- **Right side:** a Bar Cyan clock (`sthlm 13:50:37`), hidden on phones, where a Bar Yellow `[≡ 1/8]` menu button appears instead.

### Framed Box
- **Corner Style:** 3px; 1px Slate Grey border; padding 1lh 2ch.
- **Label:** Solarized Yellow text on the top-left border, 1ch padding, base03 cut-out. A label can link to its full tab (`about.md →`); it turns orange on hover.
- **Use:** overview panels only (about, case study, experience, contact, now, projects).

### Document View
- **Style:** a markdown file with a right-aligned line-number gutter (3ch numbers in a 5ch gutter, base01).
- **Headings:** `#` orange, `##` yellow, `###` cyan, all bold. Lists use `- `, ordered lists `1. `, quotes `> ` in italic Light Grey.
- **Code:** inline code in cyan; code fences fill base02 from the gutter edge and scroll sideways.
- **End:** `~` lines in base01 mark the end of the file, as in vim.

### Badges
- **Style:** filled text cells 1lh tall, base03 text on the badge colour.
- **Variants:** open (green), merged (Soft Violet), closed (red), mode NORMAL (Link Blue), mode COMMAND (yellow).

### Status Line
- **Style:** sticky bottom bar in base02: a mode badge, the current branch/file (`main › overview`), and on the right the tab position and the `press : for commands` hint (hint hidden on phones).
- **Credits:** on the overview only, a line above it styled as a shell command (`$ cat CREDITS.md`, green prompt).

### Command Palette
- **Style:** fixed, 15vh from the top, centred, `min(60ch, 100vw − 4ch)` wide, base02 with a 1px Solarized Blue border.
- **Input:** borderless, inherits the font; the list sits under a 1px base01 rule.
- **Selection:** the selected row cuts to base03 with Parchment text and a green `›` caret; hints sit right-aligned.

### Links
- **Style:** Link Blue, underlined with a 2px offset. Hover turns Burnt Orange. Resume downloads are Soft Magenta, with a `↓` mark.
- **PR rows:** one line each on desktop; the title truncates with `…` so the repo name always shows; no underline, orange on hover. Phones use two-line titles (see Layout).

### Neofetch Card (signature)
The overview's `about.md` box: the banded trans-flag ASCII logo with a base01 character shadow beside a `root@hcbille` key/value list (Link Blue bold keys, `:` separator, Body Grey values) under a character rule. The fields keep the neofetch idiom but carry the pitch: Name, Pronouns, Role, Host, Location, Uptime, Users, then `Looking for` and `Proof`. No theme details or colour swatches: the card's space goes to HC, not the setup. It is the site's most recognisable element.

### Intro
The overview opens, at every width, with a `$ whoami` command line, the page's only `h1` (`HC Bille · Systems Architect`, Parchment and cyan) and a yellow `looking for:` line. It sits above the neofetch card with no box around it.

### Focus
All interactive elements get a 2px Solarized Blue outline with a 2px offset on `:focus-visible`. Sections and headings that receive programmatic focus on tab change show no outline.

## Do's and Don'ts

### Do:
- **Do** size everything in `ch` and `lh`, and keep text at the one breakpoint size (14px, 15px on phones).
- **Do** use the `-text` accent variants on base03 and the `-bar` variants on base02 for any readable accent text.
- **Do** show markdown syntax in documents and hide it from screen readers with empty alt text (`content: "# " / ""`).
- **Do** frame new overview content in a Framed Box with a yellow label on the border.
- **Do** keep every section readable without JavaScript and keep the print stylesheet producing a clean resume.
- **Do** keep the Bar Yellow, Bar Cyan, Burnt Orange and other contrast variants at 4.5:1 or better.

### Don't:
- **Don't** add a light theme, a theme toggle, or any colour outside Solarized (the trans flag logo is the only exception).
- **Don't** use a second typeface, a larger heading size, or weights other than 400 and 700.
- **Don't** add shadows, gradients, blur, or a third surface tone.
- **Don't** use Slate Grey (base01) for text a visitor has to read.
- **Don't** use rounded pill buttons, cards with soft corners, or icon fonts; draw it in characters instead.
- **Don't** add motion for decoration; the system currently has no transitions or animations.
