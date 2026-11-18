/* ==========================================================================
   xartes.js — η σελίδα «Χάρτες»: αλλαγή περιεχομένου με τα κουμπιά.
   Κάθε χάρτης είναι αρχείο που ορίζει  MAP_RENDERERS.<κλειδί>(stage)  (τρέχει ΜΙΑ φορά, στο πρώτο άνοιγμα)
   και προαιρετικά  MAP_ON_SHOW.<κλειδί>(stage)  (τρέχει ΚΑΘΕ φορά που εμφανίζεται).
   Για νέο χάρτη: 1) μπες στο xartes-data.js  2) φτιάξε xartes-<όνομα>.js  3) πρόσθεσέ το με <script> στο xartes.html (πριν από αυτό το αρχείο).
   ========================================================================== */
(function () {
  "use strict";
  const MD = typeof mapsData !== "undefined" ? mapsData : null;
  const content = SITE.page({ active: "maps", eyebrow: "navMaps", title: { el: "Χάρτες", en: "Maps" } });
  if (!MD) { content.innerHTML = "<p>Δεν βρέθηκε το αρχείο <strong>xartes-data.js</strong>.</p>"; return; }

  const KEYS = Object.keys(MD), inited = {};
  const SOON = { el: "Ο χάρτης θα προστεθεί σύντομα.", en: "This map will be added soon." };
  let current = null;

  content.innerHTML = KEYS.map(k => `
    <section class="xm-panel" id="mp-${k}" hidden>
      <div class="xm-intro"><h2></h2><p></p></div>
      <div class="xm-stage" id="stage-${k}"></div>
    </section>`).join("");

  function placeholder(k) {
    document.getElementById("stage-" + k).innerHTML = `<div class="xm-placeholder"><div><strong>${SITE.esc(SITE.pick(MD[k].title))}</strong>${SITE.pick(SOON)}</div></div>`;
  }

  function texts() {
    KEYS.forEach(k => {
      const p = document.getElementById("mp-" + k);
      p.querySelector("h2").textContent = SITE.pick(MD[k].title);
      p.querySelector("p").innerHTML = SITE.pick(MD[k].desc);
      if (inited[k] && !MAP_RENDERERS[k]) placeholder(k);
    });
  }

  function show(key, animate) {
    if (key === current && !animate) { texts(); return; }          // αλλαγή γλώσσας: μόνο τα κείμενα
    current = key;
    KEYS.forEach(k => { const p = document.getElementById("mp-" + k); p.hidden = k !== key; p.classList.remove("fade-in"); });
    const panel = document.getElementById("mp-" + key), stage = document.getElementById("stage-" + key);
    if (!inited[key]) {
      inited[key] = true;
      if (MAP_RENDERERS[key]) MAP_RENDERERS[key](stage, MD[key]); else placeholder(key);
    }
    if (MAP_ON_SHOW[key]) MAP_ON_SHOW[key](stage);
    texts();
    if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) { void panel.offsetWidth; panel.classList.add("fade-in"); }
  }

  SITE.route({ base: "xartes", keys: KEYS, titleOf: k => MD[k].title, render: (r, animate) => show(r.key, animate), reveal: ".xm-intro" });
})();
