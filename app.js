const baseRaces = [
  { video: "https://www.youtube.com/watch?v=FAzZBkJJNs4&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=10", results: [["Rohat", 1], ["Giggand", 2], ["Fabo", 3], ["Rick", 4], ["Danergy", 5], ["Jussef", 6], ["Ayman", 7]] },
  { video: "https://www.youtube.com/watch?v=FAzZBkJJNs4&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=10", results: [["Rohat", 1], ["Noiizy", 2], ["Giggand", 3], ["Rick", 4], ["Jussef", 5], ["Fabo", 6], ["Danergy", 7], ["Ayman", 8]] },
  { video: "https://www.youtube.com/watch?v=lFllV1KA6uY&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=9", results: [["Rohat", 1], ["Noiizy", 2], ["Giggand", 3], ["Fabo", 4], ["Huyybui", 5], ["Ayman", 6], ["Ediz", 7]] },
  { video: "https://www.youtube.com/watch?v=XoFTF9o-T5o&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=8", results: [["Rick", 1], ["Giggand", 2], ["GTasty", 3], ["Noiizy", 4], ["Rohat", 5]] },
  { video: "https://www.youtube.com/watch?v=XoFTF9o-T5o&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=8", results: [["Giggand", 1], ["GTasty", 2], ["Rohat", 3], ["Rick", 4]] },
  { video: "https://www.youtube.com/watch?v=6YI4tWKrP7g&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=7", results: [["Rick", 1], ["Rohat", 2], ["Giggand", 3], ["Elquaria", 4], ["JayJo", 5], ["Mehdi", 6], ["GTasty", 7]] },
  { video: "https://www.youtube.com/watch?v=SqfZaDjLBOg&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=5", results: [["Giggand", 1], ["Rohat", 2], ["Danergy", 3]] },
  { video: "https://www.youtube.com/watch?v=0FoIvA8OsWw&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=4", results: [["Rohat", 1], ["Giggand", 2], ["Danergy", 3]] },
  { video: "https://www.youtube.com/watch?v=jA91ANOQyVo&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=3", results: [["Giggand", 1], ["Rohat", 2], ["Rick", 3], ["Danergy", 4]] },
  { video: "https://www.youtube.com/watch?v=jA91ANOQyVo&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i&index=3", results: [["Giggand", 1], ["Rick", 2], ["Rohat", 3], ["Danergy", 4]] },
  { video: "https://www.youtube.com/watch?v=bejb2BsdSug", results: [["Rohat", 1], ["Noiizy", 2], ["Fabo", 3], ["Rick", 4], ["Giggand", 5]] },
  { video: "https://www.youtube.com/watch?v=bejb2BsdSug", results: [["Noiizy", 1], ["Rohat", 2], ["Fabo", 3], ["Rick", 4], ["Giggand", 5]] },
  { video: "https://www.youtube.com/watch?v=bejb2BsdSug", results: [["Giggand", 1], ["Rohat", 2], ["Rick", 3], ["Noiizy", 4], ["Fabo", 5]] },
  { video: "https://www.youtube.com/watch?v=jZ3NnARYOZo", results: [["Giggand", 1], ["Rohat", 2], ["Noiizy", 3], ["Jussef", 4], ["Fabo", 5], ["Ayman", 6]] },
  { video: "https://www.youtube.com/watch?v=jZ3NnARYOZo", results: [["Giggand", 1], ["Rick", 2], ["Rohat", 3], ["Noiizy", 4], ["Fabo", 5], ["Ayman", 6], ["Jussef", 7]] },
  { video: "https://www.youtube.com/watch?v=fB5_WmlZx3c", results: [["Rick", 1], ["Rohat", 2], ["Jussef", 3], ["Timgioh", 4]] },
  { video: "https://www.youtube.com/watch?v=fB5_WmlZx3c", results: [["Giggand", 1], ["Rohat", 2], ["Noiizy", 3], ["Jussef", 4], ["Rick", 5], ["Timgioh", 6]] },
  { video: "https://www.youtube.com/watch?v=fB5_WmlZx3c", results: [["Rohat", 1], ["Rick", 2], ["Noiizy", 3], ["Giggand", 4], ["Timgioh", 5], ["Jussef", 6]] },
  { video: "https://www.youtube.com/watch?v=XoFTF9o-T5o", results: [["Rick", 1], ["Giggand", 2], ["GTasty", 3], ["Noiizy", 4], ["Rohat", 5]] },
  { video: "https://www.youtube.com/watch?v=jA91ANOQyVo", results: [["Giggand", 1], ["Noiizy", 2], ["Rohat", 3], ["Ayman", 4], ["Danergy", 6]] },
  { video: "https://www.youtube.com/watch?v=_ZOkUVj_MTc", results: [["Rohat", 1], ["Fabo", 2], ["Giggand", 3], ["Rick", 4], ["Ayman", 5]] },
  { video: "https://www.youtube.com/watch?v=_ZOkUVj_MTc", results: [["Rohat", 1], ["Rick", 2], ["Giggand", 3], ["Fabo", 4], ["Ayman", 5]] },
  { video: "https://www.youtube.com/watch?v=_ZOkUVj_MTc", results: [["Rohat", 1], ["Giggand", 2], ["Ayman", 3], ["Fabo", 4]] },
  { video: "https://www.youtube.com/watch?v=T5hPmJ3rIL4&list=PLTQhY0S6fhpRDhaqbxOBL1fd9Mrpud6-i", results: [["Giggand", 1], ["Rick", 2], ["Rohat", 3], ["Jussef", 4], ["Noiizy", 5]] },
  { video: "https://www.twitch.tv/videos/2825515693?t=8145s", results: [["Rohat", 1], ["Noiizy", 2], ["Giggand", 3], ["Jussef", 4], ["Ediz", 5], ["Ayman", 6]] },
  { video: "https://www.twitch.tv/videos/2825515693?t=11935s", results: [["Giggand", 1], ["Rohat", 2], ["Noiizy", 3], ["Rick", 4], ["Jussef", 5], ["Ediz", 6], ["Ayman", 7]] },
  { video: "https://www.twitch.tv/videos/2825515693?t=18365s", results: [["Giggand", 1], ["Rohat", 2], ["Noiizy", 3]] }
];

