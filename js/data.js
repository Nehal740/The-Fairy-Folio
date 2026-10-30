/* ==========================================================
   THE FAIRY FOLIO — CONTENT & CONFIGURATION
   ----------------------------------------------------------
   This is the ONLY file you need to edit to change content.
   - CONFIG ........ contact details, form endpoint, socials
   - CATEGORIES .... the six service hubs
   - PROJECTS ...... portfolio items (swap in real artwork!)
   - PRODUCTS ...... shop items for the demo catalogue / cart
   - FAQ ........... chatbot questions and answers
   ----------------------------------------------------------
   IMPORTANT: Every project and product below is a SAMPLE
   ENTRY with generated placeholder artwork. Replace titles,
   descriptions and images with real, approved work, then set
   `sample: false` so the "Sample" badge disappears.
   To use real artwork: put files in assets/img/portfolio/
   and list them in `images: ["assets/img/portfolio/x.jpg"]`.
   ========================================================== */

window.FF_CONFIG = {
  brand: "The Fairy Folio",
  tagline: "Where Imagination Meets Creativity",

  // TODO: replace with the agency's real, approved email address.
  email: "thefairyfolio@gmail.com",

  // Optional: paste a form-service URL (e.g. Formspree "https://formspree.io/f/xxxx").
  // While empty, forms are clearly labelled as NOT sent and offer an email fallback.
  formEndpoint: "",

  // Add approved links only, e.g. { label: "Instagram", href: "https://instagram.com/..." }
  socials: [
  { label: "Instagram", href: "https://www.instagram.com/thefairyfolio/" }
],

  currency: "$"
};

window.FF_CATEGORIES = [
  {
    slug: "childrens-book",
    name: "Children's Book Illustration",
    short: "Picture books & story scenes",
    kind: "children",
    icon: "📖",
    intro: "Warm, character-led artwork that carries a story from the first spread to the last page. We illustrate picture books, early readers and story scenes for authors and publishers.",
    covers: ["Picture-book artwork", "Story scenes & spreads", "Character-led narratives", "Publishing-ready files"],
    filters: ["Picture book", "Spread", "Early reader", "Story scene"]
  },
  {
    slug: "character-design",
    name: "Character Design",
    short: "Original characters & concept art",
    kind: "character",
    icon: "🧚",
    intro: "From first sketch to final turnaround, we design original characters with personality — expression sheets, poses, concept art and character commissions.",
    covers: ["Original characters", "Expression sheets & poses", "Turnarounds", "Concept art"],
    filters: ["Expression sheet", "Turnaround", "Concept art", "Commission"]
  },
  {
    slug: "wedding",
    name: "Wedding Illustration",
    short: "Portraits, invitations & keepsakes",
    kind: "wedding",
    icon: "💍",
    intro: "Custom illustrations that celebrate a couple's story — portraits, venue artwork, invitations, stationery and personalised keepsakes.",
    covers: ["Custom couple portraits", "Venue illustrations", "Invitations & stationery", "Personalised keepsakes"],
    filters: ["Couple portrait", "Venue", "Invitation", "Keepsake"]
  },
  {
    slug: "book-cover",
    name: "Book Cover Design",
    short: "Illustrated covers & layouts",
    kind: "cover",
    icon: "📚",
    intro: "Covers that sell the story. Illustrated concepts, typography-led layouts and genre-appropriate designs for authors and publishers.",
    covers: ["Illustrated covers", "Cover concepts", "Typography-led layouts", "Genre-appropriate design"],
    filters: ["Illustrated cover", "Typographic", "Concept", "Series"]
  },
  {
    slug: "merch-digital",
    name: "Merch & Digital Products",
    short: "Printables, stickers & assets",
    kind: "merch",
    icon: "🛍️",
    intro: "Illustration you can use, print and wear — printable art, digital downloads, sticker packs, illustration assets and T-shirt designs.",
    covers: ["Printable art", "Sticker packs", "Illustration assets", "T-shirt designs"],
    filters: ["Printable", "Sticker pack", "Asset pack", "T-shirt design"]
  },
  {
    slug: "editorial-commercial",
    name: "Editorial & Commercial Illustration",
    short: "Brands, campaigns & publications",
    kind: "editorial",
    icon: "🎨",
    intro: "Illustration with a message — editorial artwork, promotional visuals and campaign illustrations for brands and publications.",
    covers: ["Editorial artwork", "Promotional illustration", "Campaign visuals", "Brand illustration"],
    filters: ["Editorial", "Campaign", "Brand", "Promotional"]
  }
];

