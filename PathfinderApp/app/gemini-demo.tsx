import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { onboardingQuestions } from '../components/OnboardingQuestions';
import { getAICareerRecommendations } from '../services/GeminiService';
import AICareerResultsScreen from '../components/AICareerResultsScreen';
import { GEMINI_API_KEY, isGeminiConfigured } from '../config/apiKeys';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * This is a demo page to showcase the Gemini AI-powered career recommendations
 * It uses pre-filled sample answers to simulate a completed questionnaire
 */
export default function GeminiDemoScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Sample answers - simulating a user who completed the questionnaire
  // This represents a tech-oriented person with creative secondary traits
  const sampleAnswers = {
    1: '1a', // tech
    2: '2a', // tech
    3: '3a', // tech
    4: '4e', // creative
    5: '5a', // tech
    6: '6e', // creative
    7: '7a', // tech
    8: '8a', // tech
    9: '9e'  // creative
  };
  
  // Process the answers when the user clicks the button
  const processAnswers = async () => {
    // Check if Gemini API key is configured
    if (!isGeminiConfigured()) {
      Alert.alert(
        "API Key Required",
        "Please add your Gemini API key in the config/apiKeys.ts file to get AI-powered career recommendations.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get AI career recommendations
      const response = await getAICareerRecommendations(sampleAnswers, GEMINI_API_KEY);
      setAiResponse(response);
      setShowResults(true);
      console.log('AI Response:', response);
    } catch (error) {
      console.error('Error getting AI career recommendations:', error);
      Alert.alert(
        "Error",
        "There was an error getting career recommendations. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setShowResults(false);
    setAiResponse(null);
  };
  
  // Handle continue to dashboard
  const handleContinueToDashboard = () => {
    // In a real app, this would navigate to the dashboard
    setShowResults(false);
    setAiResponse(null);
  };
  
  // If showing results, display AI career recommendations
  if (showResults && aiResponse) {
    return (
      <AICareerResultsScreen
        aiResponse={aiResponse}
        isLoading={isLoading}
        onRetakeQuiz={handleRetakeQuiz}
        onContinue={handleContinueToDashboard}
      />
    );
  }
  
  // Otherwise, show a button to start the test
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0052CC', '#0065FF', '#4C9AFF']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Gemini AI Career Recommendations</Text>
        <Text style={styles.subtitle}>
          This demo shows how Gemini AI analyzes your answers and suggests personalized career paths.
        </Text>
        <Text style={styles.description}>
          We've pre-filled some sample answers that represent a tech-oriented person
          with creative secondary traits. Click the button below to see the AI-generated recommendations.
        </Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Consulting Gemini AI...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={processAnswers}>
            <Text style={styles.buttonText}>Get AI Career Recommendations</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0052CC',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#0052CC',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});
