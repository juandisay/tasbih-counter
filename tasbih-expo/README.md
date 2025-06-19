# Tasbih Counter

A React Native Expo application for tracking and counting tasks or prayers.

## Features

- Create and manage multiple counters with target counts
- Track progress with visual indicators
- Reorder counters to prioritize tasks
- Persistent storage using AsyncStorage
- Mobile-optimized UI for easy counting

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd tasbih-counter
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the App

#### Development

To run the app in development mode:

```
npm start
```

This will start the Expo development server. You can then:
- Press 'a' to run on Android Emulator
- Press 'i' to run on iOS Simulator (Mac only)
- Scan the QR code with the Expo Go app on your physical device

#### Android Build

To build an APK for Android:

1. Install EAS CLI if you haven't already:
   ```
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```
   eas login
   ```

3. Configure the build:
   ```
   eas build:configure
   ```

4. Build for Android:
   ```
   eas build -p android --profile preview
   ```

This will create an APK file that can be installed on Android devices.

## Project Structure

- `/components` - React components
- `/models` - TypeScript interfaces and types
- `/assets` - Images and other static assets

## License

This project is licensed under the MIT License. 