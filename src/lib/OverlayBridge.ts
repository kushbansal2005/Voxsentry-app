import { NativeModules, Platform } from 'react-native';

const { OverlayModule } = NativeModules;

export const OverlayBridge = {
  checkAndRequestOverlayPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android' && OverlayModule) {
      try {
        return await OverlayModule.checkAndRequestOverlayPermission();
      } catch (e) {
        console.warn('Overlay permission failed', e);
        return false;
      }
    }
    // Mock for testing when not on Android or not compiled natively
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  },
  startProtection: async (): Promise<void> => {
    if (Platform.OS === 'android' && OverlayModule) {
      await OverlayModule.startProtection();
    } else {
      console.log('Mock: startProtection');
    }
  },
  stopProtection: async (): Promise<void> => {
    if (Platform.OS === 'android' && OverlayModule) {
      await OverlayModule.stopProtection();
    } else {
      console.log('Mock: stopProtection');
    }
  }
};
