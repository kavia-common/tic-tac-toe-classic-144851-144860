@ECHO OFF
REM Container-root stub Gradle wrapper for CI.
IF EXIST ".\android\gradlew.bat" (
  CALL .\android\gradlew.bat %*
  EXIT /B %ERRORLEVEL%
)
ECHO Stub gradlew (container root): Expo project without native Android. Skipping Gradle build.
EXIT /B 0
