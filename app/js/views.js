// All rendering: checklist, detail pane, Next Up planner, roadmap, missables, 100%.
import { GRADE_ORDER } from "./config.js";

export const ROADMAP_STAGES = [
  {
    title: "Stage 1 — Play the story",
    time: "60–80 hours",
    intro: "Chapters 1–4 and the final mission. No gold medals are needed in story missions, so enjoy the campaign — but do the side things below while they are in front of you.",
    steps: [
      "Finish the opening mission Gone Fishing and play through Chapters 1–4 to the final mission.",
      "After the mission Down to Earth (Chapter 1), meet Lucia at Jason's house in the morning and take the balcony meditation — the one potentially missable interaction.",
      "Keep a manual save at the start and end of every chapter. There is no mission replay.",
      "Scan new vehicles with WAiNK and study new animals with binoculars from the start — you will need 200 base-model vehicles and 100 animals later.",
      "Do optional missions as they appear, especially ones introducing robberies, fishing and hunting."
    ],
    trophies: ["Just Like Paradise", "Paradise Lost", "T**s Ass Drug Money", "Vice City, Baby!", "Top of the World, Ma", "You Gotta Know When to Get Off", "Trust", "Break the Bank", "Family Matters", "DWNFALL", "Hi-Jacked", "Snow Storm", "Positive Mental Attitude"]
  },
  {
    title: "Stage 2 — Strangers & Freaks",
    time: "10–20 hours",
    intro: "The stranger mission strands across Leonida. Five character strands end in their own trophies, and eight strands in total earn the Silver.",
    steps: [
      "Finish the final mission for Andy, Kenton, Billy, Randy and Tyrone.",
      "Complete eight qualifying stranger mission strands in total.",
      "Kenton's strand ties into the treasure sets — collect treasure clues while exploring."
    ],
    trophies: ["Road to Rehabilitation", "This Was No Boat Accident", "The Lone Rider", "Supply & Demand", "Spin On This!", "Strangers & Freaks"]
  },
  {
    title: "Stage 3 — Activities & collectibles",
    time: "around 100 hours",
    intro: "The long grind, done after the story with free roam open. Work down the 100% checklist in Progress > Stats instead of chasing everything.",
    steps: [
      "Earn all 42 Shooting Range gold medals — the hardest skill trophy.",
      "Complete 250 stunts (300 count toward 100%), win 20 different races, win Top Fun drone races at all 14 locations.",
      "WAiNK It at 100 locations, complete 3 Collectible Card sets, meditate at all 18 spots, hunt Bret's unique animals.",
      "Complete 50 Challenges (70 of 80 count toward 100%), rob 5 bank vaults, rob one Illegal Operation per gang."
    ],
    trophies: ["The Shootist", "Cunning Stunts", "Top Fun", "Earn Cash, Not Kudos", "You WAiNKer!", "Don't Touch My Deck", "One Last Thing", "Maximum Withdrawal", "Pest Control", "Master of None"]
  },
  {
    title: "Stage 4 — 100% and the Platinum",
    time: "cleanup",
    intro: "Open Progress > Stats > 100% Completion, finish whatever the checklist still asks for, and the Gold for 100% unlocks — then the Platinum follows automatically.",
    steps: [
      "Finish the remaining checklist numbers (see the 100% Completion tab).",
      "Earn any leftover combat, driving, robbery or miscellaneous trophies.",
      "Check the trophy list: once A Long Road unlocks and nothing else is missing, Vice Got a Price! is yours."
    ],
    trophies: ["A Long Road", "Vice Got a Price!"]
  }
];

export const HUNDRED_TABLES = [
  { title: "Robberies for 100%", rows: [["Main story", "All chapters"], ["Optional tasks", "100 completed"], ["Gang Operations", "39 of 39"], ["Bank Jobs", "22 of 22"], ["Payday Loan Jobs", "7 of 7"], ["Smash 'N' Grabs", "34 of 35"], ["Stick Ups", "50 of 91"], ["Bank Vaults", "8 of 8"], ["Marked Bills fenced", "$250,000"], ["Jewelry fenced", "$100,000"], ["Narcotics fenced", "$100,000"], ["Vehicles fenced", "$200,000"]] },
  { title: "Collectibles & exploration", rows: [["Kenton's Treasure Sets", "5 of 7"], ["Collectible Card Sets", "15 of 18"], ["WAiNK locations", "100 scans"], ["Underwater Discoveries", "33 of 33"], ["Magazines, Books, Comics", "30 of 34"], ["Meditations", "15 of 18"], ["Cocaine Flamingos", "100 of 125"], ["Unique Playlists", "2 of 2"], ["Discovered Styles", "70 of 79"], ["Base-model Vehicles", "200 of 277"], ["Standard Issue Weapons", "50 of 66"], ["Animals Studied", "100 of 255"]] },
  { title: "Activities for 100%", rows: [["Unique Races won", "30 of 40"], ["Race Challenge Golds", "10 of 13"], ["Shooting Range Golds", "42 of 42"], ["Video Games played", "All 4"], ["Pool Opponents beaten", "5 of 7"], ["Mini Golf", "2 of 3 locations"], ["Basketball Hoops", "90 of 100"], ["Drone Time Trials", "42 of 42"], ["Stunts", "300 of 397"], ["Challenges", "70 of 80"], ["Bret's Target Decks", "15 of 15"]] }
];

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export function isHidden(trophy, spoilersOn, earned) {
  return spoilersOn && trophy.hidden && !earned;
}

