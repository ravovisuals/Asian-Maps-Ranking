// Diese beiden Arrays kommen jetzt NICHT mehr fest aus Code, sondern werden
// beim Laden der Seite live aus Supabase geholt (siehe loadBaseData() unten).
let baseRaces = [];
let basePlayerImages = {};

async function loadBaseData() {
  const { data: racesData, error: racesError } = await supabaseClient
    .from("races")
    .select("id, video_url, created_at, race_date, race_results(place, players(name))")
    .eq("status", "finished")
    .order("created_at", { ascending: true });

  if (racesError) throw racesError;

  baseRaces = racesData.map((race) => ({
    id: race.id,
    video: race.video_url,
    date: race.race_date,
    results: race.race_results.map((r) => [r.players.name, r.place])
  }));

  const { data: playersData, error: playersError } = await supabaseClient
    .from("players")
    .select("name, image_url");

  if (playersError) throw playersError;

  basePlayerImages = Object.fromEntries(
    playersData.filter((p) => p.image_url).map((p) => [p.name, p.image_url])
  );
}

const MIN_RACES = 3;
const aliases = new Map([
  ["Noizzy", "Noiizy"]
]);

// --- Admin -----------------------------------------------------------
// Admin-Login läuft jetzt über echten Supabase Auth Login (kein
// Client-seitiges Passwort mehr). Die E-Mail hier muss zu dem Admin-User
// passen, den du in Supabase unter Authentication -> Users angelegt hast.
const ADMIN_EMAIL = "visualsravo@gmail.com";

// Schalter: Wett-Feature vorübergehend deaktiviert (nur Frontend, Supabase
// Tabellen/Funktionen bleiben unverändert -- einfach auf true setzen, um es
// wieder einzuschalten).
const PREDICTIONS_ENABLED = false;

// Schalter: Community-Login/Registrierung vorübergehend deaktiviert (nur
// Frontend, Supabase Auth/Tabellen bleiben unverändert -- auf true setzen,
// um es wieder einzuschalten).
const ACCOUNTS_ENABLED = false;

function getAllRaces() {
  return baseRaces;
}

function getAllPlayerImages() {
  return basePlayerImages;
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
  raceDateInput: document.querySelector("#raceDateInput"),
  dailyDateSelect: document.querySelector("#dailyDateSelect"),
  dailyLeaderboard: document.querySelector("#dailyLeaderboard"),
  customRaceList: document.querySelector("#customRaceList"),
  playerImageForm: document.querySelector("#playerImageForm"),
  playerNameInput: document.querySelector("#playerNameInput"),
  playerNameList: document.querySelector("#playerNameList"),
  playerImageUrlInput: document.querySelector("#playerImageUrlInput"),
  playerImageFileInput: document.querySelector("#playerImageFileInput"),
  adminLogoutBtn: document.querySelector("#adminLogoutBtn"),
  accountToggle: document.querySelector("#accountToggle"),
  accountDialog: document.querySelector("#accountDialog"),
  accountAuth: document.querySelector("#accountAuth"),
  accountMaintenance: document.querySelector("#accountMaintenance"),
  accountProfile: document.querySelector("#accountProfile"),
  accountPanels: document.querySelectorAll("[data-account-panel]"),
  showRegisterBtn: document.querySelector("#showRegisterBtn"),
  showLoginBtn: document.querySelector("#showLoginBtn"),
  accountLoginForm: document.querySelector("#accountLoginForm"),
  loginUsernameInput: document.querySelector("#loginUsernameInput"),
  loginPasswordInput: document.querySelector("#loginPasswordInput"),
  loginError: document.querySelector("#loginError"),
  accountRegisterForm: document.querySelector("#accountRegisterForm"),
  registerUsernameInput: document.querySelector("#registerUsernameInput"),
  registerPasswordInput: document.querySelector("#registerPasswordInput"),
  registerError: document.querySelector("#registerError"),
  accountUsername: document.querySelector("#accountUsername"),
  accountCoins: document.querySelector("#accountCoins"),
  resetCoinsBtn: document.querySelector("#resetCoinsBtn"),
  accountLogoutBtn: document.querySelector("#accountLogoutBtn"),
  communityLeaderboard: document.querySelector("#communityLeaderboard"),
  resolveRaceSelect: document.querySelector("#resolveRaceSelect"),
  entrantRows: document.querySelector("#entrantRows"),
  addEntrantRowBtn: document.querySelector("#addEntrantRowBtn"),
  announceForm: document.querySelector("#announceForm"),
  upcomingRaces: document.querySelector("#upcomingRaces")
};

