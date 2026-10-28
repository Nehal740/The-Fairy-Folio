# Test Cases & Results — The Fairy Folio

**Method:** automated end-to-end run in headless Chromium (`tests/e2e.py`, 80 checks) plus visual review of screenshots at desktop (1366px), tablet (820px) and mobile (390px).
**Result:** 80 / 80 automated checks passed. Items marked ☐ need a human on real devices/browsers.

Re-run yourself: `pip install playwright && playwright install chromium && python tests/e2e.py`

| # | Area | Test | Result |
|---|---|---|---|
| 1 | Brand | Name "The Fairy Folio", tagline and logo appear in header, hero, footer, chatbot | ✅ |
| 2 | Home | Six category entry cards, featured projects, process, team intro | ✅ |
| 3 | Navigation | Every internal link across Home/About/Shop/Careers/Hub resolves (25 links) | ✅ |
| 4 | Navigation | Unknown routes (`#/nope`, `#/constructor`) show a friendly 404 | ✅ |
| 5 | Global | Search, Bookmarks, About, Contact, chatbot present on all 10 page types | ✅ |
| 6 | Hubs | All six hubs show ≥3 cards; first card opens the matching project detail | ✅ |
| 7 | Hubs | Type filter narrows; conflicting filters show empty state; reset restores; A→Z sort | ✅ |
| 8 | Detail | Gallery thumbnails switch image; lightbox opens and closes with Esc | ✅ |
| 9 | Detail | Related work shown; enquiry link carries category + project | ✅ |
| 10 | Bookmarks | Toggle updates aria-pressed + badge; persists after reload; page lists/empties | ✅ |
| 11 | Search | `/` opens overlay; live results; products found; empty state; Clear; Enter → results page; result opens project | ✅ |
| 12 | Shop | 8 products; Digital/Physical filter; product details modal | ✅ |
| 13 | Cart | Badge count; 2×$8 + $15 = $31.00; qty + → $39.00; remove → $16.00; clear → empty state | ✅ |
| 14 | Checkout | Explicitly states no order placed / no payment | ✅ |
| 15 | Contact | Prefill from project link; required-field errors; invalid email flagged | ✅ |
| 16 | Contact | With no form service: states message is **not sent**, offers email link + copy | ✅ |
| 17 | Careers | No fake openings; general-interest form | ✅ |
| 18 | About | Six-step process timeline | ✅ |
| 19 | Chatbot | Opens with greeting; quick replies; links in answers; won't claim to quote; fallback reply; Esc closes | ✅ |
| 20 | Accessibility | All images have alt; skip link; `main` landmark; every contact field labelled | ✅ |
| 21 | Responsive | No horizontal scroll at 390px and 820px (home, project, cart); mobile menu opens/closes | ✅ |
| 22 | Console | No JavaScript errors | ✅ |
| 23 | Browsers | Chromium tested. Firefox, Safari, Edge | ☐ manual |
| 24 | Devices | Real phone/tablet touch behaviour | ☐ manual |
| 25 | Screen reader | NVDA / VoiceOver pass | ☐ manual |

*Note:* Google Fonts could not load in the sandbox where tests ran; fallback fonts rendered and nothing broke.

## Suggested demonstration video shot list (MP4, ~3–4 min)

1. Home hero, scroll through categories, featured work, process (0:30)
2. Open a category hub → use filters/sort → open a project → gallery + lightbox → related work (0:60)
3. Save a project with the heart → open Bookmarks (0:20)
4. Press `/` → search "wedding" → open a result (0:20)
5. Shop → product details → add to cart → change quantity → show totals → demo checkout notice (0:40)
6. Chatbot quick replies and a typed question (0:20)
7. About, Careers, Contact form (show validation + honest "not sent" message) (0:30)
8. Resize to mobile width / use device toolbar; open the menu (0:20)

Record with OBS Studio, Win+G (Xbox Game Bar), or QuickTime; export as MP4.
