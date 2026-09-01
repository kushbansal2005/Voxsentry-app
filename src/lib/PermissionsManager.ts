import { PermissionsAndroid, Platform, NativeModules } from 'react-native';

const { CallDetectionModule } = NativeModules;

export type PermissionStatus = {
  microphone: boolean;
  phoneState: boolean;
  notifications: boolean;
  overlay: boolean;
  notificationListener: boolean;
  battery: boolean;
};

export const checkAllPermissions = async (): Promise<PermissionStatus> => {
  if (Platform.OS !== 'android') {
    return { microphone: true, phoneState: true, notifications: true, overlay: true, notificationListener: true, battery: true };
  }

  const mic = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
  const phone = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
  
  let notifs = true;
  if (Platform.Version >= 33) {
    notifs = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }

  let overlay = true;
  let notifListener = true;
  let battery = true;

  if (CallDetectionModule) {
    overlay = await CallDetectionModule.checkOverlayPermission();
    notifListener = await CallDetectionModule.checkNotificationPermission();
    battery = await CallDetectionModule.checkBatteryOptimizationExemption();
  }

  return {
    microphone: mic,
    phoneState: phone,
    notifications: notifs,
    overlay,
    notificationListener: notifListener,
    battery,
  };
};

export const requestMicrophone = async () => {
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestPhoneState = async () => {
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestNotifications = async () => {
  if (Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const requestOverlay = async () => {
  if (CallDetectionModule) {
    return await CallDetectionModule.requestOverlayPermission();
  }
  return true;
};

export const requestNotificationListener = async () => {
  if (CallDetectionModule) {
    await CallDetectionModule.requestNotificationPermission();
  }
};

export const requestBatteryExemption = async () => {
  if (CallDetectionModule) {
    await CallDetectionModule.requestBatteryOptimizationExemption();
  }
};
