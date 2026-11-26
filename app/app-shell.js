// Код, который работает только внутри мобильного приложения (в браузере сразу выходит).
//
// Обновление игр «по воздуху»:
//  - при запуске, при возвращении в приложение и при появлении интернета
//    проверяем https://stepik677.github.io/app/version.json;
//  - если там версия новее текущей — тихо скачиваем архив в фоне;
//  - скачанная версия включается, когда игрок находится в главном меню
//    (при запуске приложения или при возврате в меню), чтобы не прерывать игру.
// Без интернета игра работает на последней скачанной (или встроенной) версии.
(function () {
  'use strict';
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;

  var P = C.Plugins || {};
  var U = P.CapacitorUpdater;
  var VERSION_URL = 'https://stepik677.github.io/app/version.json';
  var isMenu = !/\/(cars|football)\//.test(location.pathname);

  function log() { try { console.log.apply(console, ['[app]'].concat([].slice.call(arguments))); } catch (e) {} }

  // Версии вида 1.0.<число>: сравниваем по частям как числа
  function cmp(a, b) {
    var x = String(a || '0').split('.'), y = String(b || '0').split('.');
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
      var d = (parseInt(x[i], 10) || 0) - (parseInt(y[i], 10) || 0);
      if (d) return d > 0 ? 1 : -1;
    }
    return 0;
  }

  // --- Полноэкранный режим
  if (P.StatusBar) P.StatusBar.hide().catch(function () {});

  function goMenu() { location.href = '../index.html'; }

  // --- Кнопка «Домой» в левом верхнем углу игр (на iPhone другого способа вернуться в меню нет)
  if (!isMenu) {
    var addHome = function () {
      if (document.getElementById('app-home')) return;
      var st = document.createElement('style');
      st.textContent =
        '#app-home{position:fixed;z-index:2147483000;' +
        'top:calc(6px + env(safe-area-inset-top,0px));left:calc(6px + env(safe-area-inset-left,0px));' +
        'width:38px;height:38px;padding:0;border:0;border-radius:50%;' +
        'background:rgba(15,21,34,.55);color:#fff;display:flex;align-items:center;justify-content:center;' +
        'opacity:.75;-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer}' +
        '#app-home:active{opacity:1;transform:scale(.92)}' +
        '#app-home svg{width:20px;height:20px;pointer-events:none}' +
        // «Машинки»: мини-карта стоит в том же углу — сдвигаем её под кнопку
        '#minimap{top:calc(52px + env(safe-area-inset-top,0px)) !important}';
      document.head.appendChild(st);
      var b = document.createElement('button');
      b.id = 'app-home';
      b.type = 'button';
      b.setAttribute('aria-label', 'Главное меню');
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
        'stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/></svg>';
      // не даём касанию «провалиться» в игру (джойстики, камера)
      ['touchstart', 'pointerdown', 'mousedown'].forEach(function (t) {
        b.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
      });
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (window.confirm('Выйти в главное меню?')) goMenu();
      });
      document.body.appendChild(b);
    };
    if (document.body) addHome(); else document.addEventListener('DOMContentLoaded', addHome);
  }

  // --- Кнопка «Назад» на Android: из игры — в меню, из меню — выход
  if (P.App) {
    P.App.addListener('backButton', function () {
      if (!isMenu) goMenu();
      else P.App.exitApp();
    });
  }

  if (!U) return;

  // Сообщаем плагину, что текущая версия запустилась нормально.
  // Если новая версия «сломана» и до этого места не дойдёт, плагин сам откатится на предыдущую.
  U.notifyAppReady().catch(function () {});

  function currentVersion() {
    return U.current().then(function (c) {
      if (c.bundle && c.bundle.id !== 'builtin') return c.bundle.version;
      return U.getBuiltinVersion().then(function (b) { return b.version; });
    });
  }

  // Самая новая скачанная и исправная версия (или null)
  function newestDownloaded(cur) {
    return U.list().then(function (r) {
      var best = null;
      (r.bundles || []).forEach(function (b) {
        if (b.status === 'error' || b.status === 'downloading' || b.id === 'builtin') return;
        if (cmp(b.version, cur) > 0 && (!best || cmp(b.version, best.version) > 0)) best = b;
      });
      return best;
    });
  }

  // Включить скачанную версию — только в меню, не во время игры
  function applyIfReady() {
    if (!isMenu) return Promise.resolve();
    return currentVersion().then(function (cur) {
      return newestDownloaded(cur).then(function (b) {
        if (!b) return;
        log('switching to', b.version);
        return U.set({ id: b.id }); // перезагружает страницу уже с новыми файлами
      });
    });
  }

  var busy = false;
  function check() {
    if (busy || navigator.onLine === false) return;
    busy = true;
    var cur;
    currentVersion()
      .then(function (v) { cur = v; return fetch(VERSION_URL + '?t=' + Date.now(), { cache: 'no-store' }); })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (info) {
        // paused: true в app/update-config.json — временно не раздавать обновления (например, на время проверки в магазине)
        if (!info || info.paused || !info.url || cmp(info.version, cur) <= 0) return;
        return U.list().then(function (r) {
          var have = (r.bundles || []).some(function (b) {
            return b.version === info.version && b.status !== 'error';
          });
          if (have) return;
          log('downloading', info.version);
          var opts = { url: info.url, version: info.version };
          if (info.checksum) opts.checksum = info.checksum;
          return U.download(opts);
        });
      })
      .then(applyIfReady)
      .catch(function (e) { log('check failed', e && e.message ? e.message : e); })
      .then(function () { busy = false; });
  }

  applyIfReady().catch(function () {});
  setTimeout(check, 2000);
  window.addEventListener('online', check);
  if (P.App) P.App.addListener('resume', check);
})();