const MIN_RACES = 3;
const aliases = new Map([
  ["Noizzy", "Noiizy"]
]);

const basePlayerImages = {
  Rohat: "./assets/players/rohat.png",
  Ayman: "./assets/players/Ayman.png",
  Danergy: "./assets/players/Danergy.png",
  Ediz: "./assets/players/Ediz.png",
  Elquaria: "./assets/players/Elquaria.png",
  Fabo: "./assets/players/Fabo.png",
  Giggand: "./assets/players/Giggand.png",
  GTasty: "./assets/players/GTasty.png",
  Huyybui: "./assets/players/Huyybui.png",
  JayJo: "./assets/players/JayJo.png",
  Jussef: "./assets/players/Jussef.png",
  Mehdi: "./assets/players/Mehdi.png",
  Noiizy: "./assets/players/Noiizy.png",
  Rick: "./assets/players/Rick.png",
  Timgioh: "./assets/players/Timgioh.png",
  
};

// --- Admin / Persistenz -------------------------------------------------
// Es gibt kein Backend: alles, was im Admin-Bereich gespeichert wird, landet
// im localStorage DIESES Browsers. Über den Export-Tab lässt sich der
// aktuelle Datensatz als Code exportieren, um ihn dauerhaft in app.js zu
// übernehmen (z. B. beim nächsten Upload der Seite).
const STORAGE_RACES_KEY = "am_admin_races_v1";
const STORAGE_IMAGES_KEY = "am_admin_images_v1";
const ADMIN_SESSION_KEY = "am_admin_unlocked_v1";
const ADMIN_PASSWORD = "asianmaps26"; // einfacher Client-seitiger Schutz, kein echter Login

function loadStoredJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("Konnte gespeicherte Daten nicht laden:", key, error);
    return fallback;
  }
}

function saveStoredJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Konnte Daten nicht speichern:", key, error);
  }
}

let customRaces = loadStoredJSON(STORAGE_RACES_KEY, []);
let customPlayerImages = loadStoredJSON(STORAGE_IMAGES_KEY, {});

function getAllRaces() {
  return [...baseRaces, ...customRaces];
}

function getAllPlayerImages() {
  return { ...basePlayerImages, ...customPlayerImages };
}

