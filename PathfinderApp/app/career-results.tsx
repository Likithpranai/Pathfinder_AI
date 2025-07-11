import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CareerRecommendationsScreen from '../components/CareerRecommendationsScreen';
import { AICareerResponse } from '../types/AITypes';

export default function CareerResultsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // In a real app, you would get this data from params or a global state manager
  // For now, we'll use mock data
  const mockAIResponse: AICareerResponse = {
    personalityInsight: "You have a strong analytical mind with excellent problem-solving abilities. You enjoy working with technology and finding creative solutions to complex challenges. Your personality combines technical aptitude with a desire to make meaningful contributions.",
    personalityDistribution: {
      "Technology": 85,
      "Engineering": 70,
      "Science": 65,
      "Business": 45,
      "Creative": 55,
      "Social": 40
    },
    topFields: ["Technology", "Engineering", "Science"],
    recommendations: [
      {
        field: "Software Development",
        roles: ["Software Engineer", "Full-Stack Developer", "Mobile App Developer", "DevOps Engineer"],
        description: "Software development involves designing, coding, testing, and maintaining computer programs and applications.",
        skills: ["Programming", "Problem-solving", "Algorithms", "Software Architecture", "Version Control"],
        education: ["Computer Science Degree", "Coding Bootcamp", "Self-taught with Portfolio"],
        fitReason: "Your analytical thinking and technical aptitude make you well-suited for software development roles. Your ability to solve complex problems and attention to detail are valuable assets in this field."
      },
      {
        field: "Data Science",
        roles: ["Data Scientist", "Machine Learning Engineer", "Data Analyst", "AI Researcher"],
        description: "Data science involves extracting insights and knowledge from structured and unstructured data using scientific methods and algorithms.",
        skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization", "SQL"],
        education: ["Statistics/Math Degree", "Computer Science", "Specialized Bootcamps"],
        fitReason: "Your analytical mindset and technical skills align perfectly with the data science field. Your ability to identify patterns and solve complex problems would be valuable in extracting meaningful insights from data."
      },
      {
        field: "Systems Engineering",
        roles: ["Systems Engineer", "Network Architect", "Cloud Solutions Engineer", "Infrastructure Specialist"],
        description: "Systems engineering focuses on designing, integrating, and managing complex systems over their life cycles.",
        skills: ["System Architecture", "Technical Integration", "Problem-solving", "Project Management", "Cloud Technologies"],
        education: ["Engineering Degree", "Computer Science", "Professional Certifications"],
        fitReason: "Your combination of technical knowledge and systematic thinking makes you well-suited for systems engineering. Your ability to understand how different components work together would be valuable in designing integrated systems."
      }
    ]
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <CareerRecommendationsScreen 
        aiResponse={mockAIResponse}
        isLoading={false}
        onBack={handleBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