let activeFilter = "qualified";
let players = [];
let qualifiedPlayers = [];

function normalizeName(name) {
  return aliases.get(name) || name;
}

function uniqueVideoId(url) {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get("v") || url;
  } catch (error) {
    return url;
  }
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

function buildStats(racesInput) {
  const playerMap = new Map();
  const allRaces = racesInput || getAllRaces();

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
    const volumeBonus = player.races < MIN_RACES || maxRaces <= MIN_RACES
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
      <button class="leader-row" type="button" style="--heat: ${player.score / (bestScore || 1)}" data-player="${player.name}" data-rank-row="true">
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

function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

function populateDailyDateSelect() {
  if (!els.dailyDateSelect) return;

  const dates = [...new Set(getAllRaces().map((race) => race.date).filter(Boolean))]
    .sort((a, b) => (a < b ? 1 : -1));

  if (dates.length === 0) {
    els.dailyDateSelect.innerHTML = `<option value="">Keine Rennen vorhanden</option>`;
    els.dailyLeaderboard.innerHTML = `<div class="leader-row"><span></span><span class="driver"><strong>Keine Rennen</strong><span>Noch keine Rennen mit Datum vorhanden</span></span></div>`;
    return;
  }

  const previousValue = els.dailyDateSelect.value;
  els.dailyDateSelect.innerHTML = dates
    .map((date) => `<option value="${date}">${formatDateLabel(date)}</option>`)
    .join("");

  els.dailyDateSelect.value = dates.includes(previousValue) ? previousValue : dates[0];
  renderDailyLeaderboard();
}

function renderDailyLeaderboard() {
  if (!els.dailyLeaderboard || !els.dailyDateSelect) return;

  const selectedDate = els.dailyDateSelect.value;
  const racesOfDay = getAllRaces().filter((race) => race.date === selectedDate);

  if (racesOfDay.length === 0) {
    els.dailyLeaderboard.innerHTML = `<div class="leader-row"><span></span><span class="driver"><strong>Keine Rennen</strong><span>An diesem Tag wurden keine Rennen erfasst</span></span></div>`;
    return;
  }

  const dailyPlayers = buildStats(racesOfDay);
  const bestScore = Math.max(...dailyPlayers.map((player) => player.score));

  els.dailyLeaderboard.innerHTML = dailyPlayers.map((player, index) => `
    <div class="leader-row" style="--heat: ${player.score / (bestScore || 1)}">
      <span class="rank">#${index + 1}</span>
      <span class="driver">
        ${avatarMarkup(player.name)}
        <span class="driver-info">
          <strong>${player.name}</strong>
          <span>${player.wins} Siege</span>
        </span>
      </span>
      <span class="score">${format(player.score)}</span>
      <span class="metric race-count">${player.races}</span>
      <span class="metric top-three">${format(player.top3Rate * 100, 0)}%</span>
      <span class="metric avg-place">${format(player.avgPlace)}</span>
    </div>
  `).join("");
}

if (els.dailyDateSelect) {
  els.dailyDateSelect.addEventListener("change", renderDailyLeaderboard);
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
  populateDailyDateSelect();
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

function createEntrantRow(name = "") {
  const row = document.createElement("div");
  row.className = "result-row";
  row.innerHTML = `
    <input type="text" class="entrant-name-input" placeholder="Fahrername" value="${name}" list="playerNameList" />
    <button type="button" class="result-remove" aria-label="Fahrer entfernen">×</button>
  `;
  row.querySelector(".result-remove").addEventListener("click", () => row.remove());
  return row;
}

function resetAnnounceForm() {
  if (!els.entrantRows) return;
  els.entrantRows.innerHTML = "";
  for (let i = 0; i < 4; i += 1) {
    els.entrantRows.appendChild(createEntrantRow());
  }
}

function resetRaceForm() {
  if (!els.resultRows) return;
  els.raceVideoInput.value = "";
  if (els.raceDateInput) els.raceDateInput.value = new Date().toISOString().slice(0, 10);
  if (els.resolveRaceSelect) els.resolveRaceSelect.value = "";
  els.resultRows.innerHTML = "";
  for (let i = 0; i < 4; i += 1) {
    els.resultRows.appendChild(createResultRow());
  }
}

function renderAdminRaceList() {
  if (!els.customRaceList) return;
  if (baseRaces.length === 0) {
    els.customRaceList.innerHTML = `<p class="admin-empty">Noch keine Rennen vorhanden.</p>`;
    return;
  }
  els.customRaceList.innerHTML = [...baseRaces].reverse().map((race) => `
    <div class="admin-race-row">
      <div>
        <strong>${race.results.map(([name, place]) => `#${place} ${name}`).join(", ")}</strong>
        <a href="${race.video}" target="_blank" rel="noreferrer">Quelle</a>
      </div>
      <input type="date" class="race-date-edit" value="${race.date || ""}" data-race-date="${race.id}" />
      <button type="button" class="result-remove" data-remove-race="${race.id}" aria-label="Rennen löschen">×</button>
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
  resetAnnounceForm();
  renderAdminRaceList();
  renderAdminPlayerList();
  populateResolveRaceSelect();

  if (!PREDICTIONS_ENABLED) {
    const announceTabBtn = document.querySelector('[data-tab="announce"]');
    const announcePanel = document.querySelector('[data-panel="announce"]');
    const resolveLabel = document.querySelector("#resolveRaceLabel");
    if (announceTabBtn) announceTabBtn.hidden = true;
    if (announcePanel) announcePanel.hidden = true;
    if (resolveLabel) resolveLabel.hidden = true;
  }
}

// Der Admin-Bereich verlaesst sich NICHT auf eine bestehende Supabase-Session
// (die haette jeder eingeloggte Community-Nutzer auch). Er wird ausschliesslich
// ueber diese In-Memory-Variable freigeschaltet, gesetzt erst nach erfolgreichem
// Admin-Login-Formular in DIESEM Seitenaufruf.
let isAdminUnlocked = false;

if (els.adminToggle) {
  els.adminToggle.addEventListener("click", () => {
    els.adminDialog.showModal();
    if (isAdminUnlocked) {
      unlockAdmin();
    } else {
      els.adminLogin.hidden = false;
      els.adminPanel.hidden = true;
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
  els.adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: els.adminPasswordInput.value
    });
    if (error) {
      els.adminError.hidden = false;
      return;
    }
    els.adminError.hidden = true;
    els.adminPasswordInput.value = "";
    isAdminUnlocked = true;
    unlockAdmin();
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
  els.raceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const video = els.raceVideoInput.value.trim();
    if (!video) return;
    const raceDate = els.raceDateInput ? els.raceDateInput.value : new Date().toISOString().slice(0, 10);

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

    const resolvingRaceId = els.resolveRaceSelect ? els.resolveRaceSelect.value : "";

    const submitBtn = els.raceForm.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      // 1. Sicherstellen, dass alle Fahrer als players existieren
      const uniqueNames = [...new Set(results.map(([name]) => name))];
      const { error: playerUpsertError } = await supabaseClient
        .from("players")
        .upsert(uniqueNames.map((name) => ({ name })), { onConflict: "name", ignoreDuplicates: true });
      if (playerUpsertError) throw playerUpsertError;

      // 2. Rennen anlegen ODER bestehendes angekündigtes Rennen mit Video versehen
      let raceId;
      if (resolvingRaceId) {
        raceId = resolvingRaceId;
        const { error: updateError } = await supabaseClient
          .from("races")
          .update({ video_url: video, race_date: raceDate })
          .eq("id", raceId);
        if (updateError) throw updateError;
      } else {
        const { data: newRace, error: raceError } = await supabaseClient
          .from("races")
          .insert({ video_url: video, race_date: raceDate })
          .select("id")
          .single();
        if (raceError) throw raceError;
        raceId = newRace.id;
      }

      // 3. Player-IDs zu den Namen holen
      const { data: playerRows, error: playerFetchError } = await supabaseClient
        .from("players")
        .select("id, name")
        .in("name", uniqueNames);
      if (playerFetchError) throw playerFetchError;
      const idByName = Object.fromEntries(playerRows.map((p) => [p.name, p.id]));

      // 4. Ergebnisse anlegen
      const resultRowsPayload = results.map(([name, place]) => ({
        race_id: raceId,
        player_id: idByName[name],
        place
      }));
      const { error: resultsError } = await supabaseClient.from("race_results").insert(resultRowsPayload);
      if (resultsError) throw resultsError;

      // 5. Falls es ein angekündigtes Rennen war: Wetten abrechnen
      let resolveSummary = null;
      if (resolvingRaceId) {
        const winner = results.find(([, place]) => place === 1);
        if (winner) {
          const { error: resolveError } = await supabaseClient.rpc("resolve_race_bets", {
            p_race_id: raceId,
            p_winner_player_id: idByName[winner[0]]
          });
          if (resolveError) throw resolveError;

          const { data: settledBets } = await supabaseClient
            .from("bets")
            .select("status, amount, payout")
            .eq("race_id", raceId);

          if (settledBets && settledBets.length > 0) {
            const totalPool = settledBets.reduce((sum, b) => sum + b.amount, 0);
            const totalPayout = settledBets.reduce((sum, b) => sum + b.payout, 0);
            resolveSummary = `\n\nWetten abgerechnet: ${settledBets.length} Wette(n), Pool ${totalPool} Coins, ausgezahlt ${totalPayout} Coins an Gewinner.`;
          } else {
            resolveSummary = `\n\nKeine Wetten auf dieses Rennen vorhanden.`;
          }
        }
      }

      await loadBaseData();
      await populateResolveRaceSelect();
      await loadUpcomingRaces();
      resetRaceForm();
      renderAll();

      if (resolveSummary) {
        alert(`Rennen gespeichert.${resolveSummary}`);
      }
    } catch (error) {
      console.error("Rennen konnte nicht gespeichert werden:", error);
      alert("Fehler beim Speichern. Details in der Browser-Konsole (F12).");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

let upcomingRaceEntrantNames = {};

async function populateResolveRaceSelect() {
  if (!els.resolveRaceSelect) return;

  const { data, error } = await supabaseClient
    .from("races")
    .select("id, created_at, race_entrants(players(name))")
    .eq("status", "upcoming")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Angekündigte Rennen konnten nicht geladen werden:", error);
    return;
  }

  upcomingRaceEntrantNames = {};
  const options = data.map((race) => {
    const names = race.race_entrants.map((e) => e.players.name);
    upcomingRaceEntrantNames[race.id] = names;
    return `<option value="${race.id}">${names.join(", ")}</option>`;
  }).join("");

  els.resolveRaceSelect.innerHTML =
    `<option value="">— Neues Rennen (nicht vorher angekündigt) —</option>${options}`;
}

if (els.resolveRaceSelect) {
  els.resolveRaceSelect.addEventListener("change", () => {
    const raceId = els.resolveRaceSelect.value;
    els.resultRows.innerHTML = "";
    const names = upcomingRaceEntrantNames[raceId];
    if (names && names.length > 0) {
      names.forEach((name) => els.resultRows.appendChild(createResultRow(name)));
    } else {
      for (let i = 0; i < 4; i += 1) els.resultRows.appendChild(createResultRow());
    }
  });
}

if (els.addEntrantRowBtn) {
  els.addEntrantRowBtn.addEventListener("click", () => {
    els.entrantRows.appendChild(createEntrantRow());
  });
}

if (els.announceForm) {
  els.announceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const names = [...els.entrantRows.querySelectorAll(".entrant-name-input")]
      .map((input) => input.value.trim())
      .filter(Boolean);
    const uniqueNames = [...new Set(names)];

    if (uniqueNames.length < 2) {
      alert("Bitte mindestens 2 Fahrer eintragen.");
      return;
    }

    const submitBtn = els.announceForm.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const { error: upsertError } = await supabaseClient
        .from("players")
        .upsert(uniqueNames.map((name) => ({ name })), { onConflict: "name", ignoreDuplicates: true });
      if (upsertError) throw upsertError;

      const { data: newRace, error: raceError } = await supabaseClient
        .from("races")
        .insert({ video_url: null, status: "upcoming" })
        .select("id")
        .single();
      if (raceError) throw raceError;

      const { data: playerRows, error: fetchError } = await supabaseClient
        .from("players")
        .select("id, name")
        .in("name", uniqueNames);
      if (fetchError) throw fetchError;

      const entrantPayload = playerRows.map((p) => ({ race_id: newRace.id, player_id: p.id }));
      const { error: entrantsError } = await supabaseClient.from("race_entrants").insert(entrantPayload);
      if (entrantsError) throw entrantsError;

      resetAnnounceForm();
      await populateResolveRaceSelect();
      await loadUpcomingRaces();
      alert("Rennen wurde angekündigt.");
    } catch (error) {
      console.error("Ankündigung fehlgeschlagen:", error);
      alert("Fehler beim Ankündigen. Details in der Browser-Konsole (F12).");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

if (els.customRaceList) {
  els.customRaceList.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-remove-race]");
    if (!button) return;
    const raceId = button.dataset.removeRace;
    if (!confirm("Dieses Rennen wirklich löschen?")) return;

    const { error } = await supabaseClient.from("races").delete().eq("id", raceId);
    if (error) {
      console.error("Löschen fehlgeschlagen:", error);
      alert("Fehler beim Löschen. Details in der Browser-Konsole (F12).");
      return;
    }
    await loadBaseData();
    renderAll();
  });

  els.customRaceList.addEventListener("change", async (event) => {
    const input = event.target.closest("[data-race-date]");
    if (!input) return;
    const raceId = input.dataset.raceDate;
    const newDate = input.value;
    if (!newDate) return;

    const { error } = await supabaseClient
      .from("races")
      .update({ race_date: newDate })
      .eq("id", raceId);

    if (error) {
      console.error("Datum konnte nicht gespeichert werden:", error);
      alert("Fehler beim Speichern des Datums. Details in der Browser-Konsole (F12).");
      return;
    }
    await loadBaseData();
    renderAll();
  });
}

if (els.playerImageForm) {
  els.playerImageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = els.playerNameInput.value.trim();
    if (!name) return;

    const url = els.playerImageUrlInput.value.trim();
    const file = els.playerImageFileInput.files[0];

    async function saveImage(src) {
      const { error } = await supabaseClient
        .from("players")
        .upsert({ name, image_url: src }, { onConflict: "name" });
      if (error) {
        console.error("Bild konnte nicht gespeichert werden:", error);
        alert("Fehler beim Speichern. Details in der Browser-Konsole (F12).");
        return;
      }
      els.playerImageForm.reset();
      await loadBaseData();
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

if (els.adminLogoutBtn) {
  els.adminLogoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    isAdminUnlocked = false;
    els.adminDialog.close();
    els.adminLogin.hidden = false;
    els.adminPanel.hidden = true;
  });
}

// --- Community-Konto (Login/Registrierung/Coins) ------------------------

function showAccountPanel(name) {
  els.accountPanels.forEach((panel) => {
    panel.hidden = panel.dataset.accountPanel !== name;
  });
}

if (els.showRegisterBtn) {
  els.showRegisterBtn.addEventListener("click", () => showAccountPanel("register"));
}
if (els.showLoginBtn) {
  els.showLoginBtn.addEventListener("click", () => showAccountPanel("login"));
}

async function refreshAccountUI() {
  const { data } = await supabaseClient.auth.getSession();
  const session = data.session;

  if (!session) {
    els.accountAuth.hidden = false;
    els.accountProfile.hidden = true;
    return;
  }

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("username, coins")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    els.accountAuth.hidden = false;
    els.accountProfile.hidden = true;
    return;
  }

  els.accountAuth.hidden = true;
  els.accountProfile.hidden = false;
  els.accountUsername.textContent = profile.username;
  els.accountCoins.textContent = profile.coins.toLocaleString("de-DE");
  els.resetCoinsBtn.hidden = profile.coins >= 100;
}

if (els.accountToggle) {
  els.accountToggle.addEventListener("click", async () => {
    els.accountDialog.showModal();

    if (!ACCOUNTS_ENABLED) {
      els.accountMaintenance.hidden = false;
      els.accountAuth.hidden = true;
      els.accountProfile.hidden = true;
      return;
    }

    els.accountMaintenance.hidden = true;
    showAccountPanel("login");
    await refreshAccountUI();
  });
}

document.querySelectorAll("[data-account-close]").forEach((btn) => {
  btn.addEventListener("click", () => els.accountDialog.close());
});

if (els.accountDialog) {
  els.accountDialog.addEventListener("click", (event) => {
    if (event.target === els.accountDialog) els.accountDialog.close();
  });
}

// Supabase braucht intern ein E-Mail-Feld fuer den Login-Mechanismus.
// Wir verlangen aber NIE eine echte E-Mail vom Nutzer (Datenschutz/rechtlich) --
// stattdessen erzeugen wir aus dem Username eine interne Kunst-Adresse,
// die niemand zu sehen bekommt und die nirgendwo als echte Mail funktioniert.
function usernameToEmail(username) {
  const safe = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
  return `${safe}@users.asianmaps.internal`;
}

if (els.accountLoginForm) {
  els.accountLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = els.loginUsernameInput.value.trim();

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: usernameToEmail(username),
      password: els.loginPasswordInput.value
    });
    if (error) {
      els.loginError.textContent = "Anmeldung fehlgeschlagen. Zugangsdaten prüfen.";
      els.loginError.hidden = false;
      return;
    }
    els.loginError.hidden = true;
    els.accountLoginForm.reset();
    await refreshAccountUI();
    await loadCommunityLeaderboard();
  });
}

