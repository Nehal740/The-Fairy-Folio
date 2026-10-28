"""Automated end-to-end tests for The Fairy Folio.
Run:  pip install playwright && playwright install chromium && python tests/e2e.py
"""
import sys, json
from playwright.sync_api import sync_playwright

import pathlib, tempfile
ROOT = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
OUT = tempfile.mkdtemp(prefix="ff-shots-") + "/"  # screenshots land here
print("Screenshots ->", OUT)
results = []
errors = []

def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + (" — " + str(detail) if detail and not cond else ""))

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1366, "height": 900})
    pg = ctx.new_page()
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" and "ERR_TUNNEL" not in m.text and "Failed to load resource" not in m.text else None)
    pg.on("pageerror", lambda e: errors.append("PAGEERROR " + str(e)))
    pg.goto(ROOT); pg.wait_for_selector(".hero")

    check("Home shows brand + tagline", "The Fairy Folio" in pg.title() and "Where Imagination Meets Creativity" in pg.inner_text("body"))
    check("Home: 6 category cards", pg.locator("#services .cat-card").count() == 6)
    check("Home: logo in header and hero", pg.locator(".brand img").count() == 1 and pg.locator(".hero-art img").count() == 1)
    check("Home: logo images loaded", pg.evaluate("[...document.images].filter(i=>i.src.includes('logo')).every(i=>i.complete&&i.naturalWidth>0)"))
    pg.screenshot(path=OUT + "shot_home.png", full_page=False)
    pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
    pg.screenshot(path=OUT + "shot_home_full.png", full_page=True)

    # all six hubs + their cards -> detail
    slugs = pg.evaluate("window.FF_CATEGORIES.map(c=>c.slug)")
    for s in slugs:
        pg.goto(ROOT + "#/category/" + s); pg.wait_for_selector("#hubGrid")
        n = pg.locator("#hubGrid .card").count()
        check(f"Hub {s}: has cards", n >= 3, n)
        first = pg.locator("#hubGrid .card h3 a").first
        title = first.inner_text(); first.click(); pg.wait_for_selector(".detail")
        check(f"Hub {s}: card opens matching detail", title in pg.inner_text("h1"), title)
        check(f"Detail {s}: breadcrumb back link", pg.locator(".crumbs a").count() >= 2)

    # hub filter
    pg.goto(ROOT + "#/category/wedding"); pg.wait_for_selector("#hubGrid")
    pg.click('#hubToolbar .chip[data-filter="Invitation"]')
    check("Hub filter narrows results", pg.locator("#hubGrid .card").count() == 1)
    pg.click("#hubToolbar .chip[data-featured]")
    check("Hub empty state when filters conflict", pg.locator("#resetHub").count() == 1)
    pg.click("#resetHub")
    check("Hub reset restores all", pg.locator("#hubGrid .card").count() == 4)
    pg.select_option("#hubSort", "az")
    titles = pg.locator("#hubGrid .card h3").all_inner_texts()
    check("Hub sort A-Z", titles == sorted(titles, key=lambda t: t), titles)

    # project detail: gallery, lightbox, related, bookmark
    pg.goto(ROOT + "#/project/cb-1"); pg.wait_for_selector(".detail")
    check("Detail: 3 gallery thumbs", pg.locator("#thumbs button").count() == 3)
    pg.click('#thumbs button[data-i="2"]')
    check("Detail: thumb switches current", pg.get_attribute('#thumbs button[data-i="2"]', "aria-current") == "true")
    pg.click("#galleryMain"); check("Lightbox opens", pg.locator("#lightbox.open").count() == 1)
    pg.keyboard.press("Escape"); check("Lightbox closes with Esc", pg.locator("#lightbox.open").count() == 0)
    check("Detail: related work present", pg.locator("h2:has-text('Related work')").count() == 1 and pg.locator(".section .card").count() >= 3)
    check("Detail: enquiry CTA prefilled link", "category=childrens-book&project=cb-1" in pg.get_attribute("a:has-text('Enquire about similar work')", "href"))
    pg.click("#detailBm")
    check("Bookmark toggled on (aria-pressed)", pg.get_attribute("#detailBm", "aria-pressed") == "true")
    check("Bookmark badge shows 1", pg.inner_text("#bmCount") == "1")
    pg.reload(); pg.wait_for_selector(".detail")
    check("Bookmark persists after reload", pg.inner_text("#bmCount") == "1")

    # bookmarks page
    pg.goto(ROOT + "#/bookmarks"); pg.wait_for_selector(".page-head")
    check("Bookmarks page lists saved project", pg.locator(".card").count() == 1)
    pg.click(".fav-btn")
    check("Unsave empties page (empty state)", pg.locator(".empty").count() == 1)

    # search overlay
    pg.goto(ROOT + "#/"); pg.wait_for_selector(".hero")
    pg.keyboard.press("/"); check("'/' opens search", pg.locator("#searchOverlay.open").count() == 1)
    pg.fill("#searchInput", "wedding")
    check("Live search finds category & projects", pg.locator("#searchResults .result-item").count() >= 3)
    pg.fill("#searchInput", "sticker")
    check("Search finds products", "Sticker Pack" in pg.inner_text("#searchResults"))
    pg.fill("#searchInput", "zzzzqq")
    check("Search empty state", "No results" in pg.inner_text("#searchResults"))
    pg.click("#searchClear"); check("Clear resets input", pg.input_value("#searchInput") == "")
    pg.fill("#searchInput", "fairy"); pg.press("#searchInput", "Enter")
    pg.wait_for_selector("#pageSearch")
    check("Enter goes to results page", "#/search?q=fairy" in pg.url and pg.locator("#main .card").count() >= 1)
    pg.goto(ROOT + "#/"); pg.keyboard.press("/"); pg.fill("#searchInput", "moonlit")
    pg.click("#searchResults .result-item >> nth=0"); pg.wait_for_selector(".detail")
    check("Result links to project", "#/project/cb-1" in pg.url)

    # shop + cart
    pg.goto(ROOT + "#/shop"); pg.wait_for_selector("#shopGrid")
    check("Shop shows 8 products", pg.locator("#shopGrid .card").count() == 8)
    pg.click('#shopChips .chip[data-f="physical"]')
    check("Shop physical filter", pg.locator("#shopGrid .card").count() == 2)
    pg.click('#shopChips .chip[data-f=""]')
    pg.click('[data-add="p-1"]'); pg.click('[data-add="p-1"]'); pg.click('[data-add="p-3"]')
    check("Cart badge = 3", pg.inner_text("#cartCount") == "3")
    pg.click('#shopGrid .card h3 a >> nth=1'); check("Product modal opens", pg.locator("#modalOverlay.open").count() == 1 and "What's included" in pg.inner_text("#modalBox"))
    pg.keyboard.press("Escape")
    pg.goto(ROOT + "#/cart"); pg.wait_for_selector(".summary")
    check("Cart total = 2x$8 + $15 = $31.00", "$31.00" in pg.inner_text(".summary .total"), pg.inner_text(".summary .total"))
    pg.click('[data-qty="1"] >> nth=0')
    check("Qty + updates total to $39.00", "$39.00" in pg.inner_text(".summary .total"))
    pg.click('[data-qty="-1"] >> nth=0'); pg.click('[data-remove="p-3"]')
    check("Remove updates total to $16.00", "$16.00" in pg.inner_text(".summary .total"), pg.inner_text(".summary .total"))
    pg.click("#checkoutBtn"); check("Checkout is honest demo", "no order has been placed" in pg.inner_text("#modalBox").lower() or "no order" in pg.inner_text("#modalBox").lower())
    pg.keyboard.press("Escape")
    pg.click("#clearCart"); check("Clear cart -> empty state", pg.locator(".empty").count() == 1)

    # contact form
    pg.goto(ROOT + "#/contact?category=wedding&project=wd-1"); pg.wait_for_selector("#contactForm")
    check("Contact prefilled category", pg.input_value("#f_cat") == "wedding")
    check("Contact prefilled message", "Couple Portrait" in pg.input_value("#f_msg"))
    pg.fill("#f_msg", ""); pg.click("#contactForm button[type=submit]")
    check("Validation errors shown", pg.locator("#contactForm .field.invalid").count() >= 3)
    pg.fill("#f_name", "Test Person"); pg.fill("#f_email", "nope"); pg.fill("#f_msg", "A short brief for a wedding portrait.")
    pg.click("#contactForm button[type=submit]")
    check("Invalid email flagged", "valid email" in pg.inner_text("#contactForm").lower())
    pg.fill("#f_email", "test@example.com"); pg.click("#contactForm button[type=submit]")
    st = pg.inner_text("#contactStatus")
    check("Honest status: not sent + mailto fallback", "NOT been sent" in st and pg.locator('#contactStatus a[href^="mailto:"]').count() >= 1, st)

    # careers + about
    pg.goto(ROOT + "#/careers"); pg.wait_for_selector("#careerForm")
    check("Careers: no fake openings notice", "no listed openings" in pg.inner_text("main").lower())
    pg.goto(ROOT + "#/about"); pg.wait_for_selector(".timeline")
    check("About: 6 process steps", pg.locator(".timeline li").count() == 6)

    # chatbot
    pg.goto(ROOT + "#/"); pg.wait_for_selector(".hero")
    pg.click("#chatLauncher"); check("Chat opens with greeting", pg.locator("#chatPanel.open").count() == 1 and pg.locator(".msg--bot").count() == 1)
    pg.click("#chatQuick button >> nth=0"); pg.wait_for_selector(".msg--bot >> nth=1"); pg.wait_for_timeout(700)
    check("Chat answers services w/ links", pg.locator(".msg--bot .links a").count() >= 1)
    pg.fill("#chatInput", "can you quote me a price?"); pg.press("#chatInput", "Enter"); pg.wait_for_timeout(800)
    txt = pg.locator(".msg--bot").last.inner_text()
    check("Chat does not claim to quote", "can't give a quote" in txt, txt)
    pg.fill("#chatInput", "asdfgh qwerty"); pg.press("#chatInput", "Enter"); pg.wait_for_timeout(800)
    check("Chat fallback works", "not sure" in pg.locator(".msg--bot").last.inner_text())
    pg.screenshot(path=OUT + "shot_chat.png")
    pg.keyboard.press("Escape"); check("Chat closes with Esc", pg.locator("#chatPanel.open").count() == 0)

    # every-page presence of global controls
    allok = True
    for r in ["#/", "#/category/wedding", "#/project/bc-1", "#/shop", "#/cart", "#/bookmarks", "#/about", "#/careers", "#/contact", "#/search?q=book"]:
        pg.goto(ROOT + r); pg.wait_for_selector("main > *")
        ok = all(pg.locator(s).count() >= 1 for s in ["#searchBtn", '.header-tools a[href="#/bookmarks"]', '.main-nav a[href="#/about"]', '.main-nav a[href="#/contact"]', "#chatLauncher"])
        allok &= ok
        if not ok: print("  missing global on", r)
    check("Search/Bookmarks/About/Contact/Chatbot on every page", allok)

    # 404 + broken-link scan
    pg.goto(ROOT + "#/nope"); check("404 page", "not found" in pg.inner_text("main").lower())
    pg.goto(ROOT + "#/constructor"); check("Prototype-name route -> 404 safely", "not found" in pg.inner_text("main").lower())
    hrefs = set()
    for r in ["#/", "#/about", "#/shop", "#/careers", "#/category/book-cover"]:
        pg.goto(ROOT + r); pg.wait_for_selector("main > *")
        pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
        hrefs |= set(pg.evaluate("[...document.querySelectorAll('a[href^=\"#/\"]')].map(a=>a.getAttribute('href'))"))
    bad = []
    for h in sorted(hrefs):
        pg.goto(ROOT + h); pg.wait_for_selector("main > *")
        if "not found" in pg.inner_text("main").lower() and "nope" not in h: bad.append(h)
    check(f"No broken internal links ({len(hrefs)} checked)", not bad, bad)

    # a11y spot checks
    pg.goto(ROOT + "#/"); pg.wait_for_selector(".hero")
    check("All images have alt", pg.evaluate("[...document.querySelectorAll('img')].every(i=>i.hasAttribute('alt'))"))
    check("Skip link + main landmark", pg.locator(".skip-link").count() == 1 and pg.locator("main#main").count() == 1)
    check("Form inputs have labels", pg.evaluate("(()=>{location.hash='#/contact';return true})()"))
    pg.wait_for_selector("#contactForm")
    check("Every contact field has a label", pg.evaluate("[...document.querySelectorAll('#contactForm input,#contactForm select,#contactForm textarea')].every(f=>document.querySelector('label[for=\"'+f.id+'\"]'))"))

    # responsive: mobile & tablet
    for name, w, h in [("mobile", 390, 844), ("tablet", 820, 1100)]:
        c2 = b.new_context(viewport={"width": w, "height": h}); q = c2.new_page(); q.on("pageerror", lambda e: errors.append("PAGEERROR " + str(e)))
        q.goto(ROOT); q.wait_for_selector(".hero")
        sw = q.evaluate("document.documentElement.scrollWidth"); check(f"{name}: no horizontal scroll", sw <= w + 1, sw)
        q.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
        q.screenshot(path=OUT + f"shot_{name}.png")
        if name == "mobile":
            q.click("#menuToggle"); check("mobile: menu opens", q.locator("#mainNav.open").count() == 1)
            q.screenshot(path=OUT + "shot_mobile_menu.png")
            q.click('#mainNav a[href="#/shop"]'); q.wait_for_selector("#shopGrid")
            check("mobile: menu closes on navigate", q.locator("#mainNav.open").count() == 0)
            q.goto(ROOT + "#/project/cb-1"); q.wait_for_selector(".detail")
            check("mobile project: no h-scroll", q.evaluate("document.documentElement.scrollWidth") <= w + 1)
            q.goto(ROOT + "#/cart"); q.wait_for_selector("main > *")
            check("mobile cart: no h-scroll", q.evaluate("document.documentElement.scrollWidth") <= w + 1)
        c2.close()

    # page screenshots for visual review
    for nm, r in [("hub", "#/category/childrens-book"), ("detail", "#/project/cd-1"), ("shop", "#/shop"), ("contact", "#/contact"), ("about", "#/about")]:
        pg.goto(ROOT + r); pg.wait_for_selector("main > *")
        pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))"); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT + f"shot_{nm}.png")
    b.close()

check("No JS console errors", not errors, errors[:5])
fails = [r for r in results if not r[1]]
print(f"\n{len(results)-len(fails)}/{len(results)} passed")
json.dump(results, open(OUT + "results.json", "w"))
sys.exit(1 if fails else 0)