/* ---------- PORTFOLIO (SAMPLE ENTRIES — replace with real work) ---------- */
window.FF_PROJECTS = [
  // Children's Book
  { id: "cb-1", cat: "childrens-book", title: "Sample: The Moonlit Meadow", type: "Picture book", style: "Soft watercolour", featured: true, sample: true,
    desc: "A sample picture-book project showing a bedtime story told through gentle, glowing spreads.",
    brief: "A bedtime picture book for ages 3–6 needing a calm, dreamy world.",
    approach: "Soft washes, a limited night-time palette and a recurring small character to guide young readers across each spread.",
    deliverables: ["32-page interior spreads", "Cover artwork", "Print-ready files"], tools: ["Procreate", "Photoshop"], images: [] },
  { id: "cb-2", cat: "childrens-book", title: "Sample: Pip and the Paper Boat", type: "Spread", style: "Textured gouache", featured: false, sample: true,
    desc: "A sample double-page spread demonstrating composition for read-aloud storytelling.",
    brief: "A single hero spread to pitch a story to a publisher.",
    approach: "Strong focal point, room for text, and playful details that reward a second look.",
    deliverables: ["Colour spread", "Black & white sketch", "Text-safe layout"], tools: ["Procreate"], images: [] },
  { id: "cb-3", cat: "childrens-book", title: "Sample: Alphabet Garden", type: "Early reader", style: "Bright & bold", featured: false, sample: true,
    desc: "A sample early-reader concept pairing each letter with a friendly garden creature.",
    brief: "An alphabet book with consistent characters across 26 pages.",
    approach: "A shared colour system and character kit keep every page consistent.",
    deliverables: ["26 page illustrations", "Character kit", "Cover"], tools: ["Illustrator", "Procreate"], images: [] },
  { id: "cb-4", cat: "childrens-book", title: "Sample: The Lantern Fox", type: "Story scene", style: "Warm digital paint", featured: false, sample: true,
    desc: "A sample story scene built around light, mood and a memorable character.",
    brief: "A single key scene for a chapter-book proposal.",
    approach: "Lighting-led storytelling with a clear emotional beat.",
    deliverables: ["Final scene", "Process sketches"], tools: ["Photoshop"], images: [] },

  // Character design
  { id: "cd-1", cat: "character-design", title: "Sample: Expression Sheet — Wren", type: "Expression sheet", style: "Clean line & flat colour", featured: true, sample: true,
    desc: "A sample expression sheet showing a character's range of emotion.",
    brief: "A lead character needing 12 readable, consistent expressions.",
    approach: "Simple shape language so every expression reads clearly at small sizes.",
    deliverables: ["Expression sheet", "Colour palette", "Layered source files"], tools: ["Procreate", "Illustrator"], images: [] },
  { id: "cd-2", cat: "character-design", title: "Sample: Turnaround — Captain Bramble", type: "Turnaround", style: "Concept art", featured: false, sample: true,
    desc: "A sample front / side / back turnaround ready for animation or print.",
    brief: "A character turnaround for a production pipeline.",
    approach: "Consistent proportions, costume notes and prop callouts.",
    deliverables: ["Turnaround sheet", "Costume details"], tools: ["Photoshop"], images: [] },
  { id: "cd-3", cat: "character-design", title: "Sample: Forest Folk Cast", type: "Concept art", style: "Storybook", featured: false, sample: true,
    desc: "A sample ensemble cast built to feel like one world.",
    brief: "A cast of five related characters for a children's series.",
    approach: "Shared silhouettes and colour families so the cast feels cohesive.",
    deliverables: ["Lineup sheet", "Individual characters"], tools: ["Procreate"], images: [] },
  { id: "cd-4", cat: "character-design", title: "Sample: Personal Mascot Commission", type: "Commission", style: "Chibi-inspired", featured: false, sample: true,
    desc: "A sample commission turning a client's idea into an original mascot.",
    brief: "A friendly mascot for a small business.",
    approach: "Brief-led exploration with revision rounds.",
    deliverables: ["Final mascot", "Pose set"], tools: ["Illustrator"], images: [] },

  // Wedding
  { id: "wd-1", cat: "wedding", title: "Sample: Couple Portrait", type: "Couple portrait", style: "Romantic line & wash", featured: true, sample: true,
    desc: "A sample custom portrait capturing a couple's character and story.",
    brief: "A personalised portrait from reference photos.",
    approach: "Likeness, gesture and a few personal details that tell their story.",
    deliverables: ["Digital portrait", "Print-ready file"], tools: ["Procreate"], images: [] },
  { id: "wd-2", cat: "wedding", title: "Sample: Venue Illustration", type: "Venue", style: "Delicate watercolour", featured: false, sample: true,
    desc: "A sample illustrated venue for invitations and signage.",
    brief: "An illustrated venue for use across stationery.",
    approach: "Simplified architecture framed by seasonal florals.",
    deliverables: ["Venue artwork", "Stationery crops"], tools: ["Procreate", "Photoshop"], images: [] },
  { id: "wd-3", cat: "wedding", title: "Sample: Invitation Suite", type: "Invitation", style: "Floral & elegant", featured: false, sample: true,
    desc: "A sample invitation suite with matching details.",
    brief: "Invitation, RSVP and menu with a unified look.",
    approach: "A repeating floral motif and a considered type pairing.",
    deliverables: ["Invitation", "RSVP card", "Menu"], tools: ["Illustrator"], images: [] },
  { id: "wd-4", cat: "wedding", title: "Sample: Anniversary Keepsake", type: "Keepsake", style: "Hand-lettered", featured: false, sample: true,
    desc: "A sample personalised keepsake print.",
    brief: "A keepsake marking a first anniversary.",
    approach: "Meaningful dates, places and symbols composed into one print.",
    deliverables: ["Keepsake print file"], tools: ["Procreate"], images: [] },

  // Book cover
  { id: "bc-1", cat: "book-cover", title: "Sample: Fantasy Cover — The Glass Orchard", type: "Illustrated cover", style: "Painterly", featured: true, sample: true,
    desc: "A sample illustrated fantasy cover with room for title and author.",
    brief: "A cover for a middle-grade fantasy novel.",
    approach: "A single striking image, with typography planned from the start.",
    deliverables: ["Front cover", "Full wrap", "Ebook version"], tools: ["Photoshop"], images: [] },
  { id: "bc-2", cat: "book-cover", title: "Sample: Contemporary Romance Cover", type: "Typographic", style: "Type-led", featured: false, sample: true,
    desc: "A sample typography-led cover in a genre-appropriate style.",
    brief: "A bold, readable cover that works as a thumbnail.",
    approach: "Hierarchy first: title legibility at small sizes.",
    deliverables: ["Front cover", "Thumbnail test"], tools: ["Illustrator", "Photoshop"], images: [] },
  { id: "bc-3", cat: "book-cover", title: "Sample: Cover Concepts Round", type: "Concept", style: "Multiple directions", featured: false, sample: true,
    desc: "A sample set of three cover directions for author feedback.",
    brief: "Exploring directions before committing to final art.",
    approach: "Three distinct thumbnails with rationale for each.",
    deliverables: ["3 concepts", "Feedback summary"], tools: ["Photoshop"], images: [] },
  { id: "bc-4", cat: "book-cover", title: "Sample: Series Cover System", type: "Series", style: "Consistent branding", featured: false, sample: true,
    desc: "A sample series covers sharing one visual system.",
    brief: "Three covers that read as one series on a shelf.",
    approach: "A flexible template with a unique image per book.",
    deliverables: ["3 covers", "Series template"], tools: ["Illustrator"], images: [] },

  // Merch & digital
  { id: "md-1", cat: "merch-digital", title: "Sample: Fairy Garden Printable", type: "Printable", style: "Whimsical", featured: true, sample: true,
    desc: "A sample printable wall-art design for nurseries and playrooms.",
    brief: "Printable art in several sizes.",
    approach: "A centred composition that scales cleanly to common frame sizes.",
    deliverables: ["Print files in multiple sizes"], tools: ["Procreate"], images: [] },
  { id: "md-2", cat: "merch-digital", title: "Sample: Storybook Sticker Pack", type: "Sticker pack", style: "Cute & bold", featured: false, sample: true,
    desc: "A sample sticker pack with a cohesive theme.",
    brief: "A themed pack of die-cut stickers.",
    approach: "Strong outlines and readable shapes at small sizes.",
    deliverables: ["Sticker sheet", "Individual PNGs"], tools: ["Procreate"], images: [] },
  { id: "md-3", cat: "merch-digital", title: "Sample: Illustration Asset Pack", type: "Asset pack", style: "Modular", featured: false, sample: true,
    desc: "A sample set of illustrated elements for designers.",
    brief: "Reusable elements for social posts and presentations.",
    approach: "Elements designed to combine freely.",
    deliverables: ["PNG & SVG assets"], tools: ["Illustrator"], images: [] },
  { id: "md-4", cat: "merch-digital", title: "Sample: T-shirt Graphic Concept", type: "T-shirt design", style: "Screen-print friendly", featured: false, sample: true,
    desc: "A sample T-shirt design concept (physical-product concept).",
    brief: "A bold graphic suitable for print-on-demand.",
    approach: "Limited colours and clean shapes for reliable printing.",
    deliverables: ["Print-ready graphic", "Mock-up"], tools: ["Illustrator"], images: [] },

  // Editorial & commercial
  { id: "ec-1", cat: "editorial-commercial", title: "Sample: Magazine Feature Illustration", type: "Editorial", style: "Conceptual", featured: true, sample: true,
    desc: "A sample editorial illustration that visualises an idea.",
    brief: "A feature-article lead image.",
    approach: "One clear metaphor, simple shapes and a confident palette.",
    deliverables: ["Final illustration", "Crop variants"], tools: ["Illustrator", "Photoshop"], images: [] },
  { id: "ec-2", cat: "editorial-commercial", title: "Sample: Campaign Key Visual", type: "Campaign", style: "Bright & friendly", featured: false, sample: true,
    desc: "A sample campaign visual designed to flex across formats.",
    brief: "A launch campaign for a family brand.",
    approach: "A hero illustration with modular pieces for social, web and print.",
    deliverables: ["Hero art", "Social crops"], tools: ["Illustrator"], images: [] },
  { id: "ec-3", cat: "editorial-commercial", title: "Sample: Brand Spot Illustrations", type: "Brand", style: "Flat vector", featured: false, sample: true,
    desc: "A sample set of spot illustrations for a brand.",
    brief: "A cohesive set to support a website.",
    approach: "Consistent stroke, palette and perspective across the set.",
    deliverables: ["8 spot illustrations"], tools: ["Illustrator"], images: [] },
  { id: "ec-4", cat: "editorial-commercial", title: "Sample: Promotional Poster", type: "Promotional", style: "Playful", featured: false, sample: true,
    desc: "A sample promotional poster illustration.",
    brief: "An event poster with a strong focal point.",
    approach: "Readable hierarchy with illustration doing the heavy lifting.",
    deliverables: ["Poster artwork"], tools: ["Photoshop"], images: [] }
];

