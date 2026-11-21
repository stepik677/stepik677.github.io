'use strict';
// ---------- Тренировка штрафных ----------
// 10 ударов с разных точек. Между мячом и воротами — стенка из игроков соперника, в воротах — вратарь.
// Над стенкой — слабым ударом по высокой дуге, в обход — закруткой. Пользуется функциями game.js.

const FK_DIFF = {
  // sig — насколько вратарь ошибается в оценке полёта (м), delay — когда замечает мяч из-за стенки (с)
  easy: { wall: -1, keeper: 0.3, sig: 0.85, delay: 0.44, name: 'лёгкая' },
  normal: { wall: 0, keeper: 0.5, sig: 0.6, delay: 0.38, name: 'средняя' },
  hard: { wall: 1, keeper: 0.75, sig: 0.35, delay: 0.3, name: 'сложная' },
};
const FK_TOTAL = 10;
const FK_BEST_KEY = 'penalty-fk-best';
const WALL_DIST = 9.15;
const FK = { team: 0, diff: 'normal', n: 0, goals: 0, log: [], pos: null, wall: [], side: 1, opp: 1, jumpT: -1, best: {} };
try { FK.best = JSON.parse(localStorage.getItem(FK_BEST_KEY) || '{}'); } catch (e) { FK.best = {}; }

// ---------- Экран выбора ----------
function renderFk() {
  fillClubList($('fk-list'), (i) => FK.team === i, () => false, (i) => { FK.team = i; renderFk(); });
  const b = FK.best[FK.diff];
  $('fk-best').textContent = b != null ? `🏅 Рекорд (${FK_DIFF[FK.diff].name}): ${b} из ${FK_TOTAL}` : `Рекорда пока нет — установите первый!`;
}
document.querySelectorAll('#fk-diff button').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('#fk-diff button').forEach((x) => x.classList.remove('active'));
    btn.classList.add('active');
    FK.diff = btn.dataset.d;
    renderFk();
  };
});
$('fk-start').onclick = startFreeKicks;

function startFreeKicks() {
  G.mode = 'fk';
  G.onFinish = null;
  FK.n = 0; FK.goals = 0; FK.log = [];
  do FK.opp = Math.floor(Math.random() * TEAMS.length); while (FK.opp === FK.team);
  if (!FK.prev) FK.prev = [G.you, G.cpu]; // выбор команд товарищеского матча вернём при выходе
  G.you = FK.team; G.cpu = FK.opp; G.shooter = 'you';
  G.particles = []; G.rain = 0; G.party = null; G.celeb = null; G.msg = null;
  $('again').classList.remove('hidden');
  $('again').textContent = 'Ещё 10 штрафных';
  $('back').textContent = 'В меню';
  ['setup', 'season-view', 'fk-view'].forEach((id) => $(id).classList.add('hidden'));
  $('over').classList.add('hidden');
  $('game-view').classList.remove('hidden');
  fkNewKick();
}

// Выход из тренировки: возвращаем команды, выбранные для товарищеского матча
function fkLeave() {
  if (!FK.prev) return;
  [G.you, G.cpu] = FK.prev;
  FK.prev = null;
  renderTeamLists();
}

// ---------- Новый штрафной ----------
function fkNewKick() {
  // точка удара: 18–28 м от ворот, по центру или сбоку (вне штрафной площади)
  const d = 18 + Math.random() * 10;
  const x = (Math.random() * 2 - 1) * (d < 21 ? 7 : 12);
  FK.pos = { x, d };
  FK.dist = Math.hypot(x, d);
  // камера — за мячом, чуть сдвинута к центру, чтобы видеть и мяч, и ворота
  CAM_D = d + 6; CAM_X = x * 0.85;
  FK.side = Math.sign(x) || (Math.random() < 0.5 ? -1 : 1); // со стороны какой штанги бьём
  fkBuildWall();
  G.ball = { x, y: 0.11, d, vis: true, u: 0, curl: 0 };
  // вратарь стоит ближе к дальней штанге — ближнюю закрывает стенка
  G.keeper = { x: -FK.side * (Math.abs(x) > 3 ? 0.4 : 0.25), plan: null, t: 0, landed: false };
  G.choice = null; G.msg = null; G.ripple = null; G.celeb = null;
  G.power = 0; G.powerDir = 1;
  FK.jumpT = -1;
  const st = TEAMS[FK.team];
  G.taker = st.takers[FK.n % st.takers.length];
  G.gkPlayer = TEAMS[FK.opp].keeper;
  G.aim = { x: -FK.side * 2.4, y: 1.9 };
  G.phase = 'aim';
  fkBoard();
  updateCurlUI();
  setStatus(`Штрафной ${FK.n + 1} из ${FK_TOTAL}: ${Math.round(FK.dist)} м. Бьёт ${G.taker.name}. В стенке ${FK.wall.length} игрок${FK.wall.length > 4 ? 'ов' : 'а'}. Слабый удар — выше над стенкой, закрутка — в обход.`);
}

