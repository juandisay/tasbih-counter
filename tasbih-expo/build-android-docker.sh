#!/bin/bash

echo "Building Android APK using Docker..."

# Create a temporary directory for the Docker build
mkdir -p .docker-build

# Copy the keystore file to the Docker build directory
cp tasbih-keystore.jks .docker-build/

# Run the Docker container
docker run --rm -it \
  -v $(pwd):/project \
  -v $(pwd)/.docker-build:/root/.gradle \
  -w /project \
  mingc/android-build-box:latest \
  bash -c "
    # Install node and npm
    apt-get update && apt-get install -y curl
    curl -sL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    
    # Install Expo CLI
    npm install -g expo-cli eas-cli
    
    # Install project dependencies
    npm install
    
    # Navigate to the android directory
    cd android
    
    # Build the release APK
    ./gradlew assembleRelease
    
    # Check if build was successful
    if [ \$? -eq 0 ]; then
      echo 'Build successful!'
      echo 'APK location: app/build/outputs/apk/release/app-release.apk'
      
      # Copy APK to the project root for easy access
      cp app/build/outputs/apk/release/app-release.apk ../tasbih-counter.apk
      echo 'APK copied to ./tasbih-counter.apk'
    else
      echo 'Build failed. See error messages above.'
    fi
  "

echo "Build process completed." 