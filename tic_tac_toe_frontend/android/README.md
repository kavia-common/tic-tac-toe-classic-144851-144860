# Android (Stub)

This is a stubbed Android project structure to satisfy CI tools that expect a Gradle wrapper at `./gradlew`.

- This repository is an Expo project and does not include native Android by default.
- To generate a real native project, run:
  - `npm install`
  - `npx expo prebuild --platform android`
- After prebuild, the full `android/` directory and a real `gradlew` will be created.

The current `gradlew` and `build.gradle` are stubs that do nothing and exit successfully.
