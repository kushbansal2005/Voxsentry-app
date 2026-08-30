import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { CallDetectionModule } = NativeModules;

// Create an event emitter for the native module
const detectionEventEmitter = CallDetectionModule 
  ? new NativeEventEmitter(CallDetectionModule) 
  : null;

class DetectionService {
  /**
   * Starts the protection service (Foreground Service & Monitoring)
   */
  static async startProtection(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) {
      return false;
    }
    try {
      return await CallDetectionModule.startProtection();
    } catch (error) {
      console.error("Failed to start protection:", error);
      throw error;
    }
  }

  /**
   * Stops the protection service
   */
  static async stopProtection(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) {
      return false;
    }
    try {
      return await CallDetectionModule.stopProtection();
    } catch (error) {
      console.error("Failed to stop protection:", error);
      throw error;
    }
  }

  /**
   * Checks if SYSTEM_ALERT_WINDOW permission is granted
   */
  static async checkOverlayPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) return true;
    return await CallDetectionModule.checkOverlayPermission();
  }

  /**
   * Requests SYSTEM_ALERT_WINDOW permission
   */
  static async requestOverlayPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) return true;
    return await CallDetectionModule.requestOverlayPermission();
  }

  /**
   * Checks if BIND_NOTIFICATION_LISTENER_SERVICE permission is granted
   */
  static async checkNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) return true;
    return await CallDetectionModule.checkNotificationPermission();
  }

  /**
   * Requests BIND_NOTIFICATION_LISTENER_SERVICE permission
   */
  static async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) return true;
    return await CallDetectionModule.requestNotificationPermission();
  }

  /**
   * Checks if the app is exempt from Battery Optimizations
   */
  static async checkBatteryOptimizationExemption(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) return true;
    return await CallDetectionModule.checkBatteryOptimizationExemption();
  }

  /**
   * Requests Battery Optimization Exemption
   */
  static async requestBatteryOptimizationExemption(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallDetectionModule) return true;
    return await CallDetectionModule.requestBatteryOptimizationExemption();
  }

  /**
   * Subscribes to detection events from the native module
   * @param callback Function to handle the event data
   * @returns A subscription object with a .remove() method to unsubscribe
   */
  static addDetectionListener(callback: (data: { event: string; payload?: string }) => void) {
    if (!detectionEventEmitter) {
      console.warn("Detection event emitter is not available");
      return { remove: () => {} };
    }
    
    return detectionEventEmitter.addListener('onDetectionUpdate', callback);
  }
}

export default DetectionService;