// Стенка в 9,15 м от мяча закрывает ближнюю к мячу половину ворот
function fkBuildWall() {
  const { x, d } = FK.pos, dist = FK.dist;
  const ux = -x / dist, ud = -d / dist;              // направление на центр ворот
  const c = { x: x + ux * WALL_DIST, d: d + ud * WALL_DIST };
  const px = -ud, pd = ux;                           // поперёк линии удара
  // куда в створе «проецируется» точка стенки (луч от мяча через неё до линии ворот)
  const toGoal = (o) => { const wx = c.x + px * o, wd = c.d + pd * o; return x + (wx - x) * d / (d - wd); };
  const g0 = toGoal(0), g1 = toGoal(1) - g0;
  const n = clamp((dist < 22 ? 4 : 3) + FK_DIFF[FK.diff].wall + (Math.abs(x) > 8 ? -1 : 0), 2, 5);
  const oOut = (FK.side * (GW + 0.25) - g0) / g1;   // крайний игрок закрывает ближнюю штангу
  const step = -FK.side * Math.sign(g1) * 0.56;      // остальные — к центру ворот
  const opp = TEAMS[FK.opp];
  const field = opp.lineup.flat().filter((p) => p.pos !== 'ВРТ');
  FK.wall = [];
  for (let k = 0; k < n; k++) {
    const o = oOut + step * (k + 0.5);
    const pl = field[(k * 3 + FK.n) % field.length];
    FK.wall.push({ x: c.x + px * o, d: c.d + pd * o, num: pl.num, name: pl.name, ph: Math.random() * 6 });
  }
}
const wallJump = () => (FK.jumpT < 0 ? 0 : Math.max(0, Math.sin(Math.min(1, FK.jumpT / 0.62) * Math.PI)) * 0.38);

// ---------- Траектория ----------
// Слабый удар летит по высокой дуге, сильный — низом. Закрутка на большой дистанции заметнее.
function fkPoint(u, aim, power, curl) {
  const f = FK.pos, k = (FK.dist / 11) * 0.7;
  const arc = 0.4 + (1 - power) * 2.0;
  return {
    x: lerp(f.x, aim.x, u) + curlOffset(curl, u) * k,
    y: lerp(0.11, aim.y, u) + Math.sin(Math.PI * u) * arc,
    d: lerp(f.d, 0, u),
  };
}

