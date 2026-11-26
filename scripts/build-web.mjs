// Собирает папку www/ — то, что попадает внутрь мобильного приложения
// и в zip-архив обновления «по воздуху».
//
// Что делает:
//  1. Копирует файлы сайта (игры, картинки, иконки) в www/.
//  2. Кладёт three.js локально (www/vendor/three), чтобы «Машинки» работали без интернета.
//  3. Заменяет ссылки вида "cars/" на "cars/index.html" — внутри приложения
//     адреса без имени файла открывают главную страницу, а не игру.
//  4. Подключает app/app-shell.js ко всем страницам (в браузере он ничего не делает).
//  5. Записывает версию сборки в www/app-version.json.
//
// Версия = 1.0.<время последнего коммита в секундах>. Можно задать вручную: BUNDLE_VERSION=1.0.123 npm run build

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'www');

// Что НЕ копируем из корня репозитория в приложение
const EXCLUDE = new Set([
  '.git', '.github', '.gitignore', 'node_modules', 'www', 'android', 'ios', 'scripts', 'app',
  'package.json', 'package-lock.json', 'capacitor.config.ts', 'capacitor.config.json',
  'README.md', 'CLAUDE.md', '.claude', 'robots.txt', '.nojekyll', '_site', 'assets',
]);

function version() {
  if (process.env.BUNDLE_VERSION) return process.env.BUNDLE_VERSION;
  const ts = execSync('git log -1 --format=%ct', { cwd: root }).toString().trim();
  return `1.0.${ts}`;
}

function walk(dir, fn) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, fn); else fn(p);
  }
}

// --- 1. Копирование сайта
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const e of fs.readdirSync(root, { withFileTypes: true })) {
  if (EXCLUDE.has(e.name) || e.name.startsWith('.')) continue;
  fs.cpSync(path.join(root, e.name), path.join(out, e.name), { recursive: true });
}
fs.copyFileSync(path.join(root, 'app', 'app-shell.js'), path.join(out, 'app-shell.js'));

// --- 2. three.js локально: главный модуль + нужные дополнения со всеми их зависимостями
const threeSrc = path.join(root, 'node_modules', 'three');
const threeOut = path.join(out, 'vendor', 'three');
const THREE_PREFIX = 'https://cdn.jsdelivr.net/npm/three@0.160.0/';
const neededAddons = new Set();

function copyThree(rel) {
  const dst = path.join(threeOut, rel);
  if (fs.existsSync(dst)) return;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const code = fs.readFileSync(path.join(threeSrc, rel), 'utf8');
  fs.writeFileSync(dst, code);
  // рекурсивно копируем относительные импорты дополнений ('./Pass.js', '../shaders/CopyShader.js')
  for (const m of code.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
    copyThree(path.posix.join(path.posix.dirname(rel), m[1]));
  }
}
copyThree('build/three.module.js');

// --- 3–4. Правка HTML-страниц
walk(out, (file) => {
  if (!file.endsWith('.html') || file.includes(`${path.sep}vendor${path.sep}`)) return;
  let html = fs.readFileSync(file, 'utf8');
  const depth = path.relative(out, path.dirname(file)).split(path.sep).filter(Boolean).length;
  const up = '../'.repeat(depth);

  // three.js с CDN -> локальная копия
  if (html.includes(THREE_PREFIX)) {
    for (const m of html.matchAll(/["']three\/addons\/([^"']+)["']/g)) neededAddons.add(m[1]);
    html = html.split(THREE_PREFIX).join(`${up}vendor/three/`);
  }

  // ссылки на папки -> на index.html
  html = html.replace(/href="([a-z0-9_-]+)\/"/gi, 'href="$1/index.html"');

  // подключаем app-shell.js
  if (!html.includes('app-shell.js')) {
    html = html.replace(/<\/body>/i, `<script src="${up}app-shell.js"></script>\n</body>`);
  }
  fs.writeFileSync(file, html);
});
for (const a of neededAddons) copyThree(`examples/jsm/${a}`);

// Проверка: внешних скриптов с CDN остаться не должно
walk(out, (file) => {
  if (!/\.(html|js)$/.test(file) || file.includes(`${path.sep}vendor${path.sep}`)) return;
  const bad = fs.readFileSync(file, 'utf8').match(/https:\/\/cdn\.[^"'\s)]+/g);
  if (bad) throw new Error(`Внешняя зависимость в ${path.relative(out, file)}: ${bad.join(', ')}`);
});

// --- 5. Версия
const v = version();
fs.writeFileSync(path.join(out, 'app-version.json'), JSON.stringify({ version: v }) + '\n');
console.log(`www/ собран, версия ${v}; дополнения three.js: ${[...neededAddons].join(', ') || 'нет'}`);
