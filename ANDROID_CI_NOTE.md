This repository is an Expo (managed) project. CI systems that expect a Gradle wrapper (`./gradlew`) will find a stub here at the repository root.

- It delegates to `tic_tac_toe_frontend/android/gradlew` if present.
- If not present, it exits successfully as no native build is required for Expo-managed workflow.
- To generate a real native Android project, run: `cd tic_tac_toe_frontend && npx expo prebuild --platform android`
