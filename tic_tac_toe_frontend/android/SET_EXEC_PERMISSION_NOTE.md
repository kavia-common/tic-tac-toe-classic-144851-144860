If your CI fails to execute ./gradlew due to permissions, ensure the file is executable:

chmod +x android/gradlew

This template cannot set executable bits directly via source control in all environments. Apply the chmod step in your CI pipeline before invoking ./gradlew.
