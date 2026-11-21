'use strict';

// ---------- Данные ----------
// Клубы: цвета основной формы (color — футболка, color2 — второй цвет/полосы)
const T = (name, league, color, color2, shorts, num, gk, stripes = false) => ({ name, league, color, color2, shorts, num, gk, stripes });
const TEAMS = [
  T('Реал Мадрид', 'Ла Лига', '#f5f5f5', '#febe10', '#f5f5f5', '#1a237e', '#2e7d32'),
  T('Барселона', 'Ла Лига', '#a50044', '#004d98', '#004d98', '#fdd835', '#f57f17', true),
  T('Атлетико Мадрид', 'Ла Лига', '#cb3524', '#ffffff', '#1c2c5b', '#1c2c5b', '#212121', true),
  T('Манчестер Сити', 'АПЛ', '#6cabdd', '#ffffff', '#ffffff', '#1c2c5b', '#fdd835'),
  T('Ливерпуль', 'АПЛ', '#c8102e', '#f6eb61', '#c8102e', '#ffffff', '#00897b'),
  T('Арсенал', 'АПЛ', '#ef0107', '#ffffff', '#ffffff', '#ffffff', '#fdd835'),
  T('Манчестер Юнайтед', 'АПЛ', '#da291c', '#000000', '#ffffff', '#ffffff', '#43a047'),
  T('Челси', 'АПЛ', '#034694', '#ffffff', '#034694', '#ffffff', '#fb8c00'),
  T('Бавария', 'Бундеслига', '#dc052d', '#ffffff', '#dc052d', '#ffffff', '#212121'),
  T('Боруссия Дортмунд', 'Бундеслига', '#fde100', '#000000', '#000000', '#000000', '#7b1fa2'),
  T('ПСЖ', 'Лига 1', '#004170', '#da291c', '#004170', '#ffffff', '#fdd835'),
  T('Ювентус', 'Серия A', '#ffffff', '#000000', '#ffffff', '#d4af37', '#e65100', true),
  T('Милан', 'Серия A', '#fb090b', '#000000', '#ffffff', '#ffffff', '#00897b', true),
  T('Интер', 'Серия A', '#0068a8', '#000000', '#000000', '#ffffff', '#fdd835', true),
  T('Зенит', 'РПЛ', '#0b6bb5', '#ffffff', '#ffffff', '#ffffff', '#fdd835'),
  T('Спартак Москва', 'РПЛ', '#d71920', '#ffffff', '#ffffff', '#ffffff', '#212121'),
  T('ЦСКА', 'РПЛ', '#e2001a', '#00205b', '#00205b', '#ffffff', '#fdd835'),
  T('Локомотив Москва', 'РПЛ', '#e30613', '#008a3e', '#008a3e', '#ffffff', '#212121'),
  T('Динамо Москва', 'РПЛ', '#0047ab', '#ffffff', '#ffffff', '#ffffff', '#fb8c00'),
  T('Краснодар', 'РПЛ', '#000000', '#00843d', '#000000', '#ffffff', '#fdd835', true),
  T('Тоттенхэм', 'АПЛ', '#ffffff', '#132257', '#132257', '#132257', '#fdd835'),
  T('Атлетик Бильбао', 'Ла Лига', '#ee2523', '#ffffff', '#000000', '#000000', '#212121', true),
  T('Вильярреал', 'Ла Лига', '#ffe667', '#005187', '#ffe667', '#005187', '#00897b'),
  T('Реал Бетис', 'Ла Лига', '#00954c', '#ffffff', '#00954c', '#1b5e20', '#ff7043', true),
  T('Байер Леверкузен', 'Бундеслига', '#e32221', '#000000', '#000000', '#ffffff', '#00897b'),
  T('РБ Лейпциг', 'Бундеслига', '#ffffff', '#dd0741', '#ffffff', '#dd0741', '#fdd835'),
  T('Штутгарт', 'Бундеслига', '#ffffff', '#e32219', '#ffffff', '#e32219', '#212121'),
  T('Айнтрахт Франкфурт', 'Бундеслига', '#000000', '#e1000f', '#000000', '#ffffff', '#fdd835'),
  T('Наполи', 'Серия A', '#12a0d7', '#ffffff', '#ffffff', '#ffffff', '#212121'),
  T('Рома', 'Серия A', '#8e1f2f', '#f0bc42', '#ffffff', '#f0bc42', '#00897b'),
  T('Аталанта', 'Серия A', '#1e71b8', '#000000', '#000000', '#ffffff', '#fdd835', true),
  T('Марсель', 'Лига 1', '#ffffff', '#2faee0', '#ffffff', '#2faee0', '#212121'),
  T('Монако', 'Лига 1', '#e51b22', '#ffffff', '#ffffff', '#ffffff', '#212121'),
  T('Лион', 'Лига 1', '#ffffff', '#da0812', '#ffffff', '#14387f', '#00897b'),
  T('Лилль', 'Лига 1', '#e01e13', '#20325f', '#20325f', '#ffffff', '#fdd835'),
  T('Ницца', 'Лига 1', '#e11b22', '#000000', '#000000', '#ffffff', '#00897b', true),
];
const LEAGUE_ORDER = ['АПЛ', 'Ла Лига', 'Бундеслига', 'Серия A', 'Лига 1', 'РПЛ'];
// Сила клуба (для симуляции чужих матчей в сезоне)
const RATINGS = {
  'Манчестер Сити': 90, 'Ливерпуль': 90, 'Арсенал': 89, 'Челси': 86, 'Манчестер Юнайтед': 82, 'Тоттенхэм': 82,
  'Реал Мадрид': 91, 'Барселона': 90, 'Атлетико Мадрид': 86, 'Атлетик Бильбао': 82, 'Вильярреал': 81, 'Реал Бетис': 80,
  'Бавария': 90, 'Байер Леверкузен': 85, 'Боруссия Дортмунд': 84, 'РБ Лейпциг': 82, 'Штутгарт': 80, 'Айнтрахт Франкфурт': 80,
  'Интер': 88, 'Наполи': 85, 'Ювентус': 84, 'Милан': 84, 'Аталанта': 83, 'Рома': 82,
  'ПСЖ': 91, 'Марсель': 82, 'Монако': 81, 'Лилль': 80, 'Лион': 80, 'Ницца': 78,
  'Зенит': 78, 'Краснодар': 78, 'Спартак Москва': 76, 'ЦСКА': 76, 'Локомотив Москва': 75, 'Динамо Москва': 75,
};
// Составы: вратарь и пенальтисты по порядку ударов.
// Третий элемент — фирменное празднование игрока (если есть).
// ВНИМАНИЕ: составы по состоянию знаний автора; трансферы и номера могли измениться — правьте здесь.
const SQUADS = {
  'Реал Мадрид': { gk: ['Куртуа', 1], takers: [['Мбаппе', 10, 'crossarms'], ['Винисиус', 7, 'samba'], ['Беллингем', 5, 'heyjude'], ['Вальверде', 8], ['Арда Гюлер', 15]] },
  'Барселона': { gk: ['Жоан Гарсия', 13], takers: [['Ламин Ямаль', 10, 'yamal304'], ['Левандовски', 9], ['Рафинья', 11], ['Педри', 8], ['Ферран Торрес', 7]] },
  'Атлетико Мадрид': { gk: ['Облак', 13], takers: [['Хулиан Альварес', 19], ['Гризманн', 7], ['Сёрлот', 9], ['Коке', 6], ['Джулиано Симеоне', 20]] },
  'Манчестер Сити': { gk: ['Доннарумма', 25], takers: [['Холанд', 9, 'meditate'], ['Фоден', 47], ['Шерки', 10], ['Родри', 16], ['Бернарду Силва', 20]] },
  'Ливерпуль': { gk: ['Алиссон', 1], takers: [['Салах', 11, 'sajda'], ['Вирц', 7], ['Исак', 9], ['Собослаи', 8], ['Мак Аллистер', 10]] },
  'Арсенал': { gk: ['Райя', 1], takers: [['Сака', 7], ['Эдегор', 8], ['Дьёкереш', 14], ['Райс', 41], ['Мартинелли', 11]] },
  'Манчестер Юнайтед': { gk: ['Ламменс', 31], takers: [['Бруну Фернандеш', 8], ['Мбемо', 19], ['Кунья', 10], ['Шешко', 30], ['Маунт', 7]] },
  'Челси': { gk: ['Роберт Санчес', 1], takers: [['Палмер', 10, 'cold'], ['Энсо Фернандес', 8], ['Жоао Педро', 20], ['Педро Нету', 7], ['Кайседо', 25]] },
  'Бавария': { gk: ['Нойер', 1], takers: [['Кейн', 9], ['Олисе', 17], ['Мусиала', 10], ['Луис Диас', 14], ['Киммих', 6]] },
  'Боруссия Дортмунд': { gk: ['Кобель', 1], takers: [['Гирасси', 9], ['Брандт', 10], ['Адейеми', 27], ['Байер', 14], ['Забитцер', 20]] },
  'ПСЖ': { gk: ['Шевалье', 30], takers: [['Дембеле', 10], ['Кварацхелия', 7], ['Витинья', 17], ['Дуэ', 14], ['Хакими', 2]] },
  'Ювентус': { gk: ['Ди Грегорио', 29], takers: [['Влахович', 9], ['Йылдыз', 10], ['Джонатан Дэвид', 30], ['Купмейнерс', 8], ['Консейсау', 7]] },
  'Милан': { gk: ['Меньян', 16], takers: [['Леау', 10], ['Пулишич', 11], ['Модрич', 14], ['Нкунку', 18], ['Хименес', 7]] },
  'Интер': { gk: ['Зоммер', 1], takers: [['Лаутаро Мартинес', 10], ['Тюрам', 9], ['Чалханоглу', 20], ['Барелла', 23], ['Димарко', 32]] },
  'Зенит': { gk: ['Латышонок', 1], takers: [['Мостовой', 17], ['Глушенков', 10], ['Венделл', 8], ['Соболев', 7], ['Луис Энрике', 11]] },
  'Спартак Москва': { gk: ['Максименко', 98], takers: [['Угальде', 9], ['Барко', 5], ['Солари', 14], ['Зобнин', 47], ['Пруцев', 8]] },
  'ЦСКА': { gk: ['Акинфеев', 35], takers: [['Обляков', 10], ['Мусаев', 9], ['Глебов', 7], ['Кисляк', 31], ['Дивеев', 78]] },
  'Локомотив Москва': { gk: ['Митрюшкин', 1], takers: [['Батраков', 83], ['Воробьёв', 19], ['Комличенко', 9], ['Баринов', 6], ['Сарвели', 77]] },
  'Динамо Москва': { gk: ['Лещук', 1], takers: [['Тюкавин', 98], ['Бителло', 10], ['Фомин', 74], ['Скопинцев', 3], ['Гладышев', 11]] },
  'Краснодар': { gk: ['Агкацев', 39], takers: [['Кордоба', 9], ['Сперцян', 10], ['Олусегун', 7], ['Кривцов', 88], ['Боселли', 4]] },
  'Тоттенхэм': { gk: ['Викарио', 1], takers: [['Кудус', 20], ['Симонс', 7], ['Соланке', 19], ['Ришарлисон', 9], ['Бентанкур', 30]] },
  'Атлетик Бильбао': { gk: ['Унаи Симон', 1], takers: [['Нико Уильямс', 10], ['Иньяки Уильямс', 9], ['Санчет', 8], ['Беренгер', 7], ['Гурусета', 12]] },
  'Вильярреал': { gk: ['Луис Жуниор', 1], takers: [['Жерар Морено', 7], ['Пепе', 19], ['Микаутадзе', 9], ['Парехо', 10], ['Молейро', 20]] },
  'Реал Бетис': { gk: ['Пау Лопес', 25], takers: [['Антони', 7], ['Иско', 22], ['Абде', 10], ['Ло Сельсо', 20], ['Форнальс', 18]] },
  'Байер Леверкузен': { gk: ['Флеккен', 1], takers: [['Шик', 14], ['Тиллман', 10], ['Гримальдо', 20], ['Хофманн', 7], ['Андрих', 8]] },
  'РБ Лейпциг': { gk: ['Гулачи', 1], takers: [['Нуса', 7], ['Шлагер', 24], ['Раум', 22], ['Баку', 17], ['Зайвальд', 13]] },
  'Штутгарт': { gk: ['Нюбель', 33], takers: [['Ундав', 26], ['Демирович', 9], ['Фюрих', 27], ['Миттельштедт', 7], ['Штиллер', 6]] },
  'Айнтрахт Франкфурт': { gk: ['Трапп', 1], takers: [['Гётце', 27], ['Буркардт', 21], ['Ларссон', 16], ['Кнауфф', 36], ['Скири', 15]] },
  'Наполи': { gk: ['Мерет', 1], takers: [['Де Брёйне', 11], ['Лукаку', 9], ['Мактоминей', 8], ['Политано', 21], ['Хёйлунн', 19]] },
  'Рома': { gk: ['Свилар', 99], takers: [['Дибала', 21], ['Довбик', 11], ['Пеллегрини', 7], ['Соуле', 18], ['Кристанте', 4]] },
  'Аталанта': { gk: ['Карнезекки', 29], takers: [['Лукман', 11], ['Де Кетеларе', 17], ['Скамакка', 9], ['Эдерсон', 13], ['Самарджич', 10]] },
  'Марсель': { gk: ['Рулли', 1], takers: [['Гринвуд', 10], ['Обамеянг', 97], ['Хёйбьерг', 23], ['Паишау', 14], ['Кондогбиа', 19]] },
  'Монако': { gk: ['Кён', 16], takers: [['Головин', 10], ['Минамино', 18], ['Аклиуш', 11], ['Балогун', 29], ['Погба', 8]] },
  'Лион': { gk: ['Грайф', 1], takers: [['Толиссо', 8], ['Малик Фофана', 11], ['Тессманн', 6], ['Мейтленд-Найлз', 98], ['Карабец', 18]] },
  'Лилль': { gk: ['Озер', 1], takers: [['Жиру', 9], ['Харальдссон', 10], ['Андре', 21], ['Фернандес-Пардо', 7], ['Буадди', 32]] },
  'Ницца': { gk: ['Бюлька', 1], takers: [['Мофи', 9], ['Софьян Диоп', 10], ['Сансон', 11], ['Ндайишимийе', 55], ['Клаусс', 7]] },
};
for (const t of TEAMS) {
  t.rating = RATINGS[t.name];
  const s = SQUADS[t.name];
  t.keeper = { name: s.gk[0], num: s.gk[1] };
  t.takers = s.takers.map(([name, num, celeb]) => ({ name, num, celeb }));
}

