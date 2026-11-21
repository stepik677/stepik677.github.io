'use strict';
// Перед матчем: стартовые составы обеих команд с позициями.
// Подключается после game.js и пользуется его функциями (project, drawFigure, burst, TEAMS, G…).

// ---------- Стартовые составы ----------
// Ряды через «/»: вратарь / защитники / полузащитники (может быть два ряда) / нападающие.
// ВНИМАНИЕ: составы по состоянию знаний автора; трансферы и номера могли измениться — правьте здесь.
const LINEUPS = {
  'Реал Мадрид': 'Куртуа 1 / Александер-Арнольд 12, Хёйсен 24, Рюдигер 22, Каррерас 18 / Вальверде 8, Чуамени 14, Беллингем 5 / Арда Гюлер 15, Мбаппе 10, Винисиус 7',
  'Барселона': 'Жоан Гарсия 13 / Кунде 23, Кубарси 5, Араухо 4, Бальде 3 / Педри 8, Де Йонг 21 / Ламин Ямаль 10, Ферран Торрес 7, Рафинья 11 / Левандовски 9',
  'Атлетико Мадрид': 'Облак 13 / Льоренте 14, Ле Норман 24, Хименес 2, Ганцко 17 / Джулиано Симеоне 20, Коке 6, Барриос 8 / Гризманн 7 / Хулиан Альварес 19, Сёрлот 9',
  'Манчестер Сити': 'Доннарумма 25 / Нунеш 27, Диаш 3, Гвардиол 24, О\'Райли 33 / Родри 16, Бернарду Силва 20 / Фоден 47, Шерки 10, Доку 11 / Холанд 9',
  'Ливерпуль': 'Алиссон 1 / Фримпонг 30, Конате 5, Ван Дейк 4, Керкез 6 / Гравенберх 38, Мак Аллистер 10 / Салах 11, Собослаи 8, Вирц 7 / Исак 9',
  'Арсенал': 'Райя 1 / Тимбер 12, Салиба 2, Габриэл 6, Калафьори 33 / Райс 41, Субименди 36, Эдегор 8 / Сака 7, Дьёкереш 14, Мартинелли 11',
  'Манчестер Юнайтед': 'Ламменс 31 / Йоро 15, Де Лихт 4, Шоу 23 / Мазрауи 3, Каземиро 18, Бруну Фернандеш 8, Дорги 13 / Мбемо 19, Кунья 10 / Шешко 30',
  'Челси': 'Роберт Санчес 1 / Джеймс 24, Фофана 29, Колуилл 6, Кукурелья 3 / Кайседо 25, Энсо Фернандес 8 / Педро Нету 7, Палмер 10, Гарначо 49 / Жоао Педро 20',
  'Бавария': 'Нойер 1 / Лаймер 27, Упамекано 2, Та 4, Станишич 44 / Киммих 6, Горецка 8 / Олисе 17, Мусиала 10, Луис Диас 14 / Кейн 9',
  'Боруссия Дортмунд': 'Кобель 1 / Рюэрсон 26, Антон 3, Шлоттербек 4, Свенссон 24 / Забитцер 20, Нмеча 8 / Байер 14, Брандт 10, Адейеми 27 / Гирасси 9',
  'ПСЖ': 'Шевалье 30 / Хакими 2, Маркиньос 5, Пачо 51, Нуну Мендеш 25 / Витинья 17, Жоау Невеш 87, Фабиан Руис 8 / Дуэ 14, Дембеле 10, Кварацхелия 7',
  'Ювентус': 'Ди Грегорио 29 / Калулу 15, Бремер 3, Келли 6, Камбьясо 27 / Локателли 5, Тюрам 19, Купмейнерс 8 / Консейсау 7, Йылдыз 10 / Влахович 9',
  'Милан': 'Меньян 16 / Томори 23, Габбия 46, Павлович 31 / Салемакерс 56, Модрич 14, Фофана 19, Рабьо 12, Эступиньян 2 / Пулишич 11, Леау 10',
  'Интер': 'Зоммер 1 / Павар 28, Ачерби 15, Бастони 95 / Дамфрис 2, Барелла 23, Чалханоглу 20, Мхитарян 22, Димарко 32 / Тюрам 9, Лаутаро Мартинес 10',
  'Зенит': 'Латышонок 1 / Караваев 15, Нино 4, Алип 28, Дуглас Сантос 3 / Барриос 5, Венделл 8 / Мостовой 17, Глушенков 10, Луис Энрике 11 / Соболев 7',
  'Спартак Москва': 'Максименко 98 / Денисов 92, Бабич 3, Джику 6, Гапонов 33 / Зобнин 47, Пруцев 8 / Солари 14, Барко 5, Маркиньос 10 / Угальде 9',
  'ЦСКА': 'Акинфеев 35 / Гайич 22, Дивеев 78, Лукин 4, Мойзес 66 / Кисляк 31, Обляков 10, Кругловой 15 / Глебов 7, Мусаев 9, Алерруза 19',
  'Локомотив Москва': 'Митрюшкин 1 / Силянов 3, Морозов 30, Ненахов 92, Руденко 26 / Баринов 6, Карпукас 91 / Сарвели 77, Батраков 83, Пиняев 21 / Воробьёв 19',
  'Динамо Москва': 'Лещук 1 / Касерес 2, Маричаль 4, Осипенко 55, Скопинцев 3 / Фомин 74, Нгаму 77 / Гладышев 11, Бителло 10, Кутицкий 23 / Тюкавин 98',
  'Краснодар': 'Агкацев 39 / Петров 98, Диего Коста 22, Боселли 4, Кривцов 88 / Сперцян 10, Пина 5, Кайо 17 / Олусегун 7, Кордоба 9, Батчи 77',
  'Тоттенхэм': 'Викарио 1 / Порро 23, Ромеро 17, Ван де Вен 37, Удоджи 13 / Бентанкур 30, Палинья 6 / Кудус 20, Симонс 7, Ришарлисон 9 / Соланке 19',
  'Атлетик Бильбао': 'Унаи Симон 1 / Горосабель 2, Виван 3, Паредес 4, Берчиче 17 / Галаррета 16, Санчет 8 / Иньяки Уильямс 9, Беренгер 7, Нико Уильямс 10 / Гурусета 12',
  'Вильярреал': 'Луис Жуниор 1 / Мурино 22, Рафа Марин 4, Ренато Вейга 12, Кардона 23 / Парехо 10, Комесанья 14 / Пепе 19, Молейро 20 / Жерар Морено 7, Микаутадзе 9',
  'Реал Бетис': 'Пау Лопес 25 / Бельерин 2, Натан 6, Льоренте 3, Рикардо Родригес 12 / Ло Сельсо 20, Форнальс 18 / Антони 7, Иско 22, Абде 10 / Бакамбу 11',
  'Байер Леверкузен': 'Флеккен 1 / Артур 13, Тапсоба 12, Квансах 4, Гримальдо 20 / Андрих 8, Паласиос 25 / Хофманн 7, Тиллман 10, Поку 19 / Шик 14',
  'РБ Лейпциг': 'Гулачи 1 / Баку 17, Орбан 4, Лукеба 23, Раум 22 / Зайвальд 13, Шлагер 24 / Нуса 7, Диоманде 49, Баумгартнер 14 / Ромулу 40',
  'Штутгарт': 'Нюбель 33 / Хендрикс 3, Шабо 24, Ельтш 29, Миттельштедт 7 / Штиллер 6, Карацор 16 / Фюрих 27, Ундав 26, Нартей 28 / Демирович 9',
  'Айнтрахт Франкфурт': 'Трапп 1 / Кнауфф 36, Коч 4, Теате 3, Кристенсен 13 / Скири 15, Ларссон 16 / Бахоя 19, Гётце 27 / Буркардт 21, Ваи 9',
  'Наполи': 'Мерет 1 / Ди Лоренцо 22, Буонджорно 4, Ррахмани 13, Оливера 17 / Лоботка 68, Ангисса 99, Мактоминей 8 / Политано 21, Де Брёйне 11 / Хёйлунн 19',
  'Рома': 'Свилар 99 / Манчини 23, Ндика 5, Челик 19, Анхелиньо 3 / Кристанте 4, Коне 17 / Соуле 18, Пеллегрини 7, Дибала 21 / Довбик 11',
  'Аталанта': 'Карнезекки 29 / Джимсити 19, Хиен 4, Колашинац 23 / Белланова 16, Эдерсон 13, Де Рон 15, Заппакоста 77 / Де Кетеларе 17, Лукман 11 / Скамакка 9',
  'Марсель': 'Рулли 1 / Мурильо 62, Бальерди 5, Агерд 21, Эмерсон 33 / Хёйбьерг 23, Кондогбиа 19 / Гринвуд 10, Гуири 9, Паишау 14 / Обамеянг 97',
  'Монако': 'Кён 16 / Вандерсон 2, Керер 5, Салису 22, Кайо Энрике 12 / Погба 8, Камара 15, Головин 10 / Аклиуш 11, Минамино 18 / Балогун 29',
  'Лион': 'Грайф 1 / Мейтленд-Найлз 98, Мата 22, Ниакате 19, Абнер 16 / Тессманн 6, Толиссо 8 / Малик Фофана 11, Шульц 10, Карабец 18 / Сатриано 9',
  'Лилль': 'Озер 1 / Мейр 2, Нгой 3, Алешандро 4, Мандьи 23 / Андре 21, Буадди 32 / Фернандес-Пардо 7, Харальдссон 10, Мукау 17 / Жиру 9',
  'Ницца': 'Бюлька 1 / Клаусс 7, Ндайишимийе 55, Дант 31, Бард 26 / Сансон 11, Буланже 6, Ндиайе 15 / Софьян Диоп 10, Мофи 9, Гессан 29',
};
const POS_NAME = { ВРТ: 'вратарь', ЗАЩ: 'защитник', ПЗ: 'полузащитник', НАП: 'нападающий' };
for (const t of TEAMS) {
  const rows = LINEUPS[t.name].split('/').map((r) => r.split(',').map((x) => {
    const m = x.trim().match(/^(.*\S)\s+(\d+)$/);
    return { name: m[1], num: +m[2] };
  }));
  rows.forEach((r, i) => r.forEach((p) => { p.pos = i === 0 ? 'ВРТ' : i === 1 ? 'ЗАЩ' : i === rows.length - 1 ? 'НАП' : 'ПЗ'; }));
  t.lineup = rows;
  t.formation = rows.slice(1).map((r) => r.length).join('-');
  const inXI = new Set(rows.flat().map((p) => p.name));
  t.bench = t.takers.filter((p) => !inXI.has(p.name)); // пенальтисты, вышедшие на замену к серии
}

