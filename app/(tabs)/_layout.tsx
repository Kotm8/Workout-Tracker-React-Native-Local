import { Tabs } from "expo-router";
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/icon-symbol';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  	const colorScheme = 'light'

	return <Tabs
      	screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerTitle: "Workouts",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill"  color={color} />,
        }}
      />
    </Tabs>

}