const badgeStyle = (t) => t.stripes
  ? `background:repeating-linear-gradient(90deg,${t.color} 0 5px,${t.color2} 5px 10px);border-color:${t.color2}`
  : `background:${t.color};border-color:${t.color2}`;

// Фирменные празднования реальных игроков
const SIGNATURE = {
  crossarms: 'скрещённые на груди руки',
  samba: 'танец у углового флажка',
  heyjude: 'руки широко в стороны',
  meditate: 'медитация в позе лотоса',
  cold: '«холодно» — растирает плечи',
  sajda: 'земной поклон',
  yamal304: 'жест «304» в честь родного района',
};
// Обычные празднования для остальных
const CELEBS = [
  { id: 'slide', name: 'Скольжение на коленях' },
  { id: 'plane', name: 'Самолётик' },
  { id: 'flip', name: 'Сальто' },
  { id: 'jump', name: 'Прыжок с кулаком вверх' },
  { id: 'dance', name: 'Танец у углового флажка' },
  { id: 'sky', name: 'Руки к небу' },
];
const DIFF = {
  easy: { keeper: 0.25, noise: 0.42 },
  normal: { keeper: 0.5, noise: 0.3 },
  hard: { keeper: 0.75, noise: 0.2 },
};
// Зоны прыжка вратаря (метры: x — от центра ворот, y — высота)
const ZONES = [
  { x: -2.3, y: 1.75, a: -55 }, { x: 0, y: 2.0, a: 0 }, { x: 2.3, y: 1.75, a: 55 },
  { x: -2.4, y: 0.45, a: -80 }, { x: 0, y: 0.7, a: 0, low: true }, { x: 2.4, y: 0.45, a: 80 },
];
const KEYS = { q: 0, w: 1, e: 2, a: 3, s: 4, d: 5 };
const GW = 3.66, GH = 2.44, POST = 0.12;

// ---------- Проекция (камера за точкой пенальти) ----------
const VW = 960, VH = 600;
const CAM_H = 1.6, F = 1040, CX = 480, HORIZON = 226;
// Камера: CAM_D — расстояние от линии ворот, CAM_X — сдвиг вбок. В пенальти она за точкой (16, 0),
// на штрафных отъезжает за мяч.
let CAM_D = 16, CAM_X = 0;
// x — вбок, y — высота, d — расстояние от линии ворот к камере
function project(x, y, d) {
  const z = Math.max(0.3, CAM_D - d);
  const s = F / z;
  return { x: CX + (x - CAM_X) * s, y: HORIZON + (CAM_H - y) * s, s };
}
function screenToGoal(sx, sy) {
  const s = F / CAM_D;
  return { x: (sx - CX) / s + CAM_X, y: CAM_H - (sy - HORIZON) / s };
}

// ---------- Утилиты ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const randn = () => {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

// ---------- Состояние ----------
const G = {
  you: 0, cpu: 1, diff: 'normal',
  kicks: { you: [], cpu: [] },
  shooter: 'you',
  phase: 'idle', // aim | charge | runup | flight | after | over
  aim: { x: 1.5, y: 1.2 },
  power: 0, powerDir: 1,
  curl: 0, pressX: 0,
  ball: null, keeper: null,
  particles: [], shake: 0, ripple: null, rain: 0, rainColors: [],
  choice: null, runT: 0, afterT: 0,
  msg: null, msgT: 0, time: 0,
};

const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
const $ = (id) => document.getElementById(id);

function setupCanvas() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = VW * dpr;
  cv.height = VH * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Толпа на трибунах — заранее
const crowd = [];
for (let i = 0; i < 1400; i++) {
  crowd.push({
    x: Math.random() * VW, y: 20 + Math.random() * 190,
    c: ['#e57373', '#64b5f6', '#fff176', '#f5f5f5', '#81c784', '#ba68c8', '#ffb74d'][i % 7],
    p: Math.random() * 6.28,
  });
}

// ---------- Настройка ----------
// Список клубов, сгруппированный по лигам. pick(i) вызывается при выборе, isActive/isDisabled — состояние кнопки
function fillClubList(el, isActive, isDisabled, pick) {
  el.innerHTML = '';
  for (const lg of LEAGUE_ORDER) {
    const h = document.createElement('div');
    h.className = 'league-head';
    h.textContent = lg;
    el.appendChild(h);
    TEAMS.forEach((t, i) => {
      if (t.league !== lg) return;
      const b = document.createElement('button');
      b.className = 'team-btn' + (isActive(i) ? ' active' : '');
      b.disabled = isDisabled(i);
      b.innerHTML = `<span class="badge" style="${badgeStyle(t)}"></span>${t.name}`;
      b.onclick = () => pick(i);
      el.appendChild(b);
    });
  }
}

function renderTeamLists() {
  for (const who of ['you', 'cpu']) {
    const other = who === 'you' ? 'cpu' : 'you';
    fillClubList($(who + '-list'), (i) => G[who] === i, (i) => G[other] === i, (i) => { G[who] = i; renderTeamLists(); });
  }
}
document.querySelectorAll('#diff button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('#diff button').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    G.diff = b.dataset.d;
  };
});
// Режим: 'friendly' — товарищеский матч, 'season' — матч сезона (результат уходит в G.onFinish)
G.mode = 'friendly';
G.onFinish = null;
function startFriendly() {
  G.mode = 'friendly';
  G.matchTitle = 'Товарищеский матч';
  G.allowDraw = false; // товарищеский матч — до победы
  G.onFinish = null;
  startShootout();
}
$('start').onclick = startFriendly;
$('again').onclick = () => (G.mode === 'fk' ? startFreeKicks() : startFriendly());
$('back').onclick = () => {
  fsOff(); // выходим из полноэкранного режима вместе с игрой
  $('game-view').classList.add('hidden');
  G.phase = 'idle';
  G.party = null;
  if (G.mode === 'season') showView('season');
  else if (G.mode === 'fk') showView('fk');
  else $('setup').classList.remove('hidden');
};

function startShootout() {
  CAM_D = 16; CAM_X = 0;
  const season = G.mode === 'season';
  $('again').classList.toggle('hidden', season);
  $('again').textContent = 'Ещё серию';
  $('back').textContent = season ? 'Продолжить сезон' : 'Сменить команды';
  G.kicks = { you: [], cpu: [] };
  G.shooter = 'you';
  G.rain = 0;
  G.particles = [];
  G.party = null;
  $('setup').classList.add('hidden');
  $('season-view').classList.add('hidden');
  $('over').classList.add('hidden');
  $('game-view').classList.remove('hidden');
  startIntro(); // сначала стартовые составы, потом первый удар
}

// ---------- Табло ----------
function renderBoard() {
  const rows = ['you', 'cpu'].map((who) => {
    const t = TEAMS[G[who]];
    const k = G.kicks[who];
    const n = Math.max(5, G.kicks.you.length, G.kicks.cpu.length);
    let dots = '';
    for (let i = 0; i < n; i++) {
      const cls = i < k.length ? (k[i] ? 'goal' : 'miss') : '';
      dots += `<span class="dot ${cls}"></span>`;
    }
    const turn = G.phase !== 'over' && G.shooter === who ? ' turn' : '';
    const label = who === 'you' ? ' (вы)' : '';
    return `<div class="board-row${turn}">
      <div class="board-name"><span class="badge" style="${badgeStyle(t)}"></span><span>${t.name}${label}</span></div>
      <div class="dots">${dots}</div>
      <div class="board-score">${k.filter(Boolean).length}</div>
    </div>`;
  });
  $('board').innerHTML = rows.join('');
}

function setStatus(text) { $('status').textContent = text; }

// ---------- Ход ----------
function newKick() {
  G.ball = { x: 0, y: 0.11, d: 11, vis: true };
  G.keeper = { x: 0, plan: null, t: 0, landed: false };
  G.choice = null;
  G.runT = 0;
  G.power = 0; // закрутка (G.curl) не сбрасывается — это настройка игрока
  G.msg = null;
  G.ripple = null;
  G.celeb = null;
  // Бьющие идут по очереди, в серии «до первого промаха» список начинается заново
  const st = TEAMS[G[G.shooter]];
  const kt = TEAMS[G[G.shooter === 'you' ? 'cpu' : 'you']];
  G.taker = st.takers[G.kicks[G.shooter].length % st.takers.length];
  G.gkPlayer = kt.keeper;
  if (G.shooter === 'you') {
    G.phase = 'aim';
    setStatus(`Бьёт ${G.taker.name} (№${G.taker.num}) против ${G.gkPlayer.name}. ${IS_TOUCH ? 'Коснитесь ворот и ведите пальцем — прицел; держите для силы, отпустите — удар.' : 'Наведите прицел, зажмите кнопку для силы и отпустите.'} Закрутка — регулятором под полем.`);
  } else {
    G.phase = 'runup';
    setStatus(`На воротах ${G.gkPlayer.name}! Бьёт ${G.taker.name} (№${G.taker.num}). ${IS_TOUCH ? 'Коснитесь ворот там, куда прыгнуть.' : 'Кликните в воротах, куда прыгнуть (или Q W E / A S D).'}`);
  }
  updateCurlUI();
  renderBoard();
}

// ---------- Физика вратаря ----------
// Поза: x, y — таз (м), a — наклон корпуса (рад, + вправо), arms: 1 — руки вверх, -1 — вниз в стороны, spread — ширина ног
const GRAV = 9.8, SET = 0.1, HAND_REACH = 1.12;

