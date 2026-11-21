// Boot, state and wiring for the Leonida Legend guide.
import { DEMO_EARNED } from "./config.js";
import { loadProgress, saveProgress, loadSpoilers, saveSpoilers, exportProgress, importProgressFile } from "./store.js";
import { loadTrophies } from "./data.js";
import { renderProgress, renderNextUp, renderChecklist, renderDetail, renderRoadmap, renderMissables, renderHundred } from "./views.js";

const params = new URLSearchParams(location.search);
let trophies = [];
let progress = loadProgress();
let spoilersOn = loadSpoilers();
let selectedName = null;
const filters = { kind: "all", grade: "all", status: "all", query: "" };

if (params.get("demo") === "1") {
  for (const name of DEMO_EARNED) progress[name] = true;
}

function rerenderAll() {
  renderProgress(trophies, progress);
  renderNextUp(trophies, progress);
  renderChecklist(trophies, progress, filters, spoilersOn, selectedName, selectTrophy, toggleTrophy);
  renderDetail(selectedName ? trophies.find((t) => t.name === selectedName) : null, progress, spoilersOn, toggleTrophy);
  renderRoadmap(trophies, progress);
  renderMissables(trophies);
}

function selectTrophy(name) {
  selectedName = name;
  renderChecklist(trophies, progress, filters, spoilersOn, selectedName, selectTrophy, toggleTrophy);
  renderDetail(trophies.find((t) => t.name === name), progress, spoilersOn, toggleTrophy);
}

function toggleTrophy(name, earned) {
  if (earned) progress[name] = true;
  else delete progress[name];
  saveProgress(progress);
  rerenderAll();
}

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach((b) => {
    const active = b.dataset.tab === tab;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".tabpage").forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab));
}

async function boot() {
  trophies = await loadTrophies();
  renderHundred();
  const spoilerBox = document.getElementById("spoilerToggle");
  spoilerBox.checked = spoilersOn;
  spoilerBox.addEventListener("change", () => {
    spoilersOn = spoilerBox.checked;
    saveSpoilers(spoilersOn);
    rerenderAll();
  });
  document.getElementById("exportBtn").addEventListener("click", () => exportProgress(progress));
  document.getElementById("importFile").addEventListener("change", async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      progress = await importProgressFile(file);
      saveProgress(progress);
      rerenderAll();
    } catch (err) {
      alert("Import failed: " + err.message);
    }
    ev.target.value = "";
  });
  document.getElementById("searchBox").addEventListener("input", (ev) => {
    filters.query = ev.target.value.trim();
    renderChecklist(trophies, progress, filters, spoilersOn, selectedName, selectTrophy, toggleTrophy);
  });
  document.getElementById("kindChips").addEventListener("click", (ev) => {
    const chip = ev.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
    filters.kind = chip.dataset.kind;
    renderChecklist(trophies, progress, filters, spoilersOn, selectedName, selectTrophy, toggleTrophy);
  });
  document.getElementById("gradeFilter").addEventListener("change", (ev) => {
    filters.grade = ev.target.value;
    renderChecklist(trophies, progress, filters, spoilersOn, selectedName, selectTrophy, toggleTrophy);
  });
  document.getElementById("statusFilter").addEventListener("change", (ev) => {
    filters.status = ev.target.value;
    renderChecklist(trophies, progress, filters, spoilersOn, selectedName, selectTrophy, toggleTrophy);
  });
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
  const startTab = params.get("tab");
  if (startTab && document.getElementById("tab-" + startTab)) switchTab(startTab);
  const startTrophy = params.get("trophy");
  if (startTrophy && trophies.some((t) => t.name === startTrophy)) selectedName = startTrophy;
  if (params.get("spoilers") === "1") {
    spoilersOn = true;
    spoilerBox.checked = true;
  }
  rerenderAll();
}

boot().catch((err) => {
  document.getElementById("trophyList").innerHTML = "<li>Failed to load the trophy list: " + err.message + "</li>";
});