if (els.accountRegisterForm) {
  els.accountRegisterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = els.registerUsernameInput.value.trim();
    const { error } = await supabaseClient.auth.signUp({
      email: usernameToEmail(username),
      password: els.registerPasswordInput.value,
      options: { data: { username } }
    });
    if (error) {
      els.registerError.textContent = error.message.includes("already registered")
        ? "Dieser Username ist bereits vergeben."
        : error.message;
      els.registerError.hidden = false;
      return;
    }
    els.registerError.hidden = true;
    els.accountRegisterForm.reset();
    await refreshAccountUI();
    await loadCommunityLeaderboard();
  });
}

if (els.resetCoinsBtn) {
  els.resetCoinsBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.rpc("reset_my_coins");
    if (error) {
      alert("Reset fehlgeschlagen. Details in der Konsole (F12).");
      console.error(error);
      return;
    }
    await refreshAccountUI();
    await loadCommunityLeaderboard();
  });
}

if (els.accountLogoutBtn) {
  els.accountLogoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    isAdminUnlocked = false;
    els.accountDialog.close();
    await refreshAccountUI();
  });
}

// --- Prediction Market (anstehende Rennen, Quoten, Graph) ---------------

const chartInstances = {};

function renderUpcomingRaceCard(race) {
  const entrants = race.race_entrants.map((e) => e.players);
  return `
    <div class="upcoming-race-card">
      <div class="upcoming-entrants">
        ${entrants.map((p) => `
          <button type="button" class="entrant-bet-btn" data-bet-race="${race.id}" data-bet-player="${p.id}" data-bet-name="${p.name}">
            ${avatarMarkup(p.name)}
            <span class="entrant-name">${p.name}</span>
            <span class="entrant-odds" data-odds-for="${p.id}">–</span>
          </button>
        `).join("")}
      </div>
      <div class="chart-wrap">
        <canvas id="chart-${race.id}"></canvas>
      </div>
    </div>
  `;
}