function planDive(x0, zone, target, power, curl, skill, delay, dur, read) {
  const base = { x0, delay, skill };
  if (zone == null && !read) return { ...base, mode: 'stay' };
  // zone — номер зоны (вратарь соперника) или точка {x, y}, куда кликнул игрок
  const point = typeof zone === 'object' && zone !== null;
  // Точка, куда вратарь тянет руки
  let H = point ? { x: zone.x, y: zone.y }
    : read ? { x: target.x + randn() * 0.25, y: target.y + randn() * 0.2 }
    : { x: ZONES[zone].x, y: ZONES[zone].y };
  if (!read && !point) {
    // В полёте вратарь чуть корректирует прыжок, если угадал сторону
    const sameSide = Math.sign(H.x) === Math.sign(target.x) || Math.abs(H.x) < 0.5;
    if (sameSide) {
      const ad = skill * 0.4 * (1 - power * 0.5) * (1 - Math.abs(curl) * 0.6);
      H = { x: lerp(H.x, target.x, ad), y: lerp(H.y, target.y, ad) };
    }
  }
  if (H.y < 1.0 && Math.abs(H.x) < 1.1) return { ...base, mode: 'block', bx: x0 + (H.x - x0) * (point ? 1 : 0.6) };

  const theta = clamp(Math.atan2(H.x - x0, H.y - 0.2), -1.48, 1.48);
  const sx = Math.sign(theta) || 1;
  const vertical = Math.abs(theta) < 0.3;
  const P = { x: H.x - HAND_REACH * Math.sin(theta), y: Math.max(0.22, H.y - HAND_REACH * Math.cos(theta)) };
  const xs = x0 + (vertical ? 0 : sx * 0.1), ys = 0.78; // после приседа и шага
  // Вратарь старается долететь к моменту прихода мяча, но толчок ограничен его атлетизмом
  const T = clamp(dur - delay - SET, 0.22, 0.55);
  const vmax = 4.6 + skill * 3, vymax = 3.6 + skill * 1.4;
  const vx = clamp((P.x - xs) / T, -vmax, vmax);
  let vy = clamp((P.y - ys + 0.5 * GRAV * T * T) / T, 0, vymax);
  if (vertical) vy = Math.max(vy, 2.0);
  const landY = vertical ? 0.95 : 0.22;
  const disc = vy * vy + 2 * GRAV * (ys - landY);
  const tLand = Math.max(0.12, disc > 0 ? (vy + Math.sqrt(disc)) / GRAV : T);
  const aL = theta * easeOut(Math.min(1, tLand / T));
  return { ...base, mode: 'dive', theta, sx, xs, ys, vx, vy, T, tLand, landY, aL, xL: xs + vx * tLand };
}

function keeperPose(k, t) {
  const p = k.plan;
  if (!p || t < p.delay) {
    const hop = p ? 0 : Math.abs(Math.sin(G.time * 5)) * 0.04; // пружинит на носках
    return { x: p ? p.x0 : k.x, y: 0.95 + hop, a: 0, arms: 0, spread: 0.15 };
  }
  const s = t - p.delay;
  if (p.mode === 'stay') {
    const e = easeOut(clamp(s / 0.25, 0, 1));
    return { x: p.x0, y: 0.95 - 0.05 * e, a: 0, arms: 0.5 * e, spread: 0.15 + 0.2 * e };
  }
  if (p.mode === 'block') {
    const e = easeOut(clamp(s / 0.18, 0, 1));
    return { x: lerp(p.x0, p.bx, e), y: lerp(0.95, 0.62, e), a: 0, arms: -e, spread: 0.15 + 0.85 * e };
  }
  if (s < SET) { // присед и толчок
    const e = s / SET;
    return { x: lerp(p.x0, p.xs, e), y: 0.95 - 0.17 * Math.sin((e * Math.PI) / 2), a: p.theta * 0.08 * e, arms: 0.15 * e, spread: 0.15 + 0.25 * e };
  }
  const tau = s - SET;
  if (tau < p.tLand) { // баллистический полёт
    const f = Math.min(1, tau / p.T);
    return {
      x: p.xs + p.vx * tau,
      y: p.ys + p.vy * tau - 0.5 * GRAV * tau * tau,
      a: p.theta * easeOut(f),
      arms: Math.min(1, 0.15 + tau / (p.T * 0.6)),
      spread: 0.4 * (1 - f),
    };
  }
  const g = tau - p.tLand;
  if (p.landY > 0.5) { // приземление на ноги после прыжка вверх
    const e = easeOut(Math.min(1, g / 0.3));
    return { x: p.xL, y: 0.95 - 0.15 * Math.sin(Math.min(1, g / 0.25) * Math.PI), a: p.aL * (1 - e), arms: Math.max(0, 1 - g * 2), spread: 0.2 };
  }
  // падение на газон: отскок, скольжение, корпус ложится горизонтально
  const e = easeOut(Math.min(1, g / 0.25));
  return {
    x: p.xL + (p.vx * 0.6 * (1 - Math.exp(-6 * g))) / 6,
    y: 0.22 + 0.1 * Math.abs(Math.sin(g * 12)) * Math.exp(-g * 8),
    a: lerp(p.aL, p.sx * 1.5, e),
    arms: 1, spread: 0,
  };
}

// Одинаковая геометрия для отрисовки и для проверки касания (локальные метры, y вниз)
function handLocal(sx, a) {
  return a >= 0
    ? { x: lerp(sx * 0.55, sx * 0.24, a), y: lerp(-0.2, -1.12, a) }
    : { x: lerp(sx * 0.55, sx * 0.62, -a), y: lerp(-0.2, 0.1, -a) };
}
const legX = (pose) => 0.08 + 0.3 * pose.spread;
function toWorld(pose, lx, ly) {
  const c = Math.cos(pose.a), s = Math.sin(pose.a);
  return { x: pose.x + lx * c - ly * s, y: pose.y - (lx * s + ly * c) };
}
function keeperSegments(pose, handR) {
  const w = (lx, ly) => toWorld(pose, lx, ly);
  const L = legX(pose);
  const segs = [
    { a: w(0, 0.05), b: w(0, -0.85), r: 0.24, part: 'body' },
    // ноги — до бутс включительно
    { a: w(-0.1, 0.1), b: w(-L * 1.05, 0.98), r: 0.14, part: 'leg' },
    { a: w(0.1, 0.1), b: w(L * 1.05, 0.98), r: 0.14, part: 'leg' },
  ];
  for (const sx of [-1, 1]) {
    const h = handLocal(sx, pose.arms);
    segs.push({ a: w(sx * 0.2, -0.52), b: w(h.x, h.y), r: handR, part: 'hand' });
  }
  return segs;
}
function segDist(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const l2 = dx * dx + dy * dy || 1;
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / l2, 0, 1);
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

// Итог удара: 'goal' | 'save' | 'miss' | 'post'. Сейв — только если вратарь физически касается мяча.
function resolve(target, power, curl, k, dur, skill) {
  const ax = Math.abs(target.x);
  if (ax > GW + POST || target.y > GH + POST) return { res: 'miss' };
  // Сначала вратарь: если он коснулся мяча раньше, чем мяч долетел до штанги, — это сейв
  const save = keeperTouch(target, power, curl, k, dur, skill);
  if (save) return save;
  // Попадание в штангу или перекладину: мяч отскакивает в ворота или в поле.
  // Чем ближе к внутренней стороне стойки, тем вероятнее, что отскочит в сетку.
  const hitPost = ax > GW - POST, hitBar = target.y > GH - POST;
  if (hitPost || hitBar) {
    const depthPost = hitPost ? (GW + POST - ax) / (2 * POST) : 1;      // 0 — внешний край, 1 — внутренний
    const depthBar = hitBar ? (GH + POST - target.y) / (2 * POST) : 1;
    const inside = Math.min(depthPost, depthBar);
    const pIn = clamp(0.15 + inside * 0.6, 0.1, 0.75);
    const part = hitBar && (!hitPost || depthBar < depthPost) ? 'bar' : 'post';
    return Math.random() < pIn ? { res: 'goal', postIn: part } : { res: 'post', postPart: part };
  }
  return { res: 'goal' };
}

// Касается ли вратарь мяча (руки, тело, ноги) — возвращает сейв или null
function keeperTouch(target, power, curl, k, dur, skill) {
  // Сильный и закрученный мяч труднее удержать руками
  const handR = (0.2 + skill * 0.1) * (1 - power * 0.25) * (1 - Math.abs(curl) * 0.15);
  // Проверяем касание там, где мяч проходит через вратаря (он стоит в 0.3 м перед линией),
  // и на самой линии — так мяч не «пролетает сквозь» ногу или руку
  const arc = 0.15 + (1 - power) * 0.5;
  const uK = 1 - 0.3 / 11;
  for (const u of [uK - 0.012, uK, (uK + 1) / 2, 1]) {
    const ball = { x: target.x * u + curlOffset(curl, u), y: lerp(0.11, target.y, u) + Math.sin(Math.PI * u) * arc };
    const pose = keeperPose(k, dur * u);
    for (const sg of keeperSegments(pose, handR)) {
      if (segDist(ball, sg.a, sg.b) < sg.r + 0.11) {
        const caught = sg.part !== 'leg' && power < 0.65 && Math.abs(curl) < 0.5 && Math.random() < 0.6;
        return { res: 'save', caught, part: sg.part };
      }
    }
  }
  return null;
}

function launch(target, power, zone, skill, keeperDelay, curl = 0, read = false) {
  const dur = 0.78 - power * 0.36;
  const k = G.keeper;
  k.plan = planDive(k.x, zone, target, power, curl, skill, keeperDelay, dur, read);
  k.t = 0;
  k.landed = false;
  const r = resolve(target, power, curl, k, dur, skill);
  G.ball = {
    from: { x: 0, y: 0.11, d: 11 }, target, power, result: r.res, caught: r.caught, part: r.part, curl,
    postIn: r.postIn || null, postPart: r.postPart || null,
    x: 0, y: 0.11, d: 11, u: 0, dur,
    arc: 0.15 + (1 - power) * 0.5,
    vis: true,
  };
  G.phase = 'flight';
}

function shootYou() {
  const d = DIFF[G.diff];
  const p = G.power;
  const sigma = 0.12 + Math.pow(p, 3) * 0.55 + Math.abs(G.curl) * 0.08;
  const target = {
    x: G.aim.x + randn() * sigma,
    y: Math.max(0.11, G.aim.y + randn() * sigma * 0.8 + Math.max(0, p - 0.85) * 4),
  };
  // Компьютерный вратарь: иногда «читает» удар, иначе угадывает
  const read = Math.random() < 0.12 + d.keeper * 0.25;
  const zone = read ? nearestZone(target) : weightedZone();
  launch(target, p, zone, d.keeper, 0.08 + (1 - d.keeper) * 0.08, G.curl, read);
  updateCurlUI();
  setStatus('');
}

function shootCpu() {
  const d = DIFF[G.diff];
  const r = Math.random();
  let aim;
  if (r < 0.15) aim = { x: (Math.random() - 0.5) * 1.6, y: 0.3 + Math.random() * 1.6 };
  else {
    const side = Math.random() < 0.5 ? -1 : 1;
    aim = { x: side * (1.6 + Math.random() * 1.8), y: 0.2 + Math.random() * 2.0 };
  }
  const power = 0.5 + Math.random() * 0.45;
  const noise = d.noise * (0.6 + power * 0.6);
  const target = { x: aim.x + randn() * noise, y: Math.max(0.11, aim.y + randn() * noise * 0.7) };
  // Иногда соперник закручивает мяч
  const curl = Math.random() < 0.4 ? (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.6) : 0;
  launch(target, power, G.choice, 0.55, 0.05, curl);
  setStatus('');
}

// Боковое отклонение закрученного мяча: сначала уходит в одну сторону, потом заворачивает к цели
function curlOffset(curl, u) {
  return -curl * 1.7 * Math.sin(Math.PI * u);
}

