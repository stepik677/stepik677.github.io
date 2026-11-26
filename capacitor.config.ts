import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'node:fs';

// Версия встроенных в приложение файлов игры (её пишет scripts/build-web.mjs)
let bundleVersion = '1.0.0';
try {
  bundleVersion = JSON.parse(readFileSync('www/app-version.json', 'utf8')).version;
} catch {
  // www/ ещё не собран — запустите npm run build
}

const config: CapacitorConfig = {
  appId: 'io.github.stepik677.games',
  appName: 'Stepik677',
  webDir: 'www',
  backgroundColor: '#0f1522',
  plugins: {
    CapacitorUpdater: {
      // Ручной режим: проверкой и скачиванием управляет app/app-shell.js,
      // архивы лежат на stepik677.github.io (облако Capgo не используется)
      autoUpdate: false,
      version: bundleVersion,
      statsUrl: '', // не отправлять статистику на серверы Capgo
      appReadyTimeout: 15000,
      autoDeletePrevious: true,
      resetWhenUpdate: true,
    },
  },
};

export default config;
