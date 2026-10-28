/* ==========================================================
   Placeholder artwork generator (inline SVG, palette-only).
   Used ONLY when a project/product has no real image yet.
   Replace by adding real files to `images: []` in data.js.
   ========================================================== */
(function () {
  const P = { sage: "#A9AD92", cream: "#FBEAB2", peach: "#FAC68A", blush: "#F2ABAF", rose: "#D5799E", purple: "#9275A5", ink: "#4a3358", white: "#fffaf0" };
  const PAIRS = [
    [P.cream, P.peach], [P.blush, P.cream], [P.peach, P.blush],
    [P.cream, P.sage], [P.blush, P.purple], [P.peach, P.rose]
  ];
  let uid = 0;

  function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
  function rnd(seed) { let s = seed || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  const stars = (r, n, fill) => Array.from({ length: n }, () => {
    const x = 20 + r() * 360, y = 15 + r() * 120, s = 2 + r() * 4;
    return `<path d="M${x} ${y - s * 2}L${x + s * .6} ${y - s * .6}L${x + s * 2} ${y}L${x + s * .6} ${y + s * .6}L${x} ${y + s * 2}L${x - s * .6} ${y + s * .6}L${x - s * 2} ${y}L${x - s * .6} ${y - s * .6}Z" fill="${fill}" opacity=".85"/>`;
  }).join("");

  const scenes = {
    children(r, c) {
      return `${stars(r, 9, P.white)}
        <circle cx="${300 + r() * 40}" cy="70" r="34" fill="${P.cream}" opacity=".95"/>
        <path d="M0 230 Q90 170 190 225 T400 205 V300 H0Z" fill="${P.sage}"/>
        <path d="M0 262 Q120 220 230 258 T400 245 V300 H0Z" fill="${c[1] === P.sage ? P.purple : P.sage}" opacity=".85"/>
        <g transform="translate(150 175)"><path d="M0 40 L50 28 L100 40 L100 70 L50 58 L0 70Z" fill="${P.white}" stroke="${P.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M50 28 V58" stroke="${P.ink}" stroke-width="2"/>
        <circle cx="50" cy="12" r="13" fill="${P.peach}" stroke="${P.ink}" stroke-width="2"/><path d="M38 6 q12 -14 24 0" fill="${P.cream}" stroke="${P.ink}" stroke-width="2"/></g>`;
    },
    character(r, c) {
      const cols = [P.rose, P.purple, P.sage];
      return [0, 1, 2].map(i => {
        const x = 75 + i * 125, s = i === 1 ? 1.15 : 1;
        return `<g transform="translate(${x} ${150 - (s - 1) * 40}) scale(${s})">
          <rect x="-28" y="30" width="56" height="70" rx="26" fill="${cols[(i + (r() * 3 | 0)) % 3]}" stroke="${P.ink}" stroke-width="2.5"/>
          <circle cx="0" cy="5" r="34" fill="${P.peach}" stroke="${P.ink}" stroke-width="2.5"/>
          <path d="M-34 0 q10 -38 34 -32 q28 -4 34 32 q-20 -18 -34 -14 q-16 -3 -34 14Z" fill="${[P.cream, P.blush, P.sage][i]}" stroke="${P.ink}" stroke-width="2.5"/>
          <circle cx="-12" cy="8" r="3" fill="${P.ink}"/><circle cx="12" cy="8" r="3" fill="${P.ink}"/>
          <path d="M-8 22 q8 ${6 + i * 3} 16 0" fill="none" stroke="${P.ink}" stroke-width="2.5" stroke-linecap="round"/></g>`;
      }).join("") + stars(r, 5, P.white);
    },
    wedding(r) {
      return `<path d="M120 270 V120 Q120 40 200 40 Q280 40 280 120 V270" fill="none" stroke="${P.sage}" stroke-width="10" stroke-linecap="round"/>
        ${Array.from({ length: 14 }, (_, i) => { const a = Math.PI + i * (Math.PI / 13); const x = 200 + Math.cos(a) * 80, y = 120 + Math.sin(a) * 80; return `<circle cx="${x}" cy="${y}" r="${7 + r() * 6}" fill="${[P.rose, P.blush, P.cream, P.peach][i % 4]}" stroke="${P.white}" stroke-width="1.5"/>`; }).join("")}
        <circle cx="185" cy="195" r="26" fill="none" stroke="${P.purple}" stroke-width="7"/><circle cx="218" cy="195" r="26" fill="none" stroke="${P.rose}" stroke-width="7"/>
        <path d="M200 160 l6 -10 l6 10 l-6 7Z" fill="${P.white}" stroke="${P.ink}" stroke-width="1.5"/>`;
    },
    cover(r, c) {
      return `<g transform="rotate(${-5 + r() * 10} 200 150)"><rect x="115" y="28" width="170" height="244" rx="8" fill="${P.purple}" stroke="${P.ink}" stroke-width="3"/>
        <rect x="115" y="28" width="14" height="244" rx="4" fill="${P.ink}" opacity=".35"/>
        <circle cx="205" cy="105" r="42" fill="${P.cream}"/><path d="M135 150 Q205 90 275 150 V180 H135Z" fill="${P.sage}"/>
        <rect x="145" y="196" width="110" height="12" rx="6" fill="${P.white}"/><rect x="165" y="218" width="70" height="8" rx="4" fill="${P.blush}"/><rect x="175" y="244" width="50" height="6" rx="3" fill="${P.peach}"/></g>`;
    },
    merch(r) {
      return `<path d="M110 60 L155 40 Q200 70 245 40 L290 60 L330 110 L292 130 L280 112 V250 H120 V112 L108 130 L70 110Z" fill="${P.white}" stroke="${P.ink}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="200" cy="150" r="42" fill="${P.blush}"/><path d="M200 120 l10 22 l24 3 l-18 16 l5 24 l-21 -12 l-21 12 l5 -24 l-18 -16 l24 -3Z" fill="${P.purple}"/>
        <g transform="translate(300 215) rotate(12)"><circle r="30" fill="${P.peach}" stroke="${P.white}" stroke-width="5"/><circle r="10" fill="${P.rose}"/></g>
        <g transform="translate(70 215) rotate(-10)"><rect x="-26" y="-26" width="52" height="52" rx="14" fill="${P.sage}" stroke="${P.white}" stroke-width="5"/><path d="M-8 -2 l8 10 l12 -16" fill="none" stroke="${P.white}" stroke-width="5" stroke-linecap="round"/></g>`;
    },
    editorial(r) {
      return `<circle cx="140" cy="130" r="80" fill="${P.rose}" opacity=".9"/><rect x="190" y="70" width="140" height="140" rx="26" fill="${P.purple}" opacity=".9" transform="rotate(12 260 140)"/>
        <path d="M60 250 Q200 120 350 250Z" fill="${P.sage}"/><circle cx="270" cy="78" r="26" fill="${P.cream}"/>
        <path d="M70 70 h90 M70 90 h60" stroke="${P.ink}" stroke-width="5" stroke-linecap="round"/>${stars(r, 5, P.white)}`;
    }
  };

  window.FF_ART = function (kind, seedStr, label) {
    const seed = hash(seedStr || kind);
    const r = rnd(seed);
    const c = PAIRS[seed % PAIRS.length];
    const id = "g" + (++uid);
    const fn = scenes[kind] || scenes.editorial;
    return `<svg class="art" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label || "Illustration placeholder"}" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#${id})"/>${fn(r, c)}</svg>`;
  };
})();
