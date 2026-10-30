/* ==========================================================
   THE FAIRY FOLIO — Application logic (vanilla JS, no build step)
   Hash-based router so the site works by double-clicking
   index.html OR via VS Code "Live Server".
   Sections: helpers · state · cards · pages · search · cart ·
             forms · chatbot · UI wiring · boot
   ========================================================== */
(function () {
  "use strict";

  const CFG = window.FF_CONFIG, CATS = window.FF_CATEGORIES, PROJ = window.FF_PROJECTS,
        PRODS = window.FF_PRODUCTS, PROCESS = window.FF_PROCESS, FAQ = window.FF_FAQ,
        TESTI = window.FF_TESTIMONIALS || [];

  /* ---------------- helpers ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => CFG.currency + Number(n).toFixed(2);
  const cat = (slug) => CATS.find((c) => c.slug === slug);
  const proj = (id) => PROJ.find((p) => p.id === id);
  const prod = (id) => PRODS.find((p) => p.id === id);
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable (private mode) */ } }
  };
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ---------------- state ---------------- */
  let bookmarks = store.get("ff_bookmarks", []);   // ["p:cb-1", "s:p-2"]
  let cart = store.get("ff_cart", {});             // { "p-1": 2 }
  const isBm = (key) => bookmarks.includes(key);
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);

  function updateBadges() {
    const b = $("#bmCount"), c = $("#cartCount");
    b.textContent = bookmarks.length; b.hidden = !bookmarks.length;
    c.textContent = cartCount(); c.hidden = !cartCount();
    $$("[data-bm-count]").forEach((e) => { e.textContent = bookmarks.length; e.hidden = !bookmarks.length; });
    $$("[data-cart-count]").forEach((e) => { e.textContent = cartCount(); e.hidden = !cartCount(); });
  }

  /* ---------------- imagery ---------------- */
  function imageHtml(item, kind, i = 0, isProduct = false) {
    const real = item.images && item.images[i];
    const name = item.title || item.name;
    if (real) return `<img src="${esc(real)}" alt="${esc(name)}${item.alt ? " — " + esc(item.alt) : ""}" loading="lazy">`;
    return window.FF_ART(kind, item.id + "-" + i, `Placeholder artwork for ${name}`);
  }
  const projectImg = (p, i = 0) => imageHtml(p, cat(p.cat).kind, i);
  const productImg = (p) => window.FF_ART(p.art, p.id, `Mock-up artwork for ${p.name}`);

  /* ---------------- cards ---------------- */
  const heartSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" stroke-linejoin="round"><path d="M12 21s-7-4.6-9.2-9.1C1.2 8.5 3 5 6.4 5c2 0 3.5 1.1 4.3 2.5h2.6C14.1 6.1 15.6 5 17.6 5 21 5 22.8 8.5 21.2 11.9 19 16.4 12 21 12 21z"/></svg>';
  function favBtn(key, name) {
    const on = isBm(key);
    return `<button type="button" class="fav-btn" data-bm="${key}" data-name="${esc(name)}" aria-pressed="${on}" aria-label="${on ? "Remove" : "Save"} ${esc(name)} ${on ? "from" : "to"} bookmarks">${heartSvg}</button>`;
  }

  function projectCard(p) {
    const c = cat(p.cat);
    return `<article class="card reveal">
      <div class="badges">${p.sample ? '<span class="tag tag--sample">Sample</span>' : ""}${p.featured ? '<span class="tag tag--rose">Featured</span>' : ""}</div>
      ${favBtn("p:" + p.id, p.title)}
      <div class="thumb">${projectImg(p)}</div>
      <div class="body">
        <h3><a href="#/project/${p.id}">${esc(p.title)}</a></h3>
        <p>${esc(p.desc)}</p>
        <div class="card-meta"><span class="tag">${esc(c.name)}</span><span class="tag tag--rose">${esc(p.type)}</span></div>
      </div></article>`;
  }

  function productCard(p) {
    return `<article class="card reveal">
      <div class="badges"><span class="tag ${p.format === "digital" ? "tag--digital" : "tag--sample"}">${p.format === "digital" ? "Digital" : "Physical concept"}</span><span class="tag tag--sample">Sample</span></div>
      ${favBtn("s:" + p.id, p.name)}
      <div class="thumb">${productImg(p)}</div>
      <div class="body">
        <h3><a href="#/shop" data-product="${p.id}">${esc(p.name)}</a></h3>
        <p>${esc(p.desc)}</p>
        <div class="card-meta"><span class="price">${money(p.price)}</span>
          <span class="card-actions"><button class="btn btn--primary btn--sm" type="button" data-add="${p.id}">Add to cart</button></span></div>
      </div></article>`;
  }

  function catCard(c) {
    return `<a class="cat-card reveal" href="#/category/${c.slug}">
      <div class="thumb">${window.FF_ART(c.kind, c.slug, "")}</div>
      <div class="body"><h3>${c.icon} ${esc(c.name)}</h3><p>${esc(c.short)}</p><span class="arrow-link">Explore →</span></div></a>`;
  }

  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map((it, i) =>
    (i ? '<span aria-hidden="true">›</span>' : "") + (it.href ? `<a href="${it.href}">${esc(it.label)}</a>` : `<span aria-current="page">${esc(it.label)}</span>`)).join("")}</nav>`;

  const ctaBand = (title = "Have a project in mind?", text = "Tell us about your story, characters or brand — we'll help shape the right illustration approach.", href = "#/contact") =>
    `<div class="container reveal"><div class="cta-band"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><a class="btn btn--soft" href="${href}">Discuss a Project</a></div></div>`;

  function processHtml() {
    return `<div class="process">${PROCESS.map((s) => `<div class="step reveal"><div class="num">${s.n}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>`;
  }

  /* ---------------- pages ---------------- */
  const pages = {};

  pages.home = () => {
    const featured = PROJ.filter((p) => p.featured);
    const testi = TESTI.length ? `<section class="section section--cream"><div class="container"><div class="section-head center"><span class="eyebrow">Kind words</span><h2>What clients say</h2></div>
      <div class="grid grid--3">${TESTI.map((t) => `<figure class="value-card reveal"><blockquote style="margin:0 0 12px">“${esc(t.quote)}”</blockquote><figcaption><b>${esc(t.name)}</b>${t.role ? ", " + esc(t.role) : ""}</figcaption></figure>`).join("")}</div></div></section>` : "";
    return {
      title: "The Fairy Folio — Where Imagination Meets Creativity",
      html: `
      <section class="hero"><div class="container hero-grid">
        <div>
          <span class="eyebrow">Professional Illustration Agency</span>
          <h1>Where <em>Imagination</em> Meets Creativity</h1>
          <p class="lead">The Fairy Folio is a team of illustrators creating storybook art, characters, wedding illustrations, book covers and more — for authors, publishers, brands and couples around the world.</p>
          <div class="hero-actions">
            <a class="btn btn--primary" href="#/contact">Discuss a Project</a>
            <a class="btn btn--ghost" href="#featured">Explore Our Work</a>
          </div>
          <div class="trust-row"><span>Six specialist services</span><span>A collaborative team</span><span>Print &amp; digital-ready files</span></div>
        </div>
        <div class="hero-art">
          <span class="spark" aria-hidden="true">✦</span><span class="spark" aria-hidden="true">✦</span><span class="spark" aria-hidden="true">✦</span><span class="spark" aria-hidden="true">✦</span>
          <img src="assets/img/logo.png" alt="The Fairy Folio fairy with a star wand sitting on an open book" width="520" height="485">
        </div>
      </div></section>

      <div class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map(() => CATS.map((c) => `<span>${esc(c.name)}</span>`).join("")).join("")}</div></div>

      <section class="section" id="services"><div class="container">
        <div class="section-head center"><span class="eyebrow">What we create</span><h2>Six ways we bring ideas to life</h2>
          <p class="lead">Choose a service hub to see selected work, how we approach it and how to start.</p></div>
        <div class="grid grid--cats">${CATS.map(catCard).join("")}</div>
      </div></section>

      <section class="section section--cream" id="featured"><div class="container">
        <div class="section-head center"><span class="eyebrow">Featured projects</span><h2>A look inside the folio</h2>
          <p class="lead">A selection across our service areas. Open any project for details and related work.</p></div>
        <div class="grid grid--cards">${featured.map(projectCard).join("")}</div>
      </div></section>

      <section class="section"><div class="container">
        <div class="section-head center"><span class="eyebrow">Why The Fairy Folio</span><h2>A studio, not just a gallery</h2></div>
        <div class="grid grid--cats">
          <div class="value-card reveal"><div class="ico">🤝</div><h3>Direct collaboration</h3><p>Work straight with the team creating your artwork — clear communication from brief to delivery.</p></div>
          <div class="value-card reveal"><div class="ico">🎨</div><h3>A creative team</h3><p>Multiple illustrators and designers, so projects of different styles and sizes are supported.</p></div>
          <div class="value-card reveal"><div class="ico">📦</div><h3>Ready-to-use files</h3><p>Final artwork prepared for print or digital use, in the formats your project needs.</p></div>
        </div>
      </div></section>

      <section class="section section--sage"><div class="container">
        <div class="section-head center"><span class="eyebrow">Creative process</span><h2>From first message to final file</h2>
          <p class="lead">A simple, transparent workflow so you always know what happens next.</p></div>
        ${processHtml()}
      </div></section>

      <section class="section"><div class="container two-col">
        <div class="reveal"><span class="eyebrow">Meet the studio</span><h2>An agency built around storytellers</h2>
          <p class="lead">The Fairy Folio brings illustrators, character designers and cover designers together under one roof — with plans to grow the team through jobs, internships and collaborations.</p>
          <div class="hero-actions"><a class="btn btn--primary" href="#/about">About the team</a><a class="btn btn--ghost" href="#/careers">Join us</a></div></div>
        <div class="reveal" style="border-radius:28px;overflow:hidden;box-shadow:var(--shadow)">${window.FF_ART("children", "team-intro", "Illustrated storybook landscape")}</div>
      </div></section>
      ${testi}
      <section class="section">${ctaBand()}</section>`
    };
  };

  pages.category = (slug) => {
    const c = cat(slug); if (!c) return pages.notFound();
    const items = PROJ.filter((p) => p.cat === slug);
    return {
      title: c.name + " — The Fairy Folio",
      html: `
      <section class="page-head"><div class="container">
        ${crumbs([{ label: "Home", href: "#/" }, { label: "Services", href: "#/" }, { label: c.name }])}
        <div class="hub-head">
          <div><span class="eyebrow">${c.icon} Service hub</span><h1>${esc(c.name)}</h1><p class="lead">${esc(c.intro)}</p>
            <ul class="checklist">${c.covers.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <div class="hero-actions"><a class="btn btn--primary" href="#/contact?category=${c.slug}">Enquire about this service</a></div></div>
          <div class="art-wrap">${window.FF_ART(c.kind, c.slug, c.name + " illustration")}</div>
        </div></div></section>
      <section class="section"><div class="container">
        <div class="toolbar" id="hubToolbar">
          <div class="chips" role="group" aria-label="Filter by project type">
            <button class="chip" type="button" data-filter="" aria-pressed="true">All</button>
            ${c.filters.map((f) => `<button class="chip" type="button" data-filter="${esc(f)}" aria-pressed="false">${esc(f)}</button>`).join("")}
            <button class="chip" type="button" data-featured aria-pressed="false">★ Featured only</button>
          </div>
          <label class="sr-only" for="hubSort">Sort projects</label>
          <select id="hubSort"><option value="featured">Sort: Featured first</option><option value="az">Sort: A → Z</option></select>
        </div>
        <div class="grid grid--cards" id="hubGrid" aria-live="polite">${items.map(projectCard).join("")}</div>
      </div></section>
      <section class="section section--cream"><div class="container"><div class="section-head"><h2>Explore other services</h2></div>
        <div class="grid grid--cats">${CATS.filter((x) => x.slug !== slug).slice(0, 3).map(catCard).join("")}</div></div></section>
      <section class="section">${ctaBand("Ready to start your " + c.name.toLowerCase() + " project?", "Share a few details and we'll come back with next steps.", "#/contact?category=" + c.slug)}</section>`,
      after() {
        let filter = "", featuredOnly = false, sort = "featured";
        const grid = $("#hubGrid");
        const paint = () => {
          let list = items.filter((p) => (!filter || p.type === filter) && (!featuredOnly || p.featured));
          list = list.slice().sort((a, b) => sort === "az" ? a.title.localeCompare(b.title) : (b.featured - a.featured) || a.title.localeCompare(b.title));
          grid.innerHTML = list.length ? list.map(projectCard).join("") :
            `<div class="empty" style="grid-column:1/-1"><div class="big">🔍</div><p>No projects match these filters yet.</p><button class="btn btn--soft btn--sm" type="button" id="resetHub">Reset filters</button></div>`;
          revealAll(); const r = $("#resetHub"); if (r) r.onclick = () => { filter = ""; featuredOnly = false; syncChips(); paint(); };
        };
        const syncChips = () => $$("#hubToolbar .chip").forEach((b) => b.setAttribute("aria-pressed",
          b.hasAttribute("data-featured") ? featuredOnly : (b.dataset.filter === filter)));
        $("#hubToolbar").addEventListener("click", (e) => {
          const b = e.target.closest(".chip"); if (!b) return;
          if (b.hasAttribute("data-featured")) featuredOnly = !featuredOnly; else filter = b.dataset.filter;
          syncChips(); paint();
        });
        $("#hubSort").addEventListener("change", (e) => { sort = e.target.value; paint(); });
      }
    };
  };

  pages.project = (id) => {
    const p = proj(id); if (!p) return pages.notFound();
    const c = cat(p.cat);
    const n = 3;
    const related = [...PROJ.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 2),
      ...PROJ.filter((x) => x.cat !== p.cat && x.featured).slice(0, 2)].slice(0, 4);
    const list = (arr) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    return {
      title: p.title + " — " + c.name + " — The Fairy Folio",
      html: `
      <section class="page-head"><div class="container">
        ${crumbs([{ label: "Home", href: "#/" }, { label: c.name, href: "#/category/" + c.slug }, { label: p.title }])}
        <span class="eyebrow">${esc(c.name)} · ${esc(p.type)}</span><h1 style="font-size:clamp(1.9rem,4vw,3rem)">${esc(p.title)}</h1></div></section>
      <section class="section"><div class="container detail">
        <div>
          <button type="button" class="gallery-main" id="galleryMain" aria-label="Open larger view of image 1">${projectImg(p, 0)}</button>
          <div class="thumbs" id="thumbs" role="group" aria-label="Project images">
            ${Array.from({ length: Math.max(n, (p.images || []).length) }, (_, i) =>
              `<button type="button" data-i="${i}" aria-current="${i === 0}" aria-label="View image ${i + 1}">${projectImg(p, i)}</button>`).join("")}
          </div>
        </div>
        <aside class="detail-side">
          ${p.sample ? '<div class="notice"><strong>Sample entry.</strong> This project uses placeholder artwork. Replace it with real, approved work in <code>js/data.js</code>.</div>' : ""}
          <p class="lead" style="margin-bottom:10px">${esc(p.desc)}</p>
          <ul class="meta-list">
            <li><b>Category</b><span>${esc(c.name)}</span></li>
            <li><b>Project type</b><span>${esc(p.type)}</span></li>
            <li><b>Style</b><span>${esc(p.style)}</span></li>
            ${p.client ? `<li><b>Client</b><span>${esc(p.client)}</span></li>` : ""}
            ${p.tools && p.tools.length ? `<li><b>Tools used</b><span>${esc(p.tools.join(", "))}</span></li>` : ""}
          </ul>
          <div class="detail-actions">
            <a class="btn btn--primary" href="#/contact?category=${p.cat}&project=${p.id}">Enquire about similar work</a>
            <button class="btn btn--ghost" type="button" data-bm="p:${p.id}" aria-pressed="${isBm("p:" + p.id)}" id="detailBm">${isBm("p:" + p.id) ? "♥ Saved" : "♡ Save"}</button>
          </div>
        </aside>
      </div></section>
      <section class="section section--cream"><div class="container grid grid--3">
        ${p.brief ? `<div class="value-card reveal"><h3>The brief</h3><p>${esc(p.brief)}</p></div>` : ""}
        ${p.approach ? `<div class="value-card reveal"><h3>Creative approach</h3><p>${esc(p.approach)}</p></div>` : ""}
        ${p.deliverables && p.deliverables.length ? `<div class="value-card reveal"><h3>Deliverables</h3>${list(p.deliverables)}</div>` : ""}
      </div></section>
      <section class="section"><div class="container"><div class="section-head"><h2>Related work</h2><p class="lead">More from this service and across the folio.</p></div>
        <div class="grid grid--cards">${related.map(projectCard).join("")}</div></div></section>`,
      after() {
        const main = $("#galleryMain"); let cur = 0;
        const show = (i) => {
          cur = i; main.innerHTML = projectImg(p, i); main.setAttribute("aria-label", "Open larger view of image " + (i + 1));
          $$("#thumbs button").forEach((b) => b.setAttribute("aria-current", +b.dataset.i === i));
        };
        $("#thumbs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
        main.addEventListener("click", () => openLightbox(projectImg(p, cur), main));
      }
    };
  };

  pages.shop = () => {
    const c = cat("merch-digital");
    return {
      title: "Shop — Merch & Digital Products — The Fairy Folio",
      html: `
      <section class="page-head"><div class="container">${crumbs([{ label: "Home", href: "#/" }, { label: "Shop" }])}
        <div class="hub-head"><div><span class="eyebrow">🛍️ Merch &amp; Digital Products</span><h1>The Fairy Folio Shop</h1>
          <p class="lead">${esc(c.intro)}</p></div>
          <div class="art-wrap">${window.FF_ART("merch", "shop-head", "Illustrated merchandise")}</div></div></div></section>
      <section class="section"><div class="container">
        <div class="notice"><strong>Demo catalogue.</strong> Products and prices here are samples. The cart calculates totals, but checkout is not connected — no payment is taken and no order is placed.</div>
        <div class="toolbar"><div class="chips" id="shopChips" role="group" aria-label="Filter products">
          <button class="chip" type="button" data-f="" aria-pressed="true">All</button>
          <button class="chip" type="button" data-f="digital" aria-pressed="false">Digital downloads</button>
          <button class="chip" type="button" data-f="physical" aria-pressed="false">Physical concepts</button></div>
          <a class="btn btn--soft btn--sm" href="#/cart">View cart (${cartCount()})</a></div>
        <div class="grid grid--cards" id="shopGrid">${PRODS.map(productCard).join("")}</div>
      </div></section>
      <section class="section">${ctaBand("Want something custom?", "Commission a bespoke illustration, sticker set or design for your own product.", "#/contact?category=merch-digital")}</section>`,
      after() {
        $("#shopChips").addEventListener("click", (e) => {
          const b = e.target.closest(".chip"); if (!b) return;
          $$("#shopChips .chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
          const list = PRODS.filter((p) => !b.dataset.f || p.format === b.dataset.f);
          $("#shopGrid").innerHTML = list.map(productCard).join(""); revealAll();
        });
      }
    };
  };

  pages.cart = () => {
    const rows = Object.keys(cart).map(prod).filter(Boolean);
    const items = rows.map((p) => ({ p, q: cart[p.id] }));
    const subtotal = items.reduce((a, { p, q }) => a + p.price * q, 0);
    const empty = `<div class="empty"><div class="big">🛒</div><h2>Your cart is empty</h2><p>Browse the demo shop and add something you like.</p><a class="btn btn--primary" href="#/shop">Go to the shop</a></div>`;
    return {
      title: "Cart — The Fairy Folio",
      html: `<section class="page-head"><div class="container">${crumbs([{ label: "Home", href: "#/" }, { label: "Shop", href: "#/shop" }, { label: "Cart" }])}<h1>Your cart</h1></div></section>
      <section class="section"><div class="container">${!items.length ? empty : `
        <div class="notice"><strong>Demo cart.</strong> Totals are calculated for demonstration only. Taxes, shipping and payment are not implemented.</div>
        <div class="cart-layout"><div>
          ${items.map(({ p, q }) => `<div class="cart-row">
            <div class="cthumb">${productImg(p)}</div>
            <div><h3 style="margin:0 0 4px;font-size:1.05rem">${esc(p.name)}</h3><span class="tag ${p.format === "digital" ? "tag--digital" : "tag--sample"}">${p.format === "digital" ? "Digital" : "Physical concept"}</span><div class="price" style="margin-top:6px">${money(p.price)} each</div></div>
            <div class="cart-end"><div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
              <button type="button" data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button><output aria-live="polite">${q}</output><button type="button" data-qty="1" data-id="${p.id}" aria-label="Increase quantity">+</button></div>
              <div><b>${money(p.price * q)}</b><br><button class="btn btn--sm btn--ghost" type="button" data-remove="${p.id}" style="margin-top:6px">Remove</button></div></div></div>`).join("")}
          <button class="btn btn--ghost btn--sm" type="button" id="clearCart">Clear cart</button></div>
        <aside class="summary"><h2 style="font-size:1.4rem">Order summary</h2><dl>
          <div class="line"><dt>Items</dt><dd style="margin:0">${cartCount()}</dd></div>
          <div class="line"><dt>Subtotal</dt><dd style="margin:0">${money(subtotal)}</dd></div>
          <div class="line"><dt>Shipping &amp; tax</dt><dd style="margin:0">Not calculated</dd></div>
          <div class="line total"><dt>Total (demo)</dt><dd style="margin:0">${money(subtotal)}</dd></div></dl>
          <button class="btn btn--primary" type="button" id="checkoutBtn" style="width:100%">Checkout (demo)</button>
          <p style="font-size:.85rem;color:var(--ink-soft);margin:12px 0 0">No payment is processed on this website.</p></aside></div>`}
      </div></section>`,
      after() {
        const co = $("#checkoutBtn"); if (co) co.onclick = () => openModal(`<h2 id="modalTitle">Checkout isn't live yet</h2>
          <p>This is a demo shop, so <strong>no order has been placed and no payment was taken</strong>.</p>
          <p>If you'd like to buy or commission something, please send us an enquiry and we'll reply with real options.</p>
          <div class="hero-actions"><a class="btn btn--primary" href="#/contact?category=merch-digital" data-close>Send an enquiry</a><button class="btn btn--ghost" type="button" data-close>Close</button></div>`);
        const cc = $("#clearCart"); if (cc) cc.onclick = () => { cart = {}; store.set("ff_cart", cart); updateBadges(); route(); };
      }
    };
  };

  pages.bookmarks = () => {
    const ps = bookmarks.filter((k) => k.startsWith("p:")).map((k) => proj(k.slice(2))).filter(Boolean);
    const ss = bookmarks.filter((k) => k.startsWith("s:")).map((k) => prod(k.slice(2))).filter(Boolean);
    return {
      title: "Bookmarks — The Fairy Folio",
      html: `<section class="page-head"><div class="container">${crumbs([{ label: "Home", href: "#/" }, { label: "Bookmarks" }])}<h1>Your bookmarks</h1>
        <p class="lead">Saved projects and products live in this browser on this device. Clearing browser data will remove them.</p></div></section>
        <section class="section"><div class="container">
        ${!ps.length && !ss.length ? `<div class="empty"><div class="big">♡</div><h2>Nothing saved yet</h2><p>Tap the heart on any project or product to keep it here.</p><a class="btn btn--primary" href="#/">Explore the folio</a></div>` : `
          ${ps.length ? `<h2>Saved projects</h2><div class="grid grid--cards" style="margin-bottom:40px">${ps.map(projectCard).join("")}</div>` : ""}
          ${ss.length ? `<h2>Saved products</h2><div class="grid grid--cards">${ss.map(productCard).join("")}</div>` : ""}
          <p style="margin-top:30px"><button class="btn btn--ghost btn--sm" type="button" id="clearBm">Clear all bookmarks</button></p>`}
        </div></section>`,
      after() { const b = $("#clearBm"); if (b) b.onclick = () => { bookmarks = []; store.set("ff_bookmarks", bookmarks); updateBadges(); route(); }; }
    };
  };

  pages.about = () => ({
    title: "About Us — The Fairy Folio",
    html: `<section class="page-head"><div class="container">${crumbs([{ label: "Home", href: "#/" }, { label: "About Us" }])}
      <div class="hub-head"><div><span class="eyebrow">About The Fairy Folio</span><h1>Imagination, made collaborative</h1>
      <p class="lead">The Fairy Folio is an illustration agency built around a creative team. We help international publishers, authors, businesses and couples bring stories, characters and celebrations to life — directly, clearly and professionally.</p></div>
      <div class="art-wrap" style="background:var(--cream);display:grid;place-items:center"><img src="assets/img/logo.png" alt="The Fairy Folio logo" style="width:80%;height:auto"></div></div></div></section>
      <section class="section"><div class="container"><div class="section-head center"><span class="eyebrow">Our purpose</span><h2>What we stand for</h2></div>
        <div class="grid grid--cats">
          <div class="value-card reveal"><div class="ico">✨</div><h3>Purpose</h3><p>To make high-quality illustration easy to commission directly, and to create opportunities for illustrators as the team grows.</p></div>
          <div class="value-card reveal"><div class="ico">💪</div><h3>Strengths</h3><p>Story-driven illustration across publishing, character work, weddings, covers, merchandise and editorial projects.</p></div>
          <div class="value-card reveal"><div class="ico">🤝</div><h3>Collaborative approach</h3><p>We listen first, share work in stages and keep you involved so the result matches your vision.</p></div>
          <div class="value-card reveal"><div class="ico">📋</div><h3>Professional standards</h3><p>Clear briefs, agreed deliverables, organised files and respect for copyright and client confidentiality.</p></div>
          <div class="value-card reveal"><div class="ico">🌍</div><h3>International-ready</h3><p>Online-first workflow for clients anywhere, with files prepared for print and digital use.</p></div>
          <div class="value-card reveal"><div class="ico">🌱</div><h3>Room to grow</h3><p>We aim to welcome new illustrators through employment, internships and collaboration.</p></div></div></div></section>
      <section class="section section--cream"><div class="container two-col"><div><span class="eyebrow">Creative process</span><h2>How we work together</h2>
        <p class="lead">Every project follows the same clear path, from your first enquiry to final delivery.</p><a class="btn btn--primary" href="#/contact">Start your project</a></div>
        <ol class="timeline">${PROCESS.map((s) => `<li class="reveal"><span class="num">${s.n}</span><h3 style="margin-bottom:2px">${esc(s.title)}</h3><p style="margin:0;color:var(--ink-soft)">${esc(s.text)}</p></li>`).join("")}</ol></div></section>
      <section class="section"><div class="container"><div class="section-head center"><span class="eyebrow">The team</span><h2>Roles in the studio</h2>
        <p class="lead">Individual team profiles will be added here once members approve how they are shown.</p></div>
        <div class="grid grid--cats">
          ${[["🖌️", "Illustrators", "Storybook, editorial and commission artwork."], ["🧚", "Character designers", "Original characters, sheets and concept art."], ["📚", "Cover & layout designers", "Illustrated covers and typography-led design."], ["🗂️", "Project coordination", "Briefs, timelines, reviews and delivery."], ["🛍️", "Product designers", "Printables, stickers and digital assets."], ["➕", "You?", "We're growing — see Careers & Internships."]]
            .map(([i, t, d]) => `<div class="value-card reveal"><div class="ico">${i}</div><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>
      <section class="section">${ctaBand("Let's make something wonderful", "Tell us about your project and we'll take it from there.")}</section>`
  });

  pages.careers = () => ({
    title: "Careers & Internships — The Fairy Folio",
    html: `<section class="page-head"><div class="container">${crumbs([{ label: "Home", href: "#/" }, { label: "Careers & Internships" }])}
      <span class="eyebrow">Grow with us</span><h1>Careers &amp; internships</h1>
      <p class="lead">The Fairy Folio aims to expand its creative team and create real opportunities for illustrators — through employment, internships and collaboration.</p></div></section>
      <section class="section"><div class="container"><div class="grid grid--3">
        <div class="value-card reveal"><div class="ico">🖌️</div><h3>Illustrators</h3><p>Storybook, character, wedding or editorial illustrators who enjoy working in a team.</p></div>
        <div class="value-card reveal"><div class="ico">🎓</div><h3>Interns</h3><p>Emerging artists wanting hands-on experience in a professional illustration workflow.</p></div>
        <div class="value-card reveal"><div class="ico">🤝</div><h3>Collaborators</h3><p>Writers, designers and creatives interested in project-based partnerships.</p></div></div>
        <div class="notice" style="margin-top:30px"><strong>Current openings:</strong> there are no listed openings right now. Send a general expression of interest below and we'll keep it in mind.</div>
      </div></section>
      <section class="section section--cream"><div class="container contact-layout">
        <div class="form-card"><h2>Express your interest</h2>
          <form id="careerForm" novalidate data-kind="careers">
            <div class="form-grid">
              <div class="field"><label for="c_name">Full name <span class="req">*</span></label><input id="c_name" name="name" autocomplete="name" required><div class="err" aria-live="polite"></div></div>
              <div class="field"><label for="c_email">Email <span class="req">*</span></label><input id="c_email" name="email" type="email" autocomplete="email" required><div class="err" aria-live="polite"></div></div>
              <div class="field"><label for="c_role">I'm interested in <span class="req">*</span></label><select id="c_role" name="role" required><option value="">Choose…</option><option>Employment</option><option>Internship</option><option>Collaboration</option></select><div class="err" aria-live="polite"></div></div>
              <div class="field"><label for="c_link">Portfolio link</label><input id="c_link" name="portfolio" type="url" placeholder="https://"><div class="hint">Please share a link rather than attaching files.</div><div class="err" aria-live="polite"></div></div>
              <div class="field full"><label for="c_msg">Tell us about yourself <span class="req">*</span></label><textarea id="c_msg" name="message" required></textarea><div class="err" aria-live="polite"></div></div>
            </div>
            <p style="font-size:.85rem;color:var(--ink-soft);margin-top:14px">We only ask for what's needed to respond. File uploads aren't offered until a secure method for handling applicant data is agreed.</p>
            <button class="btn btn--primary" type="submit">Send interest</button>
            <div id="careerStatus"></div>
          </form></div>
        <aside class="info-card"><h3>What we look for</h3><ul><li>✦ A strong, consistent portfolio</li><li>✦ Reliable communication</li><li>✦ A collaborative attitude</li><li>✦ Curiosity and willingness to learn</li></ul></aside>
      </div></section>`,
    after() { bindForm($("#careerForm"), $("#careerStatus"), "Careers interest — The Fairy Folio"); }
  });

  pages.contact = (query) => {
    const q = query || {};
    const prefCat = q.category || "";
    const pj = q.project && proj(q.project);
    const opts = CATS.map((c) => `<option value="${c.slug}" ${c.slug === prefCat ? "selected" : ""}>${esc(c.name)}</option>`).join("") +
      `<option value="custom" ${prefCat === "custom" ? "selected" : ""}>Custom illustration commission</option><option value="other">Something else</option>`;
    return {
      title: "Contact Us — The Fairy Folio",
      html: `<section class="page-head"><div class="container">${crumbs([{ label: "Home", href: "#/" }, { label: "Contact Us" }])}
        <span class="eyebrow">Start a project</span><h1>Let's talk about your project</h1>
        <p class="lead">Share a few details and we'll reply with next steps. The more context you give, the better we can help.</p></div></section>
      <section class="section"><div class="container contact-layout">
        <div class="form-card"><h2>Project enquiry</h2>
          <form id="contactForm" novalidate data-kind="enquiry">
            <div class="form-grid">
              <div class="field"><label for="f_name">Name <span class="req">*</span></label><input id="f_name" name="name" autocomplete="name" required><div class="err" aria-live="polite"></div></div>
              <div class="field"><label for="f_email">Email <span class="req">*</span></label><input id="f_email" name="email" type="email" autocomplete="email" required><div class="err" aria-live="polite"></div></div>
              <div class="field full"><label for="f_cat">Service / category <span class="req">*</span></label><select id="f_cat" name="service" required><option value="">Choose a service…</option>${opts}</select><div class="err" aria-live="polite"></div></div>
              <div class="field full"><label for="f_msg">Project description <span class="req">*</span></label><textarea id="f_msg" name="message" required>${pj ? esc("I'm interested in work similar to: " + pj.title + ".\n\n") : ""}</textarea><div class="err" aria-live="polite"></div></div>
              <div class="field"><label for="f_budget">Budget <span style="font-weight:600">(optional)</span></label><input id="f_budget" name="budget" placeholder="e.g. $500–$1,000"></div>
              <div class="field"><label for="f_deadline">Deadline <span style="font-weight:600">(optional)</span></label><input id="f_deadline" name="deadline" type="date"></div>
              <div class="field full"><label for="f_refs">Reference links <span style="font-weight:600">(optional)</span></label><input id="f_refs" name="references" placeholder="Links to inspiration or existing work"><div class="hint">Share links rather than large files.</div></div>
            </div>
            <button class="btn btn--primary" type="submit" style="margin-top:18px">Send enquiry</button>
            <div id="contactStatus"></div>
          </form></div>
        <aside class="info-card"><h3>Other ways to reach us</h3>
          <ul><li>✉️ <a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a></li>
          ${CFG.socials.map((s) => `<li>🔗 <a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
          <h3 style="margin-top:20px">What happens next?</h3><ol style="padding-left:1.2em;margin:0"><li>We read your enquiry</li><li>We reply with questions or a proposed approach</li><li>We agree scope and begin</li></ol></aside>
      </div></section>`,
      after() { bindForm($("#contactForm"), $("#contactStatus"), "Project enquiry — The Fairy Folio"); }
    };
  };

  pages.search = (query) => {
    const term = (query && query.q) || "";
    const r = runSearch(term);
    const total = r.projects.length + r.cats.length + r.prods.length;
    return {
      title: `Search “${term}” — The Fairy Folio`,
      html: `<section class="page-head"><div class="container">${crumbs([{ label: "Home", href: "#/" }, { label: "Search" }])}<h1>Search results</h1>
        <form id="pageSearch" role="search" class="search-field" style="max-width:560px"><label class="sr-only" for="ps">Search</label><input id="ps" type="search" value="${esc(term)}" placeholder="Search…"><button class="btn btn--primary btn--sm">Search</button><a class="btn btn--soft btn--sm" href="#/search">Clear</a></form>
        <p style="margin-top:12px">${term ? `${total} result${total === 1 ? "" : "s"} for “${esc(term)}”` : "Type something to search projects, services and products."}</p></div></section>
        <section class="section"><div class="container">${!term ? "" : !total ? emptySearch(term) : `
        ${r.cats.length ? `<h2>Services</h2><div class="grid grid--cats" style="margin-bottom:36px">${r.cats.map(catCard).join("")}</div>` : ""}
        ${r.projects.length ? `<h2>Projects</h2><div class="grid grid--cards" style="margin-bottom:36px">${r.projects.map(projectCard).join("")}</div>` : ""}
        ${r.prods.length ? `<h2>Products</h2><div class="grid grid--cards">${r.prods.map(productCard).join("")}</div>` : ""}`}
        </div></section>`,
      after() { $("#pageSearch").addEventListener("submit", (e) => { e.preventDefault(); location.hash = "#/search?q=" + encodeURIComponent($("#ps").value.trim()); }); }
    };
  };

  pages.notFound = () => ({
    title: "Page not found — The Fairy Folio",
    html: `<section class="section"><div class="container empty"><div class="big">🧚</div><h1>Oh no — page not found</h1><p>That page seems to have flown away.</p><a class="btn btn--primary" href="#/">Back to home</a></div></section>`
  });

  const emptySearch = (term) => `<div class="empty"><div class="big">🔍</div><h2>No results for “${esc(term)}”</h2><p>Try a different word, like “book”, “wedding” or “sticker”.</p><a class="btn btn--primary" href="#/">Browse all services</a></div>`;

  /* ---------------- search engine ---------------- */
  function runSearch(term) {
    const toks = term.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return { projects: [], cats: [], prods: [] };
    const score = (fields) => {
      const hay = fields.map((f) => (f.v || "").toString().toLowerCase());
      let total = 0;
      for (const t of toks) {
        let best = 0;
        fields.forEach((f, i) => { if (hay[i].includes(t)) best = Math.max(best, f.w); });
        if (!best) return 0; total += best;
      }
      return total;
    };
    const rank = (arr, fn) => arr.map((x) => ({ x, s: fn(x) })).filter((o) => o.s).sort((a, b) => b.s - a.s).map((o) => o.x);
    return {
      projects: rank(PROJ, (p) => score([{ v: p.title, w: 5 }, { v: p.type, w: 3 }, { v: cat(p.cat).name, w: 3 }, { v: p.style, w: 2 }, { v: p.desc, w: 1 }, { v: (p.tools || []).join(" "), w: 1 }, { v: (p.deliverables || []).join(" "), w: 1 }, { v: p.brief, w: 1 }])),
      cats: rank(CATS, (c) => score([{ v: c.name, w: 5 }, { v: c.short, w: 3 }, { v: c.covers.join(" "), w: 3 }, { v: c.intro, w: 1 }])),
      prods: rank(PRODS, (p) => score([{ v: p.name, w: 5 }, { v: p.type, w: 3 }, { v: p.format, w: 2 }, { v: p.desc, w: 1 }, { v: p.includes.join(" "), w: 1 }]))
    };
  }

  const so = { el: null, last: null };
  function renderSearchOverlay(term) {
    const out = $("#searchResults");
    if (!term.trim()) { out.innerHTML = '<p class="empty" style="padding:24px">Start typing to search projects, services and products.</p>'; return; }
    const r = runSearch(term);
    if (!r.projects.length && !r.cats.length && !r.prods.length) { out.innerHTML = emptySearch(term).replace('<a class="btn btn--primary" href="#/">Browse all services</a>', '<a class="btn btn--primary" href="#/" data-close-search>Browse all services</a>'); return; }
    const item = (href, art, t, sub) => `<a class="result-item" href="${href}" data-close-search><span class="rthumb">${art}</span><span><b>${esc(t)}</b><small>${esc(sub)}</small></span></a>`;
    out.innerHTML =
      (r.cats.length ? `<div class="results-group"><h3>Services</h3>${r.cats.slice(0, 4).map((c) => item("#/category/" + c.slug, window.FF_ART(c.kind, c.slug, ""), c.name, c.short)).join("")}</div>` : "") +
      (r.projects.length ? `<div class="results-group"><h3>Projects</h3>${r.projects.slice(0, 6).map((p) => item("#/project/" + p.id, projectImg(p), p.title, cat(p.cat).name + " · " + p.type)).join("")}</div>` : "") +
      (r.prods.length ? `<div class="results-group"><h3>Products</h3>${r.prods.slice(0, 5).map((p) => item("#/shop", productImg(p), p.name, p.type + " · " + money(p.price))).join("")}</div>` : "") +
      `<p style="text-align:center;margin-top:14px"><a class="btn btn--soft btn--sm" href="#/search?q=${encodeURIComponent(term)}" data-close-search>See all results</a></p>`;
  }

  /* ---------------- overlays (modal, lightbox, search) ---------------- */
  const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  let lastFocus = null;
  function openOverlay(el, focusSel) {
    lastFocus = document.activeElement; el.classList.add("open"); document.body.style.overflow = "hidden";
    const f = focusSel ? $(focusSel, el) : $(FOCUSABLE, el); if (f) setTimeout(() => f.focus(), 30);
  }
  function closeOverlay(el) {
    el.classList.remove("open");
    if (!$$(".overlay.open").length) document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openModal(html) { const m = $("#modalBox"); m.innerHTML = `<button class="icon-btn close" type="button" data-close aria-label="Close dialog">✕</button>` + html; openOverlay($("#modalOverlay")); }
  function openLightbox(html, trigger) { $("#lbContent").innerHTML = html; openOverlay($("#lightbox"), "#lbClose"); if (trigger) lastFocus = trigger; }
  function openSearch() { openOverlay($("#searchOverlay"), "#searchInput"); renderSearchOverlay($("#searchInput").value); }
  const closeSearch = () => closeOverlay($("#searchOverlay"));

  function openProductModal(id) {
    const p = prod(id); if (!p) return;
    openModal(`<div class="two-col" style="gap:24px;align-items:start"><div style="border-radius:16px;overflow:hidden">${productImg(p)}</div>
      <div><span class="tag ${p.format === "digital" ? "tag--digital" : "tag--sample"}">${p.format === "digital" ? "Digital download" : "Physical-product concept"}</span> <span class="tag tag--sample">Sample</span>
      <h2 id="modalTitle" style="margin-top:10px">${esc(p.name)}</h2><p>${esc(p.desc)}</p>
      <h3 style="font-size:1rem">What's included</h3><ul>${p.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      <p class="price" style="font-size:1.4rem">${money(p.price)}</p>
      <div class="detail-actions"><button class="btn btn--primary" type="button" data-add="${p.id}">Add to cart</button>
      <button class="btn btn--ghost" type="button" data-bm="s:${p.id}" aria-pressed="${isBm("s:" + p.id)}">${isBm("s:" + p.id) ? "♥ Saved" : "♡ Save"}</button></div></div></div>`);
  }

  /* ---------------- bookmarks & cart actions ---------------- */
  function toggleBm(key) {
    const was = isBm(key);
    bookmarks = was ? bookmarks.filter((k) => k !== key) : [...bookmarks, key];
    store.set("ff_bookmarks", bookmarks); updateBadges();
    $$(`[data-bm="${key}"]`).forEach((b) => {
      b.setAttribute("aria-pressed", !was);
      if (b.classList.contains("fav-btn")) b.setAttribute("aria-label", `${was ? "Save" : "Remove"} ${b.dataset.name || "item"} ${was ? "to" : "from"} bookmarks`);
      else b.textContent = was ? "♡ Save" : "♥ Saved";
    });
    toast(was ? "Removed from bookmarks" : "Saved to bookmarks");
    if (location.hash.startsWith("#/bookmarks") && was) route();
  }
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1; store.set("ff_cart", cart); updateBadges();
    toast("Added to cart · " + cartCount() + " item" + (cartCount() === 1 ? "" : "s"));
  }
  function setQty(id, d) {
    cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id];
    store.set("ff_cart", cart); updateBadges(); route(true);
  }

  /* ---------------- forms (validation + honest status) ---------------- */
  function bindForm(form, statusEl, subject) {
    if (!form) return;
    const setErr = (field, msg) => { const wrap = field.closest(".field"); wrap.classList.toggle("invalid", !!msg); const e = $(".err", wrap); if (e) e.textContent = msg || ""; field.setAttribute("aria-invalid", !!msg); };
    const check = (f) => {
      const v = f.value.trim();
      if (f.required && !v) return "This field is required.";
      if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
      if (f.type === "url" && v && !/^https?:\/\/\S+\.\S+/.test(v)) return "Please enter a full link starting with http:// or https://";
      if (f.name === "message" && v && v.length < 10) return "Please add a little more detail (at least 10 characters).";
      return "";
    };
    form.addEventListener("input", (e) => { if (e.target.closest(".field.invalid")) setErr(e.target, check(e.target)); });
    form.addEventListener("focusout", (e) => { if (e.target.matches("input,select,textarea") && e.target.value) setErr(e.target, check(e.target)); });
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); statusEl.innerHTML = "";
      const fields = $$("input,select,textarea", form); let first = null;
      fields.forEach((f) => { const m = check(f); setErr(f, m); if (m && !first) first = f; });
      if (first) { first.focus(); statusEl.innerHTML = '<div class="status status--err" role="alert">Please fix the highlighted fields and try again.</div>'; return; }
      const data = Object.fromEntries(fields.map((f) => [f.name, f.value.trim()]));
      if (data.service) { const c = cat(data.service); data.service = c ? c.name : (data.service === "custom" ? "Custom illustration commission" : "Something else"); }
      if (CFG.formEndpoint) {
        const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Sending…";
        try {
          const res = await fetch(CFG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error("HTTP " + res.status);
          statusEl.innerHTML = '<div class="status status--ok" role="status">✓ Thank you — your message was sent. We\'ll be in touch by email.</div>'; form.reset();
        } catch (err) {
          statusEl.innerHTML = `<div class="status status--err" role="alert">Sorry, your message could not be sent. Please try again, or email us at <a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a>.</div>`;
        }
        btn.disabled = false; btn.textContent = form.dataset.kind === "careers" ? "Send interest" : "Send enquiry";
        return;
      }
      // No backend configured: be honest — nothing has been sent.
      const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
      const mailto = `mailto:${CFG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      statusEl.innerHTML = `<div class="status status--info" role="status"><strong>Your message has NOT been sent yet.</strong> This website isn't connected to a form service, so nothing was submitted.
        To send it, <a href="${mailto}">open it in your email app</a> or <button type="button" class="btn btn--soft btn--sm" id="copyMsg">copy the text</button> and email <a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a>.</div>`;
      $("#copyMsg").onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(body) : Promise.reject()).then(() => toast("Copied to clipboard"), () => toast("Copy failed — please select the text manually")); };
    });
  }

  /* ---------------- chatbot ---------------- */
  const chat = { open: false, started: false };
  const log = () => $("#chatLog");
  function addMsg(html, who) { const d = document.createElement("div"); d.className = "msg msg--" + who; d.innerHTML = html; log().appendChild(d); log().scrollTop = log().scrollHeight; return d; }
  function answer(text) {
    const t = " " + text.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ") + " ";
    let best = null, bestScore = 0;
    FAQ.forEach((f) => { let s = 0; f.keys.forEach((k) => { if (t.includes(k.includes(" ") || k.length > 3 ? k : " " + k + " ")) s += k.includes(" ") ? 2 : 1; }); if (s > bestScore) { bestScore = s; best = f; } });
    return best || { a: "I'm not sure about that one. I can help with our services, process, shop, careers or how to contact us — or you can send the team a message.", links: [{ label: "Contact us", href: "#/contact" }, { label: "All services", href: "#/" }] };
  }
  function ask(text) {
    if (!text.trim()) return;
    addMsg(esc(text), "me");
    const typing = addMsg('<span class="typing" aria-label="Typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => {
      const r = answer(text); typing.remove();
      addMsg(esc(r.a) + (r.links && r.links.length ? `<div class="links">${r.links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}</div>` : ""), "bot");
    }, 450);
  }
  function setChat(open) {
    chat.open = open; $("#chatPanel").classList.toggle("open", open); $("#chatLauncher").setAttribute("aria-expanded", open);
    if (open) {
      if (!chat.started) {
        chat.started = true;
        addMsg("Hi! I'm the Fairy Folio helper ✨ Ask me about our services, process, shop or how to start a project.", "bot");
        $("#chatQuick").innerHTML = window.FF_QUICK_REPLIES.map((q) => `<button type="button">${esc(q)}</button>`).join("");
      }
      setTimeout(() => $("#chatInput").focus(), 50);
    }
  }

  /* ---------------- router ---------------- */
  function parseHash() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const query = Object.fromEntries(new URLSearchParams(qs || ""));
    return { parts: path.split("/").filter(Boolean), query };
  }
  let revealIO;
  function revealAll() {
    if (document.documentElement.classList.contains("splash-on")) return; // wait until the splash has finished
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
    revealIO = revealIO || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } }), { threshold: .08 });
    $$(".reveal:not(.in)").forEach((e) => revealIO.observe(e));
  }

  function route(keepScroll) {
    const { parts, query } = parseHash();
    const [a, b] = parts;
    // in-page anchors such as "#services" / "#featured"
    if (location.hash && !location.hash.startsWith("#/")) {
      const id = location.hash.slice(1);
      if (!$("#" + id) || id === "main") { location.hash = "#/"; return; }
      $("#" + id).scrollIntoView({ behavior: "smooth" }); return;
    }
    let page;
    if (!a) page = pages.home();
    else if (a === "category") page = pages.category(b);
    else if (a === "project") page = pages.project(b);
    else if (Object.prototype.hasOwnProperty.call(pages, a) && !["notFound", "home", "category", "project"].includes(a)) page = pages[a](query);
    else page = pages.notFound();

    const main = $("#main"); const y = window.scrollY;
    main.innerHTML = page.html; document.title = page.title;
    if (page.after) page.after();
    revealAll();
    $$("[data-nav]").forEach((l) => l.removeAttribute("aria-current"));
    const navKey = !a ? "home" : (["shop", "cart"].includes(a) ? "shop" : a);
    const cur = $(`[data-nav="${navKey}"]`); if (cur) cur.setAttribute("aria-current", "page");
    if (keepScroll === true) window.scrollTo(0, y); else { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
    setMenu(false);
    $("#navDd").classList.remove("open"); $("#ddBtn").setAttribute("aria-expanded", "false");
    main.classList.remove("main-reveal"); void main.offsetWidth; main.classList.add("main-reveal");
  }

  /* ---------------- mobile menu (animated hamburger drawer) ---------------- */
  function setMenu(open, returnFocus) {
    const nav = $("#mainNav"), btn = $("#menuToggle"), was = nav.classList.contains("open");
    if (open === was) return;
    nav.classList.toggle("open", open);
    $("#navBackdrop").classList.toggle("show", open);
    document.documentElement.classList.toggle("nav-locked", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) { const f = $("#mainNav > a"); if (f && window.innerWidth <= 900) setTimeout(() => f.focus({ preventScroll: true }), 120); }
    else { $("#navDd").classList.remove("open"); $("#ddBtn").setAttribute("aria-expanded", "false"); if (returnFocus) btn.focus(); }
  }

  /* ---------------- splash screen ---------------- */
  function initSplash() {
    const root = document.documentElement, sp = $("#splash");
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      sp.classList.add("hide"); root.classList.remove("splash-on");
      revealAll();
      setTimeout(() => { sp.remove(); }, 1100);
    };
    if (!sp) { root.classList.remove("splash-on"); return; }
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("#splashSkip").addEventListener("click", finish);
    sp.addEventListener("click", finish);
    setTimeout(finish, reduce ? 900 : 3600);
  }

  /* ---------------- scroll effects ---------------- */
  function initScroll() {
    const header = $(".site-header"), bar = $("#scrollProgress"), top = $("#toTop");
    let ticking = false;
    const update = () => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle("scrolled", y > 12);
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
      top.classList.toggle("show", y > 600);
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    update();
  }

  /* ---------------- global wiring ---------------- */
  function wire() {
    // build nav + footer from data
    $("#ddMenu").innerHTML = `<div class="dd-inner">` + CATS.map((c) => `<a href="#/category/${c.slug}">${c.icon} ${esc(c.name)}</a>`).join("") + `</div>`;
    $("#footCats").innerHTML = CATS.map((c) => `<li><a href="#/category/${c.slug}">${esc(c.name)}</a></li>`).join("");
    $("#footContact").innerHTML = `<li>✉️ <a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a></li>` +
      CFG.socials.map((s) => `<li><a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("") +
      `<li><a href="#/contact">Project enquiry form</a></li>`;
    $("#yr").textContent = new Date().getFullYear();

    // dropdown + mobile menu
    $("#ddBtn").addEventListener("click", (e) => { e.stopPropagation(); const o = $("#navDd").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", o); });
    $("#menuToggle").addEventListener("click", () => setMenu(!$("#mainNav").classList.contains("open")));
    $("#navBackdrop").addEventListener("click", () => setMenu(false));
    // tapping a link in the drawer closes it (also when the link points to the current page)
    $("#mainNav").addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenu(false); });
    document.addEventListener("click", (e) => { if (!e.target.closest("#navDd")) { $("#navDd").classList.remove("open"); $("#ddBtn").setAttribute("aria-expanded", "false"); } });

    // search
    $("#searchBtn").addEventListener("click", openSearch);
    $("#searchClose").addEventListener("click", closeSearch);
    $("#searchClear").addEventListener("click", () => { $("#searchInput").value = ""; renderSearchOverlay(""); $("#searchInput").focus(); });
    $("#searchInput").addEventListener("input", (e) => renderSearchOverlay(e.target.value));
    $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#searchInput").value.trim(); if (v) { location.hash = "#/search?q=" + encodeURIComponent(v); closeSearch(); } });
    $("#searchOverlay").addEventListener("click", (e) => { if (e.target.id === "searchOverlay" || e.target.closest("[data-close-search]")) closeSearch(); });

    // modal + lightbox
    $("#modalOverlay").addEventListener("click", (e) => { if (e.target.id === "modalOverlay" || e.target.closest("[data-close]")) closeOverlay($("#modalOverlay")); });
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox" || e.target.closest("#lbClose")) closeOverlay($("#lightbox")); });

    // delegated actions
    document.addEventListener("click", (e) => {
      const bm = e.target.closest("[data-bm]"); if (bm) { e.preventDefault(); toggleBm(bm.dataset.bm); return; }
      const add = e.target.closest("[data-add]"); if (add) { addToCart(add.dataset.add); return; }
      const q = e.target.closest("[data-qty]"); if (q) { setQty(q.dataset.id, +q.dataset.qty); return; }
      const rm = e.target.closest("[data-remove]"); if (rm) { delete cart[rm.dataset.remove]; store.set("ff_cart", cart); updateBadges(); route(true); return; }
      const pr = e.target.closest("[data-product]"); if (pr) { e.preventDefault(); openProductModal(pr.dataset.product); return; }
      if (e.target.closest(".chat-panel a") && window.innerWidth < 620) setChat(false);
    });

    // keyboard: Esc closes, "/" opens search, Tab trapped in overlays
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const open = $$(".overlay.open").pop();
        if (open) closeOverlay(open); else if (chat.open) { setChat(false); $("#chatLauncher").focus(); }
        if ($("#mainNav").classList.contains("open")) setMenu(false, true);
        $("#navDd").classList.remove("open");
      } else if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$$(".overlay.open").length) { e.preventDefault(); openSearch(); }
      else if (e.key === "Tab" && $("#mainNav").classList.contains("open") && window.innerWidth <= 900 && !$$(".overlay.open").length) {
        const f = [$("#menuToggle"), ...$$("#mainNav a, #mainNav button")].filter((x) => x.offsetParent !== null);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      else if (e.key === "Tab") {
        const open = $$(".overlay.open").pop(); if (!open) return;
        const f = $$(FOCUSABLE, open).filter((x) => x.offsetParent !== null); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // chatbot
    $("#chatLauncher").addEventListener("click", () => setChat(!chat.open));
    $("#chatClose").addEventListener("click", () => { setChat(false); $("#chatLauncher").focus(); });
    $("#chatForm").addEventListener("submit", (e) => { e.preventDefault(); const i = $("#chatInput"); const v = i.value; i.value = ""; ask(v); });
    $("#chatQuick").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); });

    window.addEventListener("hashchange", () => route());
    window.addEventListener("storage", (e) => { if (e.key === "ff_cart" || e.key === "ff_bookmarks") { bookmarks = store.get("ff_bookmarks", []); cart = store.get("ff_cart", {}); updateBadges(); } });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener("DOMContentLoaded", () => { wire(); updateBadges(); route(); initScroll(); initSplash(); });
})();
