import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MotiView } from 'moti';
import { Shield, ShieldAlert, Mic, Clock, Settings, PhoneCall, ShieldCheck, User } from 'lucide-react-native';
import { mockStats, mockRecentActivity } from '../lib/mockData';
import { useProtection } from '../context/ProtectionContext';

export default function DashboardScreen({ navigation }: any) {
  const { isProtectionActive } = useProtection();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View className="flex-1 bg-[#0A0A1F]">
      <ScrollView 
        className="flex-1 px-6 pt-12 pb-24"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22D3EE" />
        }
      >
        {/* Header */}
        <MotiView 
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="flex-row justify-between items-center mb-8"
        >
          <View>
            <Text className="text-gray-400 text-sm tracking-wider">WELCOME BACK,</Text>
            <Text className="text-white text-2xl font-bold mt-1">Alex</Text>
          </View>
          <View className="w-12 h-12 bg-[#1E1042] rounded-full items-center justify-center border border-[#22D3EE]/30">
            <User color="#22D3EE" size={24} />
          </View>
        </MotiView>

        {/* Protection Status Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 100 }}
          className={`p-6 rounded-2xl mb-8 border ${isProtectionActive ? 'bg-[#10B981]/10 border-[#10B981]/50' : 'bg-[#1E1042] border-gray-600'}`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {isProtectionActive ? (
                <ShieldCheck color="#10B981" size={32} />
              ) : (
                <ShieldAlert color="#6B7280" size={32} />
              )}
              <View className="ml-4">
                <Text className="text-white text-xl font-bold">
                  Protection {isProtectionActive ? 'Active' : 'Inactive'}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {isProtectionActive ? 'Voice analysis running' : 'Tap Live Protection to start'}
                </Text>
              </View>
            </View>
            <View className={`w-3 h-3 rounded-full ${isProtectionActive ? 'bg-[#10B981]' : 'bg-gray-600'}`} />
          </View>
        </MotiView>

        {/* Quick Stats Row */}
        <View className="flex-row justify-between mb-8">
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 200 }} className="flex-1 bg-[#1E1042] p-4 rounded-xl border border-white/5 mr-2 items-center">
            <Text className="text-[#22D3EE] text-2xl font-bold">{mockStats.callsScreened}</Text>
            <Text className="text-gray-400 text-xs mt-1 text-center">Screened</Text>
          </MotiView>
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 300 }} className="flex-1 bg-[#1E1042] p-4 rounded-xl border border-white/5 mx-2 items-center">
            <Text className="text-[#EF4444] text-2xl font-bold">{mockStats.threatsBlocked}</Text>
            <Text className="text-gray-400 text-xs mt-1 text-center">Blocked</Text>
          </MotiView>
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 400 }} className="flex-1 bg-[#1E1042] p-4 rounded-xl border border-white/5 ml-2 items-center">
            <Text className="text-[#A855F7] text-2xl font-bold">{mockStats.voiceProfilesTrained}</Text>
            <Text className="text-gray-400 text-xs mt-1 text-center">Profiles</Text>
          </MotiView>
        </View>

        {/* Quick Actions Grid */}
        <Text className="text-white font-bold text-lg mb-4">Quick Actions</Text>
        <View className="flex-row justify-between mb-8">
          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500, delay: 500 }} className="flex-1 mr-2">
            <TouchableOpacity 
              accessibilityLabel="Navigate to Train Voice Screen"
              accessibilityRole="button"
              onPress={() => navigation.navigate('Train')} 
              className="bg-[#1E1042] p-4 rounded-xl border border-white/5 items-center min-h-[100px]"
            >
              <View className="w-12 h-12 rounded-full bg-[#A855F7]/20 items-center justify-center mb-3">
                <Mic color="#A855F7" size={24} />
              </View>
              <Text className="text-white text-xs text-center font-bold">Train Voice</Text>
            </TouchableOpacity>
          </MotiView>
          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500, delay: 600 }} className="flex-1 mx-2">
            <TouchableOpacity 
              accessibilityLabel="Navigate to History Screen"
              accessibilityRole="button"
              onPress={() => navigation.navigate('History')} 
              className="bg-[#1E1042] p-4 rounded-xl border border-white/5 items-center min-h-[100px]"
            >
              <View className="w-12 h-12 rounded-full bg-[#22D3EE]/20 items-center justify-center mb-3">
                <Clock color="#22D3EE" size={24} />
              </View>
              <Text className="text-white text-xs text-center font-bold">History</Text>
            </TouchableOpacity>
          </MotiView>
          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500, delay: 700 }} className="flex-1 ml-2">
            <TouchableOpacity 
              accessibilityLabel="Navigate to Settings Screen"
              accessibilityRole="button"
              onPress={() => navigation.navigate('Settings')} 
              className="bg-[#1E1042] p-4 rounded-xl border border-white/5 items-center min-h-[100px]"
            >
              <View className="w-12 h-12 rounded-full bg-gray-500/20 items-center justify-center mb-3">
                <Settings color="#9CA3AF" size={24} />
              </View>
              <Text className="text-white text-xs text-center font-bold">Settings</Text>
            </TouchableOpacity>
          </MotiView>
        </View>

        {/* Recent Activity */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-bold text-lg">Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text className="text-[#22D3EE] text-sm">View All</Text>
          </TouchableOpacity>
        </View>

        {mockRecentActivity.slice(0, 3).map((item, index) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 800 + index * 100 }}
            className="bg-[#1E1042] p-4 rounded-xl mb-3 border border-white/5 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${item.isThreat ? 'bg-[#EF4444]/20' : 'bg-[#10B981]/20'}`}>
                <PhoneCall color={item.isThreat ? '#EF4444' : '#10B981'} size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold" numberOfLines={1}>{item.context}</Text>
                <Text className="text-gray-400 text-xs mt-1">{item.timestamp}</Text>
              </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${item.isThreat ? 'bg-[#EF4444]/20' : 'bg-[#10B981]/20'}`}>
              <Text className={`text-xs font-bold ${item.isThreat ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                {item.verdict}
              </Text>
            </View>
          </MotiView>
        ))}
        
        {/* Bottom padding spacer to clear absolute tab bar */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
