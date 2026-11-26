# Мобильное приложение Stepik677

Приложение для iOS и Android на Capacitor. Внутри — те же игры, что на сайте.
Bundle ID: `io.github.stepik677.games`, ориентация — только горизонтальная.

## Как обновляются игры (без релизов в магазинах)

1. Вы делаете `git push` в `main`.
2. GitHub Actions (`.github/workflows/pages.yml`) публикует сайт и кладёт рядом
   `app/version.json` и `app/bundle-<версия>.zip`.
3. Приложение при запуске, при возврате в него и при появлении интернета проверяет
   `version.json`, тихо скачивает новый архив и включает его, когда игрок в главном меню.
4. Без интернета работает последняя скачанная (или встроенная) версия.
5. Если новая версия не запустилась, приложение само откатывается на предыдущую.

Код этой логики — `app/app-shell.js`.

**Новый релиз в магазине нужен**, только если меняется нативная часть: иконка, название,
заставка, плагины Capacitor, разрешения.

### Пауза обновлений

На время проверки приложения в App Store / Google Play поставьте в `app/update-config.json`
`"paused": true` и сделайте push. После одобрения верните `false`.

## Один раз: настройка GitHub Pages

Settings → Pages → Build and deployment → Source: **GitHub Actions**.

## Сборка приложения

Нужен Node.js 20+.

```bash
npm install
```

Android (нужна Android Studio):

```bash
npm run android
```

iOS (нужен Mac с Xcode):

```bash
npm run ios
```

Команды собирают `www/`, копируют его в нативные проекты (`npx cap sync`) и открывают
Android Studio / Xcode. Дальше — сборка и публикация из них.

Перед каждой сборкой для магазина увеличивайте номер версии:
- Android: `versionCode` и `versionName` в `android/app/build.gradle`;
- iOS: Version и Build в Xcode (вкладка General у цели App).
