import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AICareerResponse } from '../services/GeminiService';

// Define styles at the top of the file to avoid 'used before declaration' errors
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 70,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 5,
  },
  careerListContainer: {
    padding: 16,
    paddingTop: 0,
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  careerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  careerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'space-between',
  },
  careerCardContent: {
    padding: 16,
  },
  fieldIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  careerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#555',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 12,
  },
  saveButton: {
    padding: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f6ff',
    borderWidth: 1,
    borderColor: '#0052CC',
  },
  secondaryButtonText: {
    color: '#0052CC',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#0052CC',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  personalityContainer: {
    padding: 20,
  },
  personalityHeader: {
    marginBottom: 24,
  },
  personalityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  personalitySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  personalityDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 24,
  },
  distributionContainer: {
    marginBottom: 30,
  },
  distributionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distributionLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
  },
  distributionBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
  },
  distributionPercent: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    marginLeft: 8,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#0052CC',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardBody: {
    padding: 16,
  },
  fieldTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  swipeInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  swipeInstructionText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
  },
  fullPagePersonalityContainer: {
    flex: 1,
    padding: 20,
  },
  insightContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  traitBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  traitName: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  traitPercentage: {
    width: 40,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    marginLeft: 8,
  },
  fullWidthButtonContainer: {
    padding: 16,
    marginTop: 'auto',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  fullWidthButton: {
    backgroundColor: '#0052CC',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fullWidthButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  rolesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  skillsList: {
    marginTop: 4,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  educationList: {
    marginTop: 4,
  },
  educationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  educationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  fitReasonBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fitReasonLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  fitReasonText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    fontStyle: 'italic',
  },
  cardCounter: {
    position: 'absolute',
    top: -30,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingSubtext: {
    color: '#E0E0FF',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  }
});

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

interface AIPersonalityResultsScreenProps {
  aiResponse: AICareerResponse | null;
  isLoading?: boolean;
  onRetakeQuiz: () => void;
  onContinue: () => void;
}

export default function AIPersonalityResultsScreen({ 
  aiResponse, 
  isLoading,
  onRetakeQuiz,
  onContinue
}: AIPersonalityResultsScreenProps) {
  // No need for showResults state as we're only showing personality results
  const router = useRouter();
  
  // Field colors for visual distinction
  const getFieldColor = (field: string) => {
    const colorMap: Record<string, string> = {
      'Technology': '#4285F4',
      'Engineering': '#EA4335',
      'Science': '#34A853',
      'Business': '#FBBC05',
      'Healthcare': '#46BDC6',
      'Education': '#9C27B0',
      'Arts': '#FF5722',
      'Social Sciences': '#795548',
      'Finance': '#607D8B',
      'Law': '#3F51B5'
    };
    
    // Find a partial match in the keys
    const matchedKey = Object.keys(colorMap).find(key => 
      field.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? colorMap[matchedKey] : '#0052CC'; // Default blue
  };
  
  // Get field icon
  const getFieldIcon = (field: string) => {
    const iconMap: Record<string, any> = {
      'Technology': <Ionicons name="code-slash" size={24} color="#fff" />,
      'Engineering': <MaterialCommunityIcons name="engine" size={24} color="#fff" />,
      'Science': <MaterialIcons name="science" size={24} color="#fff" />,
      'Business': <MaterialIcons name="business" size={24} color="#fff" />,
      'Healthcare': <FontAwesome5 name="heartbeat" size={22} color="#fff" />,
      'Education': <Ionicons name="school" size={24} color="#fff" />,
      'Arts': <Ionicons name="color-palette" size={24} color="#fff" />,
      'Social Sciences': <Ionicons name="people" size={24} color="#fff" />,
      'Finance': <MaterialIcons name="attach-money" size={24} color="#fff" />,
      'Law': <MaterialIcons name="gavel" size={24} color="#fff" />
    };
    
    // Find a partial match in the keys
    const matchedKey = Object.keys(iconMap).find(key => 
      field.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? iconMap[matchedKey] : <Ionicons name="briefcase" size={24} color="#fff" />;
  };
  
  // This is a duplicate function - removed

  // Personality results component
  const renderPersonalityResults = () => {
    if (!aiResponse || !aiResponse.personalityInsight) {
      return (
        <View style={styles.noResultsContainer}>
          <MaterialIcons name="error-outline" size={60} color="#fff" />
          <Text style={styles.noResultsText}>No personality results available</Text>
        </View>
      );
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        {/* Background Gradient */}
        <LinearGradient
          colors={['#0052CC', '#0065FF', '#4C9AFF']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Personality Profile</Text>
          </View>
          
          {/* Personality Insight - Main section */}
          <View style={styles.fullPagePersonalityContainer}>
            <View style={styles.insightContainer}>
              <Text style={styles.insightTitle}>Personality Analysis</Text>
              <Text style={styles.insightText}>{aiResponse.personalityInsight}</Text>
            </View>
            
            {/* Personality Distribution */}
            {aiResponse.personalityDistribution && (
              <View style={styles.distributionContainer}>
                <Text style={styles.distributionTitle}>Your Trait Distribution</Text>
                {aiResponse.personalityDistribution && Object.entries(aiResponse.personalityDistribution).map(([trait, percentage], index) => (
                  <View key={index} style={styles.traitBar}>
                    <Text style={styles.traitName}>{trait}</Text>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.barFill, 
                          { 
                            width: `${percentage}%` as any,
                            backgroundColor: getFieldColor(trait)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.traitPercentage}>{percentage.toString()}%</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Bottom Buttons - Fixed at bottom */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={onRetakeQuiz}
          >
            <MaterialIcons name="refresh" size={20} color="#0052CC" />
            <Text style={styles.secondaryButtonText}>Retake Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={onContinue}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  // We've removed the CareerRecommendationsScreen and CareerCard components since we're only showing personality results

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#0052CC', '#0065FF', '#4C9AFF']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Analyzing your responses with AI...</Text>
          <Text style={styles.loadingSubtext}>Generating personalized career recommendations</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Only show personality results
  return renderPersonalityResults();
}
