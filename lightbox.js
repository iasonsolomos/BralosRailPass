/* lightbox.js — μεγάλο παράθυρο φωτογραφιών (ίδιο με του history.html), για χρήση από όποια σελίδα θέλει.
   Χρήση:  LB.open([{src, caption}, ...], index, openerElement)  */
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
