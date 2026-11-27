'use strict';
// Музыка для футбола: свои бодрые треки в стиле «меню футбольной игры» (бит, бас, аккорды, мелодия).
// Всё синтезируется в браузере через Web Audio — без файлов и без чужих песен.
(() => {
  const TRACKS = [
    { name: 'Стадион', bpm: 124, root: 45, prog: [0, 5, 7, 3], mel: [[12, , 15, , 19, , 15, 17, , 15, , 12, , 10, 12, ,], [12, , 15, , 19, , 22, , 19, , 17, , 15, , 12, ,]] },
    { name: 'Финал', bpm: 128, root: 43, prog: [0, -4, 3, -2], mel: [[19, , 19, 17, , 15, , 12, , 15, , 17, 19, , , ,], [19, , 22, , 19, , 17, , 15, , 17, , 12, , , ,]] },
    { name: 'Гол!', bpm: 120, root: 48, prog: [0, 7, 9, 5], mel: [[7, , 12, , 14, , 12, 7, , 9, , 7, , 4, 2, ,], [7, , 12, , 16, , 14, , 12, , 9, , 7, , , ,]] },
  ];
  let ctx = null, master = null, verb = null, on = true, ti = 0, step = 0, bar = 0, nextT = 0, timer = null, noise = null;
  try { if (localStorage.getItem('penalty_music') === 'off') on = false; const k = +localStorage.getItem('penalty_track'); if (k >= 0 && k < TRACKS.length) ti = k; } catch (e) {}
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  // кнопка справа сверху
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;display:flex;gap:6px;font:600 14px "Segoe UI",system-ui,sans-serif';
  const bName = document.createElement('button'), bMute = document.createElement('button');
  for (const b of [bName, bMute]) b.style.cssText = 'border:1px solid rgba(255,255,255,.25);background:rgba(10,16,26,.75);color:#fff;border-radius:999px;padding:7px 12px;cursor:pointer;font:inherit';
  box.append(bName, bMute); document.body.appendChild(box);
  const render = () => { bName.textContent = '🎵 ' + TRACKS[ti].name; bMute.textContent = on ? '🔊' : '🔇'; box.style.opacity = on ? 1 : .7; };
  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = .28; master.connect(ctx.destination);
    verb = ctx.createDelay(); verb.delayTime.value = .18; const fb = ctx.createGain(); fb.gain.value = .25; verb.connect(fb); fb.connect(verb); const wet = ctx.createGain(); wet.gain.value = .25; verb.connect(wet); wet.connect(master);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); };
  function kick(t) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + .1); o.connect(g); g.connect(master); env(g, t, .002, 1, .25); o.start(t); o.stop(t + .3); }
  function hit(t, type, f, peak, dec, toVerb) { const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noise; fl.type = type; fl.frequency.value = f; s.connect(fl); fl.connect(g); g.connect(master); if (toVerb) g.connect(verb); env(g, t, .002, peak, dec); s.start(t); s.stop(t + dec + .05); }
  function bass(t, n, len) { const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = hz(n); f.type = 'lowpass'; f.frequency.value = 420; o.connect(f); f.connect(g); g.connect(master); env(g, t, .005, .45, len); o.start(t); o.stop(t + len + .05); }
  function chord(t, root, len) {
    const f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'lowpass'; f.frequency.setValueAtTime(2400, t); f.frequency.exponentialRampToValueAtTime(700, t + len); f.connect(g); g.connect(master); g.connect(verb); env(g, t, .01, .16, len);
    for (const iv of [0, 4, 7, 12]) for (const det of [-6, 6]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(root + iv); o.detune.value = det; o.connect(f); o.start(t); o.stop(t + len + .05); }
  }
  function pluck(t, n) { const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(); o.type = 'square'; o.frequency.value = hz(n); f.type = 'lowpass'; f.frequency.value = 3000; o.connect(f); f.connect(g); g.connect(master); g.connect(verb); env(g, t, .003, .14, .22); o.start(t); o.stop(t + .3); }
  function schedule() {
    const T = TRACKS[ti], spb = 60 / T.bpm / 4;
    while (nextT < ctx.currentTime + .15) {
      const t = nextT, st = step % 16, root = T.root + T.prog[bar % 4], mel = T.mel[bar % 2], intro = bar < 2;
      if (st % 4 === 0) kick(t);                                                       // бочка на каждую долю
      if (!intro && (st === 4 || st === 12)) hit(t, 'bandpass', 1500, .5, .18, true);   // хлопок
      if (st % 4 === 2) hit(t, 'highpass', 8000, .22, .05);                             // хэт между долями
      if (!intro && st % 2 === 0) bass(t, root - 12, spb * 1.6);                        // бас восьмыми
      if (st === 0 || st === 8) chord(t, root + 12, spb * 7);                            // аккорды
      if (!intro && mel[st] !== undefined) pluck(t, root + 12 + mel[st]);              // мелодия
      nextT += spb; step++; if (step % 16 === 0) bar++;
    }
  }
  function start() { if (!on || !init()) return; ctx.resume?.(); if (!timer) { nextT = ctx.currentTime + .1; step = 0; bar = 0; timer = setInterval(schedule, 25); } }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  const save = () => { try { localStorage.setItem('penalty_music', on ? 'on' : 'off'); localStorage.setItem('penalty_track', ti); } catch (e) {} };
  bName.addEventListener('click', e => { e.stopPropagation(); ti = (ti + 1) % TRACKS.length; on = true; save(); render(); stop(); start(); });
  bMute.addEventListener('click', e => { e.stopPropagation(); on = !on; save(); render(); if (on) start(); else stop(); });
  // браузер разрешает звук только после нажатия — включаем с первого нажатия в игре (любой режим)
  const first = () => { start(); };
  for (const ev of ['pointerdown', 'keydown', 'touchstart']) window.addEventListener(ev, first, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend?.(); else if (on) ctx.resume?.(); });
  render();
})();
