// DCNET Cloud website: icons + reveal-on-scroll. Content stays visible without JS (.js class gates the hidden state).
lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
var io = "IntersectionObserver" in window && new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll("[data-reveal]").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });

// Mega menu: click toggles (touch + keyboard), hover handled in CSS. Escape / outside click closes.
var triggers = document.querySelectorAll(".nav__trigger");
function closeAll(except) {
  triggers.forEach(function (t) { if (t !== except) t.setAttribute("aria-expanded", "false"); });
}
triggers.forEach(function (t) {
  t.addEventListener("click", function () {
    var open = t.getAttribute("aria-expanded") === "true";
    closeAll(t); t.setAttribute("aria-expanded", String(!open));
  });
});
document.addEventListener("click", function (e) { if (!e.target.closest(".nav__item")) closeAll(); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

// Mega menu rail: hover, focus or click a group to show its pane (DigitalOcean-style).
document.querySelectorAll(".mega__tab").forEach(function (tab) {
  function show() {
    var mega = tab.closest(".mega");
    mega.querySelectorAll(".mega__tab").forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });
    mega.querySelectorAll(".mega__pane").forEach(function (p) { p.classList.toggle("is-on", p.id === tab.getAttribute("aria-controls")); });
  }
  tab.addEventListener("mouseenter", show);
  tab.addEventListener("focus", show);
  tab.addEventListener("click", show);
});

// Cloud Server CLI demo: types each screen line by line, loops while on screen. Reduced motion keeps the static final screen.
document.querySelectorAll(".cli").forEach(function (cli) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var scrs = [].slice.call(cli.querySelectorAll(".cli__scr")), pill = cli.querySelector(".cli__status"), started = false;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  async function typeLine(l) {
    var full = l.innerHTML, text = l.textContent;
    l.textContent = ""; l.classList.add("is-shown", "is-cur");
    for (var i = 1; i <= text.length; i++) { l.textContent = text.slice(0, i); await wait(i < 3 ? 60 : 22); }
    l.innerHTML = full; l.classList.remove("is-cur");
  }
  async function run() {
    cli.classList.add("is-live");
    for (;;) {
      for (var s = 0; s < scrs.length; s++) {
        scrs.forEach(function (x) { x.classList.toggle("is-on", x === scrs[s]); x.querySelectorAll(".cli__l").forEach(function (l) { l.classList.remove("is-shown", "is-run"); }); });
        for (var l of scrs[s].querySelectorAll(".cli__l")) {
          var k = l.dataset.k;
          if (k === "cmd") { if (l.textContent.indexOf("server create") > -1) { pill.dataset.state = "BUILD"; pill.textContent = "BUILD"; } await typeLine(l); await wait(l.textContent.trim().endsWith("\\") ? 80 : 450); }
          else if (k === "step") { l.classList.add("is-shown", "is-run"); await wait(1100); l.classList.remove("is-run"); if (l.dataset.status) { pill.dataset.state = l.dataset.status; pill.textContent = l.dataset.status; } }
          else if (k === "pause") await wait(+l.dataset.ms);
          else { l.classList.add("is-shown"); await wait(70); }
        }
      }
    }
  }
  var o = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; o.disconnect(); run(); } }) : null;
  o ? o.observe(cli) : run();
});

// Charts (.upg bang-gia, .wal tinh-cuoc-theo-gio, .arch story blocks on san-pham/ha and snapshot): play once on reveal; "Chạy lại" swaps in a clone of the SVG or [data-replay-scope], which restarts its CSS animations.
document.querySelectorAll("[data-replay]").forEach(function (b) {
  b.addEventListener("click", function () { var r = b.closest(".upg, .wal, .arch"), s = r.querySelector("[data-replay-scope]") || r.querySelector("svg"); s.replaceWith(s.cloneNode(true)); });
});