function nearestZone(t) {
  let best = 0, bd = 1e9;
  ZONES.forEach((z, i) => {
    const d = Math.hypot(z.x - t.x, z.y - t.y);
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}
function weightedZone() {
  const w = [1, 0.5, 1, 1.4, 0.8, 1.4];
  let r = Math.random() * w.reduce((a, b) => a + b);
  for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
  return 5;
}

function finishFlight() {
  const b = G.ball;
  const res = b.result;
  const sx = Math.sign(b.target.x) || 1;
  if (res === 'goal' && b.postIn === 'post') { // от штанги — внутрь ворот
    b.vx = -sx * (2.5 + Math.random() * 2); b.vy = 0.5 + Math.random(); b.vd = -4;
    G.shake = Math.max(G.shake, 0.3);
  } else if (res === 'goal' && b.postIn === 'bar') { // от перекладины — вниз, за линию
    b.vx = (Math.random() - 0.5) * 2; b.vy = -4; b.vd = -3.5;
    G.shake = Math.max(G.shake, 0.3);
  } else if (res === 'goal') { b.vx = (b.target.x - b.from.x) * 0.1; b.vy = 0; b.vd = -7; }
  else if (res === 'save') {
    if (b.caught) b.attach = true; // вратарь забирает мяч в руки
    else {
      // мяч отскакивает от вратаря в сторону от его тела
      const pose = keeperPose(G.keeper, G.keeper.t);
      const away = Math.sign(b.target.x - pose.x) || sx;
      const soft = b.part === 'body' ? 0.5 : 1;
      b.vx = away * (1.5 + Math.random() * 3) * soft;
      b.vy = b.part === 'leg' ? 1 : 2.5 + Math.random() * 2;
      b.vd = (3 + Math.random() * 4) * soft;
    }
  }
  else if (res === 'post' && b.postPart === 'bar') { b.vx = (Math.random() - 0.5) * 2; b.vy = 3; b.vd = 6; } // от перекладины — вверх и в поле
  else if (res === 'post') { b.vx = sx * (0.5 + Math.random()); b.vy = 1.5; b.vd = 6; } // от штанги — наружу и в поле
  else { const k = 1 / b.dur; b.vx = (b.target.x - b.from.x) * k; b.vy = (b.target.y - b.from.y) * k * 0.5; b.vd = -11 * k; }
  b.phys = true;

  const scored = res === 'goal';
  G.kicks[G.shooter].push(scored);
  const youShot = G.shooter === 'you';
  const texts = { goal: 'ГОЛ!', save: youShot ? 'СЕЙВ!' : 'ВЗЯЛ!', miss: 'МИМО!', post: 'ШТАНГА!' };
  const good = youShot ? scored : !scored;
  G.msg = { text: texts[res], color: good ? '#66bb6a' : '#ef5350', sub: subtitle(res, youShot, b) };
  G.msgT = 0;
  G.phase = 'after';
  G.afterT = 0;
  celebrate(res, youShot, b);
  renderBoard();
}

function subtitle(res, youShot, b) {
  const who = res === 'save' ? G.gkPlayer.name : G.taker.name;
  return `${who}: ${phrase(res, youShot, b)}`;
}

function phrase(res, youShot, b) {
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const corner = Math.abs(b.target.x) > 2.5 && b.target.y > 1.6;
  if (res === 'goal' && b.postIn) return b.postIn === 'bar' ? 'от перекладины — и в ворота!' : 'от штанги — и в сетку!';
  if (res === 'goal' && youShot) {
    if (Math.abs(b.curl) > 0.5) return pick(['какая закрутка!', 'мяч обвёл вратаря по дуге!']);
    if (corner) return 'прямо в девятку!';
    if (b.power > 0.8) return 'пушечный удар!';
    return pick(['хладнокровно!', 'без шансов для вратаря!', 'уверенная реализация!']);
  }
  if (res === 'goal') return pick(['реализовал удар', 'не оставил шансов', 'точно в угол']);
  if (res === 'save' && b.caught) return 'забирает мяч намертво!';
  if (res === 'save' && b.part === 'leg') return 'отбивает ногой!';
  if (res === 'save' && !youShot) return pick(['отличный прыжок!', 'угадал угол!', 'фантастический сейв!']);
  if (res === 'save') return 'угадал угол';
  if (res === 'post') return b.postPart === 'bar' ? 'в перекладину — и мимо!' : 'звон штанги на весь стадион';
  return youShot ? 'мяч улетел на трибуны' : 'не попал в створ!';
}

// ---------- Празднование ----------
function burst(x, y, colors, n, power = 1) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.6;
    const sp = (250 + Math.random() * 450) * power;
    G.particles.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 14,
      w: 6 + Math.random() * 6, h: 3 + Math.random() * 4,
      color: colors[i % colors.length], life: 2.2 + Math.random() * 1.2,
    });
  }
}

function celebrate(res, youShot, b) {
  const team = TEAMS[G[G.shooter]];
  const p = project(b.target.x, b.target.y, 0);
  if (res === 'goal') {
    const pl = G.taker;
    const type = pl.celeb
      ? { id: pl.celeb, name: `${pl.name} — ${SIGNATURE[pl.celeb]}` }
      : { ...CELEBS[Math.floor(Math.random() * CELEBS.length)] };
    if (!pl.celeb) type.name = `${pl.name} — ${type.name.toLowerCase()}`;
    G.celeb = { type, t: 0, team, sx: Math.random() < 0.5 ? -1 : 1, num: pl.num, name: pl.name };
    G.ripple = { x: b.target.x, y: b.target.y, t: 0 };
    G.shake = youShot ? 0.45 : 0.2;
    burst(p.x, p.y, [team.color, team.color2, '#ffffff'], youShot ? 140 : 50, youShot ? 1 : 0.6);
    if (youShot) {
      burst(60, VH - 40, [team.color, team.color2, '#ffd54f'], 60, 1.2);
      burst(VW - 60, VH - 40, [team.color, team.color2, '#ffd54f'], 60, 1.2);
    }
  } else if (res === 'save' && !youShot) {
    const you = TEAMS[G.you];
    G.shake = 0.3;
    burst(p.x, p.y, [you.gk, you.color, '#ffffff'], 90, 0.8);
  } else if (res === 'post') {
    G.shake = 0.25;
  }
}

// ---------- Празднующий игрок ----------
// Поза: x, d — позиция на поле, y — высота таза, rot — наклон/вращение,
// armL/armR — угол руки от «вниз» (0) через «в сторону» (π/2) до «вверх» (π), legs — фаза шага, kneel — на коленях
function celebPose(c) {
  const t = c.t, sx = c.sx;
  // foreL/foreR — угол предплечья (по той же шкале; null — рука прямая), front — лицом к камере,
  // sit — сидит по-турецки, bow — поклон вперёд (0..1), eyesClosed, label — надпись над игроком
  const P = { x: 0, d: 10.3, y: 0.95, rot: 0, armL: 0.35, armR: 0.35, foreL: null, foreR: null, legs: 0, kneel: false, front: false, sit: false, bow: 0, eyesClosed: false, label: null };
  const runTo = (k, tx, td) => {
    P.x = sx * lerp(0.3, tx, k); P.d = lerp(10.3, td, k);
    P.legs = Math.sin(t * 16);
    P.armL = 0.45 - 0.35 * Math.sin(t * 16); P.armR = 0.45 + 0.35 * Math.sin(t * 16);
    P.y = 0.95 + Math.abs(Math.sin(t * 16)) * 0.05;
  };
  const RUN = 0.9;
  const k = easeOut(Math.min(1, t / RUN));
  const s = Math.max(0, t - RUN);
  switch (c.type.id) {
    case 'slide': {
      if (t < 0.7) { runTo(t / 0.7, 2.6, 8.4); break; }
      const g = t - 0.7, m = 1 - Math.exp(-g * 2.5);
      P.x = sx * (2.6 + 2.2 * m); P.d = 8.4 - 2.0 * m;
      P.kneel = true; P.y = 0.5;
      const up = Math.min(1, g / 0.3);
      P.armL = P.armR = lerp(0.5, 2.5, up);
      P.rot = sx * 0.06 * Math.sin(g * 3);
      break;
    }
    case 'plane': {
      const m = Math.min(1, t / 2.8);
      const ang = m * Math.PI * 0.9;
      P.x = sx * (0.3 + Math.sin(ang) * 3.6); P.d = 10.3 - (1 - Math.cos(ang)) * 1.8;
      P.legs = Math.sin(t * 14);
      P.y = 0.95 + Math.abs(Math.sin(t * 14)) * 0.04;
      P.armL = P.armR = Math.PI / 2;
      P.rot = 0.35 * Math.sin(t * 3.5) + sx * 0.15;
      break;
    }
    case 'flip': {
      if (t < RUN) { runTo(k, 3.0, 7.8); break; }
      P.x = sx * 3.0; P.d = 7.8;
      const J = 0.75;
      if (s < J) {
        const f = s / J;
        P.y = 0.95 + Math.sin(Math.PI * f) * 1.1;
        P.rot = -sx * Math.PI * 2 * easeOut(f);
        P.armL = P.armR = 2.6;
        P.legs = 0;
      } else {
        P.armL = P.armR = 2.8;
        P.y = 0.95 + Math.abs(Math.sin((s - J) * 6)) * 0.12 * Math.exp(-(s - J) * 2);
      }
      break;
    }
    case 'jump': {
      if (t < RUN) { runTo(k, 3.4, 7.4); break; }
      P.x = sx * 3.4; P.d = 7.4;
      P.y = 0.95 + Math.abs(Math.sin(s * 5)) * 0.55;
      P.armR = 2.7 + 0.4 * Math.sin(s * 10);
      P.armL = 0.6;
      if (sx < 0) { const a = P.armL; P.armL = P.armR; P.armR = a; }
      P.legs = 0.3;
      break;
    }
    case 'dance': {
      if (t < RUN) { runTo(k, 4.0, 7.0); break; }
      P.x = sx * 4.0 + Math.sin(s * 6) * 0.25; P.d = 7.0;
      P.rot = 0.25 * Math.sin(s * 6);
      P.armL = 1.6 + 1.2 * Math.sin(s * 6);
      P.armR = 1.6 - 1.2 * Math.sin(s * 6);
      P.legs = Math.sin(s * 12) * 0.6;
      P.y = 0.95 - Math.abs(Math.sin(s * 6)) * 0.08;
      break;
    }
    case 'sky': {
      if (t < RUN) { runTo(k, 2.8, 7.6); break; }
      P.x = sx * 2.8; P.d = 7.6;
      const g = Math.min(1, s / 0.35);
      P.kneel = g > 0.5;
      P.y = lerp(0.95, 0.5, g);
      P.armL = P.armR = lerp(0.4, 2.95, easeOut(Math.min(1, s / 0.6)));
      break;
    }

    // ----- Фирменные празднования: игрок добегает и поворачивается к трибуне за камерой -----
    case 'crossarms': { // Мбаппе: стоит, скрестив руки на груди
      if (t < RUN) { runTo(k, 2.6, 7.6); break; }
      P.x = sx * 2.6; P.d = 7.6; P.front = true; P.serious = true;
      const e = easeOut(Math.min(1, s / 0.35));
      P.armL = P.armR = lerp(0.3, -0.1, e);
      P.foreL = P.foreR = lerp(0.3, -2.0, e);
      P.y = 0.95 + Math.sin(s * 2) * 0.005;
      break;
    }
    case 'heyjude': { // Беллингем: замирает, раскинув руки
      if (t < RUN) { runTo(k, 2.8, 7.4); break; }
      P.x = sx * 2.8; P.d = 7.4; P.front = true;
      const e = easeOut(Math.min(1, s / 0.4));
      P.armL = P.armR = lerp(0.4, 1.95, e) + Math.sin(s * 2) * 0.03;
      P.y = 0.95 + 0.02 * e;
      break;
    }
    case 'meditate': { // Холанд: садится в позу лотоса, ладони на коленях, глаза закрыты
      if (t < RUN) { runTo(k, 2.4, 7.8); break; }
      P.x = sx * 2.4; P.d = 7.8; P.front = true;
      const e = easeOut(Math.min(1, s / 0.45));
      P.sit = e > 0.5;
      P.y = lerp(0.95, 0.3, e);
      P.armL = P.armR = lerp(0.3, 0.45, e);
      P.foreL = P.foreR = 0.3;
      P.eyesClosed = e > 0.8;
      P.y += Math.sin(s * 1.5) * 0.008; // ровное дыхание
      break;
    }
    case 'samba': { // Винисиус: танец у углового флажка
      if (t < RUN) { runTo(k, 4.0, 7.0); break; }
      P.x = sx * 4.0 + Math.sin(s * 8) * 0.3; P.d = 7.0; P.front = true;
      P.rot = 0.22 * Math.sin(s * 8);
      P.armL = 1.2 + 0.9 * Math.sin(s * 8);
      P.armR = 1.2 - 0.9 * Math.sin(s * 8);
      P.foreL = P.armL + 0.9; P.foreR = P.armR + 0.9;
      P.legs = Math.sin(s * 16) * 0.7;
      P.y = 0.95 - Math.abs(Math.sin(s * 8)) * 0.1;
      break;
    }
    case 'cold': { // Палмер: «холодно» — обхватывает себя и растирает плечи, дрожит
      if (t < RUN) { runTo(k, 2.6, 7.6); break; }
      P.x = sx * 2.6 + Math.sin(s * 70) * 0.012; P.d = 7.6; P.front = true;
      const e = easeOut(Math.min(1, s / 0.3));
      P.armL = P.armR = lerp(0.3, 0.2, e);
      P.foreL = lerp(0.3, -2.2, e) + Math.sin(s * 14) * 0.18 * e;
      P.foreR = lerp(0.3, -2.2, e) - Math.sin(s * 14) * 0.18 * e;
      P.rot = Math.sin(s * 55) * 0.025;
      P.label = s > 0.3 ? '🥶' : null;
      break;
    }
    case 'sajda': { // Салах: опускается на колени и делает земной поклон
      if (t < RUN) { runTo(k, 2.4, 7.8); break; }
      P.x = sx * 2.4; P.d = 7.8; P.front = true;
      const down = easeOut(Math.min(1, s / 0.3));
      P.kneel = down > 0.5;
      P.y = lerp(0.95, 0.5, down);
      if (s < 0.9) { P.armL = P.armR = lerp(0.3, 2.6, down); } // руки к небу
      else {
        const b = easeOut(Math.min(1, (s - 0.9) / 0.45));
        P.bow = b;
        P.armL = P.armR = lerp(2.6, 0.25, b);
        P.foreL = P.foreR = lerp(2.6, 0.15, b);
      }
      break;
    }
    case 'yamal304': { // Ламин Ямаль: пальцами показывает «304» — индекс родного района
      if (t < RUN) { runTo(k, 2.6, 7.6); break; }
      P.x = sx * 2.6; P.d = 7.6; P.front = true;
      const e = easeOut(Math.min(1, s / 0.3));
      P.armL = P.armR = lerp(0.3, 0.55, e);
      P.foreL = P.foreR = lerp(0.3, 2.85, e);
      P.label = s > 0.3 ? '3 0 4' : null;
      break;
    }
  }
  P.x *= 0.55; // камера близко — держим игрока в кадре
  return P;
}

