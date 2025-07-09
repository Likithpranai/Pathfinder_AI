import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  
  // Uncomment this to automatically redirect to onboarding
  // useEffect(() => {
  //   router.replace('/onboarding');
  // }, []);

  const goToOnboarding = () => {
    router.push('/onboarding');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Text style={styles.title}>Hello</Text>
      <Text style={styles.subtitle}>Welcome to the Pathfinder App</Text>
      
      <TouchableOpacity style={styles.button} onPress={goToOnboarding}>
        <Text style={styles.buttonText}>Start Onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a80f5',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4a80f5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  }
});
