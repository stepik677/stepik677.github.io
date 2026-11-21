'use strict';
// ---------- Сезон: чемпионаты, Лига чемпионов и Лига Европы ----------
// Сначала все шесть чемпионатов (10 туров). После них стартуют еврокубки:
//   1-е места лиг → Лига чемпионов, 2-е места → Лига Европы.
// Все матчи решаются серией пенальти. Чемпионат: строго 5 ударов, при равенстве ничья
// (победа 3, ничья 1, поражение 0). Кубки: при равенстве — до первого промаха.

const SKEY = 'penalty-season-v1';
const LEAGUE_ROUNDS = 10;   // туров в одном круге календаря (дальше календарь повторяется)
const TARGET_POINTS = 20;   // чемпионат лиги заканчивается, когда кто-то набирает 20 очков
const CUPS = {
  CL: { name: 'Лига чемпионов', acc: 'Лигу чемпионов', short: 'ЛЧ', icon: '⭐', place: 1 },
  EL: { name: 'Лига Европы', acc: 'Лигу Европы', short: 'ЛЕ', icon: '🟠', place: 2 },
};
// 6 участников: двое лучших сразу в полуфинале, остальные играют 1/4 финала
const CUP_STAGES = ['1/4 финала', '1/2 финала', 'Финал'];
const CUP_TIES = [2, 2, 1];

let S = null;          // состояние сезона
let seasonTab = null;  // открытая вкладка (лига / 'CL' / 'EL' / 'История')
let seasonPick = null; // выбранный клуб на экране старта

const tIdx = (name) => TEAMS.findIndex((t) => t.name === name);
const tObj = (name) => TEAMS[tIdx(name)];
const badge = (name) => `<span class="badge sm" style="${badgeStyle(tObj(name))}"></span>`;

function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Двухкруговой турнир (метод «карусели»): 6 клубов → 10 туров по 3 матча
function roundRobin(names) {
  const n = names.length, arr = names.slice(), rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const pairs = [];
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i], b = arr[n - 1 - i];
      pairs.push(r % 2 ? [b, a] : [a, b]);
    }
    rounds.push(pairs);
    arr.splice(1, 0, arr.pop());
  }
  return rounds.concat(rounds.map((rd) => rd.map(([a, b]) => [b, a])));
}

// Быстрая серия пенальти по рейтингам клубов.
// allowDraw — матч чемпионата: строго 5 ударов, при равенстве ничья. Иначе (кубок) — до победы.
function simShootout(a, b, allowDraw = false) {
  const ra = tObj(a).rating, rb = tObj(b).rating;
  const pa = clamp(0.74 + (ra - rb) * 0.006, 0.55, 0.9);
  const pb = clamp(0.74 + (rb - ra) * 0.006, 0.55, 0.9);
  let ga = 0, gb = 0, ka = 0, kb = 0;
  const done = () => ga + (5 - ka) < gb || gb + (5 - kb) < ga;
  while (ka < 5) {
    ga += Math.random() < pa ? 1 : 0; ka++;
    if (done()) break;
    gb += Math.random() < pb ? 1 : 0; kb++;
    if (done()) break;
  }
  while (!allowDraw && ga === gb) { ga += Math.random() < pa ? 1 : 0; gb += Math.random() < pb ? 1 : 0; }
  return { ga, gb };
}

