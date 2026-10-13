# SciExplorePH mobile app

An Ionic/Angular app packaged with Capacitor for **Android and iPhone**, with Philippine-context science and math lessons, quizzes, saved progress, and Explore chat.

Lessons, quizzes, progress, and the offline lesson guide are bundled in the app and work without a website connection. Live AI is optional and requires your hosted chat backend. Lesson content is introductory and does not claim formal DepEd curriculum certification.

## Requirements

- Node.js 24.15+ and npm (`package-lock.json` is committed).
- Android: JDK 21, Android SDK platform 36, build-tools 36.0.0, and Android Studio or the SDK command-line tools. Android 7.0+ with an up-to-date Android System WebView.
- iPhone: a Mac with Xcode 26+, an iOS 17+ simulator or device, and an Apple development signing team for physical devices. The iOS project uses Swift Package Manager.
- App identifier: `ph.sciexplore.app`; display name: `SciExplorePH`.

## Prepare both native projects

```sh
npm ci
npm run mobile:sync
```

`mobile:sync` creates the production web build and copies it into the committed `android/` and `ios/` projects. Generated web assets and local SDK/signing settings are ignored by Git. Run it again after changing app code. The default build uses the offline guide and never tries to contact a server on the phone's localhost.

## Android: build and install

Set `ANDROID_HOME` to your installed SDK directory and ensure JDK 21 is active. Android Studio can configure the SDK path in the ignored `android/local.properties` file.

```sh
npm run android:apk
```

The debug APK is `android/app/build/outputs/apk/debug/app-debug.apk`. Install it on your own Android phone by opening the APK and allowing that installer, or by using:

```sh
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

For Android Studio, run `npm run android:open`, select a device, and press Run. On Windows, after `npm run mobile:sync`, use `android\gradlew.bat -p android assembleDebug`.

Debug APKs are for development/testing. For Play Store distribution, configure your release signing key privately and create a signed Android App Bundle in Android Studio. Do not commit keystores or passwords.

## iPhone: build on a Mac

```sh
npm ci
npm run mobile:sync
npm run ios:open
```

Open the `App` scheme in Xcode. Select an iOS 17+ simulator and press Run. For an actual iPhone, set your team in **Signing & Capabilities**, connect the phone, select it, and press Run. Xcode resolves Capacitor and the local plugin Swift packages automatically. A distributable iPhone build requires Apple signing; Linux cannot compile or run the iOS project.

## Live AI on a phone

A mobile app cannot use the Angular development proxy. Host the chat server behind an HTTPS gateway, supply `GEMINI_API_KEY` **only to the server**, and allow the native origins:

```sh
# Server process environment, behind your authenticated gateway:
CHAT_ALLOWED_ORIGINS='https://localhost,capacitor://localhost' npm run chat

# App build environment, containing only the public backend origin:
SCIEXPLORE_CHAT_URL='https://study.example.com' npm run mobile:sync
```

Replace `https://study.example.com` with your deployed backend's HTTPS origin. This URL is public and bundled into the app; it must contain no credentials, paths, or query parameters. Build the APK with the same variable (`SCIEXPLORE_CHAT_URL='https://study.example.com' npm run android:apk`) or open Xcode after syncing. The sync script restores the checked-in offline config after building.

The gateway must forward `/api/chat/status` and `/api/chat` to loopback port 3001, handle native CORS preflight, and provide authentication, per-user quotas, and rate limits before public deployment. The included server provides payload limits, a concurrency cap, timeouts, and an explicit origin allowlist. An origin allowlist does not authenticate callers. The server uses `gemini-2.5-flash`; the app discloses when messages are sent to Google Gemini. No provider key or conversation history is stored in Git or bundled into the APK.

Without the hosted endpoint/key, chat is clearly labeled as an **offline lesson guide** that retrieves existing lesson text, not generated AI responses.

## Browser development

```sh
npm run chat
# In another terminal:
npm start -- --host 0.0.0.0
```

Open http://localhost:4200. The development proxy forwards `/api` to port 3001. Native projects do not use the development server.

## Learning data

Completing a lesson quiz correctly earns 50 XP once per lesson. Progress is stored on the device under `sciexplore-completed`, and persists between launches. It is not shared across devices; clearing app data resets it. Chat is session-only and can be cleared independently.

The app includes touch-friendly bottom tabs, safe-area spacing, keyboard-aware chat layout, and Android back behavior: close a lesson/chat, return to Home, then exit.

## Checks

```sh
npm run lint
npm test -- --watch=false
npm run test:server
npm run mobile:sync
cd android
./gradlew assembleDebug lintDebug
```

Native iPhone validation must be performed on a Mac with Xcode. A browser screenshot alone does not verify an installed mobile app.

Further study: [PAGASA](https://www.pagasa.dost.gov.ph/), [PHIVOLCS](https://www.phivolcs.dost.gov.ph/), and [DepEd learning resources](https://lrmds.deped.gov.ph/).
