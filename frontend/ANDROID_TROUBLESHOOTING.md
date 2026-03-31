# Android Development Troubleshooting

The errors you're seeing indicate issues with the Expo Android build. Here's how to resolve them.

## ❌ Error: "DETECT_SCREEN_CAPTURE" Permission Denial

**Fixed**: We've added the required permission to `app.json`.

**Solution**: 
```bash
cd frontend
npm install  # Reinstall to pick up new config
npm run android  # Try again
```

---

## ❌ Error: "main" has not been registered

This happens when the entry point isn't recognized. **We've fixed this** in `index.js` with better error handling.

**If it persists**, try these steps:

### Step 1: Clear Metro Cache
```bash
npm start -- --clear
```

### Step 2: Clear Everything & Reinstall
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run android
```

### Step 3: Use Expo Go Instead (Recommended for Development)
This is the **fastest** way to test on Android during development:

```bash
# Terminal 1
npm start

# Terminal 2: On your computer/emulator
# Scan the QR code with **Expo Go app** (download from Play Store)
```

---

## 🚀 Recommended: Use Expo Go (No Native Build)

Expo Go is much simpler for MVP development:

### Setup
1. Download "Expo Go" from Google Play Store
2. Run: `npm start`
3. Scan QR code with Expo Go
4. App loads instantly ✨

**Benefits**:
- ✅ No Android Studio setup
- ✅ Instant hot reload
- ✅ Works on real devices
- ✅ No native build times
- ✅ Same as production preview

### On Emulator (Alternative)
You can use **Android Studio** emulator:
```bash
# Ensure emulator is running first
npm start

# Then press 'a' in the terminal to open Android emulator
# Or scan QR with Expo Go on the emulator
```

---

## 🔧 If You Need Native Android Build

These are advanced steps for production builds, not development:

### Requirements
1. **Android Studio** installed
2. **SDK 30+**
3. **JDK 11+**
4. Proper system environment variables

### Commands
```bash
# Build APK
npx eas build -p android --local

# Or use EAS (Expo's cloud build)
npx eas build -p android
```

---

## 📋 Development Workflow (Recommended)

```bash
# Terminal 1: Start Expo dev server
npm start

# Terminal 2: Options (pick ONE)
# Option A: Scan with Expo Go (easiest!)
#   → Use your phone, scan QR code with Expo Go app

# Option B: Web preview
npm run web

# Option C: If you have Android emulator running
#   → Press 'a' in Terminal 1 when Metro is running
```

---

## ❌ Common Issues & Fixes

### "Metro is running from the wrong folder"
```bash
# Make sure you're in the frontend directory
cd frontend
npm start
```

### "Cannot find module 'react-native'"
```bash
cd frontend
npm install  # Reinstall dependencies
```

### "Port 8081 already in use"
```bash
# Kill the process
pkill -f "metro\|expo start"

# Or use a different port
npm start -- --port 8082
```

### "Hermes engine errors"
These are usually transient. Try:
```bash
npm start -- --clear   # Clear Metro cache
npm run android         # Try again
```

---

## ✅ Quick Checklist

- [x] Permissions added to app.json
- [x] index.js has error handling
- [x] App.js exports default component
- [ ] Running `npm start` (not build)
- [ ] Using Expo Go app OR Android Studio emulator
- [ ] In the `frontend` directory

---

## 🎯 Best Practice for MVP

**For rapid development**: Use **Expo Go** with `npm start` + QR code scanning

**For production builds**: Use `eas build` once ready to deploy

---

## Getting Help

If issues persist:

1. **Check logs**:
   ```bash
   npm start
   # Look at terminal output for actual error
   ```

2. **Clear everything**:
   ```bash
   ./stop-all.sh    # Kill all services
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

3. **Test web version first**:
   ```bash
   npm run web
   ```
   This helps isolate if it's a React Native issue or Android-specific

4. **Check Node version**:
   ```bash
   node --version   # Should be 18+
   ```

---

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [Android Setup Guide](https://reactnative.dev/docs/environment-setup) (for native builds only)

---

## tldr

❌ `npm run android` on raw machine (no Android Studio) → Use Expo Go  
✅ `npm start` + scan QR → Expo Go on phone/emulator → Fast development  
✅ `npm run web` → Run in browser instantly  
⏰ `eas build` → Cloud build for production release
