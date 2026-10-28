# Site Map — The Fairy Folio

```mermaid
flowchart TD
  H[Home  #/]
  H --> S[Services: six category hubs]
  S --> C1[Children's Book Illustration]
  S --> C2[Character Design]
  S --> C3[Wedding Illustration]
  S --> C4[Book Cover Design]
  S --> C5[Merch & Digital Products]
  S --> C6[Editorial & Commercial Illustration]
  C1 & C2 & C3 & C4 & C6 --> PD[Project detail  #/project/:id]
  PD --> REL[Related projects]
  PD --> ENQ
  C5 --> SHOP[Shop  #/shop]
  SHOP --> PM[Product details modal]
  SHOP --> CART[Cart  #/cart]
  CART --> DEMO[Demo checkout notice]
  H --> ABOUT[About Us & Process  #/about]
  H --> CAREERS[Careers & Internships  #/careers]
  H --> ENQ[Contact / Project Enquiry  #/contact]
  H --> BM[Bookmarks  #/bookmarks]
  H --> SR[Search results  #/search?q=]
  subgraph Global — on every page
    G1[Header nav] --- G2[Search overlay] --- G3[Bookmarks] --- G4[Cart] --- G5[Chatbot] --- G6[Footer]
  end
```

## Routes

| Route | Page |
|---|---|
| `#/` | Home |
| `#/category/<slug>` | Category hub (`childrens-book`, `character-design`, `wedding`, `book-cover`, `merch-digital`, `editorial-commercial`) |
| `#/project/<id>` | Project detail |
| `#/shop` | Merch & digital shop (demo) |
| `#/cart` | Demo cart |
| `#/bookmarks` | Saved projects & products |
| `#/search?q=<term>` | Full search results |
| `#/about` | About Us & creative process |
| `#/careers` | Careers & internships |
| `#/contact?category=<slug>&project=<id>` | Enquiry form (optionally prefilled) |

## Workflows

**Client enquiry:** Home → hub → project → *Enquire about similar work* → Contact (prefilled) → validate → email app / form service.
**Shopping (demo):** Shop → product modal → Add to cart → Cart → quantity/remove → totals → Checkout (demo notice).
**Discovery:** Search (`/`) → result → project → related work → bookmark → Bookmarks page.
