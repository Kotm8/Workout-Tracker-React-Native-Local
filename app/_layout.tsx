import { Stack } from "expo-router";
import './globals.css';
export default function RootLayout() {
	return <Stack
		screenOptions={{
			headerStyle: { backgroundColor: '#111827' }, // same as your screen bg
			headerTintColor: '#fff',
			contentStyle: { backgroundColor: '#111827' }, // prevents white flash
		}}
	>
		<Stack.Screen
			name="index"
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name="profile"
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name="workouts/[id]"
			options={{ headerShown: true }}
		/>

	</Stack>
}
