# The Fairy Folio — Illustration Agency Website

**Tagline:** Where Imagination Meets Creativity
**Version:** 1.0 · Frontend-only build (HTML5 · CSS3 · vanilla JavaScript, no build step)

A portfolio-led website for The Fairy Folio, built from the SRS. It includes a home page, six category hubs, project detail pages, global search, bookmarks, a demo shop with cart, About Us, Contact, Careers/Internships and a floating chatbot.

---

## 0. What's new in this version

- **Splash screen** built from your logo (floating logo, sparkles, animated title, loading bar; click *Skip intro* to skip).
- **Animated hamburger** → X, with a slide-in drawer, blurred backdrop, staggered links, Services accordion, body-scroll lock, Esc/backdrop/link to close.
- Scroll progress bar, back-to-top button, shrinking sticky header, services marquee, refined cards, buttons and page transitions.
- Responsive polish for phones (320px+), tablets and large desktops; all animations respect *reduced motion*.

## 1. How to open it in Visual Studio Code

1. Unzip the folder and open it in VS Code (**File → Open Folder…** → `the-fairy-folio`).
2. Easiest: install the **Live Server** extension (Ritwick Dey), right-click `index.html` → **Open with Live Server**.
3. No extension? Just double-click `index.html` — it also works straight from the file system (no server needed, because content lives in `js/data.js`, not in fetched JSON).
4. Optional alternative: `python -m http.server 8080` in the project folder, then visit http://localhost:8080.

> Fonts (Fraunces, Nunito) load from Google Fonts. Offline, the site falls back to Georgia / system fonts and still works.

## 2. Project structure

```
the-fairy-folio/
├── index.html            Page shell: header, footer, search, modal, chatbot
├── css/styles.css        Design system, layout, responsive rules
├── js/
│   ├── data.js           ★ ALL CONTENT & CONFIG (edit this file)
│   ├── art.js            Palette-based placeholder artwork generator
│   └── app.js            Router, pages, search, bookmarks, cart, forms, chatbot
├── assets/img/
│   ├── logo.png          Your logo (transparent, cropped)
│   ├── logo-small.png    Header / footer / chatbot size
│   ├── favicon.png
│   └── portfolio/        ← put real artwork here
└── docs/
    ├── SITE_MAP.md       Navigation diagram
    └── TEST_CASES.md     Test cases & results
├── tests/e2e.py          Automated browser tests (optional, needs Playwright)
```

## 3. ⚠️ What you MUST replace before launch

The SRS requires genuine content only. Nothing here is invented as a real client, award or testimonial — but the portfolio is **sample content** so the layout can be seen:

| Item | Where | What to do |
|---|---|---|
| Project artwork & text | `FF_PROJECTS` in `js/data.js` | Add real images to `assets/img/portfolio/`, list them in `images: ["assets/img/portfolio/x.jpg", …]`, update title/description, set `sample: false` |
| Contact email | `FF_CONFIG.email` | Currently `hello@example.com` — **replace with the real address** |
| Social links | `FF_CONFIG.socials` | Add approved links only; hidden while empty |
| Shop products & prices | `FF_PRODUCTS` | Sample items — replace with real products or remove |
| Testimonials | `FF_TESTIMONIALS` | Empty = section hidden. Add only approved client quotes |
| Team members | About page | Shows roles only; add named profiles once members approve |
| Job openings | Careers page | None listed (general interest route only) |
| Sixth category | `FF_CATEGORIES` | Proposed "Editorial & Commercial Illustration" — confirm or rename (SRS note) |

Add a project: copy an object in `FF_PROJECTS`, give it a unique `id`, and set `cat` to a category `slug`. It appears in its hub, search, bookmarks and related-work automatically.

## 4. Feature checklist (mapped to the SRS)

| SRS | Feature | Notes |
|---|---|---|
| 1.6.1 | Home | Name, tagline, hero with logo, CTAs, six category entries, featured projects, process, team intro |
| 1.6.2 | Category hubs ×6 | Intro, cards (thumbnail, title, description, labels), filter by type, featured filter, sort, enquiry CTA |
| 1.6.3 | Project details | Multi-image gallery + lightbox, brief/approach/deliverables/tools, related work, enquiry action |
| 1.6.4 | Global search | Header button or press `/`; live results, full results page, empty state, Clear button |
| 1.6.5 | Bookmarks | Heart buttons with saved state, Bookmarks page, stored in `localStorage` (browser/device-specific) |
| 1.6.6 | Shop & cart | Product details modal, add/remove, quantities, subtotal/total. **Demo only** |
| 1.6.7 | Chatbot | Floating launcher, quick replies, FAQ matching with page links, fallback reply |
| 1.6.8 | About & process | Purpose, strengths, standards, roles, six-step workflow |
| 1.6.9 | Contact | Validated form, honest success/error states, email fallback |
| 1.6.10 | Careers | Opportunity types, "no openings" notice, general-interest form (no file uploads) |
| 1.6.11 | Navigation | Search, Bookmarks, About, Contact, chatbot on every page; breadcrumbs |
| 1.6.12 | UI | Hover states, subtle transitions, focus rings, responsive cards, footer |

## 5. Honest-behaviour rules built in (SRS 1.5)

- **Forms never fake success.** With no backend, the form says *"Your message has NOT been sent yet"* and offers an email-app link / copy button.
  To make forms real: create a Formspree (or similar) endpoint and paste its URL in `FF_CONFIG.formEndpoint`. The form then shows true success/error states.
- **Checkout is a demo.** The cart totals items; "Checkout (demo)" explains no order or payment occurred.
- **Chatbot** uses a curated FAQ and states it cannot submit enquiries, quote, or book.
- No API keys or credentials exist in the code.

## 6. Accessibility & performance

Skip link · semantic landmarks · keyboard-operable menus, dialogs (Esc closes, focus trapped and restored) · visible focus rings · labelled form fields with inline errors · alt text for all imagery · AA-contrast text colours (darker supporting shades of the palette are used for text) · `prefers-reduced-motion` respected · lazy-loaded images · no frameworks or heavy libraries.

## 7. Browser support

Current Chrome, Edge, Firefox and Safari. (Uses ES2015+, CSS Grid, `IntersectionObserver`.)

## 8. Known limitations

- Frontend-only: no database, accounts, real orders, payments or admin panel.
- Bookmarks/cart are per-browser (`localStorage`); private mode may not persist them.
- Placeholder artwork is generated SVG until real images are supplied.
- The **demonstration video (MP4)** required by the SRS must be screen-recorded by you from the finished site (e.g. OBS, Win+G, or QuickTime) — it can't be generated from code. A suggested shot list is at the end of `docs/TEST_CASES.md`.
- Optional extras requiring owner approval (live AI chatbot, payments, backend/CMS) are intentionally excluded.

## 9. Suggested next steps

Add real portfolio images → set email & socials → connect a form service → deploy (GitHub Pages / Netlify / Vercel: just upload the folder) → record the demo video.