function drawCelebrator() {
  const c = G.celeb;
  if (!c) return;
  drawFigure(celebPose(c), c.team, c.num, c.name);

  // подпись празднования
  const a = clamp(c.t * 2, 0, 1) * clamp((3.6 - c.t) * 2, 0, 1);
  if (a > 0) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = 'bold 18px Segoe UI'; ctx.textAlign = 'center';
    const txt = `🎉 ${c.type.name}`;
    const w = ctx.measureText(txt).width + 30;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    // справа внизу — слева внизу плашка комментатора
    const x = Math.max(VW / 2 + 10, VW - 12 - w);
    ctx.beginPath(); ctx.roundRect(x, VH - 52, w, 34, 17); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(txt, x + w / 2, VH - 29, w - 20);
    ctx.restore();
  }
}

// ---------- Командное празднование победы ----------
// Вся команда сбегается к центру, прыгает в обнимку, потом подбрасывает героя серии.
const PARTY_BACK = [-0.75, 0.75, -1.5, 1.5, -2.25, 2.25];
const PARTY_FRONT = [-0.6, 0.6, -1.5, 1.5];

function startParty(who) {
  const team = TEAMS[G[who]];
  const lastKickByWinner = G.shooter === who;
  // Герой: автор решающего гола или вратарь, чей сейв (или промах соперника) решил серию
  const heroIsKeeper = !lastKickByWinner;
  const used = new Set(team.takers.map((p) => p.num).concat(team.keeper.num));
  const extraNums = [2, 3, 4, 5, 6, 8, 12, 14, 15, 18, 21, 22, 23, 24].filter((n) => !used.has(n)).slice(0, 5);
  const people = [
    { name: team.keeper.name, num: team.keeper.num, gk: true },
    ...team.takers.map((p) => ({ name: p.name, num: p.num })),
    ...extraNums.map((n) => ({ name: '', num: n })),
  ];
  const heroIdx = heroIsKeeper ? 0 : 1 + team.takers.indexOf(G.taker);
  const hero = people[heroIdx];
  const others = people.filter((p) => p !== hero).sort(() => Math.random() - 0.5);
  // победители чуть левее центра — справа у ворот стоят проигравшие с тренером
  const spots = [{ x: 0, d: 7.6 }, ...PARTY_BACK.map((x) => ({ x, d: 7.6 })), ...PARTY_FRONT.map((x) => ({ x, d: 6.5 }))]
    .map((sp) => ({ x: sp.x + WIN_SHIFT, d: sp.d }));
  const members = [hero, ...others].map((p, i) => {
    const sp = spots[i];
    const side = sp.x === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(sp.x);
    const fromGoal = p.gk; // вратарь выбегает из ворот
    return {
      ...p, hero: i === 0, tx: sp.x, td: sp.d,
      x0: fromGoal ? 0 : side * (5.5 + Math.random() * 2.5),
      d0: fromGoal ? 0.5 : sp.d + (Math.random() * 2.5 - 1.5),
      delay: Math.random() * 0.4,
      runDur: fromGoal ? 1.8 : 1.1 + Math.random() * 0.6,
      ph: Math.random() * 6.28,
    };
  });
  const gkKit = { color: team.gk, color2: '#ffffff', stripes: false, shorts: '#222222', num: '#ffffff' };
  // Проигравшие: пенальтисты у ворот справа — на коленях, сидя или понурившись
  const loseTeam = TEAMS[G[who === 'you' ? 'cpu' : 'you']];
  const losers = loseTeam.takers.map((p, i) => ({
    ...p, x: 2.7 + i * 0.45, d: 2.6 + (i % 2) * 0.6, kind: i % 3, ph: Math.random() * 6.28,
  }));
  G.party = {
    t: 0, team, gkKit, members, heroName: hero.name, huddleUntil: 4.2, shown: false, who,
    loseTeam, losers, phrase: Math.floor(Math.random() * COACH_LINES.length),
  };
}

// ---------- Проигравшие и тренер ----------
const WIN_SHIFT = -1.4;
const COACH_ARRIVE = 1.6; // за сколько секунд тренер подходит к игрокам
const COACH_LINES = ['Что это было?!', 'Позор!', 'Кто так бьёт пенальти?!', 'Завтра — двойная тренировка!', 'Я в вас верил!', 'Смотрите мне в глаза!'];
const COACH_KIT = { color: '#2b2f36', color2: '#2b2f36', stripes: false, shorts: '#1e2126', num: '#2b2f36' };

function loserPose(m, T) {
  const P = { x: m.x, d: m.d, y: 0.95, rot: 0, armL: 0.15, armR: 0.15, foreL: null, foreR: null, legs: 0, kneel: false, front: true, sit: false, bow: 0, eyesClosed: false, label: null, serious: true };
  // когда тренер начинает кричать, головы опускаются ещё ниже
  const shame = clamp((T - COACH_ARRIVE) / 2, 0, 1);
  if (m.kind === 0) { // на коленях, голова опущена
    P.kneel = true; P.y = 0.5;
    P.bow = 0.3 + 0.25 * shame + 0.04 * Math.sin(T * 1.5 + m.ph);
    P.armL = P.armR = 0.25; P.foreL = P.foreR = 0.2;
  } else if (m.kind === 1) { // сидит на газоне, схватившись за голову
    P.sit = true; P.y = 0.3;
    P.armL = P.armR = 2.5; P.foreL = P.foreR = -2.0;
    P.rot = 0.05 * Math.sin(T * 1.2 + m.ph);
    P.bow = 0.15 * shame;
  } else { // стоит понурившись
    P.bow = 0.18 + 0.15 * shame;
    P.armL = P.armR = 0.1;
    P.eyesClosed = shame > 0.5;
  }
  return P;
}

function coachPose(T) {
  const P = { x: 3.7, d: 4.3, y: 0.95, rot: 0, armL: 0.3, armR: 0.3, foreL: null, foreR: null, legs: 0, kneel: false, front: true, sit: false, bow: 0, eyesClosed: false, label: null, serious: true };
  const k = clamp(T / COACH_ARRIVE, 0, 1);
  if (k < 1) { // быстрым шагом подходит
    const e = k * k * (3 - 2 * k);
    P.x = lerp(7.5, 3.7, e); P.d = lerp(5.2, 4.3, e);
    P.legs = Math.sin(T * 12);
    P.armL = 0.3 + 0.3 * Math.sin(T * 12); P.armR = 0.3 - 0.3 * Math.sin(T * 12);
    return P;
  }
  // разнос: размахивает руками, тычет пальцем, топает
  const s = T - COACH_ARRIVE;
  P.armL = 1.6 + 1.1 * Math.sin(s * 7);
  P.armR = 1.6 + 1.1 * Math.sin(s * 7 + Math.PI);
  P.foreL = P.armL + 0.7; P.foreR = P.armR + 0.7;
  P.rot = 0.07 * Math.sin(s * 7);
  P.y = 0.95 + Math.abs(Math.sin(s * 3.5)) * 0.06; // притопывает
  P.legs = 0.25 * Math.sin(s * 7);
  return P;
}

// Облачко с репликой тренера
function drawBubble(x, y, text) {
  ctx.save();
  ctx.font = 'bold 15px Segoe UI';
  const w = ctx.measureText(text).width + 22, h = 30;
  const bx = clamp(x - w / 2, 6, VW - w - 6), by = y - h - 14;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(bx, by, w, h, 12); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 8, by + h - 1); ctx.lineTo(x, y - 2); ctx.lineTo(x + 6, by + h - 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c62828';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + w / 2, by + h / 2 + 1);
  ctx.restore();
}

function drawLosers(party) {
  const T = party.t;
  const a = clamp(T * 2, 0, 1);
  ctx.save();
  ctx.globalAlpha = a;
  const items = party.losers.map((m) => ({ P: loserPose(m, T), m }));
  items.sort((x, y) => x.P.d - y.P.d);
  for (const it of items) drawFigure(it.P, party.loseTeam, it.m.num, it.m.name);
  const cp = coachPose(T);
  drawFigure(cp, COACH_KIT, '', '');
  ctx.restore();
  if (T > COACH_ARRIVE + 0.2) {
    const idx = (party.phrase + Math.floor((T - COACH_ARRIVE) / 1.6)) % COACH_LINES.length;
    const head = project(cp.x, cp.y + 0.95, cp.d);
    drawBubble(head.x, head.y, COACH_LINES[idx]);
  }
}

function partyPose(m, T, party) {
  const P = { x: m.tx, d: m.td, y: 0.95, rot: 0, armL: 0.35, armR: 0.35, foreL: null, foreR: null, legs: 0, kneel: false, front: true, sit: false, bow: 0, eyesClosed: false, label: null };
  const k = clamp((T - m.delay) / m.runDur, 0, 1);
  if (k < 1) { // бегут к партнёрам с поднятыми руками
    const e = k * k * (3 - 2 * k);
    P.x = lerp(m.x0, m.tx, e); P.d = lerp(m.d0, m.td, e);
    P.legs = Math.sin(T * 16 + m.ph);
    P.y = 0.95 + Math.abs(Math.sin(T * 16 + m.ph)) * 0.05;
    P.armL = 2.5 + 0.3 * Math.sin(T * 9 + m.ph);
    P.armR = 2.5 + 0.3 * Math.sin(T * 9 + m.ph + 2);
    P.front = m.gk; // полевые бегут со стороны — видно спину, вратарь бежит к нам
    return P;
  }
  if (T < party.huddleUntil) { // обнялись за плечи и прыгают в такт
    P.y = 0.95 + Math.abs(Math.sin(T * 6)) * 0.32;
    P.armL = P.armR = 1.72;
    P.legs = 0.2 * Math.sin(T * 12);
    return P;
  }
  const s = T - party.huddleUntil;
  if (m.hero) { // героя подбрасывают
    const f = Math.abs(Math.sin(s * 2.6));
    P.y = 1.35 + f * 0.85;
    P.rot = Math.sin(s * 2.6) * 0.15;
    P.armL = P.armR = 2.2 + 0.4 * f;
    P.legs = 0.9 * f;
    return P;
  }
  const nearHero = Math.abs(m.tx - WIN_SHIFT) < 1 && m.td > 7;
  if (nearHero) { // ловят и подбрасывают
    P.armL = P.armR = 2.95;
    P.y = 0.95 - Math.abs(Math.cos(s * 2.6)) * 0.1;
    return P;
  }
  P.y = 0.95 + Math.abs(Math.sin(s * 5 + m.ph)) * 0.35;
  P.armL = 2.6 + 0.35 * Math.sin(s * 8 + m.ph);
  P.armR = 2.6 + 0.35 * Math.sin(s * 8 + m.ph + 1.5);
  return P;
}

function drawParty() {
  const party = G.party;
  if (!party) return;
  drawLosers(party); // проигравшие дальше от камеры — рисуем их первыми
  const items = party.members.map((m) => ({ m, P: partyPose(m, party.t, party) }));
  items.sort((a, b) => a.P.d - b.P.d || (a.m.hero ? -1 : 1)); // дальние — первыми
  // герой в воздухе рисуется поверх тех, кто его подбрасывает
  const heroUp = items.find((it) => it.m.hero && it.P.y > 1.2);
  for (const it of items) if (it !== heroUp) drawFigure(it.P, it.m.gk ? party.gkKit : party.team, it.m.num, it.m.name);
  if (heroUp) drawFigure(heroUp.P, heroUp.m.gk ? party.gkKit : party.team, heroUp.m.num, heroUp.m.name);

  // баннер
  const a = clamp(party.t * 1.5, 0, 1);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 54px Segoe UI';
  ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
  const title = `🏆 ${party.team.name.toUpperCase()}`;
  ctx.strokeText(title, VW / 2, 62);
  ctx.fillStyle = '#ffd54f';
  ctx.fillText(title, VW / 2, 62);
  ctx.font = 'bold 22px Segoe UI'; ctx.lineWidth = 5;
  const sub = party.t > party.huddleUntil ? `Герой серии — ${party.heroName}!` : 'выигрывает серию пенальти!';
  ctx.strokeText(sub, VW / 2, 108);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(sub, VW / 2, 108);
  ctx.restore();
}

