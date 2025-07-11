import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Platform,
  ScrollView,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { PersonalityProfile, CareerPath } from '../utils/CareerRecommendations';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.6;
const SPACING = 12;

interface CareerResultsScreenProps {
  personalityProfile: PersonalityProfile;
  careerRecommendations: CareerPath[];
  onRetakeQuiz: () => void;
  onContinue: () => void;
}

export default function CareerResultsScreen({ 
  personalityProfile, 
  careerRecommendations, 
  onRetakeQuiz,
  onContinue
}: CareerResultsScreenProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Get personality type color
  const getPersonalityColor = (type: string) => {
    switch (type) {
      case 'tech': return '#4a90e2';
      case 'engineering': return '#f5a623';
      case 'science': return '#7ed321';
      case 'business': return '#9013fe';
      case 'creative': return '#e91e63';
      case 'social': return '#50e3c2';
      default: return '#0052CC';
    }
  };

  // Get personality type icon
  const getPersonalityIcon = (type: string) => {
    switch (type) {
      case 'tech':
        return <Ionicons name="code-outline" size={24} color="#4a90e2" />;
      case 'engineering':
        return <MaterialIcons name="build" size={24} color="#f5a623" />;
      case 'science':
        return <MaterialIcons name="science" size={24} color="#7ed321" />;
      case 'business':
        return <MaterialIcons name="business" size={24} color="#9013fe" />;
      case 'creative':
        return <Ionicons name="color-palette-outline" size={24} color="#e91e63" />;
      case 'social':
        return <Ionicons name="people-outline" size={24} color="#50e3c2" />;
      default:
        return null;
    }
  };

  // Handle scroll end to update active card index
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
    setActiveCardIndex(newIndex);
  };

  // Scroll to specific card
  const scrollToCard = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollTo({ 
        x: index * (CARD_WIDTH + SPACING), 
        animated: true 
      });
    }
  };

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
        <ThemedText style={styles.headerTitle}>Your Career Path</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Based on your personality profile</ThemedText>
      </View>
      
      {/* Personality Profile Summary */}
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={[styles.profileIconContainer, { backgroundColor: getPersonalityColor(personalityProfile.dominantType) + '20' }]}>
            {getPersonalityIcon(personalityProfile.dominantType)}
          </View>
          <View style={styles.profileTextContainer}>
            <ThemedText style={styles.profileType}>
              {personalityProfile.dominantType.charAt(0).toUpperCase() + personalityProfile.dominantType.slice(1)} / 
              {personalityProfile.secondaryType.charAt(0).toUpperCase() + personalityProfile.secondaryType.slice(1)}
            </ThemedText>
            <ThemedText style={styles.profileTitle}>Personality Profile</ThemedText>
          </View>
        </View>
        
        {/* Distribution Bar */}
        <View style={styles.distributionContainer}>
          {Object.entries(personalityProfile.distribution).map(([type, percentage], index) => (
            <View 
              key={type} 
              style={[
                styles.distributionBar, 
                { 
                  width: `${percentage}%`, 
                  backgroundColor: getPersonalityColor(type),
                  zIndex: 10 - index
                }
              ]} 
            />
          ))}
        </View>
        
        {/* Distribution Legend */}
        <View style={styles.legendContainer}>
          {Object.entries(personalityProfile.distribution)
            .filter(([_, percentage]) => percentage > 0)
            .sort(([_, a], [__, b]) => b - a)
            .map(([type, percentage]) => (
              <View key={type} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: getPersonalityColor(type) }]} />
                <ThemedText style={styles.legendText}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} {percentage}%
                </ThemedText>
              </View>
            ))}
        </View>
      </View>
      
      {/* Career Recommendations Flashcards */}
      <View style={styles.cardsContainer}>
        <ThemedText style={styles.cardsTitle}>Recommended Career Paths</ThemedText>
        <ThemedText style={styles.cardsSubtitle}>Swipe to explore options</ThemedText>
        
        <ScrollView
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollViewContent}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
        >
          {careerRecommendations.map((career, index) => (
            <View 
              key={index} 
              style={[
                styles.card,
                { 
                  marginLeft: index === 0 ? SPACING : 0,
                  marginRight: index === careerRecommendations.length - 1 ? SPACING : 0
                }
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[
                  styles.cardIconContainer, 
                  { backgroundColor: getPersonalityColor(career.personalityTypes[0]) + '20' }
                ]}>
                  {getPersonalityIcon(career.personalityTypes[0])}
                </View>
                <ThemedText style={styles.cardTitle}>{career.title}</ThemedText>
              </View>
              
              <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
                <ThemedText style={styles.cardDescription}>{career.description}</ThemedText>
                
                <View style={styles.cardSection}>
                  <ThemedText style={styles.sectionTitle}>Key Skills</ThemedText>
                  <View style={styles.skillsContainer}>
                    {career.skills.map((skill, i) => (
                      <View key={i} style={styles.skillBadge}>
                        <ThemedText style={styles.skillText}>{skill}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.cardSection}>
                  <ThemedText style={styles.sectionTitle}>Education</ThemedText>
                  {career.education.map((edu, i) => (
                    <View key={i} style={styles.listItem}>
                      <MaterialIcons name="school" size={16} color="#0052CC" />
                      <ThemedText style={styles.listItemText}>{edu}</ThemedText>
                    </View>
                  ))}
                </View>
                
                <View style={styles.cardSection}>
                  <ThemedText style={styles.sectionTitle}>Industries</ThemedText>
                  <View style={styles.industriesContainer}>
                    {career.industries.map((industry, i) => (
                      <View key={i} style={styles.industryBadge}>
                        <ThemedText style={styles.industryText}>{industry}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.cardSection}>
                  <ThemedText style={styles.sectionTitle}>Growth & Salary</ThemedText>
                  <View style={styles.listItem}>
                    <MaterialIcons name="trending-up" size={16} color="#0052CC" />
                    <ThemedText style={styles.listItemText}>{career.growthPotential}</ThemedText>
                  </View>
                  <View style={styles.listItem}>
                    <MaterialIcons name="attach-money" size={16} color="#0052CC" />
                    <ThemedText style={styles.listItemText}>{career.salaryRange}</ThemedText>
                  </View>
                </View>
                
                {/* AI-powered personalized fit reason */}
                {career.fitReason && (
                  <View style={styles.cardSection}>
                    <ThemedText style={styles.sectionTitle}>Why This Fits You</ThemedText>
                    <View style={[styles.fitReasonContainer, { backgroundColor: getPersonalityColor(personalityProfile.dominantType) + '15' }]}>
                      <MaterialIcons name="psychology" size={18} color={getPersonalityColor(personalityProfile.dominantType)} style={styles.fitReasonIcon} />
                      <ThemedText style={styles.fitReasonText}>{career.fitReason}</ThemedText>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
        
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {careerRecommendations.map((_, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.paginationDot,
                activeCardIndex === index && styles.paginationDotActive
              ]}
              onPress={() => scrollToCard(index)}
            />
          ))}
        </View>
      </View>
      
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  profileContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  profileTitle: {
    fontSize: 14,
    color: '#666',
  },
  distributionContainer: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  distributionBar: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  cardsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  cardsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  cardsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollViewContent: {
    paddingRight: SPACING,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardSection: {
    marginBottom: 16,
  },
  fitReasonContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fitReasonIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  fitReasonText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: 'rgba(0, 82, 204, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#0052CC',
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listItemText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  industriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  industryBadge: {
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.2)',
  },
  industryText: {
    fontSize: 12,
    color: '#555',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 5,
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