// Победа — 3 очка, ничья — 1, поражение — 0
const emptyRow = () => ({ p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
function applyResult(table, a, b, ga, gb) {
  const A = table[a], B = table[b];
  A.p++; B.p++;
  A.gf += ga; A.ga += gb; B.gf += gb; B.ga += ga;
  if (ga > gb) { A.w++; A.pts += 3; B.l++; }
  else if (gb > ga) { B.w++; B.pts += 3; A.l++; }
  else { A.d = (A.d || 0) + 1; B.d = (B.d || 0) + 1; A.pts += 1; B.pts += 1; }
}
const byStanding = (x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf;
function sortedTable(season, lg) {
  const tb = season.tables[lg];
  return Object.keys(tb)
    .map((name) => ({ name, ...tb[name] }))
    .sort((x, y) => byStanding(x, y) || x.name.localeCompare(y.name));
}

function newSeason(my, prev) {
  const schedule = {}, tables = {}, results = {};
  for (const lg of LEAGUE_ORDER) {
    const names = shuffle(TEAMS.filter((t) => t.league === lg).map((t) => t.name));
    schedule[lg] = roundRobin(names);
    tables[lg] = Object.fromEntries(names.map((n) => [n, emptyRow()]));
    results[lg] = [];
  }
  S = {
    year: prev ? prev.year + 1 : 2026,
    my, lstep: 0, schedule, tables, results,
    ended: {}, // лига → после какого тура закончилась (кто-то набрал 20 очков)
    cups: null, // появятся после окончания чемпионатов
    lastStep: null, finished: false,
    history: prev ? prev.history : [],
  };
  seasonTab = tObj(my).league;
  save();
}

// Сохранение в браузере может быть недоступно (например, во встроенном окне) — тогда игра просто не запоминает сезон
function save() { try { localStorage.setItem(SKEY, JSON.stringify(S)); } catch (e) { /* без сохранения */ } }
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(SKEY));
    // если состав клубов поменялся — старое сохранение не подходит
    if (s && tIdx(s.my) >= 0 && LEAGUE_ORDER.every((lg) => s.tables[lg] && Object.keys(s.tables[lg]).every((n) => tIdx(n) >= 0))) S = s;
  } catch (e) { S = null; }
  migrate();
  migrateTarget();
}

// Сохранения до правила «до 20 очков»
function migrateTarget() {
  if (!S || S.ended) return;
  S.ended = {};
  for (const lg of LEAGUE_ORDER) {
    if (S.cups || sortedTable(S, lg)[0].pts >= TARGET_POINTS) S.ended[lg] = S.lstep;
  }
  if (leagueDone() && !S.cups) createCups();
  save();
}

// Старые сохранения: еврокубки шли параллельно с чемпионатом — теперь только после него
function migrate() {
  if (!S || 'cups' in S) return;
  if (S.lstep === undefined) {
    const old = ['L0', 'L1', 'C0', 'L2', 'L3', 'C1', 'L4', 'L5', 'C2', 'L6', 'L7', 'L8', 'C3', 'L9'];
    S.lstep = old.slice(0, S.step || 0).filter((c) => c[0] === 'L').length;
  }
  delete S.step; delete S.cstage; delete S.cl;
  S.cups = null;
  S.finished = false;
  if (S.lastStep && S.lastStep.mine && S.lastStep.mine.comp === 'ЛЧ') S.lastStep = null;
  save();
}

// ---------- Ход сезона ----------
const leagueEnded = (lg) => !!S.ended && S.ended[lg] !== undefined;
const leagueDone = () => LEAGUE_ORDER.every(leagueEnded);
const leader = (lg) => sortedTable(S, lg)[0];
const cupDone = (key) => !!S.cups && S.cups[key].stage >= CUP_STAGES.length;

// Участники кубка, отсортированные по выступлению в чемпионате (для посева)
function cupEntrants(place) {
  return LEAGUE_ORDER.map((lg) => ({ ...sortedTable(S, lg)[place - 1], league: lg }))
    .sort((x, y) => byStanding(x, y) || tObj(y.name).rating - tObj(x.name).rating);
}
function makeCup(place) {
  const seeds = cupEntrants(place).map((r) => r.name);
  return {
    seeds, byes: [seeds[0], seeds[1]],
    stages: [[[seeds[2], seeds[5]], [seeds[3], seeds[4]]]],
    results: [], stage: 0,
  };
}
function createCups() {
  S.cups = { CL: makeCup(CUPS.CL.place), EL: makeCup(CUPS.EL.place) };
}
const myCup = () => (!S.cups ? null : S.cups.CL.seeds.includes(S.my) ? 'CL' : S.cups.EL.seeds.includes(S.my) ? 'EL' : null);

