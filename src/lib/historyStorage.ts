import { NativeModules } from 'react-native';

const { CallDetectionModule } = NativeModules;

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

type NativeCallRecord = {
  id: string;
  timestamp: number;
  duration: number;
  finalStatus: string;
  maxConfidence: number;
  callType: string;
};

export const getHistory = async (): Promise<DetectionEvent[]> => {
  try {
    if (!CallDetectionModule) return [];
    
    const dataStr = await CallDetectionModule.getHistory();
    const nativeRecords: NativeCallRecord[] = JSON.parse(dataStr);
    
    // Sort descending by timestamp
    nativeRecords.sort((a, b) => b.timestamp - a.timestamp);

    return nativeRecords.map(record => {
      const isThreat = record.finalStatus === 'threat';
      const date = new Date(record.timestamp);
      
      return {
        id: record.id,
        verdict: isThreat ? 'Threat Detected' : 'Safe',
        isThreat,
        confidence: `${(record.maxConfidence).toFixed(1)}%`, // Wait, earlier I logged it as raw val
        timestamp: date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        context: record.callType === 'whatsapp' ? 'WhatsApp Call' : 'Phone Call',
        method: 'Real-time TFLite Pipeline'
      };
    });
  } catch (e) {
    console.error('Failed to load native history', e);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    if (CallDetectionModule) {
      await CallDetectionModule.clearHistory();
    }
  } catch (e) {
    console.error('Failed to clear native history', e);
  }
};
