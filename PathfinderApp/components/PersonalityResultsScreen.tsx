import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { AICareerResponse } from '../types/AITypes';
import Svg, { G, Polygon, Line, Circle } from 'react-native-svg';

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

// Define types for radar chart
interface RadarDataPoint {
  label: string;
  value: number;
}

interface RadarChartColors {
  stroke: string;
  fill: string;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  colors?: RadarChartColors;
}

// Custom Radar Chart Component
const RadarChart = ({ data, size = 250, colors = { stroke: '#0052CC', fill: 'rgba(0, 82, 204, 0.2)' } }: RadarChartProps) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Calculate points for the radar chart
  const calculatePoint = (index: number, value: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const x = centerX + radius * value * Math.cos(angle);
    const y = centerY + radius * value * Math.sin(angle);
    return { x, y };
  };
  
  // Generate polygon points
  const points = data.map((item: RadarDataPoint, index: number) => {
    const point = calculatePoint(index, item.value / 100, data.length);
    return `${point.x},${point.y}`;
  }).join(' ');
  
  // Generate grid lines
  const gridLines = [];
  const levels = 5;
  
  for (let level = 1; level <= levels; level++) {
    const scale = level / levels;
    const gridPoints = [];
    
    for (let i = 0; i < data.length; i++) {
      const point = calculatePoint(i, scale, data.length);
      gridPoints.push(`${point.x},${point.y}`);
    }
    
    gridLines.push(
      <Polygon
        key={`grid-${level}`}
        points={gridPoints.join(' ')}
        fill="none"
        stroke="rgba(200, 200, 200, 0.5)"
        strokeWidth={1}
      />
    );
  }
  
  // Generate axis lines
  const axisLines = data.map((_: RadarDataPoint, index: number) => {
    const point = calculatePoint(index, 1, data.length);
    return (
      <Line
        key={`axis-${index}`}
        x1={centerX}
        y1={centerY}
        x2={point.x}
        y2={point.y}
        stroke="rgba(200, 200, 200, 0.8)"
        strokeWidth={1}
      />
    );
  });
  
  // Generate labels
  const labels = data.map((item: RadarDataPoint, index: number) => {
    const point = calculatePoint(index, 1.15, data.length);
    return (
      <View
        key={`label-${index}`}
        style={{
          position: 'absolute',
          left: point.x - 40,
          top: point.y - 10,
          width: 80,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
          {item.label}
        </Text>
      </View>
    );
  });
  
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size}>
        {/* Grid */}
        {gridLines}
        
        {/* Axis lines */}
        {axisLines}
        
        {/* Data polygon */}
        <Polygon
          points={points}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2}
        />
        
        {/* Data points */}
        {data.map((item: RadarDataPoint, index: number) => {
          const point = calculatePoint(index, item.value / 100, data.length);
          return (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="white"
              stroke={colors.stroke}
              strokeWidth={2}
            />
          );
        })}
      </Svg>
      
      {/* Labels */}
      {labels}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 220,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  
  // Header styles
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  
  // Personality type card styles
  personalityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 0,
    marginTop: -40,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  personalityTypeCode: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
    marginVertical: 10,
  },
  personalityTypeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  personalityTypeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 10,
  },
  typeTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  typeTag: {
    backgroundColor: '#f0f4f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  typeTagText: {
    fontSize: 14,
    color: '#0052CC',
    fontWeight: '500',
  },
  
  // Radar Chart
  radarChartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  // Distribution Section
  distributionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  distributionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  traitBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  traitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  traitName: {
    width: 100,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  traitPercentage: {
    width: 40,
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    marginLeft: 10,
    fontWeight: '500',
  },
  
  // Insights Section
  insightsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  insightText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  
  // Buttons
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#0052CC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#0052CC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#0052CC',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  exploreButton: {
    backgroundColor: '#00875A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0052CC',
  },
  noResultsText: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
});

const { width, height } = Dimensions.get('window');

interface PersonalityResultsScreenProps {
  aiResponse: AICareerResponse | null;
  isLoading?: boolean;
  onRetakeQuiz: () => void;
  onContinue: () => void;
}

// Helper function to generate personality type code (like MBTI)
const generateTypeCode = (distribution: Record<string, number>) => {
  // This is a simplified version - in a real app, you would have a more sophisticated algorithm
  // based on the actual personality dimensions you're measuring
  const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  
  // Take the first letter of the top 4 traits to form a code like MBTI
  return sorted.slice(0, 4).map(([trait]) => trait.charAt(0).toUpperCase()).join('');
};

