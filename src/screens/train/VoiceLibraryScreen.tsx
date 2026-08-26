// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MotiView } from 'moti';
import { UserPlus, Play, Trash2 } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { theme } from '../../constants/theme';
import { getVoiceProfiles, removeVoiceProfile, VoiceProfile } from '../../lib/profileStorage';

export default function VoiceLibraryScreen({ navigation, route }: any) {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfiles = async () => {
    try {
      const data = await getVoiceProfiles();
      setProfiles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfiles();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.newProfileAdded) {
      loadProfiles();
      navigation.setParams({ newProfileAdded: false });
    }
  }, [route.params?.newProfileAdded]);

  const handleDeleteProfile = (id: string, name: string) => {
    Alert.alert(
      "Delete Profile",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await removeVoiceProfile(id);
            await loadProfiles();
          }
        }
      ]
    );
  };

  const handleTestVoice = (profile: VoiceProfile) => {
    Alert.alert(
      "Test Voice",
      `Testing ${profile.name}... (This is a simulation)`,
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <ScreenContainer>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={{ marginBottom: theme.spacing.xl }}
      >
        <Text style={theme.typography.display}>Voice Library</Text>
        <Text style={[theme.typography.caption, { marginTop: theme.spacing.xs, fontSize: 15 }]}>Manage your trusted voices</Text>
      </MotiView>

      {isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <Text style={theme.typography.caption}>Loading profiles...</Text>
        </View>
      ) : (
        <View style={{ gap: theme.spacing.md }}>
          {profiles.map((profile, index) => {
            const dateStr = profile.trainedAt ? new Date(profile.trainedAt).toLocaleDateString() : 'Unknown';
            return (
              <MotiView
                key={profile.id}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: index * 100 }}
              >
                <Card style={{ padding: theme.spacing.md, flexDirection: 'row', alignItems: 'center', borderColor: profile.isPrimary ? theme.colors.accentTeal : theme.colors.border }}>
                  <TouchableOpacity 
                    style={{ width: 44, height: 44, borderRadius: theme.borderRadius.full, backgroundColor: `${theme.colors.accentTeal}20`, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md }}
                    onPress={() => handleTestVoice(profile)}
                  >
                    <Play color={theme.colors.accentTeal} size={20} fill={theme.colors.accentTeal} />
                  </TouchableOpacity>
                  
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={theme.typography.heading} numberOfLines={1}>{profile.name}</Text>
                      {profile.isPrimary && (
                        <View style={{ backgroundColor: `${theme.colors.accentTeal}15`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: theme.spacing.sm }}>
                          <Text style={{ color: theme.colors.accentTeal, fontSize: 10, fontWeight: '700' }}>PRIMARY</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[theme.typography.caption, { marginTop: 2 }]}>Trained: {dateStr}</Text>
                  </View>

                  <TouchableOpacity onPress={() => handleDeleteProfile(profile.id, profile.name)} style={{ padding: theme.spacing.xs }}>
                    <Trash2 color={theme.colors.textDisabled} size={20} />
                  </TouchableOpacity>
                </Card>
              </MotiView>
            );
          })}

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400, delay: profiles.length * 100 }}
          >
            <TouchableOpacity 
              style={{
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: theme.spacing.xl,
                backgroundColor: 'transparent',
                marginTop: theme.spacing.md
              }}
              onPress={() => navigation.navigate('Consent')}
            >
              <View style={{ backgroundColor: `${theme.colors.accentTeal}15`, padding: theme.spacing.sm, borderRadius: theme.borderRadius.full, marginBottom: theme.spacing.sm }}>
                <UserPlus color={theme.colors.accentTeal} size={24} />
              </View>
              {profiles.length === 0 ? (
                <>
                  <Text style={[theme.typography.heading, { marginBottom: theme.spacing.xs }]}>No trained voices</Text>
                  <Text style={[theme.typography.caption, { textAlign: 'center', paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.lg }]}>
                    Train a trusted voice to compare incoming audio against it.
                  </Text>
                  <View style={{ backgroundColor: theme.colors.accentTeal, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.md }}>
                    <Text style={{ color: '#000000', fontWeight: '700' }}>Train New Voice</Text>
                  </View>
                </>
              ) : (
                <Text style={{ color: theme.colors.accentTeal, fontWeight: '700', fontSize: 16 }}>Add New Voice</Text>
              )}
            </TouchableOpacity>
          </MotiView>
        </View>
      )}
    </ScreenContainer>
  );
}
