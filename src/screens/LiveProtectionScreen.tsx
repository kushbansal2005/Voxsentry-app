// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { MotiView } from 'moti';
import { ShieldAlert, ShieldCheck, Info, Power, AlertTriangle, Smartphone } from 'lucide-react-native';
import { useProtection } from '../context/ProtectionContext';
import { OverlayBridge } from '../lib/OverlayBridge';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { PermissionModal } from '../components/PermissionModal';
import { theme } from '../constants/theme';

export default function LiveProtectionScreen() {
  const { isProtectionActive, setIsProtectionActive } = useProtection();
  const [hasPermission, setHasPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleGrantPermission = async () => {
    setShowPermissionModal(false);
    setIsCheckingPermission(true);
    const granted = await OverlayBridge.checkAndRequestOverlayPermission();
    setHasPermission(granted);
    setIsCheckingPermission(false);
  };

  const handleToggleProtection = async () => {
    if (isProtectionActive) {
      await OverlayBridge.stopProtection();
      setIsProtectionActive(false);
    } else {
      await OverlayBridge.startProtection();
      setIsProtectionActive(true);
    }
  };

  return (
    <ScreenContainer>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={{ marginBottom: theme.spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <View style={{ flex: 1, marginRight: theme.spacing.md }}>
          <Text style={theme.typography.display}>Live Protection</Text>
        </View>
        <View style={{ backgroundColor: `${theme.colors.accentTeal}20`, borderColor: theme.colors.accentTeal, borderWidth: 1, borderRadius: theme.borderRadius.full, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
          <Smartphone color={theme.colors.accentTeal} size={14} />
          <Text style={{ color: theme.colors.accentTeal, fontSize: 12, fontWeight: '700', marginLeft: 6 }}>On-Device</Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: isProtectionActive ? theme.colors.accentTeal : theme.colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 48, height: 48, borderRadius: theme.borderRadius.full, backgroundColor: isProtectionActive ? `${theme.colors.accentTeal}20` : theme.colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md }}>
              {isProtectionActive ? <ShieldCheck color={theme.colors.accentTeal} size={24} /> : <Power color={theme.colors.textDisabled} size={24} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={theme.typography.heading}>{isProtectionActive ? 'Protection Active' : 'Live Protection'}</Text>
              <Text style={[theme.typography.caption, { marginTop: 2 }]}>{isProtectionActive ? 'Call monitoring is enabled' : 'Real-time deepfake detection'}</Text>
            </View>
          </View>
          <Switch 
            value={isProtectionActive}
            onValueChange={handleToggleProtection}
            trackColor={{ false: theme.colors.textDisabled, true: theme.colors.accentTeal }}
            thumbColor="#FFFFFF"
          />
        </Card>
      </MotiView>

      {!hasPermission && (
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Card style={{ borderColor: theme.colors.dangerRed, borderWidth: 1, backgroundColor: `${theme.colors.dangerRed}05` }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.lg }}>
              <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.full, backgroundColor: `${theme.colors.dangerRed}20`, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md }}>
                <ShieldAlert color={theme.colors.dangerRed} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.heading}>Permission Required</Text>
                <Text style={[theme.typography.body, { color: theme.colors.dangerRed, marginTop: theme.spacing.xs, fontSize: 14 }]}>
                  To display live threat alerts during phone calls, VoxSentry requires the "Display over other apps" permission.
                </Text>
              </View>
            </View>
            
              <TouchableOpacity
                style={{ backgroundColor: theme.colors.dangerRed, borderRadius: theme.borderRadius.md, paddingVertical: theme.spacing.md, alignItems: 'center' }}
                onPress={() => setShowPermissionModal(true)}
                disabled={isCheckingPermission}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                  {isCheckingPermission ? 'Checking...' : 'Grant Permission'}
                </Text>
              </TouchableOpacity>
            </Card>
          </MotiView>
        )}
  
        <View style={{ gap: theme.spacing.md }}>
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.full, backgroundColor: `${theme.colors.accentTeal}20`, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md }}>
                <Info color={theme.colors.accentTeal} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.heading}>What's Active</Text>
                <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs, lineHeight: 22 }]}>
                  VoxSentry is listening for synthetic voice patterns during speakerphone and app calls (like WhatsApp or Telegram).
                </Text>
              </View>
            </View>
          </Card>
  
          <Card style={{ borderColor: theme.colors.warningAmber, backgroundColor: `${theme.colors.warningAmber}05` }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.full, backgroundColor: `${theme.colors.warningAmber}20`, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md }}>
                <AlertTriangle color={theme.colors.warningAmber} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.heading, { color: theme.colors.warningAmber }]}>Platform Limitation</Text>
                <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs, lineHeight: 22 }]}>
                  Due to Android OS limitations, standard cellular calls cannot be intercepted directly without being placed on speakerphone.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <PermissionModal
          visible={showPermissionModal}
          icon={<ShieldAlert color={theme.colors.accentTeal} size={32} />}
          title="Allow display over other apps"
          description="VoxSentry requires this permission to display real-time threat alerts on your screen during active calls. We do not track or record your screen contents."
          onAllow={handleGrantPermission}
          onDeny={() => setShowPermissionModal(false)}
        />
      </ScreenContainer>
    );
  }