// Рисует игрока в позе P. team — комплект формы: color, color2, stripes, shorts, num
function drawFigure(P, team, num, name) {
  const c = { num, name: name || '' };
  const hip = project(P.x, P.y, P.d);
  const s = hip.s;
  const gnd = project(P.x, 0, P.d);
  ctx.fillStyle = `rgba(0,0,0,${0.3 / (1 + Math.max(0, P.y - 0.95) * 2)})`;
  ctx.beginPath(); ctx.ellipse(gnd.x, gnd.y, 0.4 * s, 0.09 * s, 0, 0, 7); ctx.fill();

  const SKIN = '#e0ac69', HAIR = '#2b1d16';
  ctx.save();
  ctx.translate(hip.x, hip.y);
  ctx.scale(s, s);
  ctx.rotate(P.rot);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const limb = (pts, col, w) => {
    ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  };
  const boot = (x, y) => { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(x, y + 0.03, 0.09, 0.05, 0, 0, 7); ctx.fill(); };

  // ноги
  for (const lx of [-1, 1]) {
    if (P.sit) { // по-турецки: колени в стороны, голени скрещены
      limb([[lx * 0.1, 0.08], [lx * 0.4, 0.2]], team.shorts, 0.15);
      limb([[lx * 0.4, 0.2], [-lx * 0.1, 0.27]], team.color, 0.13);
      boot(-lx * 0.14, 0.24);
    } else if (P.kneel) {
      limb([[lx * 0.1, 0.15], [lx * 0.17, 0.45]], SKIN, 0.13);
      ctx.fillStyle = team.color; ctx.beginPath(); ctx.arc(lx * 0.17, 0.46, 0.07, 0, 7); ctx.fill();
    } else {
      const sw = P.legs * lx;
      const ex = lx * 0.11 + sw * 0.07, ey = 0.92 - Math.abs(sw) * 0.2;
      const mx = lerp(lx * 0.1, ex, 0.55), my = lerp(0.15, ey, 0.55);
      limb([[lx * 0.1, 0.15], [mx, my]], SKIN, 0.13);
      limb([[mx, my], [ex, ey]], team.color, 0.14);
      boot(ex, ey);
    }
  }
  // шорты
  ctx.fillStyle = team.shorts;
  ctx.beginPath(); ctx.roundRect(-0.23, -0.06, 0.46, 0.3, 0.05); ctx.fill();

  // поклон: корпус «укорачивается» (наклон к камере), голова опускается
  const th = 0.62 * (1 - 0.6 * P.bow);
  const shY = -th + 0.1;

  const drawArms = () => {
    for (const lx of [-1, 1]) {
      const up = lx < 0 ? P.armL : P.armR;
      const fo = (lx < 0 ? P.foreL : P.foreR) ?? up;
      const sh = [lx * 0.22, shY];
      const el = [sh[0] + lx * Math.sin(up) * 0.3, sh[1] + Math.cos(up) * 0.3];
      const hd = [el[0] + lx * Math.sin(fo) * 0.32, el[1] + Math.cos(fo) * 0.32];
      limb([sh, el, hd], 'rgba(0,0,0,0.3)', 0.15); // контур, чтобы рука не сливалась с футболкой
      limb([sh, el], team.color, 0.13);
      limb([el, hd], SKIN, 0.1);
      ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(hd[0], hd[1], 0.055, 0, 7); ctx.fill();
    }
  };

  const drawShirt = () => {
    ctx.save();
    ctx.beginPath(); ctx.roundRect(-0.26, -th, 0.52, th, 0.08); ctx.clip();
    ctx.fillStyle = team.color; ctx.fillRect(-0.3, -0.7, 0.6, 0.8);
    if (team.stripes) {
      ctx.fillStyle = team.color2;
      for (let x = -0.26; x < 0.3; x += 0.2) ctx.fillRect(x + 0.1, -0.7, 0.1, 0.8);
    } else {
      ctx.fillStyle = team.color2; ctx.fillRect(-0.3, -th - 0.02, 0.6, 0.05); // воротник
    }
    ctx.restore();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (P.front) { // спереди — маленький номер на груди
      ctx.font = 'bold 0.12px Segoe UI'; ctx.fillStyle = team.num;
      ctx.fillText(String(c.num), 0.12, -th + 0.18);
    } else { // со спины — фамилия и большой номер
      ctx.font = 'bold 0.075px Segoe UI'; ctx.fillStyle = team.num;
      ctx.fillText(c.name.toUpperCase(), 0, -th + 0.12, 0.46);
      ctx.font = 'bold 0.28px Segoe UI';
      ctx.lineWidth = 0.03; ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.strokeText(String(c.num), 0, -th + 0.34);
      ctx.fillText(String(c.num), 0, -th + 0.34);
    }
  };

  const drawHead = () => {
    const headY = lerp(-th - 0.14, -0.12, P.bow);
    ctx.fillStyle = SKIN;
    ctx.beginPath(); ctx.arc(0, headY, 0.13, 0, 7); ctx.fill();
    ctx.fillStyle = HAIR;
    if (!P.front || P.bow > 0.6) { // затылок или макушка при поклоне
      ctx.beginPath(); ctx.arc(0, headY - 0.02, 0.13, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
      return;
    }
    ctx.beginPath(); ctx.arc(0, headY - 0.03, 0.13, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    ctx.fillStyle = '#1a1a1a'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 0.014;
    for (const ex of [-0.045, 0.045]) {
      if (P.eyesClosed) { ctx.beginPath(); ctx.moveTo(ex - 0.022, headY + 0.005); ctx.lineTo(ex + 0.022, headY + 0.005); ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(ex, headY, 0.016, 0, 7); ctx.fill(); }
    }
    ctx.beginPath(); // рот
    if (P.eyesClosed || P.serious) { ctx.moveTo(-0.03, headY + 0.06); ctx.lineTo(0.03, headY + 0.06); ctx.stroke(); }
    else { ctx.arc(0, headY + 0.05, 0.035, 0, Math.PI); ctx.fill(); }
  };

  if (P.front) { drawShirt(); drawHead(); drawArms(); } // спереди руки поверх корпуса
  else { drawArms(); drawShirt(); drawHead(); }
  ctx.restore();

  // надпись над игроком («304», 🥶)
  if (P.label) {
    const lp = project(P.x, P.y + 1.15, P.d);
    ctx.save();
    ctx.font = `bold ${Math.round(0.28 * lp.s)}px Segoe UI`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.strokeText(P.label, lp.x, lp.y);
    ctx.fillStyle = '#ffd54f';
    ctx.fillText(P.label, lp.x, lp.y);
    ctx.restore();
  }
}

function updateParticles(dt) {
  if (G.rain > 0) {
    G.rain -= dt;
    for (let i = 0; i < 6; i++) {
      G.particles.push({
        x: Math.random() * VW, y: -10, vx: (Math.random() - 0.5) * 60, vy: 80 + Math.random() * 120,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 10,
        w: 7 + Math.random() * 6, h: 4 + Math.random() * 4,
        color: G.rainColors[i % G.rainColors.length], life: 6,
      });
    }
  }
  for (const q of G.particles) {
    q.vy += 520 * dt;
    q.vx *= Math.exp(-1.6 * dt);
    q.vy *= Math.exp(-1.6 * dt);
    q.x += q.vx * dt; q.y += q.vy * dt;
    q.rot += q.vr * dt;
    q.life -= dt;
  }
  G.particles = G.particles.filter((q) => q.life > 0 && q.y < VH + 20);
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt);
  if (G.ripple) G.ripple.t += dt;
  if (G.celeb) G.celeb.t += dt;
  if (G.party) {
    G.party.t += dt;
    if (!G.party.shown && G.party.t > 3) {
      G.party.shown = true;
      $('over').classList.remove('hidden');
    }
  }
}

function drawParticles() {
  for (const q of G.particles) {
    ctx.save();
    ctx.globalAlpha = clamp(q.life, 0, 1);
    ctx.translate(q.x, q.y);
    ctx.rotate(q.rot);
    ctx.scale(1, Math.abs(Math.cos(q.rot * 1.3)) + 0.2); // «переворачивание» конфетти
    ctx.fillStyle = q.color;
    ctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h);
    ctx.restore();
  }
}

function winner() {
  const a = G.kicks.you, b = G.kicks.cpu;
  const ga = a.filter(Boolean).length, gb = b.filter(Boolean).length;
  if (a.length <= 5 && b.length <= 5) {
    if (ga + (5 - a.length) < gb) return 'cpu';
    if (gb + (5 - b.length) < ga) return 'you';
    // Матч чемпионата: после 5 ударов при равенстве — ничья, без серии до первого промаха
    if (G.allowDraw && a.length === 5 && b.length === 5 && ga === gb) return 'draw';
    return null;
  }
  if (a.length === b.length && ga !== gb) return ga > gb ? 'you' : 'cpu';
  return null;
}

function nextTurn() {
  const w = winner();
  if (w === 'draw') {
    G.phase = 'over';
    renderBoard();
    const ga = G.kicks.you.filter(Boolean).length, gb = G.kicks.cpu.filter(Boolean).length;
    $('over-title').textContent = '🤝 Ничья';
    $('over-score').textContent = `${TEAMS[G.you].name} ${ga} : ${gb} ${TEAMS[G.cpu].name} · по 1 очку`;
    G.celeb = null;
    G.msg = { text: 'НИЧЬЯ', color: '#ffd54f', sub: 'После пяти ударов счёт равный — по очку каждой команде' };
    G.msgT = 0;
    $('over').classList.remove('hidden');
    if (G.onFinish) { const f = G.onFinish; G.onFinish = null; f(ga, gb); }
    setStatus('Ничья: каждая команда получает 1 очко.');
    return;
  }
  if (w) {
    G.phase = 'over';
    renderBoard();
    const ga = G.kicks.you.filter(Boolean).length, gb = G.kicks.cpu.filter(Boolean).length;
    $('over-title').textContent = w === 'you' ? '🏆 Победа!' : 'Поражение';
    if (w === 'you') {
      const t = TEAMS[G.you];
      G.rain = 6;
      G.rainColors = [t.color, t.color2, '#ffd54f', '#ffffff'];
      burst(VW / 2, VH * 0.6, G.rainColors, 160, 1.3);
    }
    $('over-score').textContent = `${TEAMS[G.you].name} ${ga} : ${gb} ${TEAMS[G.cpu].name}`;
    // Победившая команда выбегает праздновать; окно итога появится чуть позже, внизу
    G.celeb = null;
    G.msg = null;
    startParty(w);
    if (G.onFinish) { const f = G.onFinish; G.onFinish = null; f(ga, gb); } // результат — в сезон
    setStatus(w === 'you' ? 'Победа! Команда празднует.' : `${TEAMS[G.cpu].name} празднует победу.`);
    return;
  }
  G.shooter = G.shooter === 'you' ? 'cpu' : 'you';
  newKick();
}

