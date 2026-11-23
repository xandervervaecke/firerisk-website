# FireRisk website

 
### Run the website -> short version

1. Install **Node.js** (version 22, the "LTS" one) from <https://nodejs.org>. 
2. Open a terminal in this folder and run:

   ```bash
   npm install
   npm run dev
   ```

3. Open <http://localhost:5173> in your browser. The page updates every time you save a file.

### Add something new

Every folder has a file called `_template.md`. Always start from that file.

| To add | Copy this file | Into this folder |
|---|---|---|
| A team member | `_template.md` | `src/content/team/` |
| A news article | `_template.md` | `src/content/news/` |
| A work package | `_template.md` | `src/content/work-packages/` |

1. Copy `_template.md` and give it a new name, for example `jane-doe.md`. Use only small letters, numbers and `-`. This name becomes the web address (`/team/jane-doe`).
2. Fill in the fields at the top, between the `---` lines. Leave a field empty (`""`) if you don't know it. Empty fields are hidden on the website.
3. Write the text below the second `---`.
4. Put pictures in `public/images/...` and write the path like `/images/team/jane-doe.webp`.
5. Save. That's it. The website finds the new file by itself. You don't need to change anything else.

Tips:
- Files that start with `_` are not shown on the website.
- Write `draft: true` at the top to hide something without deleting it.
- If a value has a `: ` in it, put it between quotes: `position: "Researcher: fire models"`.

More details are in the sections below.

---

## Contents

