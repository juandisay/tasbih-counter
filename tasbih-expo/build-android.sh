#!/bin/bash

echo "Building Android APK..."

# Navigate to the android directory
cd android

# Clean the project
./gradlew clean

# Build the release APK
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "APK location: $(pwd)/app/build/outputs/apk/release/app-release.apk"
  
  # Copy APK to the project root for easy access
  cp app/build/outputs/apk/release/app-release.apk ../tasbih-counter.apk
  echo "APK copied to ./tasbih-counter.apk"
else
  echo "Build failed. See error messages above."
fi 