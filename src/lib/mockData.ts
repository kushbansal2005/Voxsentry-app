export const mockStats = {
  callsScreened: 142,
  threatsBlocked: 12,
  voiceProfilesTrained: 1,
};

export const mockRecentActivity = [
  {
    id: '1',
    verdict: 'Safe',
    timestamp: '2 mins ago',
    context: 'Incoming call from Unknown',
    isThreat: false,
  },
  {
    id: '2',
    verdict: 'Threat Detected',
    timestamp: '1 hour ago',
    context: 'AI Voice Cloning Attempt',
    isThreat: true,
  },
  {
    id: '3',
    verdict: 'Safe',
    timestamp: 'Yesterday',
    context: 'Call from Mom',
    isThreat: false,
  },
];
