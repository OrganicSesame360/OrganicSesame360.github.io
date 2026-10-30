/* =====================================================================
   script.js: small helpers used by every page. You never need to edit this.
   - light/dark toggle (remembers your choice)
   - auto-built filter buttons on the home page
   - shows a placeholder if a picture is missing
   ===================================================================== */

// Missing-image fallback (attached immediately so it catches early failures)
document.addEventListener("error", function (e) {
  var el = e.target;
  if (el && el.tagName === "IMG" && !el.dataset.failed) {
    var box = document.createElement("div");
    box.className = el.className.replace("project-img", "").replace("cover", "") + " placeholder";
    box.textContent = "[ add image: " + (el.getAttribute("src") || "") + " ]";
    el.replaceWith(box);
  }
}, true);

document.addEventListener("DOMContentLoaded", function () {

  // ---------- Light / dark mode ----------
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) root.dataset.theme = saved;
  if (toggle) {
    toggle.textContent = root.dataset.theme === "light" ? "☾" : "☀";
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      toggle.textContent = next === "light" ? "☾" : "☀";
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ---------- Footer year ----------
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Home page: filter buttons built from data-tags ----------
  var filtersBox = document.getElementById("filters");
  if (filtersBox) {
    var projects = document.querySelectorAll(".project");
    var allTags = new Set();
    projects.forEach(function (p) {
      p.dataset.tags.split(",").forEach(function (t) { if (t.trim()) allTags.add(t.trim()); });
    });

    var makeButton = function (label, value) {
      var b = document.createElement("button");
      b.className = "filter" + (value === "all" ? " active" : "");
      b.textContent = label;
      b.addEventListener("click", function () {
        document.querySelectorAll(".filter").forEach(function (f) { f.classList.remove("active"); });
        b.classList.add("active");
        projects.forEach(function (p) {
          var tags = p.dataset.tags.split(",").map(function (t) { return t.trim(); });
          p.classList.toggle("hidden", value !== "all" && tags.indexOf(value) === -1);
        });
      });
      filtersBox.appendChild(b);
    };

    makeButton("All", "all");
    Array.from(allTags).sort().forEach(function (t) { makeButton(t, t); });
  }
});
