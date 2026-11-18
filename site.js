/* ==========================================================================
   site.js — ΚΟΙΝΟ ΓΙΑ ΟΛΕΣ ΤΙΣ ΣΕΛΙΔΕΣ: κεφαλίδα/μενού, υποσέλιδο, γλώσσα, θέμα.
   Για να προσθέσεις ή να αλλάξεις σύνδεσμο του μενού, το κάνεις ΜΟΝΟ εδώ (πίνακας NAV).
   Εδώ είναι και: υποσέλιδο (SOCIAL), σκελετός σελίδας (SITE.page), δρομολογητής (SITE.route), lightbox (LB).
   Κάθε σελίδα έχει <header class="navbar" id="siteHeader"></header> και <footer id="siteFooter"></footer>
   και στο τέλος καλεί:  SITE.init({ active: "maps", title: { el: "...", en: "..." } });
   Δικές της μεταφράσεις προσθέτει με  SITE.extend({ el: {...}, en: {...} }).
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Μενού: [κλειδί, σύνδεσμος, κλειδί μετάφρασης, υπομενού] ---------- */
  const NAV = [
    ["home",    "index.html",   "navHome"],
    ["history", "history.html", "navHistory", [
      ["history.html#/istoria/kataskevi",     "navConstruction"],
      ["history.html#/istoria/a-pagkosmios",  "navWW1"],
      ["history.html#/istoria/v-pagkosmios",  "navWW2"],
      ["history.html#/istoria/metapolemika",  "navPostWar"],
      ["history.html#/istoria/tilediikisi",   "navSignalling"],
      ["history.html#/istoria/simera",        "navToday"]]],
    ["tech",    "texnika.html", "navEngineering", [
      ["texnika.html#/texnika/gefyres",       "navBridges"],
      ["texnika.html#/texnika/siraggew",      "navTunnels"],
      ["texnika.html#/texnika/stathmoi",      "navStations"]]],
    ["maps",    "xartes.html",  "navMaps", [
      ["xartes.html#/xartes/enas",            "navMap"],
      ["xartes.html#/xartes/mikotomi",        "navProfile"],
      ["xartes.html#/xartes/mellon",          "navFuture"]]],
    ["books",   "index.html#books",   "navBooks"],
    ["contact", "index.html#contact", "navContact"]
  ];

  const T = {
    el: {
      navHome: "Αρχική", navHistory: "Ιστορία",
      navConstruction: "Κατασκευή", navWW1: "Α' Παγκόσμιος Πόλεμος", navWW2: "Β' Παγκόσμιος Πόλεμος",
      navPostWar: "Μεταπολεμικά", navSignalling: "Τηλεδιοίκηση", navToday: "Σήμερα",
      navEngineering: "Τεχνικά", navBridges: "Γέφυρες", navTunnels: "Σήραγγες", navStations: "Σταθμοί - Στάσεις",
      navMaps: "Χάρτες", navMap: "Ενιαίος Χάρτης", navProfile: "Μηκοτομή", navFuture: "Μελλοντικές Προσθήκες",
      navBooks: "Βιβλία", navContact: "Επικοινωνία",
      footerText: "Ιστορία · Μηχανική · Φύση", backTop: "Επιστροφή στην κορυφή ↑"
    },
    en: {
      navHome: "Home", navHistory: "History",
      navConstruction: "Construction", navWW1: "World War I", navWW2: "World War II",
      navPostWar: "Post-War", navSignalling: "Signalling", navToday: "Today",
      navEngineering: "Engineering", navBridges: "Bridges", navTunnels: "Tunnels", navStations: "Stations & Stops",
      navMaps: "Maps", navMap: "Unified Map", navProfile: "Longitudinal Profile", navFuture: "Future Additions",
      navBooks: "Books", navContact: "Contact",
      footerText: "History · Engineering · Nature", backTop: "Back to top ↑"
    }
  };

  const BRAND_SVG = `<svg class="brand-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M 28 5 H 58 C 76 5 87 13 87 26 C 87 35 81 42 71 45 C 83 48 91 57 91 69 C 91 85 78 94 56 94 H 3 V 89 C 3 88 4 87 6 87 C 19 86 35 79 35 66 V 42 C 35 33 28 29 19 27 C 18 26 18 25 18 23 V 15 C 18 9 22 5 28 5 Z M 50 18 V 41 H 57 C 66 41 72 36 72 29 C 72 22 66 18 57 18 H 50 Z M 50 53 V 81 H 58 C 69 81 75 76 75 67 C 75 58 69 53 58 53 H 50 Z" /></svg>`;

  /* ---------- Υποσέλιδο: εικονίδια κοινωνικών δικτύων (άλλαξε ΜΟΝΟ τους συνδέσμους εδώ) ---------- */
  const SOCIAL = [
    ["Facebook",  "https://www.facebook.com/ΒΑΛΕ_ΕΔΩ_ΤΗΝ_ΣΕΛΙΔΑ",
      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.5v3h2.5V21h3.5z"/></svg>`],
    ["Instagram", "https://www.instagram.com/ΒΑΛΕ_ΕΔΩ_ΤΟ_ΠΡΟΦΙΛ",
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>`],
    ["YouTube",   "https://www.youtube.com/ΒΑΛΕ_ΕΔΩ_ΤΟ_ΚΑΝΑΛΙ",
      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>`],
    ["TikTok",    "https://www.tiktok.com/@ΒΑΛΕ_ΕΔΩ_ΤΟ_ΠΡΟΦΙΛ",
      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v2.8c-1.3.1-2.5-.3-3.8-1.1v5.5c0 3.5-2.5 5.9-5.6 5.9A5.6 5.6 0 0 1 5.5 14.4c0-3.3 2.8-5.8 6.3-5.4v2.9c-1.7-.5-3.3.4-3.3 2.1 0 1.3 1 2.3 2.3 2.3 1.5 0 2.4-1 2.4-2.6V3h2.9z"/></svg>`],
    ["Email",     "mailto:ΒΑΛΕ_ΕΔΩ_ΤΟ_EMAIL",
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5 12 13.5l8.5-6"/></svg>`]
  ];
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SITE = window.SITE = {
    lang: "el", theme: "light", pageTitle: null,

    extend(dict) { ["el", "en"].forEach(l => Object.assign(T[l], dict[l] || {})); },
    t(key) { return (T[this.lang] && T[this.lang][key]) || T.el[key] || ""; },
    pick(o) { return o ? (o[this.lang] ?? o.el ?? "") : ""; },      // { el, en } -> κείμενο
    esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); },

    /* Σκελετός εσωτερικής σελίδας (κεφαλίδα + τίτλος + κουμπιά + περιοχή περιεχομένου).
       Η σελίδα έχει μόνο  <main id="app"></main>.  Επιστρέφει το στοιχείο του περιεχομένου. */
    page(opts) {
      const app = document.getElementById("app");
      app.classList.add("page-main");
      app.innerHTML = `
        <section class="sectionh" id="introduction"><div class="page-headh"><div class="containerh page-in">
          <div class="eyebrowh" data-i18n="${opts.eyebrow}"></div><h1 id="pageTitle"></h1><ul class="pillsh" id="pagePills"></ul>
        </div></div></section>
        <section class="section" id="pageBody"><div class="containerh"><div id="pageContent"></div></div></section>`;
      this.init(opts);
      return document.getElementById("pageContent");
    },

    /* Ομαλή εμφάνιση στο scroll (όπως στην index.html): όσα στοιχεία ταιριάζουν στο sel παίρνουν .reveal */
    reveal(root, sel) {
      if (!root) return;
      if (sel) root.querySelectorAll(sel).forEach(e => e.classList.add("reveal"));
      const els = [...root.querySelectorAll(".reveal:not(.visible)")];
      if (reduce() || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("visible")); return; }
      const io = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      }), { threshold: 0.12 });
      els.forEach(e => io.observe(e));
    },

    /* Κοινός «δρομολογητής» με #/<base>/<κλειδί>[/<id>] : κουμπιά, τίτλος, γλώσσα, scroll.
       opts = { base, keys, titleOf(key) -> {el,en}, render({key, id, changed}, animate), reveal: "επιλογέας CSS" } */
    route(opts) {
      const keys = opts.keys, re = new RegExp("^#/" + opts.base + "/([\\w-]+)(?:/([\\w-]+))?");
      const pills = document.getElementById("pagePills"), h1 = document.getElementById("pageTitle");
      pills.innerHTML = keys.map(k => `<li><a href="#/${opts.base}/${k}" data-k="${k}"></a></li>`).join("");
      let last = null, started = false;
      const go = animate => {
        const m = location.hash.match(re), key = m && keys.includes(m[1]) ? m[1] : keys[0];
        pills.querySelectorAll("a").forEach(a => {
          a.classList.toggle("on", a.dataset.k === key);
          a.textContent = this.pick(opts.titleOf(a.dataset.k));
        });
        h1.textContent = this.pick(opts.titleOf(key));
        const r = { key, id: m && m[1] === key ? m[2] || null : null, changed: key !== last };
        last = key;
        opts.render(r, animate);
        if (animate || !started) this.reveal(document.getElementById("pageContent"), opts.reveal);   // όχι σε απλή αλλαγή γλώσσας
        started = true;
      };
      addEventListener("hashchange", () => {
        if (!re.test(location.hash)) return;
        go(true);
        document.getElementById("introduction").scrollIntoView({ behavior: reduce() ? "auto" : "smooth" });
      });
      document.addEventListener("bralos-languagechange", () => go(false));
      go(false);
    },

    init(opts = {}) {
      this.pageTitle = opts.title || null;
      this.lang  = localStorage.getItem("bralos-language") || "el";
      this.theme = localStorage.getItem("bralos-theme") || "light";
      window.language = this.lang;                                  // για παλιότερο κώδικα που διαβάζει το «language»

      const h = document.getElementById("siteHeader");
      if (h) {
        h.innerHTML = `
          <a href="index.html" class="brand" aria-label="Bralos Rail Pass — Home">${BRAND_SVG}
            <span class="brand-name">BRALOS RAIL PASS<span class="brand-sub">ΣΙΔΗΡΟΔΡΟΜΙΚΟ ΠΕΡΑΣΜΑ ΜΠΡΑΛΟΥ</span></span></a>
          <nav class="nav-links" id="navLinks">${NAV.map(([k, href, i18n, sub]) => `
            <div><a class="t${k === opts.active ? " on" : ""}" href="${href}" data-i18n="${i18n}"></a>${sub ? `
              <div class="dd">${sub.map(([h2, i]) => `<a href="${h2}" data-i18n="${i}"></a>`).join("")}</div>` : ""}</div>`).join("")}
          </nav>
          <div class="nav-controls">
            <button class="icon-btn" id="themeToggle" aria-label="Toggle light or dark theme"></button>
            <button class="lang-btn" id="langToggle" aria-label="Change language"></button>
            <button class="icon-btn menu-btn" id="menuToggle" aria-label="Open navigation">☰</button>
          </div>`;
      }
      const f = document.getElementById("siteFooter");
      if (f) f.innerHTML = `<div class="container footer-inner">
          <span>© ${new Date().getFullYear()} Bralos Rail Pass</span>
          <div class="social">${SOCIAL.map(([n, url, svg]) => `<a href="${url}"${url.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"'} aria-label="${n}" title="${n}">${svg}</a>`).join("")}</div>
          <a href="#introduction" data-i18n="backTop"></a></div>`;

      document.getElementById("langToggle").addEventListener("click", () => this.setLanguage(this.lang === "el" ? "en" : "el"));
      document.getElementById("themeToggle").addEventListener("click", () => this.setTheme(this.theme === "light" ? "dark" : "light"));
      document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("navLinks").classList.toggle("open"));
      document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));

      this.setLanguage(this.lang);
      this.setTheme(this.theme);
    },

    setLanguage(lang) {
      this.lang = window.language = lang;
      document.documentElement.lang = lang;
      document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = this.t(el.dataset.i18n); });
      document.getElementById("langToggle").textContent = lang === "el" ? "GR" : "EN";
      if (this.pageTitle) document.title = this.pick(this.pageTitle) + " | Bralos Rail Pass";
      localStorage.setItem("bralos-language", lang);
      document.dispatchEvent(new Event("bralos-languagechange"));
    },

    setTheme(theme) {
      this.theme = theme;
      document.documentElement.dataset.theme = theme;
      document.getElementById("themeToggle").textContent = theme === "dark" ? "Light" : "Dark";
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = theme === "dark" ? "#1b1b1b" : "#f9f9f7";
      localStorage.setItem("bralos-theme", theme);
      document.dispatchEvent(new Event("bralos-themechange"));
    }
  };
})();

/* ---------- Lightbox: LB.open([{src, caption}, ...], index, openerElement) ---------- */
window.LB = (function () {
  let root, img, cap, prev, next, close, list = [], i = 0, opener = null;
  function build() {
    if (root) return;
    root = document.createElement("div");
    root.className = "lightbox"; root.hidden = true;
    root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
    root.innerHTML = `<button type="button" class="lb-btn lb-close">×</button>
      <button type="button" class="lb-btn lb-prev">‹</button>
      <figure class="lb-figure"><img alt=""><figcaption></figcaption></figure>
      <button type="button" class="lb-btn lb-next">›</button>`;
    document.body.appendChild(root);
    img = root.querySelector("img"); cap = root.querySelector("figcaption");
    prev = root.querySelector(".lb-prev"); next = root.querySelector(".lb-next"); close = root.querySelector(".lb-close");
    close.onclick = hide; prev.onclick = () => show(i - 1); next.onclick = () => show(i + 1);
    root.addEventListener("click", e => { if (e.target === root) hide(); });
    document.addEventListener("keydown", e => {
      if (root.hidden) return;
      if (e.key === "Escape") hide();
      else if (e.key === "ArrowLeft" && list.length > 1) show(i - 1);
      else if (e.key === "ArrowRight" && list.length > 1) show(i + 1);
      else if (e.key === "Tab") {
        const b = [...root.querySelectorAll("button")].filter(x => !x.hidden), f = b[0], l = b[b.length - 1];
        if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
        else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
      }
    });
  }
  function show(n) {
    const len = list.length; i = (n + len) % len;
    img.src = list[i].src; img.alt = cap.textContent = list[i].caption || "";
    prev.hidden = next.hidden = len < 2;
  }
  function hide() { root.hidden = true; document.body.style.overflow = ""; if (opener) opener.focus(); }
  return {
    open(items, index, from) {
      if (!items || !items.length) return;
      build(); list = items; opener = from || null;
      const L = (window.SITE && SITE.lang === "en") ? ["Close", "Previous", "Next"] : ["Κλείσιμο", "Προηγούμενη", "Επόμενη"];
      close.setAttribute("aria-label", L[0]); prev.setAttribute("aria-label", L[1]); next.setAttribute("aria-label", L[2]);
      show(index || 0); root.hidden = false; document.body.style.overflow = "hidden"; close.focus();
    }
  };
})();
