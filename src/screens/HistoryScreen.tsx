import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation, UIManager, Platform, RefreshControl } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { ChevronDown, ChevronUp, ShieldCheck, ShieldAlert, History as HistoryIcon } from 'lucide-react-native';
import { getHistory, DetectionEvent } from '../lib/historyStorage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState<DetectionEvent[]>([]);
  const [filter, setFilter] = useState<'All' | 'Flagged' | 'Verified'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const data = await getHistory();
    setHistory(data);
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

  return (
    <View className="flex-1 bg-[#0A0A1F]">
      <View className="px-6 pt-16 pb-4">
        <Text className="text-white text-3xl font-bold">Detection History</Text>
        <Text className="text-gray-400 mt-2 mb-6">Review all screened calls</Text>
        
        <View className="flex-row gap-2">
          {['All', 'Flagged', 'Verified'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full border ${filter === f ? 'bg-[#22D3EE] border-[#22D3EE]' : 'bg-[#1E1042] border-white/10'}`}
            >
              <Text className={`font-bold ${filter === f ? 'text-[#0A0A1F]' : 'text-gray-400'}`}>
                {f === 'All' ? 'All' : f === 'Flagged' ? 'Flagged Only' : 'Verified Only'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22D3EE" />
        }
      >
        {filteredHistory.length === 0 ? (
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="items-center justify-center mt-20"
          >
            <View className="bg-[#1E1042] w-24 h-24 rounded-full items-center justify-center mb-6 border border-white/5">
              <HistoryIcon color="#6B7280" size={48} />
            </View>
            <Text className="text-white text-xl font-bold mb-2">No calls screened yet</Text>
            <Text className="text-gray-400 text-center">Your protected calls will show up here once VoxSentry begins monitoring.</Text>
          </MotiView>
        ) : (
          filteredHistory.map((item, index) => {
            const isExpanded = expandedId === item.id;
            return (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: index * 50 }}
                className="bg-[#1E1042] rounded-2xl p-4 border border-white/5 mb-4 shadow-lg overflow-hidden"
              >
                <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
                  <View className="flex-row justify-between items-start mb-3">
                    <View className={`px-3 py-1 rounded-full flex-row items-center ${item.isThreat ? 'bg-[#EF4444]/20' : 'bg-[#10B981]/20'}`}>
                      {item.isThreat ? <ShieldAlert color="#EF4444" size={14} /> : <ShieldCheck color="#10B981" size={14} />}
                      <Text className={`text-xs font-bold ml-1 ${item.isThreat ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                        {item.verdict}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-xs">{item.timestamp}</Text>
                  </View>

                  <View className="flex-row justify-between items-end mb-2">
                    <View>
                      <Text className="text-white font-bold text-lg mb-1">{item.context}</Text>
                      <Text className="text-gray-400 text-sm">Confidence: <Text className={item.isThreat ? 'text-[#EF4444]' : 'text-[#10B981]'}>{item.confidence}</Text></Text>
                    </View>
                    <View className="p-2">
                      {isExpanded ? <ChevronUp color="#9CA3AF" size={20} /> : <ChevronDown color="#9CA3AF" size={20} />}
                    </View>
                  </View>
                </TouchableOpacity>

                <AnimatePresence>
                  {isExpanded && (
                    <MotiView
                      from={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ type: 'timing', duration: 300 }}
                      className="border-t border-white/10 pt-3"
                    >
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-400 text-xs">Detection Method</Text>
                        <Text className="text-[#22D3EE] text-xs font-bold">{item.method}</Text>
                      </View>
                      {item.profileChecked && (
                        <View className="flex-row justify-between">
                          <Text className="text-gray-400 text-xs">Profile Checked</Text>
                          <Text className="text-[#A855F7] text-xs font-bold">{item.profileChecked}</Text>
                        </View>
                      )}
                    </MotiView>
                  )}
                </AnimatePresence>
              </MotiView>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