function fkShoot() {
  const p = G.power, curl = G.curl, cfg = FK_DIFF[FK.diff];
  const sigma = (0.24 + Math.pow(p, 3) * 0.55 + Math.abs(curl) * 0.1) * (FK.dist / 20);
  const target = {
    x: G.aim.x + randn() * sigma,
    y: Math.max(0.11, G.aim.y + randn() * sigma * 0.8 + Math.max(0, p - 0.85) * 4),
  };
  const dur = FK.dist / (14 + p * 16);
  const at = (u) => fkPoint(u, target, p, curl);
  const b = {
    from: { x: FK.pos.x, y: 0.11, d: FK.pos.d }, target, power: p, curl, dur, u: 0,
    x: FK.pos.x, y: 0.11, d: FK.pos.d, vis: true, result: 'goal', wallU: null,
  };
  // 1) стенка (она подпрыгивает в момент удара)
  let wallHit = null;
  for (const w of FK.wall) {
    const u = (b.from.d - w.d) / b.from.d;
    const pt = at(u);
    const jumpAt = Math.max(0, Math.sin(Math.min(1, (u * dur) / 0.62) * Math.PI)) * 0.38;
    if (Math.abs(pt.x - w.x) < 0.34 && pt.y < 1.88 + jumpAt && (!wallHit || u < wallHit)) wallHit = u;
  }
  // 2) вратарь: из-за стенки видит мяч поздно, но реагирует на полёт — медленный мяч он успевает достать.
  //    Закрутка и сила мешают точно оценить, куда летит мяч.
  const k = G.keeper;
  const sig = cfg.sig * (1 + Math.abs(curl) * 0.5);
  const H = { x: target.x + randn() * sig, y: clamp(target.y + randn() * sig * 0.7, 0.2, 2.4) };
  // на медленный мяч вратарь не прыгает сразу, а выжидает, чтобы долететь в момент его прихода
  const delay = Math.max(cfg.delay, dur - SET - 0.5);
  k.plan = planDive(k.x, H, target, p, curl, cfg.keeper, delay, dur, false);
  k.t = 0; k.landed = false;
  if (wallHit != null) { b.result = 'wall'; b.wallU = wallHit; }
  else if (Math.abs(target.x) > GW + POST || target.y > GH + POST) b.result = 'miss';
  else {
    const save = fkKeeperTouch(at, k, dur, p, curl, cfg.keeper);
    if (save) Object.assign(b, { result: 'save', caught: save.caught, part: save.part });
    else {
      const ax = Math.abs(target.x);
      const hitPost = ax > GW - POST, hitBar = target.y > GH - POST;
      if (hitPost || hitBar) {
        const inside = Math.min(hitPost ? (GW + POST - ax) / (2 * POST) : 1, hitBar ? (GH + POST - target.y) / (2 * POST) : 1);
        const part = hitBar && !hitPost ? 'bar' : 'post';
        if (Math.random() < clamp(0.15 + inside * 0.6, 0.1, 0.75)) b.postIn = part;
        else { b.result = 'post'; b.postPart = part; }
      }
    }
  }
  G.ball = b;
  FK.jumpT = 0;
  G.phase = 'flight';
  updateCurlUI();
  setStatus('');
}

function fkKeeperTouch(at, k, dur, power, curl, skill) {
  const handR = (0.2 + skill * 0.1) * (1 - power * 0.25) * (1 - Math.abs(curl) * 0.15);
  const uK = 1 - 0.3 / FK.pos.d;
  for (const u of [uK - 0.006, uK, (uK + 1) / 2, 1]) {
    const ball = at(u);
    const pose = keeperPose(k, dur * u);
    for (const sg of keeperSegments(pose, handR)) {
      if (segDist(ball, sg.a, sg.b) < sg.r + 0.11) {
        return { caught: sg.part !== 'leg' && power < 0.6 && Math.abs(curl) < 0.5 && Math.random() < 0.55, part: sg.part };
      }
    }
  }
  return null;
}

// ---------- Обновление ----------
function fkUpdate(dt) {
  if (G.msg) G.msgT += dt;
  updateParticles(dt);
  if (FK.jumpT >= 0) FK.jumpT += dt;
  if (G.phase === 'charge') {
    G.power += G.powerDir * dt * 0.95;
    if (G.power >= 1) { G.power = 1; G.powerDir = -1; }
    if (G.power <= 0) { G.power = 0; G.powerDir = 1; }
  }
  const k = G.keeper;
  if (k.plan) k.t += dt;
  else if (G.phase === 'aim' || G.phase === 'charge') k.x += (-FK.side * (Math.abs(FK.pos.x) > 3 ? 0.4 : 0.25) + Math.sin(G.time * 2) * 0.15 - k.x) * Math.min(1, dt * 3);

  const b = G.ball;
  if (G.phase === 'flight') {
    b.u += dt / b.dur;
    const u = Math.min(1, b.u);
    if (b.result === 'wall' && u >= b.wallU) { fkFinish(); return; }
    Object.assign(b, fkPoint(u, b.target, b.power, b.curl));
    if (b.u >= 1) fkFinish();
  } else if (G.phase === 'after') {
    G.afterT += dt;
    if (b.attach) { // мяч в руках вратаря
      const pose = keeperPose(k, k.t);
      const l = handLocal(-1, pose.arms), r = handLocal(1, pose.arms);
      const h = toWorld(pose, (l.x + r.x) / 2, (l.y + r.y) / 2);
      b.x = h.x; b.y = Math.max(0.11, h.y); b.d = 0.4;
    } else {
      b.x += b.vx * dt; b.y += b.vy * dt; b.d += b.vd * dt;
      b.vy -= 9.8 * dt;
      if (b.y < 0.11) { b.y = 0.11; b.vy = -b.vy * 0.45; b.vx *= 0.8; b.vd *= 0.8; }
      if (b.result === 'goal' && b.d < -1.7) { b.d = -1.7; b.vd = 0; b.vx *= 0.5; }
      if (b.result === 'goal' && Math.abs(b.x) > GW - 0.2 && Math.sign(b.vx) === Math.sign(b.x)) { b.x = Math.sign(b.x) * (GW - 0.2); b.vx = 0; }
      if (b.d < -8) b.vis = false;
    }
    if (G.afterT > (b.result === 'goal' ? 2.8 : 1.9)) fkNext();
  }
}