function stepFixtures(kind) {
  if (kind === 'L') {
    // играют только лиги, где ещё никто не набрал 20 очков; после 10-го тура календарь идёт по новому кругу
    const idx = S.lstep, fixtures = [];
    for (const lg of LEAGUE_ORDER) {
      if (leagueEnded(lg)) continue;
      for (const [a, b] of S.schedule[lg][idx % LEAGUE_ROUNDS]) fixtures.push({ comp: lg, a, b });
    }
    return { kind, idx, title: `${idx + 1}-й тур чемпионатов`, fixtures };
  }
  const cup = S.cups[kind], idx = cup.stage;
  return {
    kind, idx, title: `${CUPS[kind].name} — ${CUP_STAGES[idx]}`,
    fixtures: cup.stages[idx].map(([a, b]) => ({ comp: CUPS[kind].short, a, b })),
  };
}
const myFixture = (st) => st.fixtures.find((f) => f.a === S.my || f.b === S.my);

// Проводит текущий тур турнира kind ('L', 'CL' или 'EL'). myRes — результат матча игрока, если он играл сам
function playStep(kind, myRes) {
  const st = stepFixtures(kind);
  const mine = myFixture(st);
  const out = st.fixtures.map((f) => {
    const r = f === mine && myRes ? myRes : simShootout(f.a, f.b, kind === 'L');
    return { ...f, ga: r.ga, gb: r.gb, mine: f === mine };
  });
  if (kind === 'L') {
    for (const r of out) applyResult(S.tables[r.comp], r.a, r.b, r.ga, r.gb);
    for (const lg of LEAGUE_ORDER) {
      if (leagueEnded(lg)) continue;
      S.results[lg].push(out.filter((r) => r.comp === lg));
      if (leader(lg).pts >= TARGET_POINTS) S.ended[lg] = S.lstep + 1; // лига завершена после этого тура
    }
    S.lstep++;
    if (leagueDone()) createCups(); // чемпионаты закончились — определились участники еврокубков
  } else {
    const cup = S.cups[kind];
    const res = out.map((r) => ({ ...r, w: r.ga > r.gb ? r.a : r.b }));
    cup.results[st.idx] = res;
    if (st.idx === 0) cup.stages[1] = [[cup.byes[0], res[1].w], [cup.byes[1], res[0].w]];
    if (st.idx === 1) cup.stages[2] = [[res[0].w, res[1].w]];
    cup.stage++;
  }
  const myRow = out.find((r) => r.mine);
  if (myRow) S.lastStep = { title: st.title, mine: myRow }; // «прошлый матч» — последний сыгранный вами
  if (leagueDone() && cupDone('CL') && cupDone('EL') && !S.finished) {
    S.finished = true;
    const champs = Object.fromEntries(LEAGUE_ORDER.map((lg) => [lg, sortedTable(S, lg)[0].name]));
    S.history.unshift({ year: S.year, champs, cl: S.cups.CL.results[2][0].w, el: S.cups.EL.results[2][0].w });
  }
  save();
}

// Играет ваш следующий матч в турнире kind
function playMyMatch(kind) {
  const st = stepFixtures(kind);
  const f = myFixture(st);
  const opp = f.a === S.my ? f.b : f.a;
  G.you = tIdx(S.my);
  G.cpu = tIdx(opp);
  G.mode = 'season';
  G.allowDraw = kind === 'L'; // в чемпионате ничья возможна, в кубках — нет
  G.matchTitle = kind === 'L' ? `${TEAMS[G.you].league} · ${(st.idx % LEAGUE_ROUNDS) + 1}-й тур` : `${CUPS[kind].name} · ${CUP_STAGES[st.idx]}`;
  G.onFinish = (you, cpu) => {
    playStep(kind, f.a === S.my ? { ga: you, gb: cpu } : { ga: cpu, gb: you });
    autoAdvance();
  };
  startShootout();
}

