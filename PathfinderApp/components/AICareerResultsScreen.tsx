import React, { useState, useRef } from 'react';
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
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolate,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AICareerResponse, CareerRecommendation } from '../services/GeminiService';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.65;

interface AICareerResultsScreenProps {
  aiResponse: AICareerResponse | null;
  isLoading: boolean;
  onRetakeQuiz: () => void;
  onContinue: () => void;
}

export default function AICareerResultsScreen({ 
  aiResponse, 
  isLoading,
  onRetakeQuiz,
  onContinue
}: AICareerResultsScreenProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
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

  // Swipeable card implementation
  const CardStack = () => {
    if (!aiResponse || !aiResponse.recommendations || aiResponse.recommendations.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <MaterialIcons name="error-outline" size={60} color="#fff" />
          <Text style={styles.noResultsText}>No career recommendations available</Text>
        </View>
      );
    }
    
    const recommendations = aiResponse.recommendations;
    
    // Animation values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const scale = useSharedValue(1);
    const nextScale = useSharedValue(0.9);
    
    // Reset animation values
    const resetCard = () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotate.value = withSpring(0);
      scale.value = withSpring(1);
      nextScale.value = withSpring(0.9);
    };
    
    // Move to next card
    const moveToNextCard = () => {
      if (currentCardIndex < recommendations.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      }
      resetCard();
    };
    
    // Gesture handler for swipe
    const gesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
        rotate.value = interpolate(
          translateX.value,
          [-width / 2, 0, width / 2],
          [-10, 0, 10],
          Extrapolate.CLAMP
        );
        scale.value = interpolate(
          Math.abs(translateX.value),
          [0, 100],
          [1, 0.95],
          Extrapolate.CLAMP
        );
        nextScale.value = interpolate(
          Math.abs(translateX.value),
          [0, 100],
          [0.9, 0.95],
          Extrapolate.CLAMP
        );
      })
      .onEnd((event) => {
        if (Math.abs(translateX.value) > width * 0.3) {
          translateX.value = withTiming(
            Math.sign(translateX.value) * width * 1.5,
            { duration: 250 },
            () => {
              runOnJS(moveToNextCard)();
            }
          );
        } else {
          resetCard();
        }
      });
    
    // Animated styles
    const cardStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotate.value}deg` },
          { scale: scale.value }
        ]
      };
    });
    
    const nextCardStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: nextScale.value }
        ],
        opacity: interpolate(
          nextScale.value,
          [0.9, 0.95],
          [0.6, 0.8],
          Extrapolate.CLAMP
        )
      };
    });
    
    // Current and next recommendation
    const currentRecommendation = recommendations[currentCardIndex];
    const nextRecommendation = currentCardIndex < recommendations.length - 1 
      ? recommendations[currentCardIndex + 1] 
      : null;
    
    return (
      <View style={styles.cardsContainer}>
        {/* Next card (shown behind current) */}
        {nextRecommendation && (
          <Animated.View style={[styles.card, styles.nextCard, nextCardStyle]}>
            <CareerCard recommendation={nextRecommendation} />
          </Animated.View>
        )}
        
        {/* Current card (swipeable) */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.card, cardStyle]}>
            <CareerCard recommendation={currentRecommendation} />
          </Animated.View>
        </GestureDetector>
        
        {/* Card counter */}
        <View style={styles.cardCounter}>
          <Text style={styles.cardCounterText}>
            {currentCardIndex + 1} / {recommendations.length}
          </Text>
        </View>
        
        {/* Swipe instruction */}
        <View style={styles.swipeInstruction}>
          <Ionicons name="swap-horizontal" size={20} color="#fff" />
          <Text style={styles.swipeInstructionText}>Swipe to see more</Text>
        </View>
      </View>
    );
  };
  
  // Individual career card component
  const CareerCard = ({ recommendation }: { recommendation: CareerRecommendation }) => {
    const fieldColor = getFieldColor(recommendation.field);
    
    return (
      <View style={styles.cardContent}>
        {/* Card header */}
        <LinearGradient
          colors={[fieldColor, fieldColor + 'CC']}
          style={styles.cardHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.fieldIconContainer}>
            {getFieldIcon(recommendation.field)}
          </View>
          <Text style={styles.fieldTitle}>{recommendation.field}</Text>
        </LinearGradient>
        
        {/* Card body */}
        <ScrollView style={styles.cardBody} showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{recommendation.description}</Text>
          </View>
          
          {/* Roles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Potential Roles</Text>
            <View style={styles.rolesList}>
              {recommendation.roles.map((role, index) => (
                <View key={index} style={[styles.roleChip, { backgroundColor: fieldColor + '20' }]}>
                  <Text style={[styles.roleText, { color: fieldColor }]}>{role}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Skills</Text>
            <View style={styles.skillsList}>
              {recommendation.skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <MaterialIcons name="check-circle" size={16} color={fieldColor} />
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Education */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.educationList}>
              {recommendation.education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
                  <MaterialIcons name="school" size={16} color={fieldColor} />
                  <Text style={styles.educationText}>{edu}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Why it's a good fit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why It's a Good Fit For You</Text>
            <View style={[styles.fitReasonBox, { borderColor: fieldColor + '50', backgroundColor: fieldColor + '10' }]}>
              <Text style={[styles.fitReasonLabel, { color: fieldColor }]}>Based on your responses:</Text>
              <Text style={styles.fitReasonText}>{recommendation.fitReason}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

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
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your AI Career Matches</Text>
        <Text style={styles.headerSubtitle}>Powered by Grok AI</Text>
      </View>
      
      {/* Personality Insight */}
      {aiResponse && aiResponse.personalityInsight && (
        <View style={styles.insightContainer}>
          <Text style={styles.insightText}>{aiResponse.personalityInsight}</Text>
        </View>
      )}
      
      {/* Career Cards */}
      <CardStack />
      
      {/* Bottom Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onRetakeQuiz}>
          <MaterialIcons name="refresh" size={20} color="#0052CC" />
          <Text style={styles.secondaryButtonText}>Retake Quiz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  insightContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  nextCard: {
    zIndex: -1,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fieldTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardBody: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
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
  swipeInstruction: {
    position: 'absolute',
    bottom: -30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  swipeInstructionText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#0052CC',
    fontWeight: '600',
    marginLeft: 6,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0052CC',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginRight: 6,
  },
});