function fkFinish() {
  const b = G.ball, res = b.result;
  const sx = Math.sign(b.target.x) || 1;
  if (res === 'wall') { b.vx = (Math.random() - 0.5) * 4; b.vy = 2 + Math.random() * 2; b.vd = 5 + Math.random() * 3; G.shake = 0.15; }
  else if (res === 'goal' && b.postIn === 'post') { b.vx = -sx * (2.5 + Math.random() * 2); b.vy = 0.5 + Math.random(); b.vd = -4; G.shake = 0.3; }
  else if (res === 'goal' && b.postIn === 'bar') { b.vx = (Math.random() - 0.5) * 2; b.vy = -4; b.vd = -3.5; G.shake = 0.3; }
  else if (res === 'goal') { b.vx = (b.target.x - b.from.x) / b.dur * 0.15; b.vy = 0; b.vd = -7; }
  else if (res === 'save') {
    if (b.caught) b.attach = true;
    else {
      const pose = keeperPose(G.keeper, G.keeper.t);
      b.vx = (Math.sign(b.target.x - pose.x) || sx) * (1.5 + Math.random() * 3);
      b.vy = b.part === 'leg' ? 1 : 2.5 + Math.random() * 2;
      b.vd = 3 + Math.random() * 4;
    }
  } else if (res === 'post' && b.postPart === 'bar') { b.vx = (Math.random() - 0.5) * 2; b.vy = 3; b.vd = 6; G.shake = 0.25; }
  else if (res === 'post') { b.vx = sx * (0.5 + Math.random()); b.vy = 1.5; b.vd = 6; G.shake = 0.25; }
  else { b.vx = (b.target.x - b.from.x) / b.dur; b.vy = 0; b.vd = -b.from.d / b.dur; }
  b.vx = b.vx || 0; b.vy = b.vy || 0; b.vd = b.vd || 0;

  const scored = res === 'goal';
  if (scored) FK.goals++;
  FK.log.push(scored);
  const curlTxt = Math.abs(b.curl) > 0.5;
  const sub = {
    goal: b.postIn ? `${G.taker.name}: от ${b.postIn === 'bar' ? 'перекладины' : 'штанги'} — в сетку!`
      : curlTxt ? `${G.taker.name}: мяч обогнул стенку!` : b.power < 0.55 ? `${G.taker.name}: над стенкой — в ворота!` : `${G.taker.name}: какой удар!`,
    wall: 'Мяч попал в стенку',
    save: `${G.gkPlayer.name} ${b.caught ? 'забирает мяч' : 'отбивает'}!`,
    post: b.postPart === 'bar' ? 'Перекладина!' : 'Штанга!',
    miss: 'Мимо ворот',
  }[res];
  const text = { goal: 'ГОЛ!', wall: 'СТЕНКА!', save: 'СЕЙВ!', post: 'ШТАНГА!', miss: 'МИМО!' }[res];
  G.msg = { text, color: scored ? '#66bb6a' : '#ef5350', sub };
  G.msgT = 0;
  if (scored) {
    const t = TEAMS[FK.team], pt = project(b.target.x, b.target.y, 0);
    G.ripple = { x: b.target.x, y: b.target.y, t: 0 };
    G.shake = Math.max(G.shake, 0.35);
    burst(pt.x, pt.y, [t.color, t.color2, '#ffffff'], 120, 1);
  }
  G.phase = 'after';
  G.afterT = 0;
  fkBoard();
}

