/**
 * Types for AI service responses
 */

// Interface for career recommendation response
export interface CareerRecommendation {
  field: string;
  roles: string[];
  description: string;
  skills: string[];
  education: string[];
  fitReason: string;
}

// Interface for the complete AI response
export interface AICareerResponse {
  personalityInsight: string;
  personalityDistribution?: Record<string, number>;
  topFields: string[];
  recommendations: CareerRecommendation[];
}
