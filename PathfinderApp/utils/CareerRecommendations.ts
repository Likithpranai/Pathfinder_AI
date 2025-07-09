import { Option } from '../components/OnboardingQuestions';

// Define career path interfaces
export interface CareerPath {
  title: string;
  description: string;
  skills: string[];
  education: string[];
  industries: string[];
  growthPotential: string;
  salaryRange: string;
  personalityTypes: string[];
}

export interface PersonalityProfile {
  dominantType: string;
  secondaryType: string;
  description: string;
  distribution: Record<string, number>;
}

// Career paths data organized by personality type
export const careerPaths: Record<string, CareerPath[]> = {
  tech: [
    {
      title: "Software Engineer",
      description: "Design, develop, and maintain software applications and systems using programming languages and development tools.",
      skills: ["Programming", "Problem-solving", "Debugging", "Software architecture", "Version control"],
      education: ["Computer Science degree", "Coding bootcamp", "Self-taught with portfolio"],
      industries: ["Tech companies", "Finance", "Healthcare", "E-commerce", "Gaming"],
      growthPotential: "High demand with continuous growth opportunities and specialization paths",
      salaryRange: "$70,000 - $150,000+",
      personalityTypes: ["tech", "engineering"]
    },
    {
      title: "Data Scientist",
      description: "Analyze and interpret complex data to help organizations make better decisions using statistical methods and machine learning.",
      skills: ["Statistics", "Machine learning", "Data visualization", "Programming (Python/R)", "Domain expertise"],
      education: ["Statistics/Math degree", "Computer Science", "Specialized bootcamps"],
      industries: ["Tech", "Finance", "Healthcare", "Retail", "Government"],
      growthPotential: "Rapidly growing field with increasing demand across industries",
      salaryRange: "$80,000 - $160,000+",
      personalityTypes: ["tech", "science"]
    },
    {
      title: "Cybersecurity Specialist",
      description: "Protect computer systems and networks from information disclosure, theft, and damage to hardware, software, or data.",
      skills: ["Network security", "Ethical hacking", "Risk assessment", "Security protocols", "Incident response"],
      education: ["Computer Science", "Cybersecurity degree", "Professional certifications"],
      industries: ["Government", "Finance", "Healthcare", "Tech", "Defense"],
      growthPotential: "Critical growing field with high demand and specialization options",
      salaryRange: "$75,000 - $150,000+",
      personalityTypes: ["tech", "engineering"]
    }
  ],
  engineering: [
    {
      title: "Mechanical Engineer",
      description: "Design, develop, build, and test mechanical devices, including tools, engines, and machines.",
      skills: ["CAD design", "Problem-solving", "Technical drawing", "Material science", "Thermodynamics"],
      education: ["Mechanical Engineering degree", "Engineering Technology programs"],
      industries: ["Automotive", "Aerospace", "Manufacturing", "Energy", "Robotics"],
      growthPotential: "Stable field with opportunities in emerging technologies",
      salaryRange: "$65,000 - $120,000+",
      personalityTypes: ["engineering", "tech"]
    },
    {
      title: "Civil Engineer",
      description: "Design, build, and maintain infrastructure projects and systems, including roads, buildings, airports, tunnels, dams, bridges, and water supply systems.",
      skills: ["Structural analysis", "Project management", "AutoCAD", "Material testing", "Environmental considerations"],
      education: ["Civil Engineering degree", "Professional Engineer (PE) license"],
      industries: ["Construction", "Government", "Transportation", "Urban planning", "Environmental"],
      growthPotential: "Steady demand with opportunities in sustainable development",
      salaryRange: "$60,000 - $115,000+",
      personalityTypes: ["engineering", "science"]
    },
    {
      title: "Robotics Engineer",
      description: "Design, build, and maintain robots and robotic systems for various applications.",
      skills: ["Programming", "Mechanical design", "Electronics", "AI/Machine learning", "Control systems"],
      education: ["Robotics Engineering", "Mechanical Engineering", "Computer Science"],
      industries: ["Manufacturing", "Healthcare", "Aerospace", "Automotive", "Research"],
      growthPotential: "Rapidly growing field with cutting-edge opportunities",
      salaryRange: "$75,000 - $140,000+",
      personalityTypes: ["engineering", "tech"]
    }
  ],
  science: [
    {
      title: "Research Scientist",
      description: "Conduct research to advance knowledge in a particular field, develop new products, or improve existing ones.",
      skills: ["Research methodology", "Data analysis", "Critical thinking", "Technical writing", "Lab techniques"],
      education: ["Master's or PhD in relevant science field"],
      industries: ["Pharmaceuticals", "Biotechnology", "Environmental", "Agriculture", "Academia"],
      growthPotential: "Specialized growth with opportunities for breakthrough research",
      salaryRange: "$65,000 - $130,000+",
      personalityTypes: ["science", "tech"]
    },
    {
      title: "Environmental Scientist",
      description: "Study environmental problems and develop solutions to protect the environment and human health.",
      skills: ["Environmental sampling", "Data analysis", "GIS mapping", "Regulatory knowledge", "Field research"],
      education: ["Environmental Science degree", "Biology", "Chemistry", "Earth Sciences"],
      industries: ["Government", "Consulting", "Non-profit", "Energy", "Manufacturing"],
      growthPotential: "Growing field with increasing focus on sustainability",
      salaryRange: "$55,000 - $110,000+",
      personalityTypes: ["science", "social"]
    },
    {
      title: "Medical Researcher",
      description: "Conduct research aimed at improving human health, from developing new treatments to understanding disease mechanisms.",
      skills: ["Clinical research", "Biostatistics", "Lab techniques", "Medical knowledge", "Scientific writing"],
      education: ["MD", "PhD in Life Sciences", "Combined MD-PhD"],
      industries: ["Pharmaceuticals", "Hospitals", "Universities", "Government agencies", "Research institutes"],
      growthPotential: "High-impact field with continuous innovation opportunities",
      salaryRange: "$70,000 - $150,000+",
      personalityTypes: ["science", "social"]
    }
  ],
  business: [
    {
      title: "Marketing Manager",
      description: "Develop and implement marketing strategies to promote products, services, and brands.",
      skills: ["Market research", "Campaign planning", "Digital marketing", "Analytics", "Communication"],
      education: ["Marketing degree", "Business Administration", "Communications"],
      industries: ["Retail", "Tech", "Consumer goods", "Media", "Agencies"],
      growthPotential: "Dynamic field with paths to executive positions",
      salaryRange: "$60,000 - $140,000+",
      personalityTypes: ["business", "creative"]
    },
    {
      title: "Financial Analyst",
      description: "Evaluate financial data and market trends to help companies make investment decisions.",
      skills: ["Financial modeling", "Data analysis", "Research", "Reporting", "Forecasting"],
      education: ["Finance degree", "Accounting", "Economics", "CFA certification"],
      industries: ["Banking", "Investment firms", "Insurance", "Corporate finance", "Consulting"],
      growthPotential: "Stable career with advancement to senior analyst or management",
      salaryRange: "$65,000 - $125,000+",
      personalityTypes: ["business", "tech"]
    },
    {
      title: "Entrepreneur",
      description: "Start and run your own business ventures, identifying opportunities and taking calculated risks.",
      skills: ["Leadership", "Strategic thinking", "Problem-solving", "Networking", "Financial management"],
      education: ["Business degree", "Entrepreneurship programs", "Self-taught with experience"],
      industries: ["Any industry", "Startups", "Small business", "Tech", "E-commerce"],
      growthPotential: "Unlimited potential with high risk and high reward",
      salaryRange: "Variable, from $0 to millions",
      personalityTypes: ["business", "creative"]
    }
  ],
  creative: [
    {
      title: "UX/UI Designer",
      description: "Design user interfaces and experiences for websites, apps, and digital products that are both functional and appealing.",
      skills: ["User research", "Wireframing", "Prototyping", "Visual design", "Usability testing"],
      education: ["Design degree", "UX bootcamps", "Self-taught with portfolio"],
      industries: ["Tech", "Agencies", "E-commerce", "Media", "Gaming"],
      growthPotential: "Growing field with increasing focus on user experience",
      salaryRange: "$60,000 - $130,000+",
      personalityTypes: ["creative", "tech"]
    },
    {
      title: "Content Creator",
      description: "Produce engaging content across various platforms, including videos, blogs, podcasts, and social media.",
      skills: ["Storytelling", "Video editing", "Writing", "Social media", "Audience engagement"],
      education: ["Communications", "Media Studies", "Self-taught with portfolio"],
      industries: ["Media", "Entertainment", "Marketing", "Education", "Independent"],
      growthPotential: "Expanding field with opportunities for personal branding",
      salaryRange: "$40,000 - $100,000+ (highly variable)",
      personalityTypes: ["creative", "social"]
    },
    {
      title: "Game Designer",
      description: "Create concepts, characters, stories, and gameplay mechanics for video games.",
      skills: ["Game mechanics", "Storytelling", "Level design", "Prototyping", "Player psychology"],
      education: ["Game Design degree", "Computer Science", "Self-taught with portfolio"],
      industries: ["Gaming studios", "Mobile gaming", "Educational games", "Independent development"],
      growthPotential: "Growing industry with opportunities in emerging technologies",
      salaryRange: "$50,000 - $120,000+",
      personalityTypes: ["creative", "tech"]
    }
  ],
  social: [
    {
      title: "Social Worker",
      description: "Help individuals, families, and communities enhance their well-being and solve personal and social problems.",
      skills: ["Counseling", "Case management", "Advocacy", "Crisis intervention", "Community outreach"],
      education: ["Social Work degree (BSW/MSW)", "Psychology", "Human Services"],
      industries: ["Healthcare", "Government", "Non-profit", "Schools", "Community services"],
      growthPotential: "Stable field with opportunities for specialization",
      salaryRange: "$45,000 - $80,000+",
      personalityTypes: ["social", "creative"]
    },
    {
      title: "Teacher/Educator",
      description: "Educate students of various ages, develop curriculum, and foster learning environments.",
      skills: ["Instruction", "Curriculum development", "Classroom management", "Assessment", "Communication"],
      education: ["Education degree", "Teaching certification", "Subject expertise"],
      industries: ["K-12 schools", "Higher education", "Online learning", "Corporate training", "Educational technology"],
      growthPotential: "Stable career with paths to administration or specialization",
      salaryRange: "$45,000 - $90,000+",
      personalityTypes: ["social", "creative"]
    },
    {
      title: "Healthcare Administrator",
      description: "Manage healthcare facilities, services, programs, staff, budgets, and relations with other organizations.",
      skills: ["Leadership", "Healthcare regulations", "Budgeting", "Staff management", "Strategic planning"],
      education: ["Healthcare Administration degree", "Business", "Public Health"],
      industries: ["Hospitals", "Clinics", "Nursing homes", "Public health agencies", "Insurance"],
      growthPotential: "Growing field with increasing healthcare demand",
      salaryRange: "$65,000 - $130,000+",
      personalityTypes: ["social", "business"]
    }
  ]
};