// После чемпионата: стадии кубков без вашего матча проходят сами (если вас нет в кубке,
// вы выбыли или у вас «пропуск» в 1/4 финала)
function autoAdvance() {
  // ваша лига уже закончилась — остальные лиги доигрываются сами, до своих 20 очков
  let guard = 0;
  while (!leagueDone() && leagueEnded(tObj(S.my).league) && guard++ < 100) playStep('L', null);
  if (!leagueDone()) return;
  for (const key of ['CL', 'EL']) {
    while (!cupDone(key) && !myFixture(stepFixtures(key))) playStep(key, null);
  }
}

// ---------- Экран сезона ----------
const seasonLabel = (y) => `${y}/${String((y + 1) % 100).padStart(2, '0')}`;
const scoreLine = (r, bold = true) => {
  const aw = r.ga > r.gb, bw = r.gb > r.ga;
  return `<span class="${aw && bold ? 'win' : ''}">${badge(r.a)}${r.a}</span>
    <b class="sc">${r.ga}:${r.gb}</b>
    <span class="${bw && bold ? 'win' : ''}">${r.b}${badge(r.b)}</span>${r.ga === r.gb ? ' <span class="muted">ничья</span>' : ''}`;
};
const cupWinner = (key) => (cupDone(key) ? S.cups[key].results[2][0].w : null);

function cupState(key) {
  if (!leagueDone()) return '🔒 после чемпионата';
  if (cupDone(key)) return 'завершена';
  return CUP_STAGES[S.cups[key].stage];
}

