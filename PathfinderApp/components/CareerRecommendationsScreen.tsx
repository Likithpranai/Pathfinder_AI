import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { AICareerResponse, CareerRecommendation } from '../types/AITypes';
import { CareerPath } from '../types/CareerTypes';

interface CareerRecommendationsScreenProps {
  aiResponse: AICareerResponse;
  isLoading: boolean;
  onBack: () => void;
}

// Animation for progress bars
const AnimatedProgressBar = ({ percentage, color, delay = 0 }: { percentage: number, color: string, delay?: number }) => {
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 1000,
      delay: delay,
      useNativeDriver: false
    }).start();
  }, [percentage, delay]);
  
  return (
    <Animated.View 
      style={[{
        height: '100%',
        borderRadius: 6,
        backgroundColor: color,
        width: widthAnim.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%']
        })
      }]} 
    />
  );
};

export default function CareerRecommendationsScreen({ 
  aiResponse, 
  isLoading,
  onBack
}: CareerRecommendationsScreenProps) {
  const router = useRouter();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // Function to get color based on field
  const getFieldColor = (field: string): string => {
    const fieldColors: Record<string, string> = {
      tech: '#4285F4',      // Google Blue
      technology: '#4285F4',
      engineering: '#EA4335', // Google Red
      science: '#34A853',   // Google Green
      business: '#FBBC05',  // Google Yellow
      creative: '#FF5722',  // Deep Orange
      social: '#9C27B0',    // Purple
      healthcare: '#46BDC6', // Teal
      education: '#673AB7', // Deep Purple
      finance: '#607D8B',   // Blue Grey
      law: '#3F51B5',       // Indigo
      arts: '#E91E63',      // Pink
    };
    
    // Find a partial match in the keys
    const matchedKey = Object.keys(fieldColors).find(key => 
      field.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? fieldColors[matchedKey] : '#0052CC'; // Default to Atlassian blue
  };
  
  // Function to get icon based on field
  const getFieldIcon = (field: string) => {
    const fieldIcons: Record<string, any> = {
      tech: <MaterialIcons name="computer" size={24} color="#ffffff" />,
      technology: <MaterialIcons name="computer" size={24} color="#ffffff" />,
      engineering: <MaterialCommunityIcons name="engine" size={24} color="#ffffff" />,
      science: <MaterialIcons name="science" size={24} color="#ffffff" />,
      business: <MaterialIcons name="business" size={24} color="#ffffff" />,
      creative: <MaterialIcons name="palette" size={24} color="#ffffff" />,
      social: <MaterialIcons name="people" size={24} color="#ffffff" />,
      healthcare: <FontAwesome5 name="heartbeat" size={22} color="#ffffff" />,
      education: <MaterialIcons name="school" size={24} color="#ffffff" />,
      arts: <MaterialIcons name="color-lens" size={24} color="#ffffff" />,
      finance: <MaterialIcons name="attach-money" size={24} color="#ffffff" />,
      law: <MaterialIcons name="gavel" size={24} color="#ffffff" />
    };
    
    // Find a partial match in the keys
    const matchedKey = Object.keys(fieldIcons).find(key => 
      field.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? fieldIcons[matchedKey] : <MaterialIcons name="work" size={24} color="#ffffff" />;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#0052CC' }]}>
        <StatusBar style="light" />
        <MaterialCommunityIcons name="briefcase-search" size={60} color="#ffffff" />
        <Text style={styles.loadingText}>Finding your ideal career paths...</Text>
        <Text style={styles.loadingSubtext}>Matching your personality with opportunities...</Text>
      </View>
    );
  }
  
  // Error state - no recommendations
  if (!aiResponse || !aiResponse.recommendations || aiResponse.recommendations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#0052CC', '#0065FF', '#4C9AFF']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.noResultsContainer}>
          <MaterialIcons name="error-outline" size={60} color="#fff" />
          <Text style={styles.noResultsText}>No career recommendations available</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            <Text style={styles.backButtonText}>Back to Personality Profile</Text>
          </TouchableOpacity>
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Career Recommendations</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <MaterialIcons name="work" size={32} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.introTitle}>Your Ideal Career Paths</Text>
          <Text style={styles.introText}>
            Based on your personality profile, we've identified these career paths that align with your strengths and interests.
          </Text>
        </View>
        
        {/* Career Recommendations */}
        {aiResponse.recommendations.map((recommendation, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.careerCard,
              expandedCard === recommendation.field ? styles.expandedCard : {}
            ]}
            onPress={() => setExpandedCard(expandedCard === recommendation.field ? null : recommendation.field)}
            activeOpacity={0.9}
          >
            {/* Card Header */}
            <View style={[styles.cardHeader, { backgroundColor: getFieldColor(recommendation.field) }]}>
              <View style={styles.cardHeaderContent}>
                <View style={styles.cardIcon}>
                  {getFieldIcon(recommendation.field)}
                </View>
                <Text style={styles.cardTitle}>{recommendation.field}</Text>
              </View>
              <MaterialIcons 
                name={expandedCard === recommendation.field ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={28} 
                color="#ffffff" 
              />
            </View>
            
            {/* Card Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardDescription}>{recommendation.description}</Text>
              
              {expandedCard === recommendation.field && (
                <View style={styles.expandedContent}>
                  {/* Roles */}
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Potential Roles</Text>
                    <View style={styles.tagContainer}>
                      {recommendation.roles.map((role, roleIndex) => (
                        <View key={roleIndex} style={styles.tag}>
                          <Text style={styles.tagText}>{role}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  {/* Skills */}
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Key Skills</Text>
                    <View style={styles.tagContainer}>
                      {recommendation.skills.map((skill, skillIndex) => (
                        <View key={skillIndex} style={styles.tag}>
                          <Text style={styles.tagText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  {/* Education */}
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Education Paths</Text>
                    <View style={styles.tagContainer}>
                      {recommendation.education.map((edu, eduIndex) => (
                        <View key={eduIndex} style={styles.tag}>
                          <Text style={styles.tagText}>{edu}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  {/* Fit Reason */}
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Why It's a Good Fit</Text>
                    <Text style={styles.fitReasonText}>{recommendation.fitReason}</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.cardFooter}>
                <Text style={styles.expandPrompt}>
                  {expandedCard === recommendation.field ? "Show less" : "Show more details"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'System',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 4,
    fontFamily: 'System',
  },
  headerRight: {
    width: 40, // To balance the header
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  introContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0052CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'System',
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'System',
  },
  careerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandedCard: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'System',
  },
  cardContent: {
    padding: 16,
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
    fontFamily: 'System',
  },
  expandedContent: {
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'System',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'System',
  },
  fitReasonText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    fontFamily: 'System',
  },
  cardFooter: {
    alignItems: 'center',
    marginTop: 8,
  },
  expandPrompt: {
    fontSize: 14,
    color: '#0052CC',
    fontWeight: '600',
    fontFamily: 'System',
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
    fontFamily: 'System',
  },
  loadingSubtext: {
    fontSize: 16,
    fontWeight: '400',
    color: '#E0E0FF',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'System',
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
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'System',
  },
});
