# Frontend - VeraGenesi Mobile App (Expo)

This is a React Native app built with **Expo** for simplified development without native build setup.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device/Emulator

After running `npm start`, you'll see a QR code. Choose:

**Option A: Expo Go (Recommended for Development)**
- Download Expo Go app on your phone
- Scan the QR code with your phone camera
- App loads instantly on your device

**Option B: Web Browser**
```bash
npm run web
```

**Option C: Android Emulator**
```bash
npm run android
# Requires Android Studio emulator running
```

**Option D: iOS Simulator**
```bash
npm run ios
# macOS only, requires Xcode
```

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start Metro bundler with QR code |
| `npm run web` | Preview in web browser |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm test` | Run Jest tests |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |

## Project Structure

```
frontend/
├── src/
│   ├── screens/
│   ├── components/
│   ├── services/
│   ├── styles/
│   └── App.js
├── assets/
├── tests/
└── package.json
```

---

Updated as development progresses.
