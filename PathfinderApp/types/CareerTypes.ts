// Define personality profile interface
export interface PersonalityProfile {
  dominantType: string;
  secondaryType: string;
  description: string;
  distribution: Record<string, number>;
}

// Define career path interface
export interface CareerPath {
  title: string;
  description: string;
  skills: string[];
  education: string[];
  industries: string[];
  growthPotential: string;
  salaryRange: string;
  personalityTypes: string[];
  fitReason?: string; // Optional field for AI-generated reasoning
}

// Define AI response interfaces
export interface CareerRecommendation {
  field: string;
  description: string;
  skills: string[];
  education: string[];
  roles: string[];
  fitReason: string;
}

export interface AICareerResponse {
  personalityInsights: string;
  recommendations: CareerRecommendation[];
}
