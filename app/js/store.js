// Progress store: localStorage persistence plus export / import.
import { STORAGE_KEY, SPOILER_KEY } from "./config.js";

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or blocked: progress stays in memory for this visit.
  }
}

export function loadSpoilers() {
  try {
    return localStorage.getItem(SPOILER_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveSpoilers(on) {
  try {
    localStorage.setItem(SPOILER_KEY, on ? "1" : "0");
  } catch {
    // ignore
  }
}

export function exportProgress(progress) {
  const blob = new Blob(
    [JSON.stringify({ app: "leonida-legend", earned: Object.keys(progress).filter((k) => progress[k]) }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leonida-legend-progress.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  const names = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(names)) throw new Error("File is not a Leonida Legend export.");
  const progress = {};
  for (const name of names) if (typeof name === "string") progress[name] = true;
  return progress;
}
