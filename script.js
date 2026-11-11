/* =====================================================================
   script.js: small helpers used by every page. You never need to edit this.
   - light/dark toggle (remembers your choice)
   - search bar + auto-built filter buttons on the home page
     (the chosen tag and search text are saved in the URL, so refresh,
      Back/Forward, and sharing the link all keep the same view)
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
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  var paintTheme = function (theme) {
    root.dataset.theme = theme;
    if (toggle) {
      toggle.textContent = theme === "light" ? "☾" : "☀";
      toggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    }
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f5f5f0" : "#07080c");
  };

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  paintTheme(saved || root.dataset.theme || "dark");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      paintTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ---------- Footer year ----------
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Home page: search + tag filters ----------
  var filtersBox = document.getElementById("filters");
  if (filtersBox) {
    var projects = document.querySelectorAll(".project");
    var searchBox = document.getElementById("search");
    var noResults = document.getElementById("no-results");
    var liveCount = document.getElementById("result-count");
    var allTags = new Set();

    projects.forEach(function (p) {
      p.dataset.tags.split(",").forEach(function (t) { if (t.trim()) allTags.add(t.trim()); });
    });

    // Start from whatever the URL says, e.g. ?tag=IoT&q=esp32
    var params = new URLSearchParams(location.search);
    var activeTag = params.get("tag") || "all";
    if (activeTag !== "all" && !allTags.has(activeTag)) activeTag = "all";
    if (searchBox) searchBox.value = params.get("q") || "";

    var saveToUrl = function () {
      var p = new URLSearchParams();
      if (activeTag !== "all") p.set("tag", activeTag);
      var q = searchBox ? searchBox.value.trim() : "";
      if (q) p.set("q", q);
      var s = p.toString();
      try { history.replaceState(null, "", location.pathname + (s ? "?" + s : "") + location.hash); } catch (e) {}
    };

    // Show or hide each card based on the active tag AND the search text
    var applyFilters = function (announce) {
      var query = searchBox ? searchBox.value.trim().toLowerCase() : "";
      var shown = 0;

      projects.forEach(function (p) {
        var tags = p.dataset.tags.split(",").map(function (t) { return t.trim(); });
        var matchesTag = activeTag === "all" || tags.indexOf(activeTag) !== -1;
        var matchesSearch = query === "" || p.textContent.toLowerCase().indexOf(query) !== -1;
        var visible = matchesTag && matchesSearch;
        p.classList.toggle("hidden", !visible);
        if (visible) shown++;
      });

      if (noResults) noResults.hidden = shown !== 0;
      if (announce && liveCount) liveCount.textContent = shown + (shown === 1 ? " project shown" : " projects shown");
      saveToUrl();
    };

    var buttons = [];
    var markActive = function () {
      buttons.forEach(function (b) {
        var on = b.dataset.value === activeTag;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    };

    var makeButton = function (label, value) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.dataset.value = value;
      b.textContent = label;
      b.addEventListener("click", function () {
        activeTag = value;
        markActive();
        applyFilters(true);
      });
      buttons.push(b);
      filtersBox.appendChild(b);
    };

    makeButton("All", "all");
    Array.from(allTags).sort().forEach(function (t) { makeButton(t, t); });
    markActive();
    applyFilters(false);

    if (searchBox) searchBox.addEventListener("input", function () { applyFilters(true); });
  }
});