function renderSeason() {
  const root = $('season-root');
  if (!S) {
    root.innerHTML = `
      <div class="panel">
        <h2>Новый сезон — выберите клуб</h2>
        <p class="muted">Шесть чемпионатов по 6 клубов. Чемпионат лиги идёт, пока какой-нибудь клуб не наберёт <b>${TARGET_POINTS} очков</b> —
        после этого тура лига завершается. Все матчи решаются серией пенальти:
        победа — 3 очка, ничья — 1, поражение — 0 (в чемпионате бьют строго по 5 ударов, при равенстве — ничья).</p>
        <p class="muted">Когда чемпионаты закончатся, начнутся еврокубки: <b>1-е место</b> каждой лиги попадает в
        <b>Лигу чемпионов</b>, <b>2-е место</b> — в <b>Лигу Европы</b>. В кубках при равенстве бьют до первого промаха.</p>
        <div id="season-clubs" class="team-list tall"></div>
        <button id="season-start" class="primary" ${seasonPick ? '' : 'disabled'}>Начать сезон${seasonPick ? ' за «' + seasonPick + '»' : ''}</button>
      </div>`;
    fillClubList($('season-clubs'), (i) => TEAMS[i].name === seasonPick, () => false, (i) => { seasonPick = TEAMS[i].name; renderSeason(); });
    $('season-start').onclick = () => { newSeason(seasonPick); renderSeason(); };
    return;
  }

  autoAdvance();
  const me = tObj(S.my);
  if (!seasonTab) seasonTab = me.league; // после перезагрузки страницы — лига своего клуба
  const kind = seasonTab === 'CL' || seasonTab === 'EL' ? seasonTab : 'L';
  const myPos = sortedTable(S, me.league).findIndex((r) => r.name === S.my) + 1;
  const qual = myCup();
  let next = '';

  if (S.finished) {
    const h = S.history[0];
    next = `
      <h3>🏁 Сезон ${seasonLabel(S.year)} завершён</h3>
      <p>Ваш клуб занял <b>${myPos}-е место</b> в лиге «${me.league}».</p>
      <div class="champs">
        <div class="champ cl">⭐ Лига чемпионов: ${badge(h.cl)}<b>${h.cl}</b></div>
        <div class="champ el">🟠 Лига Европы: ${badge(h.el)}<b>${h.el}</b></div>
        ${LEAGUE_ORDER.map((lg) => `<div class="champ">${lg}: ${badge(h.champs[lg])}${h.champs[lg]}</div>`).join('')}
      </div>
      <button id="season-next" class="primary">Начать сезон ${seasonLabel(S.year + 1)}</button>`;
  } else if (kind === 'L') {
    if (leagueDone()) {
      const where = qual ? `и играет в <b>${CUPS[qual].acc}</b> — откройте вкладку «${CUPS[qual].icon} ${CUPS[qual].name}».`
        : 'и не попал в еврокубки.';
      next = `<h3>Чемпионат завершён</h3><p>Ваш клуб занял <b>${myPos}-е место</b> ${where}</p>`;
    } else {
      const st = stepFixtures('L');
      const f = myFixture(st);
      next = `<h3>${st.title}</h3>
        <div class="my-match">${badge(f.a)}<b>${f.a}</b> <span class="vs">—</span> <b>${f.b}</b>${badge(f.b)}<span class="comp">${f.comp}</span></div>
        <div class="btn-row"><button id="season-play" class="primary">▶ Играть серию пенальти</button></div>
        <p class="muted small">Очки во всех лигах начисляются, когда вы сыграете этот матч: вместе с ним проходят все матчи тура.</p>`;
    }
  } else {
    const C = CUPS[kind];
    if (!leagueDone()) {
      const ld = leader(me.league);
      next = `<h3>🔒 ${C.name} ещё не началась</h3>
        <p>Еврокубки стартуют, когда закончатся все чемпионаты — в каждой лиге кто-то должен набрать ${TARGET_POINTS} очков.
        В ${C.acc} попадают клубы, занявшие <b>${C.place}-е место</b> в своих лигах.</p>
        <p class="muted small">Лидер лиги «${me.league}»: ${ld.name} — ${ld.pts} из ${TARGET_POINTS} очков. Ваш клуб — ${myPos}-й.</p>`;
    } else if (qual !== kind) {
      next = `<h3>${C.icon} ${C.name}</h3><p class="muted">Ваш клуб не играет в этом турнире
        ${qual ? `— он в турнире «${CUPS[qual].name}».` : `(${myPos}-е место в чемпионате).`}</p>
        ${cupWinner(kind) ? `<p>Победитель: ${badge(cupWinner(kind))}<b>${cupWinner(kind)}</b></p>` : ''}`;
    } else if (cupDone(kind)) {
      const w = cupWinner(kind);
      next = `<h3>${C.icon} ${C.name} завершена</h3><p>Победитель: ${badge(w)}<b>${w}</b>${w === S.my ? ' — это ваш клуб! 🏆' : ''}</p>`;
    } else {
      const st = stepFixtures(kind);
      const f = myFixture(st);
      next = `<h3>${st.title}</h3>
        <div class="my-match">${badge(f.a)}<b>${f.a}</b> <span class="vs">—</span> <b>${f.b}</b>${badge(f.b)}<span class="comp">${f.comp}</span></div>
        <div class="btn-row"><button id="season-play" class="primary">▶ Играть серию пенальти — ${C.name}</button></div>
        <p class="muted small">Кубковый матч: при равенстве после 5 ударов — до первого промаха. Вместе с ним проходят все матчи стадии.</p>`;
    }
  }

  const last = S.lastStep && S.lastStep.mine
    ? `<div class="last">Прошлый матч (${S.lastStep.title}): ${scoreLine(S.lastStep.mine)}${S.lastStep.mine.ga !== S.lastStep.mine.gb ? ' <span class="muted">по пенальти</span>' : ''}</div>` : '';
  // прогресс: чемпионат — по очкам лидера вашей лиги (до 20), затем стадии кубков
  const leagueFrac = leagueDone() ? 1 : Math.min(1, leader(me.league).pts / TARGET_POINTS);
  const progress = leagueFrac * LEAGUE_ROUNDS + (S.cups ? S.cups.CL.stage + S.cups.EL.stage : 0);

  const tabs = [...LEAGUE_ORDER.map((l) => [l, l]), ['CL', '⭐ Лига чемпионов'], ['EL', '🟠 Лига Европы'], ['История', 'История']];
  root.innerHTML = `
    <div class="panel season-head">
      <div class="sh-top">
        <div class="sh-club">${badge(S.my)}<div><b>${S.my}</b><div class="muted">${me.league} · сезон ${seasonLabel(S.year)}</div></div></div>
        <div class="sh-progress"><div class="muted">Чемпионат: ${leagueDone() ? 'завершён' : `тур ${S.lstep + 1}, до ${TARGET_POINTS} очков`} · ЛЧ: ${cupState('CL')} · ЛЕ: ${cupState('EL')}</div>
          <div class="bar"><div style="width:${(progress / (LEAGUE_ROUNDS + 2 * CUP_STAGES.length)) * 100}%"></div></div></div>
      </div>
      <div class="next">${next}</div>
      ${last}
    </div>
    <div class="tabs">${tabs.map(([id, label]) => `<button data-tab="${id}" class="${id === seasonTab ? 'active' : ''}">${label}</button>`).join('')}</div>
    <div class="panel" id="season-tab"></div>
    <button id="season-reset" class="link">Начать заново с выбора клуба</button>`;

  root.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => { seasonTab = b.dataset.tab; renderSeason(); }; });
  const play = $('season-play'), nx = $('season-next');
  if (play) play.onclick = () => playMyMatch(kind);
  if (nx) nx.onclick = () => { newSeason(S.my, S); renderSeason(); };
  // Подтверждение прямо на кнопке (системные окна confirm на iPad/во встроенном окне могут не работать)
  const reset = $('season-reset');
  reset.onclick = () => {
    if (!reset.dataset.armed) {
      reset.dataset.armed = '1';
      reset.textContent = 'Точно удалить сезон? Нажмите ещё раз';
      setTimeout(() => { if (reset.isConnected) { delete reset.dataset.armed; reset.textContent = 'Начать заново с выбора клуба'; } }, 4000);
      return;
    }
    try { localStorage.removeItem(SKEY); } catch (e) { /* без сохранения */ }
    S = null; seasonPick = null;
    renderSeason();
  };

  const box = $('season-tab');
  if (kind !== 'L') box.innerHTML = cupHtml(kind);
  else if (seasonTab === 'История') box.innerHTML = historyHtml();
  else box.innerHTML = leagueHtml(seasonTab);
}

