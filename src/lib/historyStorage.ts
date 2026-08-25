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

const mockSeedData: DetectionEvent[] = [
  {
    id: '1',
    verdict: 'Safe',
    isThreat: false,
    confidence: '99.8%',
    timestamp: 'Just now',
    context: 'Routine',
    method: 'On-Device inference',
    profileChecked: 'Primary Voice',
  },
  {
    id: '2',
    verdict: 'Threat Detected',
    isThreat: true,
    confidence: '12.4%',
    timestamp: '2 hours ago',
    context: 'Fund Transfer',
    method: 'On-Device inference',
    profileChecked: 'Primary Voice',
  },
  {
    id: '3',
    verdict: 'Safe',
    isThreat: false,
    confidence: '96.5%',
    timestamp: 'Yesterday',
    context: 'Routine',
    method: 'Cloud-Connected inference',
  },
];

export const getHistory = async (): Promise<DetectionEvent[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Seed data if empty
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeedData));
    return mockSeedData;
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