1. [Quick start](#1-quick-start)
2. [Project structure](#2-project-structure)
3. [Editing content](#3-editing-content)
   - [Add a researcher](#add-a-researcher)
   - [Add a news article](#add-a-news-article)
   - [Add or edit a work package](#add-or-edit-a-work-package)
   - [Images, video and other assets](#images-video-and-other-assets)
   - [Site settings and partners](#site-settings-and-partners)
4. [Building and deploying](#4-building-and-deploying)
5. [How it works](#5-how-it-works)
6. [Content still to be supplied](#6-content-still-to-be-supplied)
7. [Credits](#7-credits)

---

## 1. Quick start

Requirements: **Node.js 20 or newer** (22 LTS recommended) and npm.

```bash
npm install        # install dependencies (once)
npm run dev        # start the development server at http://localhost:5173
```

The dev server reloads automatically when you save a Markdown, YAML or Vue file.

```bash
npm run build      # production build into dist/
npm run preview    # serve dist/ locally to check the production build
```

---

## 2. Project structure

```text
firerisk-website/
├── index.html                  HTML shell (default title, meta tags, favicon)
├── vite.config.js              Vite config (+ BASE_PATH for sub-folder hosting)
├── plugins/content.js          Build-time Markdown/YAML → JS loader
├── scripts/postbuild.mjs       Per-route SEO pages, 404.html, sitemap, robots.txt
├── public/                     Static files, copied as-is (served from "/")
│   ├── images/
│   │   ├── site/               General photography (home page, heroes)
│   │   ├── research/           Work package images
│   │   ├── news/               News images
│   │   └── team/               Profile photos
│   ├── videos/                 Hero video + poster frame
│   └── favicon.svg
└── src/
    ├── content/                ← ALL EDITABLE CONTENT
    │   ├── site.yaml           Site-wide settings (e-mail, URL, funding, socials)
    │   ├── partners.yaml       Consortium partners
    │   ├── work-packages/      One Markdown file per work package
    │   ├── team/               One Markdown file per person
    │   ├── news/               One Markdown file per article
    │   └── index.js            Content discovery (no need to edit)
    ├── components/             Reusable UI (Navbar, Footer, Hero, cards, …)
    ├── layouts/MainLayout.vue  Header + page transition + footer
    ├── pages/                  Home, Research, WorkPackage, Team, Profile,
    │                           News, Article, Contact, NotFound
    ├── router/index.js         Routes
    ├── composables/            Page metadata, scroll reveal, helpers
    ├── styles/                 main.css (design tokens, base), prose.css
    └── main.js                 App entry
```

### Routes

| URL | Page | Source |
|---|---|---|
| `/` | Home | `src/pages/Home.vue` |
| `/research` | Work package overview (filter with `?phase=before\|during\|after\|cross-cutting`) | `src/content/work-packages/*.md` |
| `/research/<file-name>` | Work package, e.g. `/research/wp1-wui-mapping` | `src/content/work-packages/<file-name>.md` |
| `/team` | Team overview | `src/content/team/*.md` |
| `/team/<file-name>` | Profile, e.g. `/team/jane-doe` | `src/content/team/<file-name>.md` |
| `/news` | News overview with category filter and search | `src/content/news/*.md` |
| `/news/<file-name>` | Article | `src/content/news/<file-name>.md` |
| `/contact` | Contact, end-user involvement, partners | `site.yaml`, `partners.yaml` |
| anything else | 404 page | `src/pages/NotFound.vue` |

**The file name is the URL.** Use lowercase letters, digits and hyphens only (`jane-doe.md`, not `Jane Doe.md`).

---

## 3. Editing content

Every content folder contains a `_template.md`. Files whose names start with `_` are ignored by the website, so copy the template, rename it and fill it in.

Markdown files start with a **frontmatter** block between `---` lines (YAML key–value pairs), followed by normal Markdown text. Leave a field empty (`""`) or delete it to hide it — empty fields and empty sections never appear on the site.

After adding or editing a file:
- in development (`npm run dev`) the change appears immediately;
- for the live site, rebuild and redeploy (automatic if you use the GitHub Pages workflow — just push).

### Add a researcher

1. Copy `src/content/team/_template.md` to `src/content/team/firstname-lastname.md`.
2. Fill in the frontmatter:

   ```yaml
   ---
   name: "Jane Doe"
   position: "Doctoral researcher"
   partner: KU Leuven              # an id from src/content/partners.yaml:
                                   # PXL, UH-CMK, UH-DFL, KU Leuven, INBO, UA
   photo: "/images/team/jane-doe.webp"
   email: "jane.doe@kuleuven.be"
   website: "https://…"
   linkedin: "https://www.linkedin.com/in/…"
   orcid: "0000-0000-0000-0000"
   work_packages: [WP2]
   order: 20                       # optional; lower = listed first
   ---
   ```

3. Write the body with `##` headings. Each heading becomes a section on the profile; sections you leave empty are hidden:

   ```markdown
   ## Biography
   Jane Doe is …

   ## Research interests
   - Microclimate
   - Remote sensing

   ## Publications
   - Doe, J. (2026). Title. *Journal*. https://doi.org/…
   ```

4. Add the photo to `public/images/team/` (see [images](#images-video-and-other-assets)).

The person now appears on `/team`, on `/team/firstname-lastname`, and in the "People" box of each work package listed in `work_packages`.

**Replacing a role placeholder.** The team currently contains one profile per staffed role in the project description (e.g. `phd-microenvironment.md`). When a person is appointed, either fill in `name`, `photo`, etc. in that file and remove `placeholder: true`, or rename the file to the person's name (this changes the URL).

### Add a news article

1. Copy `src/content/news/_template.md` to `src/content/news/<short-url-name>.md`, e.g. `2027-03-field-campaign-starts.md`.
2. Fill in the frontmatter:

   ```yaml
   ---
   title: "Field campaign starts in ten study areas"
   date: "2027-03-14"            # YYYY-MM-DD — sorts the overview, newest first
   category: "Research"          # free text; new categories become filter buttons
   image: "/images/news/field-campaign.webp"
   image_alt: "Researchers installing a microclimate logger"
   excerpt: "One or two sentences for the overview card and search engines."
   author: "Jane Doe"
   draft: false                  # true = hidden from the site
   ---
   ```

3. Write the article in Markdown. Use `##` for subheadings. Link to other pages with root-relative links, e.g. `[WP2](/research/wp2-microenvironment)` — they navigate without a page reload.

The newest article is automatically shown as the featured article on `/news` and appears on the home page.

### Add or edit a work package

Work packages live in `src/content/work-packages/` and are sorted by `number`.

```yaml
---
number: 4
title: "Mapping fire danger: fire spread modelling"   # full title
short_title: Fire spread modelling                    # used on cards and in menus
phase: before                # before | during | after | cross-cutting
theme: Wildfire danger — fire behaviour
lead: UH-CMK                 # partner id
partners: [PXL, KU Leuven, INBO]    # or [all]
image: /images/research/fire-front.webp
summary: >-
  One or two sentences for cards and search engines.
related: [WP1, WP2, WP3]     # "Connected work packages" box
contributions:               # optional "Partner expertise" list
  UH-CMK: Management scenario modelling
deliverables:
  - id: D4.1
    title: Comprehensive literature review on fire spread modelling
---

## Goals
…

## Tasks
### Task 4.1 — Literature review and model selection
…
```

To **add** one, copy `_template.md` to `wp11-short-name.md`. It will appear on `/research`, in the science-loop section on the home page (by `phase`) and in the partner cards on `/contact` — automatically.

### Images, video and other assets

- Put files in `public/` and reference them from Markdown/YAML with a path starting at `/`: `public/images/news/x.webp` → `/images/news/x.webp`.
- **Format:** WebP or JPEG. **Size:** about 1600 px wide for photos (≈150–300 kB). Profile photos: portrait, about 800 × 1000 px.
- **Responsive variant (optional):** also add a file with `-800` before the extension (`x-800.webp`, 800 px wide). The site detects it at build time and serves it to small screens and cards.
- Images inside Markdown: `![Alt text](/images/news/x.webp)` — always provide alt text.
- Converting an image with ffmpeg:

  ```bash
  ffmpeg -i photo.jpg -vf "scale=1600:-2" -c:v libwebp -quality 78 public/images/news/photo.webp
  ffmpeg -i photo.jpg -vf "scale=800:-2"  -c:v libwebp -quality 75 public/images/news/photo-800.webp
  ```

- **Hero video:** `public/videos/hero-wildfire.mp4` (1080p) and `hero-wildfire-720.mp4` (served on screens ≤ 900 px), plus `hero-poster.webp` (shown before the video loads, for reduced-motion users and as the default social sharing image). Keep the video short (10–30 s), muted, H.264, without audio:

  ```bash
  ffmpeg -i input.mp4 -an -vf "scale=1920:-2,fps=25" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart public/videos/hero-wildfire.mp4
  ```

- PDFs and other downloads: put them in `public/files/` and link to `/files/name.pdf`.

### Site settings and partners

- `src/content/site.yaml` — project e-mail, production URL (enables sitemap and canonical links), funding acknowledgement (footer), social media links, coordinating partner. Empty values are hidden.
- `src/content/partners.yaml` — name, short name, website, role and expertise of each consortium partner. The `id` is what work packages and profiles refer to. Lead/participation per work package is computed automatically from the work package files.

---

## 4. Building and deploying

```bash
npm run build
```

This creates `dist/`, a fully static site. Besides the app bundle, the post-build step writes:
- an `index.html` for **every route** (e.g. `dist/research/wp1-wui-mapping/index.html`) with the correct `<title>`, description and Open Graph tags — so deep links work on any static host without rewrite rules, and link previews show the right title;
- `404.html` for unknown URLs (the app then shows its own 404 page);
- `robots.txt`, and `sitemap.xml` + canonical links once `url` is set in `site.yaml`.

### GitHub Pages (workflow included)

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`. The site appears at `https://<user>.github.io/<repository>/`.
3. With a custom domain (e.g. `firerisk.be`): configure it under Settings → Pages, and remove the `BASE_PATH` line from the workflow (the site then lives at `/`).

### Other static hosts

Upload the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, a university web server, …).
- Build command: `npm run build` — output directory: `dist`.
- If the site is served from a sub-folder, build with that folder as base path:

  ```bash
  BASE_PATH=/firerisk/ npm run build
  ```

---

## 5. How it works

- `plugins/content.js` is a small Vite plugin. At build time it turns every `.md` file into `{ attributes, html, sections }` (frontmatter via `js-yaml`, Markdown via `markdown-it`) and every `.yaml` file into data. No Markdown parser is shipped to the browser.
- `src/content/index.js` uses `import.meta.glob` to discover all files in `team/`, `news/` and `work-packages/`, skips `_templates` and `draft: true`, and sorts them (work packages by number, news by date, team by `order` then name).
- Pages read from that module; dynamic routes (`/team/:slug`, `/news/:slug`, `/research/:slug`) look up the file by name and show the 404 page if it does not exist.
- `usePageMeta` sets the page title and meta tags on navigation; `scripts/postbuild.mjs` bakes the same metadata into the static HTML.
- Design tokens (colours, type, spacing) are CSS custom properties at the top of `src/styles/main.css`.
- Accessibility: semantic landmarks, skip link, visible focus states, keyboard-operable tabs and menu, `prefers-reduced-motion` support (animations off, video replaced by its poster), a pause button for the hero video, and AA contrast for text (orange text on light backgrounds uses the darker `--fire-ink`).

---

## 6. Content still to be supplied

All project facts on the site come from the *FireRisk scientific project description*. The following is **not** in that document and still needs input from the consortium:

| What | Where | Status on the site |
|---|---|---|
| Project e-mail address | `site.yaml → email` | "To be announced" on Contact |
| Production URL / domain | `site.yaml → url` | Needed for sitemap, canonical and absolute social-card URLs |
| Funding acknowledgement (the description refers to FWO reporting guidelines — please confirm the exact funder line) | `site.yaml → funding` | Hidden |
| Social media channels | `site.yaml → social` | Hidden |
| Names, photos, e-mail, biographies, interests and publications of all team members | `src/content/team/*.md` | 11 role-based profiles marked "Name to be announced / Profile details to be added" |
| Principal investigators / supervisors | new files in `src/content/team/` | Not shown |
| Official partner logos (with permission) | e.g. `public/images/partners/` | Partners are shown as typographic names |
| Exact URLs of the CMK research unit page and other partner sub-pages | `partners.yaml → website` | Main university sites used |
| Project start date and duration | could be added to `site.yaml` and the home page | Not shown |
| Real project news | `src/content/news/` | Three introductory articles based on the project description; review their dates and wording before launch |
| Names/details of the ten case study areas (once selected, D0.1) | Research page "Shared foundations" | Selection criteria only |
| Partner-specific contact persons | `partners.yaml` or team profiles | Not shown |

Please also double-check:
- the partner expertise lines (`partners.yaml`, and `contributions` in work package files), which were transcribed from the consortium table in section 3.4;
- the statistic cited on the home page: the WUI estimate of **14.8% refers to Belgium** (not Flanders) in the project description.

---

## 7. Credits

- Photography and hero video: [Pexels](https://www.pexels.com) (free to use under the Pexels license). Hero video: Pexels video 7543653 (mirrored and re-encoded). Photo IDs: 8602677, 37836110, 40040338, 1126386, 7279560, 11749416, 35352488, 14840720, 40102374, 8728555, 40700195, 3321802, 8145328, 4902032. They are illustrative and can be replaced with the consortium's own field photography.
- Typefaces: Inter and IBM Plex Mono (SIL Open Font License), self-hosted via Fontsource.
