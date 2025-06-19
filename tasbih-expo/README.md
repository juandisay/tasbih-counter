# Tasbih Counter

A React Native Expo app for counting tasbih (prayer beads).

## Features

- Add, edit, and delete tasbih counters
- Reorder counters with drag and drop
- Full screen mode for better visibility
- Persistent storage using AsyncStorage
- Beautiful and intuitive UI

## Development

### Prerequisites

- Node.js 18 or higher
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Building for Android

### Option 1: Using Expo EAS Build (Cloud)

```bash
npm run build:android
```

### Option 2: Local Build

Make sure you have Android SDK and Java 11 installed, then run:

```bash
cd android
./gradlew assembleRelease
```

The APK will be available at `android/app/build/outputs/apk/release/app-release.apk`

### Option 3: Docker Build

If you don't have the Android SDK set up, you can use Docker to build the APK:

```bash
./build-android-docker.sh
```

This will create a Docker container with all the necessary tools and build the APK.

## Signing the APK

The app is configured to use the `tasbih-keystore.jks` keystore file for signing the release APK. The keystore credentials are stored in `gradle.properties`.

## Project Structure

- `/components` - React components
- `/models` - TypeScript interfaces and types
- `/assets`