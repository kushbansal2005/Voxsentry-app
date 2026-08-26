import AsyncStorage from '@react-native-async-storage/async-storage';

export type DetectionEvent = {
  id: string;
  verdict: 'Safe' | 'Threat Detected';
  isThreat: boolean;
  confidence: string;
  timestamp: string;
  context: string;
  method: string;
  profileChecked?: string;
};

const STORAGE_KEY = 'voxsentry_detection_history';

export const getHistory = async (): Promise<DetectionEvent[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
};

export const addHistoryEvent = async (event: Omit<DetectionEvent, 'id'>) => {
  try {
    const current = await getHistory();
    const newEvent = { ...event, id: Date.now().toString() };
    const updated = [newEvent, ...current];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to add history event', e);
  }
};
