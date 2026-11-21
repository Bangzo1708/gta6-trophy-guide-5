import { DEMO_EARNED } from "./config.js";
import {
  loadProgress,
  saveProgress,
  loadSpoilers,
  saveSpoilers,
  exportProgress,
  importProgressFile,
} from "./store.js";
import { loadTrophies } from "./data.js";
import {
  renderProgress,
  renderNextUp,
  renderChecklist,
  renderDetail,
  renderRoadmap,
  renderMissables,
  renderHundred,
} from "./views.js";

let trophies = [];
let progress = loadProgress();
let spoilersOn = loadSpoilers();
let selectedName = null;
const filters = { kind: "all", grade: "all", status: "all", query: "" };

const params = new URLSearchParams(window.location.search);
if (params.get("demo") === "1") {
  for (const name of DEMO_EARNED) {
    progress[name] = true;
  }
}

function rerenderAll() {
  renderProgress(trophies, progress);
  renderNextUp(trophies, progress);
  renderChecklist(trophies, progress, spoilersOn, filters, selectTrophy, toggleTrophy, selectedName);
  const selected = trophies.find((t) => t.name === selectedName) || null;
  renderDetail(selected, progress, spoilersOn, toggleTrophy);
  renderRoadmap(trophies, progress);
  renderMissables(trophies, progress);
}

function selectTrophy(name) {
  selectedName = name;
  renderChecklist(trophies, progress, spoilersOn, filters, selectTrophy, toggleTrophy, selectedName);
  const selected = trophies.find((t) => t.name === name) || null;
  renderDetail(selected, progress, spoilersOn, toggleTrophy);
}

function toggleTrophy(name, earned) {
  if (earned) {
    progress[name] = true;
  } else {
    delete progress[name];
  }
  saveProgress(progress);
  rerenderAll();
}

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach((el) => {
    const active = el.dataset.tab === tab;
    el.classList.toggle("active", active);
    el.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll(".tabpage").forEach((el) => {
    el.classList.toggle("active", el.id === "tab-" + tab);
  });
}

async function boot() {
  trophies = await loadTrophies();
  renderHundred();

  const spoilerToggle = document.getElementById("spoilerToggle");
  spoilerToggle.checked = spoilersOn;
  spoilerToggle.addEventListener("change", () => {
    spoilersOn = spoilerToggle.checked;
    saveSpoilers(spoilersOn);
    rerenderAll();
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    exportProgress(progress);
  });

  const importFile = document.getElementById("importFile");
  importFile.addEventListener("change", async () => {
    const file = importFile.files[0];
    if (!file) return;
    try {
      progress = await importProgressFile(file);
      saveProgress(progress);
      rerenderAll();
    } catch (err) {
      alert("Import failed: " + err.message);
    }
    importFile.value = "";
  });

  document.getElementById("searchBox").addEventListener("input", (e) => {
    filters.query = e.target.value.trim();
    renderChecklist(trophies, progress, spoilersOn, filters, selectTrophy, toggleTrophy, selectedName);
  });

  document.getElementById("kindChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll("#kindChips .chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    filters.kind = chip.dataset.kind;
    renderChecklist(trophies, progress, spoilersOn, filters, selectTrophy, toggleTrophy, selectedName);
  });

  document.getElementById("gradeFilter").addEventListener("change", (e) => {
    filters.grade = e.target.value;
    renderChecklist(trophies, progress, spoilersOn, filters, selectTrophy, toggleTrophy, selectedName);
  });

  document.getElementById("statusFilter").addEventListener("change", (e) => {
    filters.status = e.target.value;
    renderChecklist(trophies, progress, spoilersOn, filters, selectTrophy, toggleTrophy, selectedName);
  });

  document.querySelectorAll(".tab").forEach((el) => {
    el.addEventListener("click", () => switchTab(el.dataset.tab));
  });

  if (params.get("spoilers") === "1") {
    spoilersOn = true;
    spoilerToggle.checked = true;
    saveSpoilers(true);
  }
  const tabParam = params.get("tab");
  if (tabParam && document.getElementById("tab-" + tabParam)) {
    switchTab(tabParam);
  }
  const trophyParam = params.get("trophy");
  if (trophyParam && trophies.some((t) => t.name === trophyParam)) {
    selectedName = trophyParam;
  }

  rerenderAll();
}

boot().catch((err) => {
  document.getElementById("trophyList").innerHTML =
    "<li>Failed to load the trophy list: " + err.message + "</li>";
});