// --- Kernlogik: arbeitet auf getAllRaces()/getAllPlayerImages(), damit
// Admin-Änderungen sofort einfließen ------------------------------------

const els = {
  leaderboard: document.querySelector("#leaderboard"),
  leaderPreview: document.querySelector("#leaderPreview"),
  statRaces: document.querySelector("#statRaces"),
  statVideos: document.querySelector("#statVideos"),
  statPlacements: document.querySelector("#statPlacements"),
  statPlayers: document.querySelector("#statPlayers"),
  searchInput: document.querySelector("#searchInput"),
  raceGrid: document.querySelector("#raceGrid"),
  dialog: document.querySelector("#playerDialog"),
  dialogContent: document.querySelector("#dialogContent"),
  adminToggle: document.querySelector("#adminToggle"),
  adminDialog: document.querySelector("#adminDialog"),
  adminLogin: document.querySelector("#adminLogin"),
  adminPanel: document.querySelector("#adminPanel"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  adminPasswordInput: document.querySelector("#adminPasswordInput"),
  adminError: document.querySelector("#adminError"),
  adminTabs: document.querySelectorAll(".admin-tab"),
  adminTabPanels: document.querySelectorAll(".admin-tab-panel"),
  raceForm: document.querySelector("#raceForm"),
  raceVideoInput: document.querySelector("#raceVideoInput"),
  resultRows: document.querySelector("#resultRows"),
  addRowBtn: document.querySelector("#addRowBtn"),
  customRaceList: document.querySelector("#customRaceList"),
  playerImageForm: document.querySelector("#playerImageForm"),
  playerNameInput: document.querySelector("#playerNameInput"),
  playerNameList: document.querySelector("#playerNameList"),
  playerImageUrlInput: document.querySelector("#playerImageUrlInput"),
  playerImageFileInput: document.querySelector("#playerImageFileInput"),
  generateExportBtn: document.querySelector("#generateExportBtn"),
  exportOutput: document.querySelector("#exportOutput"),
  copyExportBtn: document.querySelector("#copyExportBtn"),
  resetCustomBtn: document.querySelector("#resetCustomBtn")
};

let activeFilter = "qualified";
let players = [];
let qualifiedPlayers = [];

function normalizeName(name) {
  return aliases.get(name) || name;
}

function uniqueVideoId(url) {
  return new URL(url).searchParams.get("v") || url;
}

function getRaceResults(race) {
  const bestByPlayer = new Map();
  race.results.forEach(([rawName, place]) => {
    const name = normalizeName(rawName);
    if (!bestByPlayer.has(name) || place < bestByPlayer.get(name)) {
      bestByPlayer.set(name, place);
    }
  });
  return [...bestByPlayer.entries()].sort((a, b) => a[1] - b[1]);
}

function buildStats() {
  const playerMap = new Map();
  const allRaces = getAllRaces();

  allRaces.forEach((race, raceIndex) => {
    const cleanResults = getRaceResults(race);
    const fieldSize = cleanResults.length;

    cleanResults.forEach(([name, place]) => {
      if (!playerMap.has(name)) {
        playerMap.set(name, {
          name,
          races: 0,
          wins: 0,
          podiums: 0,
          places: [],
          performances: [],
          appearances: []
        });
      }

      const player = playerMap.get(name);
      const performance = fieldSize <= 1 ? 100 : ((fieldSize - place) / (fieldSize - 1)) * 100;
      player.races += 1;
      player.wins += place === 1 ? 1 : 0;
      player.podiums += place <= 3 ? 1 : 0;
      player.places.push(place);
      player.performances.push(performance);
      player.appearances.push({ raceIndex, place, fieldSize, video: race.video });
    });
  });

  const maxRaces = Math.max(...[...playerMap.values()].map((player) => player.races));

  return [...playerMap.values()].map((player) => {
    const avgPerformance = average(player.performances);
    const avgPlace = average(player.places);
    const top3Rate = player.podiums / player.races;
    const winRate = player.wins / player.races;
    const reliability = player.races < MIN_RACES ? 0.72 : 0.88 + 0.12 * (1 - Math.exp(-(player.races - MIN_RACES) / 8));
    const volumeBonus = player.races < MIN_RACES
      ? 0
      : (Math.log1p(player.races - MIN_RACES) / Math.log1p(maxRaces - MIN_RACES)) * 6;
    const score = avgPerformance * reliability + top3Rate * 5 + winRate * 3 + volumeBonus;

    return {
      ...player,
      avgPerformance,
      avgPlace,
      top3Rate,
      winRate,
      score,
      qualified: player.races >= MIN_RACES
    };
  }).sort((a, b) => b.score - a.score || b.races - a.races || a.avgPlace - b.avgPlace);
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function format(value, digits = 1) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarHue(name) {
  return [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
}

function avatarMarkup(name) {
  const image = getAllPlayerImages()[name];
  const imageMarkup = image
    ? `<img src="${image}" alt="${name}" onerror="this.remove()" />`
    : "";

  return `
    <span class="avatar" style="--hue: ${avatarHue(name)}">
      ${imageMarkup}
      <span class="avatar-fallback">${initials(name)}</span>
    </span>
  `;
}

function refreshData() {
  players = buildStats();
  qualifiedPlayers = players.filter((player) => player.qualified);
}

function animateNumber(element, target) {
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString("de-DE");
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function updateStats() {
  const allRaces = getAllRaces();
  const videos = new Set(allRaces.map((race) => uniqueVideoId(race.video)));
  const placements = allRaces.reduce((sum, race) => sum + getRaceResults(race).length, 0);

  animateNumber(els.statRaces, allRaces.length);
  animateNumber(els.statVideos, videos.size);
  animateNumber(els.statPlacements, placements);
  animateNumber(els.statPlayers, players.length);
}

function renderPreview() {
  els.leaderPreview.innerHTML = qualifiedPlayers.slice(0, 5).map((player, index) => `
    <div class="preview-row" style="--offset: ${index * -7}px">
      <span class="preview-rank">#${index + 1}</span>
      ${avatarMarkup(player.name)}
      <strong>${player.name}</strong>
      <span class="preview-score">${format(player.score)}</span>
    </div>
  `).join("");
}

function visiblePlayers() {
  const query = els.searchInput.value.trim().toLowerCase();
  return players
    .filter((player) => {
      if (activeFilter === "qualified") return player.qualified;
      if (activeFilter === "lowData") return !player.qualified;
      return true;
    })
    .filter((player) => player.name.toLowerCase().includes(query));
}

function renderLeaderboard() {
  const list = visiblePlayers();
  const bestScore = Math.max(...players.map((player) => player.score));

  els.leaderboard.innerHTML = list.map((player) => {
    const globalRank = players.findIndex((item) => item.name === player.name) + 1;
    return `
      <button class="leader-row" type="button" style="--heat: ${player.score / bestScore}" data-player="${player.name}" data-rank-row="true">
        <span class="rank">#${globalRank}</span>
        <span class="driver">
          ${avatarMarkup(player.name)}
          <span class="driver-info">
            <strong>${player.name}</strong>
            <span>${player.qualified ? "Qualifiziert" : "Zu wenig Daten"} · ${player.wins} Siege</span>
          </span>
        </span>
        <span class="score">${format(player.score)}</span>
        <span class="metric race-count">${player.races}</span>
        <span class="metric top-three">${format(player.top3Rate * 100, 0)}%</span>
        <span class="metric avg-place">${format(player.avgPlace)}</span>
      </button>
    `;
  }).join("") || `<div class="leader-row"><span></span><span class="driver"><strong>Keine Treffer</strong><span>Filter oder Suche anpassen</span></span></div>`;
}

function renderRaces() {
  const allRaces = getAllRaces();
  els.raceGrid.innerHTML = allRaces.map((race, index) => {
    const cleanResults = getRaceResults(race);
    return `
      <article class="race-card">
        <h3>
          <span>Rennen ${index + 1}</span>
          <a href="${race.video}" target="_blank" rel="noreferrer">Quelle</a>
        </h3>
        <div class="race-results">
          ${cleanResults.map(([name, place]) => `<span class="chip">#${place} ${name}</span>`).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function openPlayer(name) {
  const player = players.find((item) => item.name === name);
  if (!player) return;

  els.dialogContent.innerHTML = `
    <div class="dialog-body">
      <div class="dialog-profile">
        ${avatarMarkup(player.name)}
        <div>
          <p class="eyebrow">Fahrerprofil</p>
          <h2>${player.name}</h2>
        </div>
      </div>
      <div class="dialog-stats">
        <div class="dialog-stat"><strong>${format(player.score)}</strong><span>Score</span></div>
        <div class="dialog-stat"><strong>${player.races}</strong><span>Rennen</span></div>
        <div class="dialog-stat"><strong>${player.wins}</strong><span>Siege</span></div>
        <div class="dialog-stat"><strong>${format(player.avgPlace)}</strong><span>Ø Platz</span></div>
      </div>
      <div class="mini-results">
        ${player.appearances.map((entry) => `
          <a class="mini-result" href="${entry.video}" target="_blank" rel="noreferrer">
            <span>Rennen ${entry.raceIndex + 1}</span>
            <strong>#${entry.place} von ${entry.fieldSize}</strong>
          </a>
        `).join("")}
      </div>
    </div>
  `;
  els.dialog.showModal();
}

// --- Zentrales Neuberechnen/Rendern -------------------------------------
function renderAll() {
  refreshData();
  updateStats();
  renderPreview();
  renderLeaderboard();
  renderRaces();
  renderAdminRaceList();
  renderAdminPlayerList();
}

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderLeaderboard();
  });
});

els.searchInput.addEventListener("input", renderLeaderboard);
els.leaderboard.addEventListener("click", (event) => {
  const row = event.target.closest("[data-player]");
  if (row) openPlayer(row.dataset.player);
});

document.querySelector(".dialog-close").addEventListener("click", () => els.dialog.close());
els.dialog.addEventListener("click", (event) => {
  if (event.target === els.dialog) els.dialog.close();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

// --- Admin-Bereich -------------------------------------------------------

function createResultRow(name = "", place = "") {
  const row = document.createElement("div");
  row.className = "result-row";
  row.innerHTML = `
    <input type="text" class="result-name" placeholder="Fahrername" value="${name}" />
    <input type="number" class="result-place" placeholder="Platz" min="1" value="${place}" />
    <button type="button" class="result-remove" aria-label="Fahrer entfernen">×</button>
  `;
  row.querySelector(".result-remove").addEventListener("click", () => row.remove());
  return row;
}

function resetRaceForm() {
  if (!els.resultRows) return;
  els.raceVideoInput.value = "";
  els.resultRows.innerHTML = "";
  for (let i = 0; i < 4; i += 1) {
    els.resultRows.appendChild(createResultRow());
  }
}

function renderAdminRaceList() {
  if (!els.customRaceList) return;
  if (customRaces.length === 0) {
    els.customRaceList.innerHTML = `<p class="admin-empty">Noch keine manuell hinzugefügten Rennen.</p>`;
    return;
  }
  els.customRaceList.innerHTML = customRaces.map((race, index) => `
    <div class="admin-race-row">
      <div>
        <strong>${race.results.map(([name, place]) => `#${place} ${name}`).join(", ")}</strong>
        <a href="${race.video}" target="_blank" rel="noreferrer">Quelle</a>
      </div>
      <button type="button" class="result-remove" data-remove-race="${index}" aria-label="Rennen löschen">×</button>
    </div>
  `).join("");
}

function renderAdminPlayerList() {
  if (!els.playerNameList) return;
  els.playerNameList.innerHTML = players.map((player) => `<option value="${player.name}"></option>`).join("");
}

function unlockAdmin() {
  els.adminLogin.hidden = true;
  els.adminPanel.hidden = false;
  resetRaceForm();
  renderAdminRaceList();
  renderAdminPlayerList();
}

if (els.adminToggle) {
  els.adminToggle.addEventListener("click", () => {
    els.adminDialog.showModal();
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "1") {
      unlockAdmin();
    }
  });
}

document.querySelectorAll("[data-admin-close]").forEach((btn) => {
  btn.addEventListener("click", () => els.adminDialog.close());
});

if (els.adminDialog) {
  els.adminDialog.addEventListener("click", (event) => {
    if (event.target === els.adminDialog) els.adminDialog.close();
  });
}

if (els.adminLoginForm) {
  els.adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (els.adminPasswordInput.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      els.adminError.hidden = true;
      els.adminPasswordInput.value = "";
      unlockAdmin();
    } else {
      els.adminError.hidden = false;
    }
  });
}

els.adminTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    els.adminTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    els.adminTabPanels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== target;
    });
  });
});

if (els.addRowBtn) {
  els.addRowBtn.addEventListener("click", () => {
    els.resultRows.appendChild(createResultRow());
  });
}

if (els.raceForm) {
  els.raceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const video = els.raceVideoInput.value.trim();
    if (!video) return;

    const rows = [...els.resultRows.querySelectorAll(".result-row")];
    const results = rows
      .map((row) => {
        const name = row.querySelector(".result-name").value.trim();
        const place = Number(row.querySelector(".result-place").value);
        return name && place > 0 ? [name, place] : null;
      })
      .filter(Boolean)
      .sort((a, b) => a[1] - b[1]);

    if (results.length === 0) {
      alert("Bitte mindestens einen Fahrer mit Namen und Platz eintragen.");
      return;
    }

    customRaces = [...customRaces, { video, results }];
    saveStoredJSON(STORAGE_RACES_KEY, customRaces);
    resetRaceForm();
    renderAll();
  });
}

if (els.customRaceList) {
  els.customRaceList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-race]");
    if (!button) return;
    const index = Number(button.dataset.removeRace);
    customRaces = customRaces.filter((_, i) => i !== index);
    saveStoredJSON(STORAGE_RACES_KEY, customRaces);
    renderAll();
  });
}

if (els.playerImageForm) {
  els.playerImageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.playerNameInput.value.trim();
    if (!name) return;

    const url = els.playerImageUrlInput.value.trim();
    const file = els.playerImageFileInput.files[0];

    function saveImage(src) {
      customPlayerImages = { ...customPlayerImages, [name]: src };
      saveStoredJSON(STORAGE_IMAGES_KEY, customPlayerImages);
      els.playerImageForm.reset();
      renderAll();
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => saveImage(reader.result);
      reader.readAsDataURL(file);
    } else if (url) {
      saveImage(url);
    } else {
      alert("Bitte eine Bild-URL eingeben oder eine Datei hochladen.");
    }
  });
}

if (els.generateExportBtn) {
  els.generateExportBtn.addEventListener("click", () => {
    const raceLines = getAllRaces().map((race) => {
      const resultsText = race.results.map(([name, place]) => `["${name}", ${place}]`).join(", ");
      return `  { video: "${race.video}", results: [${resultsText}] }`;
    }).join(",\n");

    const imageLines = Object.entries(getAllPlayerImages()).map(([name, src]) => {
      return `  ${JSON.stringify(name)}: ${JSON.stringify(src)}`;
    }).join(",\n");

    els.exportOutput.value =
`const baseRaces = [
${raceLines}
];

const basePlayerImages = {
${imageLines}
};`;
  });
}

if (els.copyExportBtn) {
  els.copyExportBtn.addEventListener("click", async () => {
    if (!els.exportOutput.value) return;
    try {
      await navigator.clipboard.writeText(els.exportOutput.value);
      els.copyExportBtn.textContent = "Kopiert!";
      setTimeout(() => { els.copyExportBtn.textContent = "Kopieren"; }, 1500);
    } catch (error) {
      els.exportOutput.select();
    }
  });
}

// Setzt die im Browser gespeicherten Zusatz-Rennen/-Bilder auf 0 zurück.
// Damit vorher exportierter Code (der jetzt fest in app.js steckt) nicht bei
// jedem weiteren Export erneut mit ausgegeben wird und immer länger wird.
if (els.resetCustomBtn) {
  els.resetCustomBtn.addEventListener("click", () => {
    const confirmed = confirm(
      "Wurde der generierte Code bereits in app.js übernommen?\n\nWenn ja, werden jetzt alle im Browser gespeicherten Rennen und Spielerbilder gelöscht (nicht die, die schon fest in app.js stehen)."
    );
    if (!confirmed) return;

    customRaces = [];
    customPlayerImages = {};
    saveStoredJSON(STORAGE_RACES_KEY, customRaces);
    saveStoredJSON(STORAGE_IMAGES_KEY, customPlayerImages);
    els.exportOutput.value = "";
    renderAll();
  });
}

renderAll();
