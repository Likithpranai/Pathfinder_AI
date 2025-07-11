import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { AICareerResponse } from '../types/AITypes';

// Animation for trait bars
const AnimatedTraitBar = ({ percentage, color, delay = 0 }: { percentage: number, color: string, delay?: number }) => {
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: '#0052CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalityTypeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: -20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personalityTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0052CC',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#E0E0FF',
    textAlign: 'center',
    fontFamily: 'System',
  },
  fullPagePersonalityContainer: {
    padding: 20,
  },
  insightContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  insightTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'System',
  },
  insightText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#444',
    fontFamily: 'System',
  },
  insightIconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  insightIcon: {
    backgroundColor: '#0052CC',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distributionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  distributionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    fontFamily: 'System',
  },
  distributionIconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  distributionIcon: {
    backgroundColor: '#0052CC',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  traitBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  traitName: {
    width: 100,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'System',
  },
  barContainer: {
    flex: 1,
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  traitPercentage: {
    width: 40,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    marginLeft: 10,
    fontFamily: 'System',
  },
  traitIcon: {
    width: 24,
    marginRight: 8,
    alignItems: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#0052CC',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'System',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0052CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  secondaryButtonText: {
    color: '#0052CC',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'System',
  },
  exploreButton: {
    backgroundColor: '#34A853',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
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
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
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
  },
  loadingSubtext: {
    fontSize: 16,
    fontWeight: '400',
    color: '#E0E0FF',
    marginTop: 10,
  },
});

const { width, height } = Dimensions.get('window');

interface PersonalityResultsScreenProps {
  aiResponse: AICareerResponse | null;
  isLoading?: boolean;
  onRetakeQuiz: () => void;
  onContinue: () => void;
}

export default function PersonalityResultsScreen({ 
  aiResponse, 
  isLoading,
  onRetakeQuiz,
  onContinue
}: PersonalityResultsScreenProps) {
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

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#0052CC' }]}>
        <StatusBar style="light" />
        <MaterialCommunityIcons name="brain" size={60} color="#ffffff" />
        <Text style={styles.loadingText}>Analyzing your personality...</Text>
        <Text style={styles.loadingSubtext}>Discovering your unique traits...</Text>
      </View>
    );
  }

  // Get dominant personality type
  const getDominantType = () => {
    if (!aiResponse || !aiResponse.personalityDistribution) return "Analytical";
    
    const sorted = Object.entries(aiResponse.personalityDistribution)
      .sort((a, b) => b[1] - a[1]);
    
    return sorted[0][0];
  };
  
  // Get icon for personality type
  const getPersonalityIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'Technology': <MaterialIcons name="computer" size={24} color="#0052CC" />,
      'Tech': <MaterialIcons name="computer" size={24} color="#0052CC" />,
      'Engineering': <MaterialCommunityIcons name="engine" size={24} color="#EA4335" />,
      'Science': <MaterialIcons name="science" size={24} color="#34A853" />,
      'Business': <MaterialIcons name="business" size={24} color="#FBBC05" />,
      'Creative': <MaterialIcons name="palette" size={24} color="#FF5722" />,
      'Social': <MaterialIcons name="people" size={24} color="#9C27B0" />,
      'Healthcare': <FontAwesome5 name="heartbeat" size={22} color="#46BDC6" />,
      'Education': <MaterialIcons name="school" size={24} color="#9C27B0" />,
      'Arts': <MaterialIcons name="color-lens" size={24} color="#FF5722" />,
      'Finance': <MaterialIcons name="attach-money" size={24} color="#607D8B" />,
      'Law': <MaterialIcons name="gavel" size={24} color="#3F51B5" />
    };
    
    // Find a partial match in the keys
    const matchedKey = Object.keys(iconMap).find(key => 
      type.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? iconMap[matchedKey] : <MaterialIcons name="psychology" size={24} color="#0052CC" />;
  };
  
  // Main personality results render
  if (!aiResponse || !aiResponse.personalityInsight) {
    return (
      <View style={styles.noResultsContainer}>
        <MaterialIcons name="error-outline" size={60} color="#fff" />
        <Text style={styles.noResultsText}>No personality results available</Text>
      </View>
    );
  }
  
  const dominantType = getDominantType();
  
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
        
        {/* Avatar and Personality Type */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={60} color="#ffffff" />
          </View>
          <View style={styles.personalityTypeTag}>
            {getPersonalityIcon(dominantType)}
            <Text style={styles.personalityTypeText}>{dominantType} Type</Text>
          </View>
        </View>
        
        {/* Personality Insight - Main section */}
        <View style={styles.fullPagePersonalityContainer}>
          <View style={styles.insightContainer}>
            <View style={styles.insightIconContainer}>
              <View style={styles.insightIcon}>
                <MaterialIcons name="psychology" size={28} color="#ffffff" />
              </View>
            </View>
            <Text style={styles.insightTitle}>Personality Analysis</Text>
            <Text style={styles.insightText}>{aiResponse.personalityInsight}</Text>
          </View>
          
          {/* Personality Distribution */}
          {aiResponse.personalityDistribution && (
            <View style={styles.distributionContainer}>
              <View style={styles.distributionIconContainer}>
                <View style={styles.distributionIcon}>
                  <MaterialIcons name="bar-chart" size={28} color="#ffffff" />
                </View>
              </View>
              <Text style={styles.distributionTitle}>Your Trait Distribution</Text>
              {aiResponse.personalityDistribution && Object.entries(aiResponse.personalityDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([trait, percentage], index) => (
                <View key={index} style={styles.traitBar}>
                  <View style={styles.traitIcon}>
                    {getPersonalityIcon(trait)}
                  </View>
                  <Text style={styles.traitName}>{trait}</Text>
                  <View style={styles.barContainer}>
                    <AnimatedTraitBar 
                      percentage={percentage} 
                      color={getFieldColor(trait)}
                      delay={index * 100}
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
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={onRetakeQuiz}
          >
            <MaterialIcons name="refresh" size={22} color="#0052CC" />
            <Text style={styles.secondaryButtonText}>Retake Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={onContinue}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.push('/career-results' as any)}
        >
          <Text style={styles.exploreButtonText}>Explore Career Paths</Text>
          <MaterialIcons name="explore" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