function leagueHtml(lg) {
  const rows = sortedTable(S, lg);
  const body = rows.map((r, i) => `<tr class="${r.name === S.my ? 'me' : ''} ${i === 0 ? 'ucl' : i === 1 ? 'uel' : ''}">
      <td class="pos">${i + 1}</td>
      <td class="club">${badge(r.name)}${r.name}</td>
      <td>${r.p}</td><td>${r.w}</td><td>${r.d || 0}</td><td>${r.l}</td>
      <td>${r.gf}–${r.ga}</td><td>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</td>
      <td class="pts">${r.pts}</td></tr>`).join('');
  const lastRound = S.results[lg][S.results[lg].length - 1];
  const res = lastRound
    ? `<h4>Результаты ${S.results[lg].length}-го тура</h4><div class="results">${lastRound.map((r) => `<div class="res ${r.mine ? 'me' : ''}">${scoreLine(r)}</div>`).join('')}</div>`
    : '<p class="muted">Чемпионат ещё не начался.</p>';
  const ld = rows[0];
  const status = leagueEnded(lg)
    ? `<div class="lg-status done">🏁 Чемпионат завершён после ${S.ended[lg]}-го тура: ${badge(ld.name)}<b>${ld.name}</b> набрал ${ld.pts} очков.</div>`
    : `<div class="lg-status">Играется до ${TARGET_POINTS} очков · лидер: ${badge(ld.name)}${ld.name} — <b>${ld.pts}</b>
       <div class="bar"><div style="width:${Math.min(100, (ld.pts / TARGET_POINTS) * 100)}%"></div></div></div>`;
  return `
    ${status}
    <table class="tbl">
      <thead><tr><th>#</th><th class="club">Клуб</th><th title="Игры">И</th><th title="Победы">В</th><th title="Ничьи">Н</th><th title="Поражения">П</th><th title="Забитые–пропущенные пенальти">Пен.</th><th title="Разница">±</th><th title="Очки">О</th></tr></thead>
      <tbody>${body}</tbody>
    </table>
    <div class="legend"><span class="lg ucl"></span>1-е место — Лига чемпионов <span class="lg uel"></span>2-е место — Лига Европы</div>
    ${res}`;
}