function wrapLines(text, maxW) {
  const words = text.split(' '), out = [];
  let line = '';
  for (const w of words) {
    const tryL = line ? line + ' ' + w : w;
    if (ctx.measureText(tryL).width > maxW && line) { out.push(line); line = w; } else line = tryL;
  }
  if (line) out.push(line);
  return out;
}

// ---------- Заставка перед матчем ----------
const INTRO_SCENES = [
  { id: 'lineA', dur: 7 },
  { id: 'lineB', dur: 7 },
];
const SKIP = { x: VW - 196, y: VH - 54, w: 182, h: 40 };
const I = { scene: 0, t: 0 };

function startIntro() {
  G.phase = 'intro';
  G.ball = null; G.celeb = null; G.msg = null; G.taker = null;
  I.scene = -1;
  updateCurlUI();
  renderBoard();
  setStatus(`Стартовые составы. ${IS_TOUCH ? 'Коснитесь поля' : 'Кликните по полю или нажмите пробел'}, чтобы листать дальше, или «Пропустить».`);
  introNext();
}
function introNext() {
  I.scene++;
  I.t = 0;
  if (I.scene >= INTRO_SCENES.length) finishIntro();
}
function finishIntro() {
  G.particles = [];
  G.phase = 'idle'; // newKick выставит нужную фазу
  newKick();
}
function introTap(pt) {
  if (pt.x >= SKIP.x && pt.x <= SKIP.x + SKIP.w && pt.y >= SKIP.y && pt.y <= SKIP.y + SKIP.h) { finishIntro(); return; }
  introNext();
}
window.addEventListener('keydown', (e) => {
  if (G.phase !== 'intro' || e.target.tagName === 'INPUT') return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); introNext(); }
});