/* ---------- SHOP (DEMO CATALOGUE — SAMPLE PRODUCTS & PRICES) ---------- */
window.FF_PRODUCTS = [
  { id: "p-1", name: "Fairy Garden Printable Art", type: "Printable art", format: "digital", price: 8,
    desc: "Whimsical printable wall art for nurseries and playrooms.",
    includes: ["High-resolution PDF & PNG", "Three common frame sizes", "Personal-use licence (sample terms)"], art: "children" },
  { id: "p-2", name: "Storybook Sticker Pack", type: "Sticker pack", format: "digital", price: 6,
    desc: "A cute themed pack of illustrated stickers for planners and journals.",
    includes: ["20 individual PNG stickers", "Printable sticker sheet"], art: "merch" },
  { id: "p-3", name: "Illustration Asset Pack", type: "Illustration assets", format: "digital", price: 15,
    desc: "Modular illustrated elements for social posts, slides and invitations.",
    includes: ["PNG & SVG elements", "Colour palette file"], art: "editorial" },
  { id: "p-4", name: "Fairy Folio Tee — Design Concept", type: "T-shirt design", format: "physical", price: 24,
    desc: "A T-shirt graphic shown as a mock-up. This is a physical-product concept.",
    includes: ["Mock-up preview", "Concept only — not currently in production"], art: "merch" },
  { id: "p-5", name: "Character Sheet Template", type: "Illustration assets", format: "digital", price: 10,
    desc: "A tidy template for planning poses and expressions.",
    includes: ["Layered PSD & PNG template", "Guide sheet"], art: "character" },
  { id: "p-6", name: "Wedding Monogram Print", type: "Printable art", format: "digital", price: 12,
    desc: "A floral monogram print to personalise as a keepsake.",
    includes: ["Printable PDF", "Editable colour version"], art: "wedding" },
  { id: "p-7", name: "Bookmark Set (Printable)", type: "Printable art", format: "digital", price: 5,
    desc: "Four illustrated bookmarks you can print and cut at home.",
    includes: ["Print-ready PDF", "4 designs"], art: "cover" },
  { id: "p-8", name: "Enamel Pin — Design Concept", type: "Merchandise concept", format: "physical", price: 14,
    desc: "A fairy-and-book pin design shown as a mock-up (physical-product concept).",
    includes: ["Mock-up preview", "Concept only — not currently in production"], art: "children" }
];

