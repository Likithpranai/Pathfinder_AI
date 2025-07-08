import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Text style={styles.title}>Hello</Text>
      <Text style={styles.subtitle}>Welcome to the Pathfinder App</Text>
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
  },
});
