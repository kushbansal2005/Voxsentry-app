import { NativeModules, Platform } from 'react-native';

const { CallDetectionModule } = NativeModules;

export const OverlayBridge = {
  checkAndRequestOverlayPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android' && CallDetectionModule) {
      try {
        const hasPermission = await CallDetectionModule.checkOverlayPermission();
        if (!hasPermission) {
          return await CallDetectionModule.requestOverlayPermission();
        }
        return true;
      } catch (e) {
        console.warn('Overlay permission failed', e);
        return false;
      }
    }
    // Mock for testing when not on Android or not compiled natively
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  },
  startProtection: async (): Promise<void> => {
    if (Platform.OS === 'android' && CallDetectionModule) {
      await CallDetectionModule.startProtection();
    } else {
      console.log('Mock: startProtection');
    }
  },
  stopProtection: async (): Promise<void> => {
    if (Platform.OS === 'android' && CallDetectionModule) {
      await CallDetectionModule.stopProtection();
    } else {
      console.log('Mock: stopProtection');
    }
  },
  checkNotificationPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android' && CallDetectionModule) {
      return await CallDetectionModule.checkNotificationPermission();
    }
    return true;
  },
  requestNotificationPermission: async (): Promise<void> => {
    if (Platform.OS === 'android' && CallDetectionModule) {
      await CallDetectionModule.requestNotificationPermission();
    }
  },
  checkBatteryOptimizationExemption: async (): Promise<boolean> => {
    if (Platform.OS === 'android' && CallDetectionModule) {
      return await CallDetectionModule.checkBatteryOptimizationExemption();
    }
    return true;
  },
  requestBatteryOptimizationExemption: async (): Promise<void> => {
    if (Platform.OS === 'android' && CallDetectionModule) {
      await CallDetectionModule.requestBatteryOptimizationExemption();
    }
  }
};