function updateIntro(dt) {
  I.t += dt;
  const sc = INTRO_SCENES[I.scene];
  if (sc && I.t >= sc.dur) introNext();
}

const ease = (k) => { k = clamp(k, 0, 1); return 1 - Math.pow(1 - k, 3); };

// Щит-эмблема клуба в цветах формы
function drawCrest(x, y, s, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(-s, -s); ctx.lineTo(s, -s); ctx.lineTo(s, 0.1 * s);
  ctx.quadraticCurveTo(s, 0.85 * s, 0, 1.25 * s);
  ctx.quadraticCurveTo(-s, 0.85 * s, -s, 0.1 * s);
  ctx.closePath();
  ctx.save(); ctx.clip();
  ctx.fillStyle = t.color; ctx.fillRect(-s, -s, 2 * s, 2.4 * s);
  ctx.fillStyle = t.color2;
  if (t.stripes) for (let i = -2; i <= 2; i += 2) ctx.fillRect(i * s * 0.3 - s * 0.15, -s, s * 0.3, 2.4 * s);
  else ctx.fillRect(-s, -s, 2 * s, s * 0.32);
  ctx.restore();
  ctx.lineWidth = Math.max(2, s * 0.1); ctx.strokeStyle = t.color2 === '#ffffff' && t.color === '#ffffff' ? '#999' : t.color2;
  ctx.stroke();
  const ini = t.name.split(/[\s-]+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  ctx.font = `bold ${Math.round(s * (ini.length > 2 ? 0.62 : 0.8))}px Segoe UI`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = s * 0.12; ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.strokeText(ini, 0, 0.18 * s);
  ctx.fillStyle = '#fff'; ctx.fillText(ini, 0, 0.18 * s);
  ctx.restore();
}





function drawLineup(t, tm) {
  // фон студии в цветах клуба
  const g = ctx.createLinearGradient(0, 0, VW, VH);
  g.addColorStop(0, '#0b1119'); g.addColorStop(1, '#16263a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
  ctx.save();
  ctx.globalAlpha = 0.25; ctx.fillStyle = tm.color === '#ffffff' ? tm.color2 : tm.color;
  ctx.beginPath(); ctx.moveTo(VW * 0.55, 0); ctx.lineTo(VW, 0); ctx.lineTo(VW, VH); ctx.lineTo(VW * 0.4, VH); ctx.closePath(); ctx.fill();
  ctx.restore();

  // мини-поле со схемой
  const px = 36, py = 30, pw = 380, ph = 530;
  const slide = ease(t / 0.5);
  ctx.save();
  ctx.translate(lerp(-460, 0, slide), 0);
  for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#2e7d32' : '#388e3c'; ctx.fillRect(px, py + i * ph / 8, pw, ph / 8); }
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2;
  ctx.strokeRect(px, py, pw, ph);
  ctx.beginPath(); ctx.moveTo(px, py + ph / 2); ctx.lineTo(px + pw, py + ph / 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(px + pw / 2, py + ph / 2, 50, 0, 7); ctx.stroke();
  ctx.strokeRect(px + pw / 2 - 90, py + ph - 66, 180, 66);
  ctx.strokeRect(px + pw / 2 - 90, py, 180, 66);
  const rows = tm.lineup;
  rows.forEach((r, i) => {
    const y = py + ph - 40 - i * (ph - 100) / (rows.length - 1);
    r.forEach((p, j) => {
      const x = px + (j + 1) * pw / (r.length + 1);
      const idx = rows.slice(0, i).reduce((s, rr) => s + rr.length, 0) + j;
      const k = ease((t - 0.4 - idx * 0.12) / 0.35);
      if (k <= 0) return;
      ctx.save();
      ctx.translate(x, y); ctx.scale(k, k);
      const gk = p.pos === 'ВРТ';
      ctx.beginPath(); ctx.arc(0, 0, 17, 0, 7);
      ctx.fillStyle = gk ? tm.gk : tm.color; ctx.fill();
      if (tm.stripes && !gk) { ctx.save(); ctx.clip(); ctx.fillStyle = tm.color2; for (const sx of [-10, 2]) ctx.fillRect(sx, -17, 7, 34); ctx.restore(); }
      ctx.lineWidth = 3; ctx.strokeStyle = gk ? '#fff' : tm.color2; ctx.stroke();
      ctx.font = 'bold 15px Segoe UI'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.strokeText(String(p.num), 0, 1);
      ctx.fillStyle = '#fff'; ctx.fillText(String(p.num), 0, 1);
      ctx.font = 'bold 12px Segoe UI'; ctx.lineWidth = 3;
      ctx.strokeText(p.name, 0, 29, pw / (r.length + 0.6)); ctx.fillText(p.name, 0, 29, pw / (r.length + 0.6));
      ctx.restore();
    });
  });
  ctx.restore();

  // заголовок и список
  const lx = 460;
  ctx.save();
  ctx.globalAlpha = ease((t - 0.2) / 0.4);
  drawCrest(lx + 34, 62, 30, tm);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
  ctx.font = 'bold 30px Segoe UI'; ctx.fillText(tm.name, lx + 80, 52, 400);
  ctx.font = 'bold 16px Segoe UI'; ctx.fillStyle = '#9fb3c8';
  ctx.fillText(`СТАРТОВЫЙ СОСТАВ · СХЕМА ${tm.formation}${tm === TEAMS[G.you] ? ' · ВАША КОМАНДА' : ''}`, lx + 80, 82, 420);
  ctx.restore();
  const all = rows.flat();
  all.forEach((p, i) => {
    const k = ease((t - 0.5 - i * 0.07) / 0.3);
    if (k <= 0) return;
    const y = 120 + i * 30;
    ctx.save();
    ctx.globalAlpha = k; ctx.translate((1 - k) * 60, 0);
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';
    ctx.fillRect(lx, y - 14, 460, 28);
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 17px Segoe UI'; ctx.textAlign = 'right'; ctx.fillStyle = '#ffd54f';
    ctx.fillText(String(p.num), lx + 40, y);
    ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
    ctx.fillText(p.name, lx + 56, y, 230);
    ctx.font = '15px Segoe UI'; ctx.fillStyle = '#9fb3c8';
    ctx.fillText(POS_NAME[p.pos], lx + 300, y);
    ctx.restore();
  });
  // пенальтисты по порядку (и кто выйдет на замену)
  const k = ease((t - 1.6) / 0.4);
  if (k > 0) {
    ctx.save();
    ctx.globalAlpha = k;
    ctx.font = 'bold 14px Segoe UI'; ctx.fillStyle = '#ffd54f'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('БЬЮТ ПЕНАЛЬТИ:', lx, 466);
    ctx.font = '15px Segoe UI'; ctx.fillStyle = '#fff';
    const lines = wrapLines(tm.takers.map((p, i) => `${i + 1}. ${p.name}`).join('  '), 460);
    lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, lx, 488 + i * 20));
    if (tm.bench.length) {
      ctx.font = '13px Segoe UI'; ctx.fillStyle = '#9fb3c8';
      ctx.fillText(`Вышли на замену к серии: ${tm.bench.map((p) => p.name).join(', ')}`, lx, 488 + Math.min(2, lines.length) * 20, 460);
    }
    ctx.restore();
  }
}


function drawIntro() {
  const sc = INTRO_SCENES[I.scene];
  if (!sc) return;
  const t = I.t;
  drawLineup(t, sc.id === 'lineA' ? TEAMS[G.you] : TEAMS[G.cpu]);
  if (t < 0.25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; ctx.fillRect(0, 0, VW, VH); } // плавная склейка
  ctx.save();
  // кнопка «Пропустить»
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.roundRect(SKIP.x, SKIP.y, SKIP.w, SKIP.h, 20); ctx.fill();
  ctx.fillStyle = '#10161f'; ctx.font = 'bold 18px Segoe UI'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Пропустить ⏭', SKIP.x + SKIP.w / 2, SKIP.y + SKIP.h / 2 + 1);
  // точки: какая команда сейчас
  INTRO_SCENES.forEach((_, i) => {
    ctx.fillStyle = i === I.scene ? '#ffd54f' : 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(VW / 2 - (INTRO_SCENES.length - 1) * 9 + i * 18, VH - 16, 4, 0, 7); ctx.fill();
  });
  ctx.restore();
}
