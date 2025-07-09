import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform, Image, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { onboardingQuestions } from './OnboardingQuestions';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import Animated, { FadeIn, FadeOut, SlideInRight, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Animated scroll indicator component
const ScrollIndicator = () => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.7);
  
  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    opacity.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.scrollIndicatorContainer}>
      <Animated.View style={animatedStyle}>
        <Entypo name="chevron-down" size={24} color="#0052CC" />
      </Animated.View>
      <ThemedText style={styles.scrollIndicatorText}>Scroll for more</ThemedText>
    </View>
  );
};

export default function OnboardingScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [canScroll, setCanScroll] = useState(true);
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const router = useRouter();
  const isLastQuestion = currentQuestionIndex === onboardingQuestions.length - 1;
  
  // Animation values
  const progressAnimation = useSharedValue(0);
  
  // Randomize options for the current question
  const currentQuestion = React.useMemo(() => {
    const question = {...onboardingQuestions[currentQuestionIndex]};
    // Create a copy of options and shuffle them
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    return {
      ...question,
      options: shuffledOptions
    };
  }, [currentQuestionIndex]);
  const progress = ((currentQuestionIndex + 1) / onboardingQuestions.length) * 100;
  
  // Update progress animation when progress changes
  useEffect(() => {
    progressAnimation.value = withTiming(progress / 100, { duration: 300 });
  }, [progress]);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnimation.value * 100}%`,
    };
  });
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion.id]: optionId
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < onboardingQuestions.length - 1) {
      setPreviousIndex(currentQuestionIndex);
      setDirection('forward');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, process results
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setPreviousIndex(currentQuestionIndex);
      setDirection('backward');
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = () => {
    // Process the selected options here
    console.log('Selected options:', selectedOptions);
    
    // Calculate the most frequent type
    const typeCounts: Record<string, number> = {};
    
    Object.entries(selectedOptions).forEach(([questionId, optionId]) => {
      const question = onboardingQuestions.find(q => q.id === parseInt(questionId));
      const option = question?.options.find(o => o.id === optionId);
      
      if (option?.type) {
        typeCounts[option.type] = (typeCounts[option.type] || 0) + 1;
      }
    });
    
    // Find the type with the highest count
    let maxCount = 0;
    let dominantType = '';
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type;
      }
    });
    
    console.log('Dominant type:', dominantType);
    
    // Navigate to the home screen or results screen
    router.replace('/');
  };

  const isOptionSelected = (optionId: string) => {
    return selectedOptions[currentQuestion.id] === optionId;
  };

  // Function to get icon based on option type
  const getCategoryIcon = (type?: string) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient - Atlassian color scheme */}
      <LinearGradient
        colors={['#0052CC', '#0065FF', '#4C9AFF']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <View style={styles.progressTextContainer}>
            <ThemedText style={styles.progressText}>Question {currentQuestionIndex + 1} of {onboardingQuestions.length}</ThemedText>
          </View>
        </View>
      </View>
      
      {/* Question Card */}
      <View style={styles.contentContainer}>
        {/* Question */}
        <Animated.View 
          style={styles.questionContainer}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(200)}
        >
          <ThemedText style={styles.questionNumber}>Question {currentQuestionIndex + 1}</ThemedText>
          <ThemedText style={styles.questionText}>{currentQuestion.text}</ThemedText>
        </Animated.View>
        
        {/* Options - Now with ScrollView */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.optionsScrollContainer}
          contentContainerStyle={styles.optionsContentContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
          onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
            const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            setCanScroll(!isScrolledToBottom);
          }}
          scrollEventThrottle={16}
        >
          {currentQuestion.options.map((option, index) => (
            <Animated.View 
              key={option.id}
              entering={SlideInRight.delay(50 + index * 30).duration(200)}
              exiting={FadeOut.duration(150)}
              style={styles.optionWrapper}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  isOptionSelected(option.id) && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect(option.id)}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIconContainer}>
                    <Ionicons name="list-circle-outline" size={20} color="#0052CC" />
                  </View>
                  <Text style={styles.optionText}>{option.text}</Text>
                </View>
                {isOptionSelected(option.id) && (
                  <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark-circle" size={20} color="#0052CC" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
          {/* Animated scroll indicator */}
          {canScroll && (
            <ScrollIndicator />
          )}
          <View style={styles.scrollBottomPadding} />
        </ScrollView>
      </View>
      
      {/* Navigation Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="arrow-back" size={22} color="#0052CC" style={styles.buttonIcon} />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, isLastQuestion && selectedOptions[currentQuestionIndex] === undefined && styles.disabledButton]}
          onPress={handleNext}
          disabled={isLastQuestion && selectedOptions[currentQuestionIndex] === undefined}
        >
          <Text style={styles.navButtonText}>{isLastQuestion ? 'Finish' : 'Next'}</Text>
          <Ionicons name="arrow-forward" size={22} color="#0052CC" style={styles.buttonIcon} />
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
  headerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  progressTextContainer: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  progressText: {
    textAlign: 'right',
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  questionContainer: {
    padding: 20,
    paddingBottom: 5,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052CC', // Atlassian blue
    marginBottom: 6,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    lineHeight: 24,
  },
  optionsScrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  optionsContentContainer: {
    paddingTop: 5,
    paddingBottom: 10,
  },
  optionWrapper: {
    marginBottom: 10,
  },
  scrollBottomPadding: {
    height: 10,
  },
  scrollIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollIndicatorText: {
    fontSize: 12,
    color: '#0052CC',
    marginTop: 2,
    fontWeight: '500',
  },
  optionButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    marginRight: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    borderColor: '#0052CC', // Atlassian blue
    borderWidth: 1.5,
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0052CC',
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    paddingTop: 10,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: width / 2 - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#ffffff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0052CC',
  },
  buttonIcon: {
    marginHorizontal: 4,
  },
});