export function renderProgress(trophies, progress) {
  const earned = trophies.filter((t) => progress[t.name]);
  const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of earned) byGrade[t.grade] = (byGrade[t.grade] || 0) + 1;
  const pct = Math.round((earned.length / trophies.length) * 100);
  document.getElementById("progressCount").textContent = earned.length + "/" + trophies.length;
  document.getElementById("progressPct").textContent = pct + "%";
  document.getElementById("progressSub").textContent =
    earned.length + " earned · " + byGrade.bronze + " bronze · " + byGrade.silver + " silver · " + byGrade.gold + " gold";
  document.getElementById("progressFill").style.width = pct + "%";
}

export function renderNextUp(trophies, progress) {
  const list = trophies
    .filter((t) => !progress[t.name] && t.grade !== "platinum")
    .sort((a, b) => a.difficulty - b.difficulty || GRADE_ORDER[b.grade] - GRADE_ORDER[a.grade])
    .slice(0, 3);
  document.getElementById("nextUpList").innerHTML = list
    .map((t) => "<li><span class=\"nu-grade " + t.grade + "\">" + escapeHtml(t.name) + "</span> <span class=\"grade-tag " + t.grade + "\">" + t.grade + "</span> · " + stars(t.difficulty) + "<br><span class=\"nu-why\">" + escapeHtml(t.description) + " — about " + escapeHtml(t.time) + ".</span></li>")
    .join("");
}

export function trophyMatches(trophy, kind, grade, status, query, progress) {
  if (kind === "missable" && !trophy.missable) return false;
  if (kind !== "all" && kind !== "missable" && trophy.kind !== kind) return false;
  if (grade !== "all" && trophy.grade !== grade) return false;
  const earned = !!progress[trophy.name];
  if (status === "earned" && !earned) return false;
  if (status === "unearned" && earned) return false;
  if (query) {
    const q = query.toLowerCase();
    if (!(trophy.name.toLowerCase().includes(q) || trophy.description.toLowerCase().includes(q))) return false;
  }
  return true;
}

export function renderChecklist(trophies, progress, filters, spoilersOn, selectedName, onSelect, onToggle) {
  const list = document.getElementById("trophyList");
  const shown = trophies.filter((t) => trophyMatches(t, filters.kind, filters.grade, filters.status, filters.query, progress));
  document.getElementById("listCount").textContent =
    "Showing " + shown.length + " of 55 trophies · " + trophies.filter((t) => progress[t.name]).length + " earned";
  list.innerHTML = shown
    .map((t) => {
      const earned = !!progress[t.name];
      const hidden = isHidden(t, spoilersOn, earned);
      const name = hidden ? "Hidden story trophy — earn it to reveal" : escapeHtml(t.name);
      const desc = hidden ? "Spoilers hidden until earned." : escapeHtml(t.description);
      return "<li><button type=\"button\" class=\"trophy-row" + (earned ? " earned" : "") + (t.name === selectedName ? " selected" : "") +
        "\" data-name=\"" + escapeHtml(t.name) + "\">" +
        "<input type=\"checkbox\" " + (earned ? "checked" : "") + " data-check=\"" + escapeHtml(t.name) + "\" aria-label=\"Mark " + escapeHtml(t.name) + " earned\">" +
        "<span class=\"medal " + t.grade + "\" aria-hidden=\"true\"></span>" +
        "<span><span class=\"trophy-name\">" + name + "</span>" +
        (t.missable ? "<span class=\"badge\">MISSABLE</span>" : "") +
        (t.hidden && !hidden ? "<span class=\"badge hidden-badge\">HIDDEN</span>" : "") +
        "<br><span class=\"trophy-desc\">" + desc + "</span>" +
        "<br><span class=\"trophy-meta\">" + stars(t.difficulty) + " · " + escapeHtml(t.time) + " · " + escapeHtml(t.kind) + "</span></span>" +
        "<span class=\"grade-tag " + t.grade + "\">" + t.grade + "</span>" +
        "</button></li>";
    })
    .join("");
  list.querySelectorAll(".trophy-row").forEach((row) => {
    row.addEventListener("click", (ev) => {
      if (ev.target.matches("input[type=checkbox]")) return;
      onSelect(row.dataset.name);
    });
  });
  list.querySelectorAll("input[type=checkbox]").forEach((box) => {
    box.addEventListener("click", (ev) => {
      ev.stopPropagation();
      onToggle(box.dataset.check, box.checked);
    });
  });
}