function renderOddsAndChart(race, raceBets) {
  const entrants = race.race_entrants.map((e) => e.players);
  const n = entrants.length;
  if (n === 0) return;

  const totals = Object.fromEntries(entrants.map((p) => [p.id, 0]));
  let totalPool = 0;

  const labels = ["Start"];
  const series = Object.fromEntries(entrants.map((p) => [p.id, [100 / n]]));

  raceBets.forEach((bet, index) => {
    totals[bet.player_id] = (totals[bet.player_id] || 0) + bet.amount;
    totalPool += bet.amount;
    labels.push(`#${index + 1}`);
    entrants.forEach((p) => {
      const pct = totalPool > 0 ? (totals[p.id] / totalPool) * 100 : 100 / n;
      series[p.id].push(pct);
    });
  });

  entrants.forEach((p) => {
    const el = document.querySelector(`[data-odds-for="${p.id}"]`);
    if (el) {
      const pct = series[p.id][series[p.id].length - 1];
      el.textContent = `${pct.toFixed(0)}%`;
    }
  });

  const canvas = document.getElementById(`chart-${race.id}`);
  if (!canvas || typeof Chart === "undefined") return;

  if (chartInstances[race.id]) {
    chartInstances[race.id].destroy();
  }

  const colors = ["#6ee7ff", "#ff8fd6", "#ffd166", "#8b5cf6", "#34d399", "#f97066", "#60a5fa"];

  chartInstances[race.id] = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: entrants.map((p, i) => ({
        label: p.name,
        data: series[p.id],
        borderColor: colors[i % colors.length],
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: 0
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, bottom: 4, left: 4 } },
      plugins: { legend: { labels: { color: "#cbd5e1", font: { size: 11 } } } },
      scales: {
        x: { display: false },
        y: {
          min: 0,
          max: 100,
          ticks: { color: "#94a3b8", callback: (v) => `${v}%` },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      }
    }
  });
}