function fkNext() {
  FK.n++;
  if (FK.n < FK_TOTAL) { fkNewKick(); return; }
  G.phase = 'over';
  const prev = FK.best[FK.diff];
  const record = prev == null || FK.goals > prev;
  if (record) {
    FK.best[FK.diff] = FK.goals;
    try { localStorage.setItem(FK_BEST_KEY, JSON.stringify(FK.best)); } catch (e) { /* без сохранения */ }
  }
  const verdict = FK.goals >= 7 ? 'Мастер штрафных! 🏆' : FK.goals >= 4 ? 'Хорошая тренировка! 👍' : 'Есть над чем поработать 💪';
  $('over-title').textContent = record && FK.goals > 0 ? `🏅 Новый рекорд: ${FK.goals} из ${FK_TOTAL}!` : `Забито ${FK.goals} из ${FK_TOTAL}`;
  $('over-score').textContent = `${verdict}${!record ? ` Рекорд: ${prev} из ${FK_TOTAL}.` : ''} Сложность: ${FK_DIFF[FK.diff].name}.`;
  $('over').classList.remove('hidden');
  if (FK.goals >= 5) {
    const t = TEAMS[FK.team];
    G.rain = 4; G.rainColors = [t.color, t.color2, '#ffd54f', '#ffffff'];
  }
  G.msg = null;
  fkBoard();
  setStatus(`Тренировка окончена: ${FK.goals} из ${FK_TOTAL}.`);
}

// ---------- Табло ----------
function fkBoard() {
  const t = TEAMS[FK.team];
  let dots = '';
  for (let i = 0; i < FK_TOTAL; i++) dots += `<span class="dot ${i < FK.log.length ? (FK.log[i] ? 'goal' : 'miss') : ''}"></span>`;
  const best = FK.best[FK.diff];
  $('board').innerHTML = `<div class="board-row turn">
      <div class="board-name"><span class="badge" style="${badgeStyle(t)}"></span><span>${t.name} · штрафные${best != null ? ` · рекорд ${best}` : ''}</span></div>
      <div class="dots">${dots}</div>
      <div class="board-score">${FK.goals}</div>
    </div>`;
}

// ---------- Отрисовка ----------
function fkDraw() {
  ctx.clearRect(0, 0, VW, VH);
  ctx.save();
  if (G.shake > 0) { const m = G.shake * 14; ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m); }
  drawBackground();
  drawNet();
  const b = G.ball;
  const behind = b && b.d < -0.05;
  if (behind) drawBall();
  drawKeeper(TEAMS[FK.opp]);
  drawFrame();
  // стенка и мяч — по глубине: что дальше от камеры, рисуется раньше
  const wallD = FK.wall.length ? Math.min(...FK.wall.map((w) => w.d)) : 0;
  const ballFirst = b && !behind && b.d < wallD;
  if (ballFirst) drawBall();
  fkDrawWall();
  if (b && !behind && !ballFirst) drawBall();
  drawAim();
  drawNames();
  fkDrawInfo();
  ctx.restore();
  drawMessage();
  drawParticles();
}

function fkDrawWall() {
  const opp = TEAMS[FK.opp];
  const j = wallJump();
  const list = [...FK.wall].sort((a, c) => a.d - c.d);
  for (const w of list) {
    const P = {
      x: w.x, d: w.d, y: 0.95 + j, rot: 0,
      armL: 0.35, armR: 0.35, foreL: -0.9, foreR: -0.9, // руки прикрывают корпус
      legs: j > 0.05 ? 0.25 : 0, kneel: false, sit: false, bow: 0, front: true, eyesClosed: false, label: null, serious: true,
    };
    drawFigure(P, opp, w.num, w.name);
  }
}

function fkDrawInfo() {
  const txt = `Штрафной ${Math.min(FK.n + 1, FK_TOTAL)}/${FK_TOTAL} · ${Math.round(FK.dist)} м`;
  ctx.save();
  ctx.font = 'bold 16px Segoe UI';
  const w = ctx.measureText(txt).width + 24;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath(); ctx.roundRect(VW / 2 - w / 2, VH - 44, w, 30, 15); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(txt, VW / 2, VH - 29);
  ctx.restore();
}
