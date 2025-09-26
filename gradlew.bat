@ECHO OFF
REM Root-level stub Gradle wrapper for CI.
IF EXIST ".\tic_tac_toe_frontend\android\gradlew.bat" (
  CALL .\tic_tac_toe_frontend\android\gradlew.bat %*
  EXIT /B %ERRORLEVEL%
)
IF EXIST ".\android\gradlew.bat" (
  CALL .\android\gradlew.bat %*
  EXIT /B %ERRORLEVEL%
)
ECHO Stub gradlew at repo root: Expo project without native Android. Skipping Gradle build.
EXIT /B 0
