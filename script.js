/* =========================================================
   YOUR PROJECTS: this is the only part you need to edit.
   To add a project, copy one block { ... }, paste it in the
   list, and change the text. Don't forget the comma between blocks.

   Fields:
     title        name of the project
     date         when you built it (any text, e.g. "Oct 2026")
     summary      one or two sentences shown on the card
     description  longer explanation shown in the popup (HTML allowed)
     tags         short labels used for the filter buttons
     image        optional: path to a picture, e.g. "images/amp.jpg"
                  (leave "" to show the emoji instead)
     emoji        shown when there is no image
     links        buttons in the popup: { label, url }
   ========================================================= */
const projects = [
  {
    title: "Audio Amplifier (Speaker Circuit)",
    date: "Oct 29 2026",
    summary: "Breadboarded circuit with audio jack, switch, and speaker that amplifies audio when connected to a device",
    description: `
      <p>lets larp</p>
      <h4>more larp?</h4>
      <ul>
        <li>test 1</li>
        <li>test 2</li>
      </ul>`,
    tags: ["Analog", "Op-amp"],
    image: "",
    emoji: "📈",
    links: [
      { label: "me no work :(", url: "#" },
      { label: "me also no work :(", url: "#" }
   ]
  },
];

/* =========================================================
   Everything below makes the site work. You can leave it alone.
   ========================================================= */
const grid = document.getElementById("project-grid");
const filtersBox = document.getElementById("filters");
const searchBox = document.getElementById("search");
const noResults = document.getElementById("no-results");
const dialog = document.getElementById("project-dialog");
const dialogContent = document.getElementById("dialog-content");

let activeTag = "All";

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function buildFilters() {
  const tags = ["All", ...new Set(projects.flatMap(p => p.tags))];
  filtersBox.innerHTML = "";
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (tag === activeTag ? " active" : "");
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      activeTag = tag;
      buildFilters();
      renderProjects();
    });
    filtersBox.appendChild(btn);
  });
}

function renderProjects() {
  const query = searchBox.value.trim().toLowerCase();
  grid.innerHTML = "";

  const visible = projects.filter(p => {
    const matchesTag = activeTag === "All" || p.tags.includes(activeTag);
    const text = (p.title + " " + p.summary + " " + p.tags.join(" ")).toLowerCase();
    return matchesTag && text.includes(query);
  });

  visible.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="card-img">
        ${p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}">` : p.emoji || "🔧"}
      </div>
      <div class="card-body">
        <span class="date">${escapeHTML(p.date || "")}</span>
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.summary)}</p>
        <div class="tags">${p.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>
      </div>`;
    card.addEventListener("click", () => openProject(p));
    card.addEventListener("keydown", e => { if (e.key === "Enter") openProject(p); });
    grid.appendChild(card);
  });

  noResults.hidden = visible.length > 0;
}

function openProject(p) {
  const links = (p.links || [])
    .map(l => `<a href="${escapeHTML(l.url)}" target="_blank" rel="noopener">${escapeHTML(l.label)}</a>`)
    .join("");

  dialogContent.innerHTML = `
    ${p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}">` : ""}
    <h3>${escapeHTML(p.title)}</h3>
    <p class="date">${escapeHTML(p.date || "")}</p>
    ${p.description}
    <div class="tags">${p.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>
    ${links ? `<div class="links">${links}</div>` : ""}`;
  dialog.showModal();
}

document.getElementById("dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
searchBox.addEventListener("input", renderProjects);

/* ----- Theme toggle (remembers your choice) ----- */
const root = document.documentElement;
function applyTheme(theme) { root.setAttribute("data-theme", theme); }

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

document.getElementById("year").textContent = new Date().getFullYear();

buildFilters();
renderProjects();