async function loadUpcomingRaces() {
  if (!els.upcomingRaces) return;

  if (!PREDICTIONS_ENABLED) {
    els.upcomingRaces.innerHTML = `
      <div class="upcoming-race-card">
        <p class="admin-empty">🚧 Das Wett-Feature wird aktuell überarbeitet und ist bald wieder da. Schau später nochmal vorbei!</p>
      </div>
    `;
    return;
  }

  const { data: races, error } = await supabaseClient
    .from("races")
    .select("id, created_at, race_entrants(player_id, players(id, name))")
    .eq("status", "upcoming")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Anstehende Rennen konnten nicht geladen werden:", error);
    return;
  }

  if (!races || races.length === 0) {
    els.upcomingRaces.innerHTML = `<p class="admin-empty">Aktuell keine anstehenden Rennen zum Wetten.</p>`;
    return;
  }

  const raceIds = races.map((r) => r.id);
  const { data: bets, error: betsError } = await supabaseClient
    .from("bets")
    .select("race_id, player_id, amount, created_at")
    .in("race_id", raceIds)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (betsError) console.error("Wetten konnten nicht geladen werden:", betsError);

  els.upcomingRaces.innerHTML = races.map((race) => renderUpcomingRaceCard(race)).join("");

  races.forEach((race) => {
    const raceBets = (bets || []).filter((b) => b.race_id === race.id);
    renderOddsAndChart(race, raceBets);
  });

  els.upcomingRaces.querySelectorAll("[data-bet-player]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      if (!sessionData.session) {
        alert("Bitte zuerst mit deinem Community-Konto anmelden.");
        els.accountDialog.showModal();
        return;
      }

      const raceId = btn.dataset.betRace;
      const playerId = btn.dataset.betPlayer;
      const playerName = btn.dataset.betName;

      const amountStr = prompt(`Wie viele Coins auf ${playerName} setzen?`);
      if (amountStr === null) return;
      const amount = Math.floor(Number(amountStr));
      if (!amount || amount <= 0) {
        alert("Ungültiger Betrag.");
        return;
      }

      const { error: betError } = await supabaseClient.rpc("place_bet", {
        p_race_id: raceId,
        p_player_id: playerId,
        p_amount: amount
      });

      if (betError) {
        alert(`Wette fehlgeschlagen: ${betError.message}`);
        return;
      }

      await loadUpcomingRaces();
      await refreshAccountUI();

      const { data: freshProfile } = await supabaseClient
        .from("profiles")
        .select("coins")
        .eq("id", sessionData.session.user.id)
        .single();

      alert(
        freshProfile
          ? `Wette platziert: ${amount} Coins auf ${playerName}.\nDein neuer Kontostand: ${freshProfile.coins} Coins.`
          : `Wette platziert: ${amount} Coins auf ${playerName}.`
      );
    });
  });
}

