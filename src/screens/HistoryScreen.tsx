// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform, RefreshControl, ScrollView } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { ChevronDown, ChevronUp, ShieldCheck, ShieldAlert, History as HistoryIcon, PhoneCall } from 'lucide-react-native';
import { getHistory, DetectionEvent } from '../lib/historyStorage';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { theme } from '../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HistoryScreen({ navigation }: any) {
  const [history, setHistory] = useState<DetectionEvent[]>([]);
  const [filter, setFilter] = useState<'All' | 'Flagged' | 'Verified'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const filteredHistory = history.filter(item => {
    if (filter === 'Flagged') return item.isThreat;
    if (filter === 'Verified') return !item.isThreat;
    return true;
  });

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const computeThreatConfidence = (item: DetectionEvent) => {
    // Assuming item.confidence is a string like "12.4%"
    const rawVal = parseFloat(item.confidence);
    if (isNaN(rawVal)) return item.confidence;
    // If it's a threat but confidence is low (e.g. 12.4%), it meant "12.4% safe". So threat confidence is 100 - 12.4 = 87.6%
    if (item.isThreat && rawVal < 50) {
      return (100 - rawVal).toFixed(1) + '%';
    }
    // If it's safe and confidence is high (e.g. 98%), threat confidence is 100 - 98 = 2%
    if (!item.isThreat && rawVal > 50) {
      return (100 - rawVal).toFixed(1) + '%';
    }
    return item.confidence;
  };

  return (
    <ScreenContainer 
      scrollViewProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accentTeal} />
      }}
    >
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Text style={theme.typography.display}>Detection History</Text>
        <Text style={[theme.typography.caption, { marginTop: theme.spacing.xs, fontSize: 15, marginBottom: theme.spacing.lg }]}>Review analyzed calls</Text>
        
        {/* Segmented Control */}
        <View style={{ flexDirection: 'row', backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.borderRadius.md, padding: 4 }}>
          {['All', 'Flagged', 'Verified'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              style={{ flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: theme.borderRadius.md, backgroundColor: filter === f ? theme.colors.surface : 'transparent' }}
            >
              <Text style={{ fontWeight: '600', color: filter === f ? theme.colors.accentTeal : theme.colors.textSecondary, fontSize: 14 }}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
          <Text style={theme.typography.caption}>Loading history...</Text>
        </View>
      ) : filteredHistory.length === 0 ? (
        <MotiView 
          from={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
        >
          <EmptyState
            icon={<HistoryIcon color={theme.colors.textDisabled} size={48} />}
            title="No detections yet"
            description="Your analyzed calls will appear here once you receive them."
          />
        </MotiView>
      ) : (
        <View style={{ gap: theme.spacing.md }}>
          {filteredHistory.map((item, index) => {
            const isExpanded = expandedId === item.id;
            return (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: index * 50 }}
              >
                <Card style={{ padding: theme.spacing.md, marginBottom: 0 }}>
                  <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.full, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md, backgroundColor: item.isThreat ? `${theme.colors.dangerRed}20` : `${theme.colors.successGreen}20` }}>
                          <PhoneCall color={item.isThreat ? theme.colors.dangerRed : theme.colors.successGreen} size={20} />
                        </View>
                        <View>
                          <Text style={theme.typography.heading}>{item.context}</Text>
                          <Text style={[theme.typography.caption, { marginTop: 2 }]}>{item.timestamp}</Text>
                        </View>
                      </View>
                      <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.borderRadius.full, backgroundColor: item.isThreat ? `${theme.colors.dangerRed}20` : `${theme.colors.successGreen}20`, flexDirection: 'row', alignItems: 'center' }}>
                        {item.isThreat ? <ShieldAlert color={theme.colors.dangerRed} size={14} /> : <ShieldCheck color={theme.colors.successGreen} size={14} />}
                        <Text style={{ fontSize: 12, fontWeight: '700', marginLeft: 6, color: item.isThreat ? theme.colors.dangerRed : theme.colors.successGreen }}>
                          {item.verdict}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <View>
                        <Text style={[theme.typography.caption, { fontWeight: '600', marginBottom: 2 }]}>Threat Confidence</Text>
                        <Text style={{ fontWeight: '700', fontSize: 16, color: item.isThreat ? theme.colors.dangerRed : theme.colors.textPrimary }}>
                          {computeThreatConfidence(item)}
                        </Text>
                      </View>
                      <View style={{ padding: 4 }}>
                        {isExpanded ? <ChevronUp color={theme.colors.textSecondary} size={20} /> : <ChevronDown color={theme.colors.textSecondary} size={20} />}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md, marginTop: theme.spacing.md }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
                        <Text style={[theme.typography.caption, { fontWeight: '600' }]}>Detection Method</Text>
                        <Text style={{ fontWeight: '700', fontSize: 13, color: theme.colors.accentTeal }}>{item.method}</Text>
                      </View>
                      {item.profileChecked && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={[theme.typography.caption, { fontWeight: '600' }]}>Profile Checked</Text>
                          <Text style={{ fontWeight: '700', fontSize: 13, color: '#A855F7' }}>{item.profileChecked}</Text>
                        </View>
                      )}
                    </MotiView>
                  )}
                </Card>
              </MotiView>
            );
          })}
        </View>
      )}
    </ScreenContainer>
  );
}
