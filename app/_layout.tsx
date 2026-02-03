import { Stack, useRouter } from "expo-router";
import {Button, Text, View, StyleSheet, Pressable} from 'react-native'; 

// Header Customization for Screens
//Make it so that not every result gets turned into a new layer and get rid of the back button in result screen AND homescreen
//back button seems to track history/stacked screens, make it not stack
export default function RootLayout() {
  const router = useRouter();
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#537acd',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 24,
        },
        headerTitle: "WordHunt Trainer",
      }}
      />
      <Stack.Screen name="game" options={{
        headerTitle: "",
        headerStyle: {
          backgroundColor: '#2f943fb8',
        },
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </Pressable>
        ),
      }}
      />
      <Stack.Screen name="results" options={{
        headerTitle: "Results",
        headerStyle: {
          backgroundColor: '#2f943fb8',
        },
        headerShown: true,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 24,
        },
      }}
      />
    </Stack>
  );
}


const styles = StyleSheet.create({
  exitButton: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#c4173d',
    borderWidth: 2,
    width: 80,
    height: 40,
    borderColor: 'black',
    borderRadius: 5,
    marginLeft: 15,
  },
  exitButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 600,
    justifyContent: 'center', 
    alignItems: 'center',
  },
});