async function loadCommunityLeaderboard() {
  if (!els.communityLeaderboard) return;

  if (!ACCOUNTS_ENABLED) {
    els.communityLeaderboard.innerHTML = `<div class="leader-row"><span></span><span class="driver"><strong>🚧 Bald verfügbar</strong><span>Konten werden aktuell überarbeitet</span></span></div>`;
    return;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("username, coins, is_admin")
    .order("coins", { ascending: false });

  if (error) {
    console.error("Community-Rangliste konnte nicht geladen werden:", error);
    return;
  }

  const list = data.filter((row) => !row.is_admin);

  if (list.length === 0) {
    els.communityLeaderboard.innerHTML = `<div class="leader-row"><span></span><span class="driver"><strong>Noch keine Mitglieder</strong><span>Sei die/der Erste mit einem Konto</span></span></div>`;
    return;
  }

  els.communityLeaderboard.innerHTML = list.map((row, index) => `
    <div class="leader-row">
      <span class="rank">#${index + 1}</span>
      <span class="driver">
        ${avatarMarkup(row.username)}
        <span class="driver-info"><strong>${row.username}</strong></span>
      </span>
      <span class="score">${row.coins.toLocaleString("de-DE")}</span>
    </div>
  `).join("");
}

supabaseClient.auth.onAuthStateChange(() => {
  refreshAccountUI();
});

loadBaseData()
  .then(() => {
    renderAll();
    refreshAccountUI();
    loadCommunityLeaderboard();
    loadUpcomingRaces();
  })
  .catch((error) => {
    console.error("Konnte Daten nicht aus Supabase laden:", error);
    els.leaderboard.innerHTML = `
      <div class="leader-row">
        <span></span>
        <span class="driver"><strong>Fehler beim Laden</strong><span>Bitte Seite neu laden oder Konsole prüfen</span></span>
      </div>
    `;
  });