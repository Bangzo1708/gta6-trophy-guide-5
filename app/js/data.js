import { DATA_URL } from "./config.js";

export async function loadTrophies() {
  const res = await fetch(DATA_URL);
  if (!res.ok) {
    throw new Error("Could not load " + DATA_URL);
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.trophies;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("No trophies in data file.");
  }
  return list;
}