function cupHtml(key) {
  const C = CUPS[key];
  if (!S.cups) {
    // До конца чемпионата — кто сейчас идёт на нужном месте
    const now = cupEntrants(C.place);
    return `<p class="muted">${C.icon} ${C.name} начнётся после окончания чемпионатов. Участники — клубы, занявшие
      ${C.place}-е место в своих лигах. Двое лучших по очкам сразу выходят в 1/2 финала.</p>
      <h4>Сейчас на ${C.place}-м месте</h4>
      <div class="results">${now.map((r) => `<div class="res ${r.name === S.my ? 'me' : ''}">${badge(r.name)}${r.name} <span class="muted">· ${r.league}, ${r.pts} очк.</span></div>`).join('')}</div>`;
  }
  const cup = S.cups[key];
  const cols = CUP_STAGES.map((name, i) => {
    const pairs = cup.stages[i] || [], results = cup.results[i] || [];
    let boxes = '';
    for (let k = 0; k < CUP_TIES[i]; k++) {
      const p = pairs[k], r = results[k];
      if (!p) { boxes += '<div class="tie empty"><div>—</div><div>—</div></div>'; continue; }
      const row = (n, g, win) => `<div class="${win ? 'win' : r ? 'lose' : ''} ${n === S.my ? 'me' : ''}">${badge(n)}<span>${n}</span><b>${r ? g : ''}</b></div>`;
      boxes += `<div class="tie">${row(p[0], r && r.ga, r && r.w === p[0])}${row(p[1], r && r.gb, r && r.w === p[1])}</div>`;
    }
    if (i === 0) boxes += `<div class="byes muted small">Сразу в 1/2 финала:<br>${cup.byes.map((n) => `${badge(n)}<span class="${n === S.my ? 'me-name' : ''}">${n}</span>`).join('<br>')}</div>`;
    return `<div class="col"><h4>${name}</h4><div class="col-ties">${boxes}</div></div>`;
  }).join('');
  const w = cupWinner(key);
  return `${w ? `<div class="cl-winner">🏆 Победитель: ${badge(w)}<b>${w}</b></div>` : ''}
    <div class="bracket cup">${cols}</div>
    <p class="muted small">Участники — ${C.place}-е места всех шести лиг; двое лучших по очкам получили пропуск в 1/2 финала. Все стадии — один матч, серия пенальти.</p>`;
}

function historyHtml() {
  if (!S.history.length) return '<p class="muted">Здесь появятся чемпионы завершённых сезонов.</p>';
  return `<table class="tbl hist"><thead><tr><th>Сезон</th><th>Лига чемпионов</th><th>Лига Европы</th>${LEAGUE_ORDER.map((l) => `<th>${l}</th>`).join('')}</tr></thead><tbody>
    ${S.history.map((h) => `<tr><td>${seasonLabel(h.year)}</td><td class="club">${badge(h.cl)}${h.cl}</td><td class="club">${h.el ? badge(h.el) + h.el : '—'}</td>${LEAGUE_ORDER.map((l) => `<td class="club">${badge(h.champs[l])}${h.champs[l]}</td>`).join('')}</tr>`).join('')}
  </tbody></table>`;
}

// ---------- Навигация ----------
function showView(v) {
  fsOff();
  fkLeave();
  document.querySelectorAll('#nav button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
  $('game-view').classList.add('hidden');
  G.phase = 'idle';
  G.party = null;
  $('setup').classList.toggle('hidden', v !== 'friendly');
  $('season-view').classList.toggle('hidden', v !== 'season');
  $('fk-view').classList.toggle('hidden', v !== 'fk');
  if (v === 'season') renderSeason();
  if (v === 'fk') renderFk();
}
document.querySelectorAll('#nav button').forEach((b) => { b.onclick = () => showView(b.dataset.view); });

load();
