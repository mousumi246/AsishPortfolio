# Asish Kumar Sahoo — portfolio website

A one-page portfolio for a presentation design consultant. The page is styled as a slide being edited in PowerPoint (rulers, alignment guides, a speaker-notes pane), then switches into "slide show" for the work.

## What is in this folder

| Path | What it is |
| --- | --- |
| `index.html`, `assets/`, `works/`, `favicon.svg`, `.nojekyll` | The finished website. This is what GitHub Pages serves. |
| `Asish_Sahoo_Resume.pdf` | The résumé behind every "Download résumé" button. |
| `works/` | Slides rendered from the decks in the Google Drive folder (WebP, full size and thumbnail). |
| `source/` | The editable React + TypeScript + Tailwind project that produces the website. You only need it to change content or design. |

## Preview it

Double-click `index.html` to open the site in your browser. Everything except the portrait (loaded from Unsplash) and the Google Drive links works offline.

## Put it online with GitHub Pages

1. Create a new repository on GitHub (for example `portfolio`, or `<your-username>.github.io` for a root address).
2. Upload **everything in this folder** to the repository, including the hidden `.nojekyll` file. On the GitHub website: **Add file → Upload files**, drag the files and folders in, then **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick **main** and **/ (root)**, and save.
4. After a minute or two the site is live at `https://<your-username>.github.io/<repository-name>/`.

All paths in the site are relative, so it works at either address without changes.

> Tip: on a Mac, hidden files such as `.nojekyll` don't show in Finder. Press <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> to show them before dragging.

## Change the content

All text lives in one file: `source/src/data/portfolio.ts`.

- **Name, email, phone, LinkedIn, summary, typewriter phrases**: the `person` object.
- **Portrait**: `person.portrait`. It currently points at the Unsplash photo supplied for the site. To use a real photo, put it in `source/public/` (for example `asish.jpg`) and set `portrait: asset("asish.jpg")`.
- **Projects**: the `projects` list. Each project has its slides, brief, "what I did" notes, tools and a Google Drive link.
- **Experience, skills, recognition, education**: the lists below the projects.

### Adding slide images for the Fractal and Odessa decks

Those two decks (8.4 MB and 12.5 MB) were too large to fetch automatically, so the site shows them as an outline with a link to the original in Google Drive. To show real slides:

1. Export the slides as images (PowerPoint: **File → Export → PNG**, or save as PDF and convert).
2. Save them as `source/public/works/fractal/01.webp`, `01-sm.webp` (a ~960 px wide thumbnail), `02.webp`, and so on. JPG works too if you change the extension in the data file.
3. In `portfolio.ts`, fill that project's `slides: []` the same way the other projects do, for example `s("fractal", 1, "Redefining the AI-powered enterprise", "Final")`.
4. Rebuild (below).

## Rebuild after editing

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
cd source
npm install
npm run dev      # live preview at http://localhost:5173
npm run build    # writes the finished site to source/dist
```

Then copy everything inside `source/dist/` over the files at the top of this folder (or of your repository) and commit.

## How the project is set up

- **Vite + React 18 + TypeScript**, styled with **Tailwind CSS 3**.
- **shadcn/ui structure**: `components.json` at the root, the `@/` import alias, shared helpers in `src/lib/utils.ts`, and reusable components in `src/components/ui/`. Keeping UI primitives in `components/ui` is what the shadcn CLI expects, so `npx shadcn add <component>` will drop new components next to these without any path changes.
- **Integrated components** (in `src/components/ui/`):
  - `glass-folder-cards.tsx`: copied as supplied. Each project is a frosted-glass folder; its files are the deck's slides.
  - `perspective-tunnel-hero.tsx`: adapted. The original captured the mouse wheel and called `preventDefault()`, which stopped the page from scrolling past it and never moved on phones (touch screens don't send wheel events). It is now driven by normal page scroll through a sticky stage, takes the slides as a prop, and opens a deck when a slide is clicked.
  - Demos for both components are in `src/demos/`.
- **Motion**: `framer-motion` for reveals, the typewriter, the before/after slider, the case-study viewer and the tunnel; `lenis` for smooth scrolling. Everything honours the "reduce motion" accessibility setting.
- **Fonts**: Archivo (variable, with a width axis) is bundled with the site, so nothing loads from Google Fonts.

## Credits

- Portrait: Unsplash (photo `1519085360753-af0119f7cbe7`), used as supplied.
- Slide images: rendered from Asish's own decks in the shared Google Drive folder.