// Personality type descriptions
export const personalityDescriptions: Record<string, string> = {
  tech: "You have a strong analytical mind and enjoy solving complex problems using technology. You're drawn to logical thinking, coding, and creating digital solutions that make life easier.",
  engineering: "You're a practical problem-solver who enjoys designing, building, and improving physical systems. You have strong spatial reasoning and like to understand how things work.",
  science: "You're naturally curious about the world and enjoy discovering how things work through research and experimentation. You value evidence-based approaches and methodical investigation.",
  business: "You have an entrepreneurial spirit and enjoy creating value through strategic thinking. You're comfortable with leadership, decision-making, and understanding market dynamics.",
  creative: "You have a rich imagination and enjoy expressing ideas in unique ways. You're drawn to aesthetics, storytelling, and creating experiences that resonate with others.",
  social: "You're people-oriented and find fulfillment in helping others. You have strong empathy, communication skills, and enjoy building meaningful connections."
};

// Analyze answers to determine personality profile
export function analyzeAnswers(selectedOptions: Record<number, string>, questions: any[]): PersonalityProfile {
  // Count occurrences of each personality type
  const typeCounts: Record<string, number> = {
    tech: 0,
    engineering: 0,
    science: 0,
    business: 0,
    creative: 0,
    social: 0
  };
  
  // Total number of questions answered
  let totalAnswered = 0;
  
  // Analyze each answer
  Object.entries(selectedOptions).forEach(([questionId, optionId]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    const option = question?.options.find((o: Option) => o.id === optionId);
    
    if (option?.type) {
      typeCounts[option.type] = (typeCounts[option.type] || 0) + 1;
      totalAnswered++;
    }
  });
  
  // Find dominant and secondary types
  let dominantType = '';
  let dominantCount = 0;
  let secondaryType = '';
  let secondaryCount = 0;
  
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > dominantCount) {
      secondaryType = dominantType;
      secondaryCount = dominantCount;
      dominantType = type;
      dominantCount = count;
    } else if (count > secondaryCount) {
      secondaryType = type;
      secondaryCount = count;
    }
  });
  
  // If there's a tie for dominant, use the first one alphabetically
  if (dominantType === '') {
    dominantType = 'tech'; // Default fallback
  }
  
  // If there's a tie for secondary or no clear secondary, use the first one that's not the dominant
  if (secondaryType === '' || secondaryType === dominantType) {
    const types = Object.keys(typeCounts).filter((t: string) => t !== dominantType);
    secondaryType = types.length > 0 ? types[0] : 'business'; // Default fallback
  }
  
  // Calculate distribution percentages
  const distribution: Record<string, number> = {};
  Object.entries(typeCounts).forEach(([type, count]) => {
    distribution[type] = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0;
  });
  
  // Create description based on dominant and secondary types
  const description = `You primarily identify with ${personalityDescriptions[dominantType]} You also show traits of ${personalityDescriptions[secondaryType]}`;
  
  return {
    dominantType,
    secondaryType,
    description,
    distribution
  };
}

// Get career recommendations based on personality profile
export function getCareerRecommendations(profile: PersonalityProfile): CareerPath[] {
  const { dominantType, secondaryType } = profile;
  let recommendations: CareerPath[] = [];
  
  // Add careers from dominant type
  if (careerPaths[dominantType]) {
    recommendations = recommendations.concat(careerPaths[dominantType]);
  }
  
  // Add careers from secondary type that match both types
  if (careerPaths[secondaryType]) {
    const secondaryRecommendations = careerPaths[secondaryType].filter(career => 
      career.personalityTypes.includes(dominantType) || 
      !recommendations.some(rec => rec.title === career.title)
    );
    
    // Add up to 3 secondary recommendations
    recommendations = recommendations.concat(secondaryRecommendations.slice(0, 3));
  }
  
  // Limit to top 6 recommendations
  return recommendations.slice(0, 6);
}
