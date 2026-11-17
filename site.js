/* ==========================================================================
   site.js — ΚΟΙΝΟ ΓΙΑ ΟΛΕΣ ΤΙΣ ΣΕΛΙΔΕΣ: κεφαλίδα/μενού, υποσέλιδο, γλώσσα, θέμα.
   Για να προσθέσεις ή να αλλάξεις σύνδεσμο του μενού, το κάνεις ΜΟΝΟ εδώ (πίνακας NAV).
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

  const SITE = window.SITE = {
    lang: "el", theme: "light", pageTitle: null,

    extend(dict) { ["el", "en"].forEach(l => Object.assign(T[l], dict[l] || {})); },
    t(key) { return (T[this.lang] && T[this.lang][key]) || T.el[key] || ""; },
    pick(o) { return o ? (o[this.lang] ?? o.el ?? "") : ""; },      // { el, en } -> κείμενο
    esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); },

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
          <span data-i18n="footerText"></span>
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