/* ---------- PROCESS (used on Home & About) ---------- */
window.FF_PROCESS = [
  { n: 1, title: "Enquiry", text: "Tell us about your project, audience and timeline through the enquiry form." },
  { n: 2, title: "Brief", text: "We agree scope, deliverables and references so everyone starts aligned." },
  { n: 3, title: "Concept direction", text: "Thumbnails, mood and character or layout options to choose a direction." },
  { n: 4, title: "Development", text: "The chosen direction becomes finished artwork, refined stage by stage." },
  { n: 5, title: "Review", text: "You review and request changes within the agreed revision rounds." },
  { n: 6, title: "Final delivery", text: "Final files delivered in the formats you need for print or digital." }
];

/* Add approved client feedback here ONLY with permission. While empty, the section stays hidden.
   Example: { quote: "…", name: "Client name", role: "Author" } */
window.FF_TESTIMONIALS = [];

/* ---------- CHATBOT FAQ (keyword matched) ---------- */
window.FF_FAQ = [
  { keys: ["hello", "hi", "hey", "greetings"], a: "Hello! I'm the Fairy Folio helper. I can point you to our services, portfolio, shop or contact page.",
    links: [{ label: "Explore our work", href: "#/" }] },
  { keys: ["service", "services", "offer", "do you do", "what do you"], a: "We offer six service areas: Children's Book Illustration, Character Design, Wedding Illustration, Book Cover Design, Merch & Digital Products, and Editorial & Commercial Illustration.",
    links: [{ label: "Children's books", href: "#/category/childrens-book" }, { label: "Character design", href: "#/category/character-design" }, { label: "Wedding", href: "#/category/wedding" }] },
  { keys: ["children", "picture book", "kids book", "storybook"], a: "Our Children's Book Illustration hub covers picture books, story scenes, sample spreads and publishing-ready artwork.",
    links: [{ label: "Children's Book hub", href: "#/category/childrens-book" }] },
  { keys: ["character", "mascot", "turnaround", "expression"], a: "Character Design includes original characters, expression sheets, poses, turnarounds and concept art.",
    links: [{ label: "Character Design hub", href: "#/category/character-design" }] },
  { keys: ["wedding", "couple", "invitation", "portrait", "keepsake"], a: "Wedding Illustration covers custom couple portraits, venue illustrations, invitations, stationery and keepsakes.",
    links: [{ label: "Wedding hub", href: "#/category/wedding" }] },
  { keys: ["cover", "book cover", "novel", "author"], a: "Book Cover Design includes illustrated covers, cover concepts and typography-led layouts for different genres.",
    links: [{ label: "Book Cover hub", href: "#/category/book-cover" }] },
  { keys: ["editorial", "commercial", "brand", "campaign", "magazine"], a: "Editorial & Commercial Illustration covers editorial artwork, campaign visuals and brand illustrations.",
    links: [{ label: "Editorial hub", href: "#/category/editorial-commercial" }] },
  { keys: ["shop", "merch", "buy", "sticker", "printable", "digital", "t-shirt", "tshirt", "product", "cart"], a: "Our shop is a demo catalogue with a working cart. Checkout isn't connected yet, so no real orders can be placed.",
    links: [{ label: "Open the shop", href: "#/shop" }, { label: "View cart", href: "#/cart" }] },
  { keys: ["process", "workflow", "how does", "steps", "work together"], a: "Our process: enquiry, brief, concept direction, development, review and final delivery.",
    links: [{ label: "See our process", href: "#/about" }] },
  { keys: ["contact", "email", "reach", "talk", "enquiry", "inquiry", "project", "start", "hire", "commission"], a: "The best way to start is the project enquiry form. I can't submit an enquiry on your behalf, but the form will guide you.",
    links: [{ label: "Discuss a project", href: "#/contact" }] },
  { keys: ["quote", "price", "cost", "pricing", "budget", "how much"], a: "Pricing depends on scope. I can't give a quote in chat, so please share your project details through the enquiry form.",
    links: [{ label: "Request details", href: "#/contact" }] },
  { keys: ["job", "career", "careers", "intern", "internship", "hiring", "join", "work for"], a: "We hope to grow the team and welcome interest from illustrators and interns. Check the Careers page for how to get in touch.",
    links: [{ label: "Careers & internships", href: "#/careers" }] },
  { keys: ["bookmark", "save", "favourite", "favorite", "wishlist"], a: "Use the heart button on any project or product to save it. Saved items live in your Bookmarks and stay in this browser.",
    links: [{ label: "Open bookmarks", href: "#/bookmarks" }] },
  { keys: ["about", "who", "team", "studio", "agency"], a: "The Fairy Folio is an illustration agency built around a creative team, with a goal of working directly with international clients.",
    links: [{ label: "About us", href: "#/about" }] },
  { keys: ["thank", "thanks"], a: "You're welcome! Anything else I can help you find?", links: [] }
];

window.FF_QUICK_REPLIES = ["What services do you offer?", "How does your process work?", "How can I start a project?", "Tell me about the shop"];
