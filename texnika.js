/* ==========================================================================
   texnika.js — εμφάνιση της σελίδας «Τεχνικά» (ό,τι γράφεις το γράφεις στο texnika-data.js)
   Κουμπιά: Γέφυρες / Σήραγγες / Σταθμοί-Στάσεις  →  λίστα καρτών  →  σελίδα του κάθε έργου.
   Σύνδεσμοι:  texnika.html#/texnika/<κατηγορία>   και   texnika.html#/texnika/<κατηγορία>/<id έργου>
   ========================================================================== */
(function () {
  "use strict";
  const TD = typeof texnikaData !== "undefined" ? texnikaData : null;
  const GEO = typeof bralosGeo !== "undefined" ? bralosGeo : null;
  const NAMES_EN = typeof texnikaNamesEn !== "undefined" ? texnikaNamesEn : {};
  const $ = id => document.getElementById(id);
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => SITE.esc(s);

  const content = SITE.page({ active: "tech", eyebrow: "navEngineering", title: { el: "Τεχνικά", en: "Engineering" } });

  const UI = {
    el: { search: "Αναζήτηση…", only: "Μόνο με περιγραφή", count: n => n + " έργα", none: "Δεν βρέθηκε κανένα έργο.",
          back: "← Πίσω στη λίστα", photos: "Φωτογραφίες", videos: "Βίντεο", drawings: "Τεχνικά σχέδια", more: "Περισσότερα",
          prev: "Προηγούμενο", next: "Επόμενο", enlarge: "Μεγέθυνση", details: "Με περιγραφή",
          bridge: "Γέφυρα", tunnel: "Σήραγγα", gallery: "Στοά", station: "Σταθμός", halt: "Στάση", km: "Χ.Θ.", noData: "Λείπει το αρχείο texnika-data.js." },
    en: { search: "Search…", only: "With description only", count: n => n + " structures", none: "Nothing found.",
          back: "← Back to the list", photos: "Photos", videos: "Videos", drawings: "Technical drawings", more: "More",
          prev: "Previous", next: "Next", enlarge: "Enlarge", details: "Has description",
          bridge: "Bridge", tunnel: "Tunnel", gallery: "Gallery", station: "Station", halt: "Halt", km: "Ch.", noData: "The file texnika-data.js is missing." }
  };
  const ui = k => UI[SITE.lang][k];
  const FACT_EN = { "Χιλιομετρική Θέση": "Chainage", "Χ.Θ.": "Chainage", "Υψόμετρο": "Elevation", "Μήκος": "Length", "Ύψος": "Height",
                    "Ανοίγματα": "Spans", "Μεσόβαθρα": "Piers", "Κατασκευή Κτιρίου": "Building built" };
  const factLabel = l => SITE.lang === "en" ? (FACT_EN[l] || l) : l;
  const factValue = v => SITE.lang === "en" ? String(v).replace(/μέτρα|μέτεα|Μέτρα|μ\./g, "m").replace(/χλμ\.|χλιμ\./g, "km") : v;

  /* ---------- Δημιουργία των έργων: KML (xartes-geo.js) + ό,τι έχεις γράψει στο texnika-data.js ---------- */
  const KMRE = /(\d{3})\s*[+,]\s*\(?\s*(\d{1,3})\s*\)?/;
  function kmOf(f) {
    let m = String(f.name).match(KMRE);
    if (!m) for (const a of f.facts || []) if (/Χ\.?Θ|Χιλιομετρ/.test(a[0]) && (m = String(a[1]).match(KMRE))) break;
    return m ? +m[1] + (+m[2] / (m[2].length === 1 ? 10 : m[2].length === 2 ? 100 : 1000)) : null;
  }
  function baseName(f, kind) {                       // όνομα από το KML → { el, en }
    const nm = String(f.name);
    if (kind === "station" || kind === "halt") {
      const en = NAMES_EN[nm] || nm;
      return { el: nm, en: en, prefix: kind };
    }
    if (kind === "bridge") {
      const m = nm.match(/^[\d+()\s]+\((.+)\)$/);
      return { el: m ? m[1] : nm, en: m ? m[1] : nm, prefix: "bridge", bare: !m };
    }
    return { el: nm, en: nm, prefix: null };
  }

  const CATS = {};
  function build() {
    Object.keys(TD).forEach(ck => {
      const cat = TD[ck], items = [];
      (cat.groups || []).forEach(g => {
        (GEO && GEO[g.source] || []).forEach(f => {
          const kind = g.kind || f.kind;               // σταθμοί: «station» / «halt» από το KML
          const km = kmOf(f);
          if (km == null) return;
          const ov = (cat.items || []).find(o => [].concat(o.match).some(k => String(f.name).includes(k))) || {};
          const bn = baseName(f, kind);
          const kmTxt = String(f.name).match(/\d{3}\s*\+\s*\(?\d{1,3}\)?/);
          const auto = "k" + Math.round(km * 1000);
          const hasText = !!((ov.text && (ov.text.el || []).length) || (ov.sections || []).length || (f.text || []).length);
          const media = (ov.media || []).slice();
          const kmlPhotos = (f.photos || []).map(src => ({ type: "image", src, caption: null }));
          items.push({
            id: ov.id || auto, auto, cat: ck, kind, km, group: g, geo: f, ov, bn, kmTxt: kmTxt ? kmTxt[0] : null,
            text: ov.text || (f.text && f.text.length ? { el: f.text } : null),
            sections: ov.sections || [],
            facts: (f.facts || []).filter(a => !/Χιλιομετρ/.test(a[0]) || kind !== "bridge").concat(ov.facts || []),
            media: kmlPhotos.concat(media),
            described: hasText || media.length > 0,
            thumb: ov.thumb || null,
            hero: ov.hero || ov.thumb || null,
          });
        });
      });
      items.sort((a, b) => a.group === b.group ? a.km - b.km : cat.groups.indexOf(a.group) - cat.groups.indexOf(b.group));
      CATS[ck] = items;
    });
  }

  const nameOf = it => {
    if (it.ov.name) return SITE.pick(it.ov.name);
    const n = SITE.lang === "en" ? it.bn.en : it.bn.el;
    if (it.bn.prefix === "bridge") return it.bn.bare ? `${ui("bridge")} ${it.kmTxt}` : `${ui("bridge")} ${n}`;
    if (it.bn.prefix) return `${ui(it.bn.prefix)} ${n}`;
    return n;
  };
  const kindOf = it => ui(it.kind);
  const lenOf = it => { const a = (it.facts || []).find(x => /Μήκος/.test(x[0])); return a ? factValue(a[1]) : ""; };
  const paras = o => { const v = SITE.pick(o); return Array.isArray(v) ? v : v ? [v] : []; };
  const prose = arr => `<div class="tk-prose">${arr.map(p => `<p>${p}</p>`).join("")}</div>`;

  /* ---------- Μέσα (φωτογραφίες, βίντεο, σχέδια) ---------- */
  const GAL = {};
  function mediaBlock(list, heading, gid, types) {
    const sel = list.filter(m => types.includes(m.type));
    if (!sel.length) return "";
    const gallery = [];
    const html = sel.map(m => {
      const cap = SITE.pick(m.caption);
      const c = cap ? `<figcaption>${cap}</figcaption>` : "";
      if (m.type === "video") return `<figure class="hm hm-video"><video controls preload="metadata"${m.poster ? ` poster="${esc(m.poster)}"` : ""}><source src="${esc(m.src)}"></video>${c}</figure>`;
      if (m.type === "youtube") return `<figure class="hm hm-video"><div class="hm-embed"><iframe src="https://www.youtube-nocookie.com/embed/${esc(m.id)}" title="${esc(cap || "Video")}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>${c}</figure>`;
      if (m.type === "pdf") return `<figure class="hm"><a class="hm-file" href="${esc(m.src)}" target="_blank" rel="noopener">📄 ${esc(cap || m.src.split("/").pop())}</a></figure>`;
      gallery.push({ src: m.src, caption: cap });
      return `<figure class="hm hm-image${m.type === "drawing" ? " hm-drawing" : ""}"><button type="button" class="hm-open" data-gal="${gid}" data-i="${gallery.length - 1}" aria-label="${ui("enlarge")}"><img src="${esc(m.src)}" alt="${esc(cap)}" loading="lazy" onerror="this.closest('figure').remove()"></button>${c}</figure>`;
    }).join("");
    GAL[gid] = gallery;
    return `<div class="tk-block"><h3>${heading}</h3><div class="media-grid">${html}</div></div>`;
  }

  /* ---------- Σελίδες ---------- */
  let filterText = "", onlyDesc = false;

  function listView(ck) {
    const cat = TD[ck], items = CATS[ck];
    let h = "";
    if (cat.image) h += `<figure class="tk-hero"><img src="${esc(cat.image)}" alt="" onerror="this.closest('figure').remove()"></figure>`;
    h += `<p class="tk-lead">${SITE.pick(cat.lead)}</p>`;
    h += `<div class="tk-toolbar"><input type="search" id="tkSearch" placeholder="${ui("search")}" value="${esc(filterText)}" aria-label="${ui("search")}">
      <label><input type="checkbox" id="tkOnly"${onlyDesc ? " checked" : ""}> ${ui("only")}</label><span class="tk-count" id="tkCount"></span></div>`;
    cat.groups.forEach(g => {
      const its = items.filter(i => i.group === g);
      if (!its.length) return;
      if (cat.groups.length > 1) h += `<h3 class="tk-group">${SITE.pick(g.label) || SITE.pick(cat.title)}</h3>`;
      h += `<div class="tk-grid">` + its.map(it => {
        // const ph = it.media.find(m => m.type === "image");//
        const ph = it.thumb ? { src: it.thumb } : it.media.find(m => m.type === "image");
        const meta = [it.kmTxt ? `${ui("km")} ${it.kmTxt}` : `${ui("km")} ${Math.floor(it.km)}+${String(Math.round((it.km % 1) * 1000)).padStart(3, "0")}`, lenOf(it)].filter(Boolean).join(" · ");
        const name = nameOf(it);
        const hay = (name + " " + (it.bn.el) + " " + (it.kmTxt || "")).toLowerCase();
        return `<a class="tk-card" href="#/texnika/${ck}/${it.id}" data-hay="${esc(hay)}" data-desc="${it.described ? 1 : 0}">
          <div class="tk-thumb">${ph ? `<img src="${esc(ph.src)}" alt="" loading="lazy" onerror="this.remove()">` : ""}</div>
          <div class="tk-card-body"><div class="tk-kind">${kindOf(it)}</div><h3>${esc(name)}</h3>
            <div class="tk-meta">${esc(it.ov.summary ? SITE.pick(it.ov.summary) : meta)}</div>
            ${it.described ? `<span class="tk-badge">${ui("details")}</span>` : ""}</div></a>`;
        
      }).join("") + `</div>`;
    });
    h += `<p class="tk-empty" id="tkNone" hidden>${ui("none")}</p>`;
    (cat.sections || []).forEach((s, i) => {
      h += `<div class="tk-block"><h3>${SITE.pick(s.title)}</h3>${prose(paras(s.text))}` +
           mediaBlock(s.media || [], ui("drawings"), "cs" + i, ["image", "drawing", "pdf", "video", "youtube"]).replace('<div class="tk-block">', '<div>') + `</div>`;
    });
    return h;
  }

  function applyFilter() {
    const q = filterText.trim().toLowerCase();
    let n = 0;
    content.querySelectorAll(".tk-card").forEach(c => {
      const ok = (!q || c.dataset.hay.includes(q)) && (!onlyDesc || c.dataset.desc === "1");
      c.hidden = !ok; if (ok) n++;
    });
    const cnt = $("tkCount"); if (cnt) cnt.textContent = ui("count")(n);
    const none = $("tkNone"); if (none) none.hidden = n > 0;
  }

  function detailView(ck, it) {
    const items = CATS[ck], idx = items.indexOf(it), prev = items[idx - 1], next = items[idx + 1];
    const facts = it.facts.map(([k, v]) => `<dt>${esc(factLabel(k))}</dt><dd>${esc(factValue(v))}</dd>`).join("");
    const photoTypes = ["image"], all = it.media;
    const heroSrc = it.hero || (it.media.find(m => m.type === "image") || {}).src || null;
    let h = `<a class="tk-back" href="#/texnika/${ck}">${ui("back")}</a><article class="tk-detail">
      <div class="tk-kind">${kindOf(it)}${it.kmTxt ? " · " + ui("km") + " " + it.kmTxt : ""}</div>
      <h2>${esc(nameOf(it))}</h2>
      ${heroSrc ? `<figure class="tk-hero"><img src="${esc(heroSrc)}" alt="" onerror="this.closest('figure').remove()"></figure>` : ""}
      ${facts ? `<dl class="tk-facts">${facts}</dl>` : ""}
      ${it.text ? prose(paras(it.text)) : ""}`;
    it.sections.forEach(s => { h += `<div class="tk-block"><h3>${SITE.pick(s.title)}</h3>${prose(paras(s.text))}</div>`; });
    h += mediaBlock(all, ui("photos"), "ph", photoTypes) + mediaBlock(all, ui("videos"), "vd", ["video", "youtube"]) + mediaBlock(all, ui("drawings"), "dr", ["drawing", "pdf"]);
    h += `</article><nav class="tk-pager">` +
      (prev ? `<a href="#/texnika/${ck}/${prev.id}"><small>← ${ui("prev")}</small><strong>${esc(nameOf(prev))}</strong></a>` : "") +
      (next ? `<a class="next" href="#/texnika/${ck}/${next.id}"><small>${ui("next")} →</small><strong>${esc(nameOf(next))}</strong></a>` : "") + `</nav>`;
    return h;
  }

  function render(r, animate) {
    const cat = r.key;
    if (r.changed) { filterText = ""; onlyDesc = false; }
    const it = r.id && CATS[cat].find(x => x.id === r.id || x.auto === r.id);
    for (const k in GAL) delete GAL[k];
    content.innerHTML = it ? detailView(cat, it) : listView(cat);
    if (!it) applyFilter();
  }

  /* ---------- Εκκίνηση ---------- */
  if (!TD || !GEO) {
    content.innerHTML = `<p>${!TD ? "Δεν βρέθηκε το αρχείο <strong>texnika-data.js</strong>." : "Δεν βρέθηκε το αρχείο <strong>xartes-geo.js</strong>."}</p>`;
    return;
  }
  build();
  SITE.route({ base: "texnika", keys: Object.keys(TD), titleOf: k => TD[k].title, render,
    reveal: ".tk-lead,.tk-hero,.tk-toolbar,.tk-group,.tk-card,#pageContent>.tk-block,.tk-detail>*,.tk-pager a" });
  content.addEventListener("input", e => { if (e.target.id === "tkSearch") { filterText = e.target.value; applyFilter(); } });
  content.addEventListener("change", e => { if (e.target.id === "tkOnly") { onlyDesc = e.target.checked; applyFilter(); } });
  content.addEventListener("click", e => {
    const o = e.target.closest(".hm-open");
    if (o) LB.open(GAL[o.dataset.gal], +o.dataset.i, o);
  });
})();
