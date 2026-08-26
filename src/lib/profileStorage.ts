import AsyncStorage from '@react-native-async-storage/async-storage';

export type VoiceProfile = {
  id: string;
  name: string;
  trainedAt: string;
  isPrimary: boolean;
};

const STORAGE_KEY = 'voxsentry_voice_profiles';

export const getVoiceProfiles = async (): Promise<VoiceProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to load voice profiles', e);
    return [];
  }
};

export const addVoiceProfile = async (profile: Omit<VoiceProfile, 'id' | 'trainedAt'>) => {
  try {
    const current = await getVoiceProfiles();
    
    // If this is the first profile, make it primary automatically
    const isPrimary = current.length === 0 ? true : profile.isPrimary;
    
    // If new profile is primary, set all others to non-primary
    const updatedProfiles = isPrimary 
      ? current.map(p => ({ ...p, isPrimary: false }))
      : current;

    const newProfile: VoiceProfile = {
      ...profile,
      id: Date.now().toString(),
      trainedAt: new Date().toISOString(),
      isPrimary,
    };
    
    const updated = [newProfile, ...updatedProfiles];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to add voice profile', e);
    return null;
  }
};

export const removeVoiceProfile = async (id: string) => {
  try {
    const current = await getVoiceProfiles();
    const updated = current.filter(p => p.id !== id);
    
    // If we removed the primary profile and there are others left, make the first one primary
    if (current.find(p => p.id === id)?.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove voice profile', e);
    return null;
  }
};