// ---------- Ввод ----------
function canvasPoint(e) {
  const r = cv.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * VW, y: ((e.clientY - r.top) / r.height) * VH };
}
function updateAim(e) {
  const p = screenToGoal(...Object.values(canvasPoint(e)));
  G.aim = { x: clamp(p.x, -5, 5), y: clamp(p.y, 0.11, 3.6) };
}
// Прицел следует за мышью или пальцем — и до нажатия, и пока набирается сила.
// На планшете нет «наведения», поэтому прицел ведут пальцем, удерживая его на экране.
cv.addEventListener('pointermove', (e) => {
  if (G.phase === 'aim' || G.phase === 'charge') updateAim(e);
});
cv.addEventListener('pointerdown', (e) => {
  if (G.phase === 'intro') { introTap(canvasPoint(e)); return; }
  if (G.phase === 'aim') {
    updateAim(e);
    G.phase = 'charge';
    G.power = 0; G.powerDir = 1;
    updateCurlUI();
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* без захвата — удар всё равно сработает по отпусканию */ }
  } else if (G.phase === 'runup' && G.choice == null) {
    // вратарь прыгает ровно в точку клика (в пределах ворот и чуть за ними)
    const p = screenToGoal(...Object.values(canvasPoint(e)));
    pickDive({ x: clamp(p.x, -GW - 0.3, GW + 0.3), y: clamp(p.y, 0.15, GH + 0.2) });
  }
});
cv.addEventListener('pointerup', () => {
  if (G.phase === 'charge') (G.mode === 'fk' ? fkShoot() : shootYou());
});
// iPad: если система прервала касание (жест, уведомление) — не зависаем в наборе силы
cv.addEventListener('pointercancel', () => {
  if (G.phase === 'charge') { G.phase = 'aim'; G.power = 0; updateCurlUI(); }
});
// без контекстного меню и лупы при долгом нажатии
cv.addEventListener('contextmenu', (e) => e.preventDefault());
// iPad: пока палец на поле, страница не прокручивается и не масштабируется
// (обработка самого касания — в pointer-событиях выше)
for (const type of ['touchstart', 'touchmove', 'touchend']) {
  cv.addEventListener(type, (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
}
const IS_TOUCH = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

// ---------- Режим «на весь экран» ----------
// Настоящий полноэкранный режим браузера (компьютер, iPad). Где его нет (iPhone) или он запрещён —
// игра просто растягивается на всё окно браузера через CSS-класс body.fs.
let fsReal = false;
const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
async function fsOn() {
  document.body.classList.add('fs');
  fsUpdateBtn(); // сразу, не дожидаясь ответа браузера на запрос полноэкранного режима
  const el = document.documentElement;
  try {
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  } catch (e) { /* остаёмся в режиме «на всё окно» */ }
  fsUpdateBtn();
}
function fsOff() {
  if (!document.body.classList.contains('fs')) return;
  document.body.classList.remove('fs');
  try {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
  } catch (e) { /* ничего */ }
  fsUpdateBtn();
}
function fsUpdateBtn() {
  const on = document.body.classList.contains('fs');
  const b = $('fs-btn');
  b.title = on ? 'Свернуть (Esc)' : 'На весь экран (F)';
  b.setAttribute('aria-label', on ? 'Свернуть' : 'На весь экран');
}
function fsChanged() {
  // вышли из настоящего полноэкранного режима (Esc, жест) — возвращаем обычную раскладку
  if (fsElement()) fsReal = true;
  else if (fsReal) { fsReal = false; document.body.classList.remove('fs'); fsUpdateBtn(); }
}
document.addEventListener('fullscreenchange', fsChanged);
document.addEventListener('webkitfullscreenchange', fsChanged);
$('fs-btn').addEventListener('click', () => (document.body.classList.contains('fs') ? fsOff() : fsOn()));
window.addEventListener('keydown', (e) => {
  if ($('game-view').classList.contains('hidden') || e.target.tagName === 'INPUT') return;
  if (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') { document.body.classList.contains('fs') ? fsOff() : fsOn(); }
  else if (e.key === 'Escape') fsOff(); // для режима «на всё окно», где браузер сам Esc не ловит
});
window.addEventListener('keydown', (e) => {
  if (G.phase === 'aim' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    setCurl(G.curl + (e.key === 'ArrowLeft' ? -0.1 : 0.1));
    e.preventDefault();
    return;
  }
  const k = KEYS[e.key.toLowerCase()] ?? KEYS[{ 'й': 'q', 'ц': 'w', 'у': 'e', 'ф': 'a', 'ы': 's', 'в': 'd' }[e.key.toLowerCase()]];
  if (G.phase === 'runup' && G.choice == null && k != null) pickDive({ x: ZONES[k].x, y: ZONES[k].y });
});

// ---------- Регулятор закрутки (настраивается до удара) ----------
function setCurl(v) {
  G.curl = clamp(Math.round(v * 20) / 20, -1, 1);
  updateCurlUI();
}
function updateCurlUI() {
  $('curl').value = Math.round(G.curl * 100);
  const pct = Math.round(Math.abs(G.curl) * 100);
  $('curl-val').textContent = pct === 0 ? 'без закрутки' : G.curl < 0 ? `⟲ влево ${pct}%` : `вправо ⟳ ${pct}%`;
  // крутить можно только когда вы целитесь
  $('curl-bar').classList.toggle('off', G.phase !== 'aim');
}
$('curl').addEventListener('input', (e) => setCurl(+e.target.value / 100));
$('curl-left').onclick = () => setCurl(G.curl - 0.2);
$('curl-right').onclick = () => setCurl(G.curl + 0.2);
$('curl-reset').onclick = () => setCurl(0);

// Игрок выбрал, куда прыгнет вратарь: запоминаем точку и запускаем эффекты
function pickDive(pt) {
  G.choice = pt;
  G.choiceT = 0;
}

// ---------- Обновление ----------
const RUNUP = 3.0; // секунды разбега соперника — время на выбор угла
function update(dt) {
  G.time += dt;
  if (G.phase === 'intro') { updateIntro(dt); return; }
  if (G.mode === 'fk') { fkUpdate(dt); return; }
  if (G.msg) G.msgT += dt;
  updateParticles(dt);

  if (G.phase === 'charge') {
    G.power += G.powerDir * dt * 0.95;
    if (G.power >= 1) { G.power = 1; G.powerDir = -1; }
    if (G.power <= 0) { G.power = 0; G.powerDir = 1; }
  }
  if (G.phase === 'runup') {
    G.runT += dt;
    if (G.runT >= RUNUP) shootCpu();
  }

  const k = G.keeper;
  if (k.plan) {
    k.t += dt;
    // Пыль и комья газона при падении
    const p = k.plan;
    if (p.mode === 'dive' && !k.landed && k.t >= p.delay + SET + p.tLand) {
      k.landed = true;
      const pose = keeperPose(k, k.t);
      const gp = project(pose.x, 0, 0.3);
      const n = p.landY > 0.5 ? 8 : 22;
      for (let i = 0; i < n; i++) {
        G.particles.push({
          x: gp.x + (Math.random() - 0.5) * 80, y: gp.y,
          vx: (Math.random() - 0.5) * 160 + p.vx * 20, vy: -60 - Math.random() * 140,
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 8,
          w: 3 + Math.random() * 4, h: 2 + Math.random() * 3,
          color: ['#7cb342', '#558b2f', '#8d6e63'][i % 3], life: 0.5 + Math.random() * 0.4,
        });
      }
      G.shake = Math.max(G.shake, 0.12);
    }
  } else if (G.phase === 'runup' && G.choice) {
    // выбрал угол — вратарь смещается и наклоняется в эту сторону, готовясь к прыжку
    const tx = clamp(G.choice.x * 0.08, -0.3, 0.3);
    k.x += (tx - k.x) * Math.min(1, dt * 6);
  } else if (G.phase === 'aim' || G.phase === 'charge' || G.phase === 'runup') {
    k.x = Math.sin(G.time * 2.2) * 0.25; // покачивается на линии
  }
  if (G.choice) G.choiceT = (G.choiceT || 0) + dt;

  const b = G.ball;
  if (G.phase === 'flight') {
    b.u += dt / b.dur;
    const u = Math.min(1, b.u);
    b.x = lerp(b.from.x, b.target.x, u) + curlOffset(b.curl, u);
    b.d = lerp(b.from.d, 0, u);
    b.y = lerp(b.from.y, b.target.y, u) + Math.sin(Math.PI * u) * b.arc;
    if (b.u >= 1) finishFlight();
  } else if (G.phase === 'after') {
    G.afterT += dt;
    if (b.phys) {
      b.x += b.vx * dt; b.y += b.vy * dt; b.d += b.vd * dt;
      b.vy -= 9.8 * dt;
    if (b.attach) { // мяч в руках вратаря
      const pose = keeperPose(k, k.t);
      const l = handLocal(-1, pose.arms), r = handLocal(1, pose.arms);
      const h = toWorld(pose, (l.x + r.x) / 2, (l.y + r.y) / 2);
      b.x = h.x; b.y = Math.max(0.11, h.y); b.d = 0.4;
      b.vx = b.vy = b.vd = 0;
    }
      if (b.y < 0.11) { b.y = 0.11; b.vy = -b.vy * 0.45; b.vx *= 0.8; b.vd *= 0.8; }
      if (b.result === 'goal' && b.d < -1.7) { b.d = -1.7; b.vd = 0; b.vx *= 0.5; }
      // боковая сетка: останавливает только мяч, летящий наружу (отскок от штанги внутрь не трогаем)
      if (b.result === 'goal' && Math.abs(b.x) > GW - 0.2 && Math.sign(b.vx) === Math.sign(b.x)) { b.x = Math.sign(b.x) * (GW - 0.2); b.vx = 0; }
      if (b.d < -8) b.vis = false;
    }
    if (G.afterT > (b.result === 'goal' ? 3.8 : 1.9)) nextTurn();
  }
}

// ---------- Отрисовка ----------
function poly(pts, fill) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
function line3(a, b, w, col) {
  const p = project(...a), q = project(...b);
  ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
  ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke();
}

function drawBackground() {
  // Трибуны
  const g = ctx.createLinearGradient(0, 0, 0, HORIZON);
  g.addColorStop(0, '#0a0f18'); g.addColorStop(1, '#1d2735');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VW, HORIZON);
  for (const c of crowd) {
    const jump = (G.msg && G.msgT < 1.5) || G.party ?Math.abs(Math.sin(G.time * 9 + c.p)) * 3 : 0;
    ctx.fillStyle = c.c;
    ctx.globalAlpha = 0.25 + (c.y / 210) * 0.45;
    ctx.fillRect(c.x, c.y - jump, 3, 3);
  }
  ctx.globalAlpha = 1;
  // Рекламный борт
  ctx.fillStyle = '#123'; ctx.fillRect(0, HORIZON - 16, VW, 16);
  ctx.fillStyle = '#4fc3f7'; ctx.font = 'bold 11px Segoe UI'; ctx.textAlign = 'center';
  for (let x = 60; x < VW; x += 220) ctx.fillText('СЕРИЯ ПЕНАЛЬТИ • ФИНАЛ', x, HORIZON - 4);

  // Газон полосами
  const bands = [-40, -20, -12, -7, -3.5, 0, 2.75, 5.5, 8.25, 11, 13, 15.6, 18.5, 21.5, 24.5, 27.5, 31, 36, 60]; // дальние полосы — для штрафных
  for (let i = 0; i < bands.length - 1; i++) {
    const a = bands[i], b = bands[i + 1];
    const p1 = project(-80, 0, a), p2 = project(80, 0, a), p3 = project(80, 0, b), p4 = project(-80, 0, b);
    poly([p1, p2, p3, p4], i % 2 ? '#2e7d32' : '#388e3c');
  }
  // Разметка
  const W2 = 'rgba(255,255,255,0.85)';
  line3([-60, 0, 0], [60, 0, 0], 2, W2);
  line3([-9.16, 0, 0], [-9.16, 0, 5.5], 2, W2);
  line3([9.16, 0, 0], [9.16, 0, 5.5], 2, W2);
  line3([-9.16, 0, 5.5], [9.16, 0, 5.5], 2, W2);
  line3([-20.16, 0, 0], [-20.16, 0, 15.5], 3, W2);
  line3([20.16, 0, 0], [20.16, 0, 15.5], 3, W2);
  if (CAM_D > 18) { // на штрафных камера дальше — видна передняя линия штрафной и дуга
    line3([-20.16, 0, 15.5], [-20.16, 0, 16.5], 3, W2);
    line3([20.16, 0, 15.5], [20.16, 0, 16.5], 3, W2);
    line3([-20.16, 0, 16.5], [20.16, 0, 16.5], 3, W2);
    ctx.strokeStyle = W2; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const a = -0.93 + (i / 24) * 1.86, q = project(Math.sin(a) * 9.15, 0, 11 + Math.cos(a) * 9.15);
      i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
    }
    ctx.stroke();
  }
  const spot = project(0, 0, 11);
  ctx.fillStyle = W2;
  ctx.beginPath(); ctx.ellipse(spot.x, spot.y, 9, 3, 0, 0, 7); ctx.fill();
}

function drawNet() {
  const back = -2, topBack = 1.9;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  poly([project(-GW, GH, 0), project(GW, GH, 0), project(GW, topBack, back), project(-GW, topBack, back)], 'rgba(255,255,255,0.06)');
  poly([project(-GW, 0, back), project(GW, 0, back), project(GW, topBack, back), project(-GW, topBack, back)], 'rgba(255,255,255,0.08)');
  const nc = 'rgba(255,255,255,0.28)';
  for (let x = -GW; x <= GW + 0.01; x += 0.3) {
    line3([x, 0, back], [x, topBack, back], 1, nc);
    line3([x, topBack, back], [x, GH, 0], 1, nc);
  }
  for (let y = 0; y <= topBack + 0.01; y += 0.3) line3([-GW, y, back], [GW, y, back], 1, nc);
  // Сетка «вздрагивает» от гола: расходящиеся круги в точке попадания
  const rp = G.ripple;
  if (rp && rp.t < 1.2) {
    const c = project(rp.x, Math.min(rp.y, topBack), back * 0.8);
    for (let i = 0; i < 3; i++) {
      const r = (rp.t * 1.6 - i * 0.2) * c.s;
      if (r <= 0) continue;
      ctx.strokeStyle = `rgba(255,255,255,${0.6 * (1 - rp.t / 1.2)})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(c.x, c.y, r, r * 0.8, 0, 0, 7); ctx.stroke();
    }
  }
  for (const s of [-1, 1]) {
    for (let t = 0; t <= 1.001; t += 0.15) {
      line3([s * GW, 0, back * t], [s * GW, lerp(GH, topBack, t), back * t], 1, nc);
    }
    for (let y = 0; y <= GH; y += 0.3) line3([s * GW, y, 0], [s * GW, Math.min(y, topBack), back], 1, nc);
  }
}

function drawFrame() {
  const s = project(0, 0, 0).s;
  const w = POST * s;
  const l = project(-GW, 0, 0), r = project(GW, 0, 0), t = project(0, GH, 0);
  ctx.fillStyle = '#f5f5f5';
  ctx.shadowColor = '#0006'; ctx.shadowBlur = 6;
  ctx.fillRect(l.x - w, t.y - w, w, l.y - t.y + w);
  ctx.fillRect(r.x, t.y - w, w, r.y - t.y + w);
  ctx.fillRect(l.x - w, t.y - w, r.x - l.x + 2 * w, w);
  ctx.shadowBlur = 0;
}

function drawKeeper(team) {
  const k = G.keeper;
  const pose = keeperPose(k, k.t);
  const p = project(pose.x, pose.y, 0.3);
  const s = p.s;
  // тень: шире, когда вратарь лежит, бледнее и меньше, когда он в воздухе
  const sh = project(pose.x, 0, 0.3);
  const lift = Math.max(0, pose.y - 0.95 * Math.cos(pose.a));
  const lying = Math.abs(Math.sin(pose.a));
  ctx.fillStyle = `rgba(0,0,0,${0.32 / (1 + lift * 1.5)})`;
  ctx.beginPath(); ctx.ellipse(sh.x, sh.y, (0.45 + lying * 0.6) * s / (1 + lift * 0.4), 0.1 * s, 0, 0, 7); ctx.fill();

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(s, s);
  ctx.rotate(pose.a);
  ctx.lineCap = 'round';
  // ноги
  ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 0.14;
  const L = legX(pose);
  ctx.beginPath(); ctx.moveTo(-0.1, 0.1); ctx.lineTo(-L, 0.92); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0.1, 0.1); ctx.lineTo(L, 0.92); ctx.stroke();
  ctx.fillStyle = '#0a0a0a'; // бутсы
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * L * 1.05, 0.95, 0.1, 0.06, 0, 0, 7); ctx.fill(); }
  // шорты
  ctx.fillStyle = '#111'; ctx.fillRect(-0.21, -0.05, 0.42, 0.3);
  // руки (та же геометрия, по которой считается сейв)
  const hand = (sx) => {
    const h = handLocal(sx, pose.arms);
    ctx.strokeStyle = team.gk; ctx.lineWidth = 0.11;
    ctx.beginPath(); ctx.moveTo(sx * 0.2, -0.52); ctx.lineTo(h.x, h.y); ctx.stroke();
    ctx.fillStyle = '#eeeeee';
    ctx.beginPath(); ctx.arc(h.x, h.y, 0.085, 0, 7); ctx.fill();
  };
  hand(-1); hand(1);
  // торс
  ctx.fillStyle = team.gk;
  ctx.beginPath(); ctx.roundRect(-0.25, -0.62, 0.5, 0.62, 0.08); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.font = 'bold 0.28px Segoe UI'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(team.keeper.num), 0, -0.32);
  // голова
  ctx.fillStyle = '#e0ac69';
  ctx.beginPath(); ctx.arc(0, -0.77, 0.13, 0, 7); ctx.fill();
  ctx.fillStyle = '#3e2723';
  ctx.beginPath(); ctx.arc(0, -0.81, 0.13, Math.PI, 0); ctx.fill();
  ctx.restore();
}

function drawBall() {
  const b = G.ball;
  if (!b || !b.vis) return;
  const p = project(b.x, b.y, b.d);
  const g = project(b.x, 0, b.d);
  const r = 0.11 * p.s;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(g.x, g.y, r * 1.1, r * 0.35, 0, 0, 7); ctx.fill();
  const gr = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#bdbdbd');
  ctx.fillStyle = gr;
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill();
  // пятна
  ctx.fillStyle = '#263238';
  // Закрученный мяч вращается заметно быстрее
  const rot = (b.u || 0) * (14 + (b.curl || 0) * 40);
  for (let i = 0; i < 3; i++) {
    const a = rot + i * 2.1;
    ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * r * 0.5, p.y + Math.sin(a) * r * 0.5, r * 0.22, 0, 7); ctx.fill();
  }
}

function drawAim() {
  if (G.phase !== 'aim' && G.phase !== 'charge') return;
  const p = project(G.aim.x, G.aim.y, 0);
  const col = G.phase === 'charge' ? `hsl(${120 - G.power * 120},90%,55%)` : '#ffffff';

  // Линия полёта мяча: учитывает закрутку с регулятора (без учёта неточности удара)
  ctx.save();
  const arc = 0.15 + (1 - G.power) * 0.5;
  const at = G.mode === 'fk' ? (u) => fkPoint(u, G.aim, G.power, G.curl)
    : (u) => ({ x: lerp(0, G.aim.x, u) + curlOffset(G.curl, u), y: lerp(0.11, G.aim.y, u) + Math.sin(Math.PI * u) * arc, d: lerp(11, 0, u) });
  const path = () => {
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const w = at(i / 40);
      const q = project(w.x, w.y, w.d);
      i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
    }
  };
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 6; // подложка для контраста
  path(); ctx.stroke();
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = -G.time * 25; // пунктир «бежит» к воротам
  ctx.strokeStyle = Math.abs(G.curl) > 0.02 ? '#4fc3f7' : '#ffffff';
  ctx.lineWidth = 3;
  path(); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, 7); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(p.x - 22, p.y); ctx.lineTo(p.x - 7, p.y);
  ctx.moveTo(p.x + 7, p.y); ctx.lineTo(p.x + 22, p.y);
  ctx.moveTo(p.x, p.y - 22); ctx.lineTo(p.x, p.y - 7);
  ctx.moveTo(p.x, p.y + 7); ctx.lineTo(p.x, p.y + 22);
  ctx.stroke();

  // Шкала силы
  const x = VW - 50, y = 360, h = 200, w = 22;
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  const gr = ctx.createLinearGradient(0, y + h, 0, y);
  gr.addColorStop(0, '#43a047'); gr.addColorStop(0.7, '#fdd835'); gr.addColorStop(1, '#e53935');
  ctx.fillStyle = gr;
  const ph = h * G.power;
  ctx.fillRect(x, y + h - ph, w, ph);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
  ctx.beginPath(); ctx.moveTo(x - 4, y + h * 0.15); ctx.lineTo(x + w + 4, y + h * 0.15); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = '12px Segoe UI'; ctx.textAlign = 'center';
  ctx.fillText('СИЛА', x + w / 2, y + h + 20);
}

// Место, куда нажал игрок, мягко светится — видно, что клик засчитан
function drawChoice() {
  if (!G.choice) return;
  let alpha = 1;
  if (G.phase === 'flight') alpha = clamp(1 - G.ball.u * 2.5, 0, 1); // после удара свечение гаснет
  else if (G.phase !== 'runup') return;
  if (alpha <= 0) return;
  const t = G.choiceT || 0;
  const p = project(G.choice.x, G.choice.y, 0.3);
  // в момент клика чуть ярче и шире, потом ровное слабое свечение с лёгким «дыханием»
  const flash = t < 0.35 ? 1 - t / 0.35 : 0;
  const glow = (0.6 + 0.1 * Math.sin(t * 5) + 0.4 * flash) * alpha;
  const R = 42 + 18 * flash;
  const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
  g.addColorStop(0, `rgba(255,244,190,${glow})`);
  g.addColorStop(0.5, `rgba(255,210,100,${glow * 0.6})`);
  g.addColorStop(1, 'rgba(255,220,120,0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 7); ctx.fill();
  ctx.restore();
}

// Пока соперник разбегается: ворота пустые, внизу только полоска разбега
function drawZones() {
  if (G.phase !== 'runup') return;
  ctx.textAlign = 'center';
  // таймер разбега
  const left = 1 - G.runT / RUNUP;
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(330, 560, 300, 14);
  ctx.fillStyle = left > 0.35 ? '#4fc3f7' : '#ef5350';
  ctx.fillRect(330, 560, 300 * left, 14);
  ctx.fillStyle = '#fff'; ctx.font = '13px Segoe UI';
  ctx.fillText(G.choice == null ? 'Соперник разбегается — кликните, куда прыгнуть!' : 'Прыжок выбран', 480, 550);
}

// Табличка «кто бьёт / кто в воротах»
function drawNames() {
  if (!G.taker || G.phase === 'over' || G.celeb) return;
  const st = TEAMS[G[G.shooter]], kt = TEAMS[G[G.shooter === 'you' ? 'cpu' : 'you']];
  const rows = [
    { icon: '⚽', text: `${G.taker.name}  №${G.taker.num}`, col: st.color, col2: st.color2 },
    { icon: '🧤', text: `${G.gkPlayer.name}  №${G.gkPlayer.num}`, col: kt.gk, col2: '#ffffff' },
  ];
  ctx.save();
  ctx.font = 'bold 15px Segoe UI';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const w = Math.max(...rows.map((r) => ctx.measureText(r.text).width)) + 58;
  rows.forEach((r, i) => {
    const y = 14 + i * 32;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath(); ctx.roundRect(12, y, w, 26, 6); ctx.fill();
    ctx.fillStyle = r.col; ctx.fillRect(12, y, 6, 26);
    ctx.fillStyle = '#fff';
    ctx.fillText(r.icon, 24, y + 13);
    ctx.fillText(r.text, 48, y + 14);
  });
  ctx.restore();
}

function drawMessage() {
  if (!G.msg) return;
  const t = G.msgT;
  const sc = 1 + Math.max(0, 0.4 - t) * 1.5;
  ctx.save();
  ctx.globalAlpha = clamp(2.2 - t, 0, 1);
  ctx.translate(VW / 2, 85);
  ctx.scale(sc, sc);
  ctx.font = 'bold 72px Segoe UI';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
  ctx.strokeText(G.msg.text, 0, 0);
  ctx.fillStyle = G.msg.color;
  ctx.fillText(G.msg.text, 0, 0);
  if (G.msg.sub) {
    ctx.font = 'bold 22px Segoe UI';
    ctx.lineWidth = 5;
    ctx.strokeText(G.msg.sub, 0, 58);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(G.msg.sub, 0, 58);
  }
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, VW, VH);
  if (G.phase === 'intro') { drawIntro(); return; }
  if (G.mode === 'fk' && G.phase !== 'idle') { fkDraw(); return; }
  ctx.save();
  if (G.shake > 0) {
    const m = G.shake * 14;
    ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
  }
  drawBackground();
  drawNet();
  if (G.phase !== 'idle') {
    const keeperTeam = TEAMS[G.shooter === 'you' ? G.cpu : G.you];
    const behind = G.ball && G.ball.d < -0.05;
    // Вратарь победителей убегает из ворот праздновать вместе со всеми
    const keeperLeft = G.party && G.party.team === keeperTeam;
    if (keeperLeft && G.ball && G.ball.attach) G.ball.vis = false;
    if (behind) drawBall();
    if (!keeperLeft) drawKeeper(keeperTeam);
    drawFrame();
    if (!behind) drawBall();
    drawCelebrator();
    drawParty();
    drawZones();
    drawChoice();
    drawAim();
    drawNames();
  }
  ctx.restore();
  drawMessage();
  drawParticles();
}

// ---------- Цикл ----------
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (G.phase !== 'idle') update(dt);
  draw();
  requestAnimationFrame(loop);
}

setupCanvas();
renderTeamLists();
requestAnimationFrame(loop);
