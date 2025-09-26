Android native build is not included in this Expo template.

To generate android/ and a Gradle wrapper:
1. npm install
2. npx expo prebuild --platform android
3. cd android && ./gradlew assembleDebug

For CI in this template, avoid invoking ./gradlew. Use Expo web or EAS Build instead.
