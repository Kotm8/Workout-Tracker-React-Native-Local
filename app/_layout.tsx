import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = 'light';
  return (
    <ThemeProvider value={colorScheme !== 'light' ? DarkTheme : DefaultTheme}>

      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="workouts/[id]"
          options={{
            headerShown: true,
          }}
        />
      </Stack>
      <StatusBar
        style={colorScheme === 'light' ? 'dark' : 'light'}
        backgroundColor={colorScheme === 'light' ? 'white' : '#000'}
      />
    </ThemeProvider>
  );
}
