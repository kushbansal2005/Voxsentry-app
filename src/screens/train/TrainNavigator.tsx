// @ts-nocheck
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VoiceLibraryScreen from './VoiceLibraryScreen';
import ConsentScreen from './ConsentScreen';
import RecordingScreen from './RecordingScreen';
import ProcessingScreen from './ProcessingScreen';

const Stack = createNativeStackNavigator();

export default function TrainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VoiceLibrary" component={VoiceLibraryScreen} />
      <Stack.Screen name="Consent" component={ConsentScreen} />
      <Stack.Screen name="Recording" component={RecordingScreen} />
      <Stack.Screen name="Processing" component={ProcessingScreen} />
    </Stack.Navigator>
  );
}