export function renderDetail(trophy, progress, spoilersOn, onToggle) {
  const pane = document.getElementById("detailPane");
  if (!trophy) {
    pane.innerHTML = "<p class=\"detail-empty\">Select a trophy to read its guide, sources and missable note.</p>";
    return;
  }
  const earned = !!progress[trophy.name];
  if (isHidden(trophy, spoilersOn, earned)) {
    pane.innerHTML = "<h2>Hidden story trophy</h2><p class=\"official\">Spoilers are hidden until this trophy is earned. Turn off “Hide story spoilers” to reveal it, or earn it in the game.</p>" +
      "<p class=\"kv\"><span>Grade: <b>" + trophy.grade + "</b></span><span>Difficulty: <b>" + stars(trophy.difficulty) + "</b></span><span>Time: <b>" + escapeHtml(trophy.time) + "</b></span></p>";
    return;
  }
  pane.innerHTML =
    "<h2>" + escapeHtml(trophy.name) + "</h2>" +
    "<p class=\"official\">“" + escapeHtml(trophy.description) + "” — official description</p>" +
    "<p class=\"kv\"><span>Grade: <b class=\"grade-tag " + trophy.grade + "\">" + trophy.grade + "</b></span>" +
    "<span>Difficulty: <b>" + stars(trophy.difficulty) + "</b></span>" +
    "<span>Time: <b>" + escapeHtml(trophy.time) + "</b></span>" +
    "<span>Kind: <b>" + escapeHtml(trophy.kind) + "</b></span>" +
    (trophy.missable ? "<span><b style=\"color:var(--warn)\">⚠ MISSABLE</b></span>" : "<span>Missable: <b>No</b></span>") + "</p>" +
    "<h3>How to get it</h3><p>" + escapeHtml(trophy.guide) + "</p>" +
    "<h3>Tip</h3><p>" + escapeHtml(trophy.tip) + "</p>" +
    "<h3>When it can be missed</h3><p>" + (trophy.missable
      ? "Yes — this is the one potentially missable trophy. See the Missables tab for the exact moment (Chapter 1 balcony meditation) and keep manual saves."
      : "It cannot be missed. Free roam stays open after the story, so it can be earned any time.") + "</p>" +
    "<p class=\"sources\"><strong>Sources:</strong> " + escapeHtml(trophy.sources) + "</p>" +
    "<button type=\"button\" class=\"mark-btn" + (earned ? " earned" : "") + "\" id=\"markBtn\">" +
    (earned ? "✓ Earned — click to unmark" : "Mark as earned") + "</button>";
  document.getElementById("markBtn").addEventListener("click", () => onToggle(trophy.name, !earned));
}

export function renderRoadmap(trophies, progress) {
  const byName = Object.fromEntries(trophies.map((t) => [t.name, t]));
  document.getElementById("stageList").innerHTML = ROADMAP_STAGES
    .map((s) => {
      const done = s.trophies.filter((n) => progress[n]).length;
      return "<li class=\"stage\"><h3>" + escapeHtml(s.title) + " <span class=\"stage-time\">· " + escapeHtml(s.time) + " · " + done + "/" + s.trophies.length + " trophies</span></h3>" +
        "<p>" + escapeHtml(s.intro) + "</p><ul>" +
        s.steps.map((step) => "<li>" + escapeHtml(step) + "</li>").join("") +
        "</ul><p class=\"stage-trophies\">Trophies: " + s.trophies.map((n) => (progress[n] ? "✓ " : "") + escapeHtml(n)).join(" · ") + "</p></li>";
    })
    .join("");
}

export function renderMissables(trophies) {
  const missable = trophies.filter((t) => t.missable);
  const safe = trophies.filter((t) => !t.missable);
  document.getElementById("missableList").innerHTML =
    missable.map((t) =>
      "<div class=\"missable-card\"><h3>⚠ " + escapeHtml(t.name) + " — potentially missable</h3>" +
      "<p><em>“" + escapeHtml(t.description) + "”</em></p><p>" + escapeHtml(t.guide) + "</p>" +
      "<p class=\"sources\"><strong>Sources:</strong> " + escapeHtml(t.sources) + "</p></div>"
    ).join("") +
    "<div class=\"missable-card safe\"><h3>Everything else: not missable</h3>" +
    "<p>All other " + safe.length + " trophies can be earned in free roam after the story ends. There is no mission replay, but nothing else is gated behind a one-time moment: story trophies unlock by playing, and activities, collectibles, robberies and races stay available. Manual saves at the start and end of each chapter are still good insurance.</p></div>";
}

export function renderHundred() {
  document.getElementById("hundredGrid").innerHTML = HUNDRED_TABLES
    .map((t) =>
      "<div class=\"hundred-card\"><h3>" + escapeHtml(t.title) + "</h3><table>" +
      t.rows.map((r) => "<tr><td>" + escapeHtml(r[0]) + "</td><td>" + escapeHtml(r[1]) + "</td></tr>").join("") +
      "</table></div>"
    )
    .join("");
}
