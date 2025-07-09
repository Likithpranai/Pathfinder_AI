import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { onboardingQuestions } from '../components/OnboardingQuestions';
import { analyzeAnswers, getCareerRecommendations } from '../utils/CareerRecommendations';
import CareerResultsScreen from '../components/CareerResultsScreen';

/**
 * This is a test page to demonstrate the career recommendation system
 * It pre-fills some sample answers and shows the results in flashcard format
 */
export default function CareerTestScreen() {
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
  const processAnswers = () => {
    setShowResults(true);
  };
  
  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setShowResults(false);
  };
  
  // Handle continue to dashboard
  const handleContinueToDashboard = () => {
    // In a real app, this would navigate to the dashboard
    setShowResults(false);
  };
  
  // If showing results, analyze the answers and show the career recommendations
  if (showResults) {
    const personalityProfile = analyzeAnswers(sampleAnswers, onboardingQuestions);
    const careerRecommendations = getCareerRecommendations(personalityProfile);
    
    return (
      <CareerResultsScreen
        personalityProfile={personalityProfile}
        careerRecommendations={careerRecommendations}
        onRetakeQuiz={handleRetakeQuiz}
        onContinue={handleContinueToDashboard}
      />
    );
  }
  
  // Otherwise, show a button to start the test
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Career Path AI</Text>
        <Text style={styles.subtitle}>
          This demo shows how the AI analyzes your answers and suggests career paths
          based on your personality profile.
        </Text>
        <Text style={styles.description}>
          We've pre-filled some sample answers that represent a tech-oriented person
          with creative secondary traits. Click the button below to see the results.
        </Text>
        <TouchableOpacity style={styles.button} onPress={processAnswers}>
          <Text style={styles.buttonText}>Show Career Recommendations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0052CC',
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
});
