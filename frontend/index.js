/**
 * @format
 */

import { registerRootComponent } from 'expo';
import App from './App';

// Error boundary for debugging
if (__DEV__) {
  console.log('VeraGenesi starting...');
}

try {
  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in Expo Go or in a native build,
  // the environment is set up appropriately
  registerRootComponent(App);
  console.log('VeraGenesi registered successfully');
} catch (error) {
  console.error('Failed to register VeraGenesi:', error);
}
