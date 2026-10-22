// DCNET Cloud price formula (monthly, before VAT). Same unit prices as the 6 listed plans.
// Đơn giá = sàn tham chiếu ADR flavor (chờ PO chốt giá bán). Dải thanh trượt PO duyệt 2026-10-14, vCPU nâng lên 64 ngày 2026-10-20 (tỉ lệ 1:2 với RAM max): vCPU 1-64, RAM 1-128 GB, ổ 40-1000 GB, IP 0-5.
var DC_UNIT = { vcpu: 94140, ram: 94140, disk: 3180, ip: 118000 };
function dcPrice(c) {
  return c.vcpu * DC_UNIT.vcpu + c.ram * DC_UNIT.ram + c.disk * DC_UNIT.disk + (c.ip || 0) * DC_UNIT.ip;
}
function dcMoney(n) { return n.toLocaleString("vi-VN").replace(/,/g, ".") + "đ"; }
if (typeof module !== "undefined") module.exports = { dcPrice: dcPrice, DC_UNIT: DC_UNIT };

// Configurator on bang-gia.html: sliders -> live price; "Gửi cấu hình" opens a lead dialog with the config as hidden fields.
if (typeof document !== "undefined") (function () {
  var box = document.getElementById("tu-cau-hinh");
  if (!box) return;
  var form = box.querySelector("form");
  var out = box.querySelector("[data-total]");
  var dlg = document.getElementById("lead");
  function cfg() {
    return { vcpu: +form.vcpu.value, ram: +form.ram.value, disk: +form.disk.value, ip: +form.ip.value, os: form.os.value };
  }
  function render() {
    var c = cfg();
    box.querySelectorAll("[data-show]").forEach(function (el) { el.textContent = c[el.dataset.show]; });
    box.querySelectorAll("input[type=range]").forEach(function (r) {
      r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%");
    });
    out.textContent = dcMoney(dcPrice(c));
  }
  form.addEventListener("input", render);
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  box.querySelector("[data-send]").addEventListener("click", function () {
    var c = cfg(), lf = dlg.querySelector("form");
    Object.keys(c).forEach(function (k) { lf.elements["cau_hinh_" + k].value = c[k]; });
    lf.elements.gia_du_kien.value = dcPrice(c);
    dlg.querySelector("[data-summary]").textContent =
      c.vcpu + " vCPU · " + c.ram + " GB RAM · " + c.disk + " GB SSD NVMe · " + c.ip + " IP · " + c.os + " · " + dcMoney(dcPrice(c)) + "/tháng";
    dlg.classList.remove("is-sent");
    dlg.showModal();
  });
  // TODO: chưa có backend (action="#"); khi có đích gửi thì POST ở đây rồi mới hiện lời cảm ơn.
  dlg.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    this.reset();
    dlg.classList.add("is-sent");
  });
  dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  render();
})();
