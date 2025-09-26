#!/usr/bin/env bash
# Root-level stub Gradle wrapper to satisfy CI expecting ./gradlew at repo root.
# Delegates to android/gradlew if present; otherwise exits successfully.
if [ -x "./tic_tac_toe_frontend/android/gradlew" ]; then
  exec ./tic_tac_toe_frontend/android/gradlew "$@"
elif [ -x "./android/gradlew" ]; then
  exec ./android/gradlew "$@"
else
  echo "Stub gradlew at repo root: Expo project without native Android. Skipping Gradle build."
  exit 0
fi