// Helper function to get personality archetype name based on dominant trait
const getPersonalityArchetype = (dominantTrait: string): string => {
  const archetypes: Record<string, string> = {
    'Technology': 'The Innovator',
    'Tech': 'The Innovator',
    'Engineering': 'The Builder',
    'Science': 'The Analyst',
    'Business': 'The Leader',
    'Creative': 'The Creator',
    'Social': 'The Connector',
    'Healthcare': 'The Healer',
    'Education': 'The Mentor',
    'Arts': 'The Visionary',
    'Finance': 'The Strategist',
    'Law': 'The Advocate'
  };
  
  // Find a partial match in the keys
  const matchedKey = Object.keys(archetypes).find(key => 
    dominantTrait.toLowerCase().includes(key.toLowerCase())
  );
  
  return matchedKey ? archetypes[matchedKey] : 'The Explorer';
};

// Helper function to get personality tags based on traits
const getPersonalityTags = (distribution: Record<string, number>): string[] => {
  const traits = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  const tags: string[] = [];
  
  // Add archetype for dominant trait
  tags.push(getPersonalityArchetype(traits[0][0]));
  
  // Add descriptive tags based on top traits
  if (traits[0][0].toLowerCase().includes('tech') || traits[0][0].toLowerCase().includes('engineering')) {
    tags.push('Analytical Thinker');
  }
  
  if (traits[0][0].toLowerCase().includes('creative') || traits[0][0].toLowerCase().includes('arts')) {
    tags.push('Imaginative');
  }
  
  if (traits[0][0].toLowerCase().includes('social') || traits[0][0].toLowerCase().includes('education')) {
    tags.push('People-Oriented');
  }
  
  if (traits[0][0].toLowerCase().includes('business') || traits[0][0].toLowerCase().includes('finance')) {
    tags.push('Strategic');
  }
  
  // Add a general tag based on second highest trait
  if (traits.length > 1) {
    if (traits[1][0].toLowerCase().includes('tech')) tags.push('Tech-Savvy');
    if (traits[1][0].toLowerCase().includes('creative')) tags.push('Creative Thinker');
    if (traits[1][0].toLowerCase().includes('social')) tags.push('Empathetic');
    if (traits[1][0].toLowerCase().includes('science')) tags.push('Methodical');
    if (traits[1][0].toLowerCase().includes('business')) tags.push('Goal-Oriented');
  }
  
  // Return unique tags (up to 3)
  return Array.from(new Set(tags)).slice(0, 3);
};

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
      'Social': '#795548',
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
  
  // Generate personality type code (like MBTI)
  const typeCode = aiResponse.personalityDistribution ? 
    generateTypeCode(aiResponse.personalityDistribution) : 'XXXX';
  
  // Get personality archetype
  const archetype = getPersonalityArchetype(dominantType);
  
  // Get personality tags
  const personalityTags = aiResponse.personalityDistribution ? 
    getPersonalityTags(aiResponse.personalityDistribution) : [];
  
  // Prepare radar chart data
  const radarData = aiResponse.personalityDistribution ? 
    Object.entries(aiResponse.personalityDistribution)
      .map(([trait, value]) => ({ label: trait, value }))
      .slice(0, 6) : [];
  
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
          <Text style={styles.headerSubtitle}>Based on your responses</Text>
        </View>
        
        {/* Personality Type Card */}
        <View style={styles.personalityCard}>
          <Text style={styles.personalityTypeCode}>{typeCode}</Text>
          <Text style={styles.personalityTypeName}>{archetype}</Text>
          
          {/* Personality Tags */}
          <View style={styles.typeTagsContainer}>
            {personalityTags.map((tag, index) => (
              <View key={index} style={styles.typeTag}>
                <Text style={styles.typeTagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.personalityTypeDescription}>
            {aiResponse.personalityInsight}
          </Text>
        </View>
        
        {/* Radar Chart */}
        {radarData.length > 0 && (
          <View style={styles.radarChartContainer}>
            <Text style={styles.chartTitle}>Your Personality Dimensions</Text>
            <RadarChart data={radarData} size={300} colors={{ stroke: getFieldColor(dominantType), fill: `${getFieldColor(dominantType)}40` }} />
          </View>
        )}
        
        {/* Personality Distribution */}
        {aiResponse.personalityDistribution && (
          <View style={styles.distributionContainer}>
            <Text style={styles.distributionTitle}>Your Trait Distribution</Text>
            {Object.entries(aiResponse.personalityDistribution)
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
              ))
            }
          </View>
        )}
        
        {/* Personality Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightTitle}>What This Means For You</Text>
          <Text style={styles.insightText}>
            Based on your personality profile, you tend to excel in environments that value 
            {dominantType.toLowerCase().includes('tech') ? ' technical problem-solving and innovation' : 
             dominantType.toLowerCase().includes('creative') ? ' creativity and self-expression' :
             dominantType.toLowerCase().includes('social') ? ' interpersonal connections and teamwork' :
             dominantType.toLowerCase().includes('business') ? ' leadership and strategic thinking' :
             ' analytical thinking and methodical approaches'}.
            
            Your strengths include {personalityTags.join(', ')}, which can be valuable assets in your career journey.
          </Text>
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
