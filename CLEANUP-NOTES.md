# L42i — cleanup notes & "what is managed where"

A map of the cleaned-up project: where layout, routing, and content live, and how
to control each.

---

## Routing model (the important part)

**Folders = menu categories. URLs are flat by default, hierarchical only where
you opt in.**

- Content lives in `src/content/<category>/*.md`. The folder name is the category
  (it drives the menu and the `/category` listing pages). These files are **not**
  routed by Astro directly, so there are no stray unstyled pages.
- `src/pages/[...id].astro` is the engine. It reads everything in `src/content/`
  and decides each URL:
  - **Flat by default:** `src/content/projects/mesh.md` → `/mesh`
  - **Nested if you opt in:** `src/content/courses/dsp.md` → `/courses/dsp`
- You choose which categories are nested in ONE place, at the top of
  `getStaticPaths` in `[...id].astro`:

  ```js
  const NESTED_CATEGORIES = new Set(['courses', 'events']);
  ```

  Anything not in that set is flat. To make a category hierarchical, add its
  folder name here. To flatten one, remove it. That's the only switch.

- Each category folder also gets a listing page at `/<category>`
  (`/projects`, `/courses`, …), and its links automatically point to the right
  URL (flat or nested) per the rule above.

### Why this resolves the `bikes` clash
There are two `bikes.md` (a project and a course). With `courses` nested they no
longer collide: the project is `/bikes`, the course is `/courses/bikes`. If you
ever flatten `courses`, they'd clash again — the build won't crash, it'll keep
the first and print a `[routing] Duplicate URL "/bikes"` warning naming both
files.

---

## Where to control layout

**Everything site-wide is in `src/styles/global.css`.** Edit the variables at the
top and the whole site follows:

| Variable           | Controls                                            |
| ------------------ | --------------------------------------------------- |
| `--content-width`  | width of normal (flat/article) pages (800px)        |
| `--wide-width`     | width of category listing pages + header (1024px)   |
| `--content-pad`    | inner padding of the page column                    |
| `--text-color`     | body text                                           |
| `--heading-color`  | headings + bold text                                |
| `--link-color`     | links                                               |
| `--font-sans`      | the whole site's font stack                         |
| `--image-width`    | default width of images inside content (80%)        |
| `--image-radius`   | corner rounding on content images + carousel        |

The file is organized in numbered sections (base, page columns, markdown
content, utilities, listing pages, carousel). Styling meant only for one
component stays scoped inside it (header bar in `Header.astro`, nav pills in
`Navigation.astro`).

---

## What each file manages

```
src/
  layouts/
    BaseLayout.astro   ← page shell: <head>, <Header/>, <main> wrapper. Imports
                         global.css, loads carousel.js. `variant` prop:
                         "article" (narrow, default) or "wide" (listings).
  components/
    Header.astro       ← sticky top bar + logo (self-contained styles).
    Navigation.astro   ← the menu. Edit the `categoryLinks` array to change
                         menu labels / order. (Labels are editorial; routing
                         doesn't depend on them.)
  styles/
    global.css         ← ALL site-wide layout. Start here for any look change.
  scripts/
    carousel.js        ← the only carousel behavior on the site.
  content/             ← YOUR CONTENT. One .md per page, grouped by category
    projects/  lab/  3d-contest/   → flat URLs  (/bikes, /3dbox, ...)
    courses/                       → nested URLs (/courses/dsp, ...)
  pages/
    index.md           ← homepage ("/"). Uses BaseLayout via `layout:` frontmatter.
    404.astro          ← not-found page.
    [...id].astro      ← the routing engine (flat/nested policy lives here).
```

### Add a page
Drop a `.md` file into the matching `src/content/<category>/` folder. Optional
frontmatter:

```markdown
---
title: My Page Title          # optional; falls back to first "# H1", then slug
description: One-line summary  # optional; shown on the category listing page
---

# My Page Title
...content...
```

### Add a new category (e.g. "events")
1. Create `src/content/events/` and add `.md` files.
2. Add it to the menu: a new entry in `categoryLinks` in `Navigation.astro`.
3. Flat or nested? Leave it out of `NESTED_CATEGORIES` for flat, or add
   `'events'` to that set for `/events/<slug>` URLs.

### Carousel
Put this in any markdown file (buttons are added automatically):

```html
<div class="md-carousel">
  <div class="md-carousel-track">
    <img src="/assets/.../one.png" alt="..." />
    <img src="/assets/.../two.png" alt="..." />
  </div>
</div>
```

### Images
Assets live on the server under `/assets/...` (not in this repo). Reference them
with an **absolute** path starting `/assets/...` — never a relative
`../../public/...` path, which breaks the build.

---

## What changed in this cleanup

- Moved content out of `src/pages/` into `src/content/` so Astro no longer emits
  a second, unstyled copy of every page at its folder path. URLs are now flat
  (or nested where you choose), with nothing duplicated.
- Made the flat-vs-nested choice a one-line config (`NESTED_CATEGORIES`).
- Fixed the build (homepage image used a relative `../../public/...` path).
- Consolidated all layout CSS into one variable-driven `global.css` (it was
  duplicated across three files with conflicting widths).
- Removed invalid markup that had been pasted into `global.css`.
- Replaced two broken/duplicated carousel scripts with one working `carousel.js`.
- Deleted dead files (`index._astro`, `Sidebar.astro`, `Carousel.astro`) and dead
  imports/variables.
- Added a title fallback (frontmatter → first H1 → prettified slug).
- Fixed the two `/projects/bikes` links in `courses/bikes.md` to the flat `/bikes`.
- Minor: named `package.json`, set `site:` in `astro.config.mjs`.

---

## Commands

```sh
npm install        # once
npm run dev        # local dev at http://localhost:4321
npm run build      # static build into ./dist
./deploy.sh        # scp dist/* to the server
```
