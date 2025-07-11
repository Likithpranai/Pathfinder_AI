import axios from 'axios';
import { onboardingQuestions, Question, Option } from '../components/OnboardingQuestions';
import { GEMINI_API_KEY, isGeminiConfigured } from '../config/apiKeys';
import { AICareerResponse, CareerRecommendation } from '../types/AITypes';
import { analyzeAnswers } from '../utils/CareerRecommendations';

// Re-export types from AITypes.ts for backward compatibility
export type { AICareerResponse, CareerRecommendation } from '../types/AITypes';

/**
 * Formats the user's answers into a structured prompt for the Gemini AI
 */
export const formatUserAnswersForAI = (selectedOptions: Record<number, string>): string => {
  // Analyze the user's answers to determine personality types
  const personalityProfile = analyzeAnswers(selectedOptions, onboardingQuestions);
  const { dominantType, secondaryType, distribution } = personalityProfile;
  
  let prompt = "Based on the following questionnaire responses and personality analysis, suggest EXACTLY 5 specific career paths that would be most suitable for this individual:\n\n";
  
  // Add personality analysis to the prompt
  prompt += `Personality Analysis:\n`;
  prompt += `- Dominant personality type: ${dominantType} (${distribution[dominantType]}%)\n`;
  prompt += `- Secondary personality type: ${secondaryType} (${distribution[secondaryType]}%)\n`;
  prompt += `- Other traits: `;
  
  Object.entries(distribution)
    .filter(([type]) => type !== dominantType && type !== secondaryType)
    .forEach(([type, percentage]) => {
      prompt += `${type} (${percentage}%), `;
    });
  prompt += "\n\n";
  
  // Add personality type descriptions
  prompt += "Personality Type Descriptions:\n";
  prompt += "- tech: Analytical, logical, enjoys technology and problem-solving\n";
  prompt += "- engineering: Practical, methodical, enjoys building and understanding systems\n";
  prompt += "- science: Curious, investigative, enjoys research and discovery\n";
  prompt += "- business: Strategic, leadership-oriented, enjoys organization and management\n";
  prompt += "- creative: Imaginative, artistic, enjoys expression and design\n";
  prompt += "- social: Empathetic, communicative, enjoys helping and connecting with others\n\n";
  
  // Add individual question responses
  Object.entries(selectedOptions).forEach(([questionId, optionId]) => {
    const question = onboardingQuestions.find(q => q.id === parseInt(questionId));
    if (!question) return;
    
    const option = question.options.find((o: Option) => o.id === optionId);
    if (!option) return;
    
    prompt += `Question: ${question.text}\n`;
    prompt += `Answer: ${option.text} (Type: ${option.type})\n\n`;
  });
  
  prompt += "Based on the above personality analysis, please recommend EXACTLY 5 SPECIFIC career paths that align with the user's dominant and secondary personality types. These should be specific job titles (like 'Full-Stack Developer', 'Financial Analyst', 'Mechanical Engineer', etc.) rather than broad categories. For each recommendation, include:\n";
  prompt += "1. Specific career title (e.g., 'Data Scientist' not 'Technology')\n";
  prompt += "2. Related roles or specializations within that career\n";
  prompt += "3. Brief description of what the job entails\n";
  prompt += "4. Key skills needed for success in this career\n";
  prompt += "5. Typical education requirements\n";
  prompt += "6. Why this specific career matches their profile\n\n";
  prompt += "Format your response in JSON with the following structure:\n";
  prompt += "{\n";
  prompt += '  "personalityInsight": "Overall analysis of their personality and aptitudes",\n';
  prompt += '  "topFields": ["Specific Career 1", "Specific Career 2", "Specific Career 3", "Specific Career 4", "Specific Career 5"],\n';
  prompt += '  "recommendations": [\n';
  prompt += '    {\n';
  prompt += '      "field": "Specific Career Title",\n';
  prompt += '      "roles": ["Related Role 1", "Related Role 2", "Related Role 3"],\n';
  prompt += '      "description": "Brief description of what this job entails",\n';
  prompt += '      "skills": ["Specific Skill 1", "Specific Skill 2", "Specific Skill 3"],\n';
  prompt += '      "education": ["Education 1", "Education 2"],\n';
  prompt += '      "fitReason": "Why this specific career matches their profile"\n';
  prompt += '    }\n';
  prompt += '  ]\n';
  prompt += '}';
  
  prompt += "\n\nIMPORTANT INSTRUCTIONS:\n";
  prompt += "1. You MUST provide EXACTLY 5 SPECIFIC career recommendations in the 'recommendations' array.\n";
  prompt += "2. Each recommendation MUST align with either the dominant or secondary personality type.\n";
  prompt += "3. At least 3 recommendations should align with the dominant personality type.\n";
  prompt += "4. Do not use broad categories - use specific job titles.\n";
  prompt += "5. For tech personality: focus on software development, data science, IT roles.\n";
  prompt += "6. For engineering personality: focus on specific engineering disciplines.\n";
  prompt += "7. For science personality: focus on research, laboratory, and analytical roles.\n";
  prompt += "8. For business personality: focus on management, finance, marketing roles.\n";
  prompt += "9. For creative personality: focus on design, content creation, artistic roles.\n";
  prompt += "10. For social personality: focus on counseling, teaching, healthcare roles.\n";
  
  return prompt;
};

/**
 * Calls the Gemini API to get career recommendations based on user answers
 */
export const getAICareerRecommendations = async (
  selectedOptions: Record<number, string>,
  apiKey: string = GEMINI_API_KEY
): Promise<AICareerResponse> => {
  try {
    const prompt = formatUserAnswersForAI(selectedOptions);
    
    // Gemini API endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await axios.post(endpoint, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
    
    // Extract the text response from Gemini
    const textResponse = response.data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    // Find the JSON object in the response (in case there's additional text)
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]);
    
    // Ensure we have exactly 5 recommendations
    const result = jsonResponse as AICareerResponse;
    
    if (!result.recommendations || result.recommendations.length === 0) {
      throw new Error("No recommendations received from Gemini API");
    }
    
    // If we have fewer than 5 recommendations, duplicate the last one to make it 5
    if (result.recommendations.length < 5) {
      const lastRec = result.recommendations[result.recommendations.length - 1];
      while (result.recommendations.length < 5) {
        const copy = { ...lastRec };
        copy.field = `${copy.field} (Specialization ${result.recommendations.length + 1})`;
        result.recommendations.push(copy);
      }
    }
    
    // If we have more than 5 recommendations, trim to 5
    if (result.recommendations.length > 5) {
      result.recommendations = result.recommendations.slice(0, 5);
    }
    
    // Ensure topFields also has 5 entries
    if (!result.topFields || result.topFields.length === 0) {
      result.topFields = result.recommendations.map(r => r.field);
    }
    
    if (result.topFields.length < 5) {
      while (result.topFields.length < 5) {
        result.topFields.push(result.topFields[result.topFields.length - 1] + " (Specialization)");
      }
    }
    
    if (result.topFields.length > 5) {
      result.topFields = result.topFields.slice(0, 5);
    }
    
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Get the personality profile to provide relevant fallback recommendations
    const personalityProfile = analyzeAnswers(selectedOptions, onboardingQuestions);
    const { dominantType, secondaryType } = personalityProfile;
    
    // Define fallback recommendations based on personality types
    const fallbackRecommendations: Record<string, any[]> = {
      tech: [
        {
          field: "Full-Stack Developer",
          roles: ["Frontend Developer", "Backend Engineer", "DevOps Specialist"],
          description: "Designs and builds complete web applications, handling both user interfaces and server-side functionality.",
          skills: ["JavaScript/TypeScript", "React/Angular/Vue", "Node.js", "Database management", "API development"],
          education: ["Computer Science degree", "Coding bootcamp", "Self-taught with portfolio"],
          fitReason: "Based on your tech-oriented answers, you would excel in creating digital solutions and solving complex technical challenges."
        },
        {
          field: "Data Scientist",
          roles: ["Machine Learning Engineer", "AI Researcher", "Data Analyst"],
          description: "Analyzes complex data sets to identify patterns and build predictive models that drive business decisions.",
          skills: ["Python/R", "Statistical analysis", "Machine learning", "Data visualization", "SQL"],
          education: ["Computer Science or Statistics degree", "Data Science bootcamp", "Advanced degree in related field"],
          fitReason: "Your analytical mindset and technical interests align perfectly with extracting insights from complex data."
        },
        {
          field: "Cybersecurity Analyst",
          roles: ["Security Engineer", "Penetration Tester", "Security Consultant"],
          description: "Protects computer systems and networks from information disclosure, theft, or damage to hardware, software, or data.",
          skills: ["Network security", "Threat detection", "Security protocols", "Ethical hacking", "Risk assessment"],
          education: ["Computer Science degree", "Cybersecurity certifications", "Specialized training"],
          fitReason: "Your technical aptitude and analytical thinking would be valuable in protecting systems from security threats."
        }
      ],
      engineering: [
        {
          field: "Robotics Engineer",
          roles: ["Automation Specialist", "Control Systems Engineer", "Robot Programmer"],
          description: "Designs, builds, and maintains robotic systems and automated equipment for various applications.",
          skills: ["Mechanical design", "Programming", "Electronics", "Control systems", "Problem-solving"],
          education: ["Mechanical/Electrical Engineering degree", "Robotics specialization", "Technical certifications"],
          fitReason: "Your engineering mindset and interest in building systems would be perfect for creating robotic solutions."
        },
        {
          field: "Aerospace Engineer",
          roles: ["Propulsion Engineer", "Structural Analyst", "Systems Engineer"],
          description: "Designs aircraft, spacecraft, satellites, and missiles, as well as testing prototypes to ensure they function according to design.",
          skills: ["Aerodynamics", "Propulsion", "Materials science", "CAD software", "Analytical thinking"],
          education: ["Aerospace Engineering degree", "Advanced degree in specialized area", "Professional certifications"],
          fitReason: "Your engineering aptitude and systematic approach to problem-solving align well with aerospace challenges."
        },
        {
          field: "Mechanical Engineer",
          roles: ["Product Designer", "Manufacturing Engineer", "Thermal Systems Specialist"],
          description: "Designs, develops, and tests mechanical devices, components, and systems for various applications.",
          skills: ["CAD software", "Thermodynamics", "Material science", "Problem-solving", "Technical drawing"],
          education: ["Mechanical Engineering degree", "Professional Engineer (PE) license", "Specialized certifications"],
          fitReason: "Your answers show strong engineering tendencies and interest in how things work physically."
        }
      ],
      science: [
        {
          field: "Biochemist",
          roles: ["Research Scientist", "Laboratory Manager", "Pharmaceutical Developer"],
          description: "Studies the chemical processes and substances that occur in living organisms to develop new products and solve problems.",
          skills: ["Laboratory techniques", "Data analysis", "Research methodology", "Critical thinking", "Technical writing"],
          education: ["Biochemistry degree", "Advanced degree (MS/PhD)", "Laboratory certifications"],
          fitReason: "Your scientific curiosity and analytical approach would be valuable in biochemical research and development."
        },
        {
          field: "Environmental Scientist",
          roles: ["Conservation Specialist", "Environmental Analyst", "Sustainability Consultant"],
          description: "Studies, develops, and implements solutions to environmental problems and works to protect natural resources.",
          skills: ["Field research", "Data collection", "Environmental regulations", "GIS mapping", "Scientific writing"],
          education: ["Environmental Science degree", "Specialized certifications", "Advanced degree in related field"],
          fitReason: "Your scientific mindset and analytical skills would help address important environmental challenges."
        },
        {
          field: "Astrophysicist",
          roles: ["Research Scientist", "Observatory Specialist", "Data Analyst"],
          description: "Studies the physics of the universe, including stars, planets, galaxies, and the fundamental laws that govern them.",
          skills: ["Advanced mathematics", "Computer modeling", "Data analysis", "Research methodology", "Critical thinking"],
          education: ["Physics degree", "PhD in Astrophysics", "Advanced mathematics training"],
          fitReason: "Your scientific curiosity and analytical abilities would be well-suited to exploring the cosmos."
        }
      ],
      business: [
        {
          field: "Financial Analyst",
          roles: ["Investment Analyst", "Risk Assessment Specialist", "Portfolio Manager"],
          description: "Analyzes financial data to guide investment decisions and provide recommendations for individuals or organizations.",
          skills: ["Financial modeling", "Data analysis", "Market research", "Excel/financial software", "Critical thinking"],
          education: ["Finance or Economics degree", "MBA", "CFA certification"],
          fitReason: "Your business acumen and analytical abilities would excel in making data-driven financial decisions."
        },
        {
          field: "Marketing Manager",
          roles: ["Brand Strategist", "Digital Marketing Specialist", "Market Research Analyst"],
          description: "Develops and implements marketing strategies to promote products or services and drive business growth.",
          skills: ["Strategic planning", "Campaign management", "Market analysis", "Communication", "Creative thinking"],
          education: ["Marketing or Business degree", "MBA", "Digital marketing certifications"],
          fitReason: "Your business orientation and strategic thinking would be valuable in developing effective marketing campaigns."
        },
        {
          field: "Management Consultant",
          roles: ["Strategy Consultant", "Operations Analyst", "Business Transformation Specialist"],
          description: "Helps organizations improve performance through analysis of existing problems and development of plans for improvement.",
          skills: ["Problem-solving", "Business analysis", "Project management", "Communication", "Strategic thinking"],
          education: ["Business degree", "MBA", "Management consulting certifications"],
          fitReason: "Your business mindset and analytical approach would help organizations solve complex problems."
        }
      ],
      creative: [
        {
          field: "UX/UI Designer",
          roles: ["Interaction Designer", "User Researcher", "Visual Designer"],
          description: "Creates intuitive, accessible, and visually appealing digital interfaces that enhance user experience.",
          skills: ["User research", "Wireframing", "Prototyping", "Visual design", "Usability testing"],
          education: ["Design degree", "UX certification", "Strong portfolio"],
          fitReason: "Your creative thinking and interest in combining aesthetics with functionality would create exceptional user experiences."
        },
        {
          field: "Game Designer",
          roles: ["Level Designer", "Narrative Designer", "Gameplay Programmer"],
          description: "Creates concepts, rules, and content for video games, focusing on player experience and engagement.",
          skills: ["Game mechanics", "Storytelling", "Prototyping", "User psychology", "Creative problem-solving"],
          education: ["Game Design degree", "Computer Science with game focus", "Strong portfolio"],
          fitReason: "Your creative mindset and interest in interactive experiences would be perfect for game design."
        },
        {
          field: "Art Director",
          roles: ["Creative Director", "Brand Designer", "Visual Communications Manager"],
          description: "Oversees the visual style and creative elements of projects in advertising, publishing, film, or other media.",
          skills: ["Visual design", "Creative direction", "Team leadership", "Brand strategy", "Project management"],
          education: ["Fine Arts or Design degree", "Extensive portfolio", "Industry experience"],
          fitReason: "Your creative vision and aesthetic sensibilities would be valuable in directing visual projects."
        }
      ],
      social: [
        {
          field: "Clinical Psychologist",
          roles: ["Therapist", "Counselor", "Mental Health Researcher"],
          description: "Assesses and treats mental, emotional, and behavioral disorders through various therapeutic approaches.",
          skills: ["Active listening", "Empathy", "Assessment techniques", "Treatment planning", "Research methodology"],
          education: ["Psychology degree", "PhD in Clinical Psychology", "State licensure"],
          fitReason: "Your empathetic nature and interest in understanding human behavior would help others overcome challenges."
        },
        {
          field: "Human Resources Manager",
          roles: ["Talent Acquisition Specialist", "Employee Relations Manager", "Training Coordinator"],
          description: "Oversees the administrative functions of an organization, focusing on recruiting, employee development, and workplace culture.",
          skills: ["Interpersonal communication", "Conflict resolution", "Organizational development", "Policy implementation", "Employee advocacy"],
          education: ["Human Resources degree", "Business with HR focus", "HR certifications"],
          fitReason: "Your people-oriented approach and communication skills would excel in managing human capital."
        },
        {
          field: "Healthcare Administrator",
          roles: ["Medical Practice Manager", "Health Services Coordinator", "Patient Care Director"],
          description: "Manages healthcare facilities, services, and staff to ensure efficient operations and quality patient care.",
          skills: ["Leadership", "Healthcare regulations", "Staff management", "Budget planning", "Quality improvement"],
          education: ["Healthcare Administration degree", "Business with healthcare focus", "Industry certifications"],
          fitReason: "Your social orientation and organizational skills would be valuable in healthcare management."
        }
      ]
    };
    
    // Select recommendations based on dominant and secondary personality types
    let recommendations = [];
    
    // Add 3 recommendations from dominant type
    if (fallbackRecommendations[dominantType] && fallbackRecommendations[dominantType].length >= 3) {
      recommendations.push(...fallbackRecommendations[dominantType].slice(0, 3));
    }
    
    // Add 2 recommendations from secondary type
    if (fallbackRecommendations[secondaryType] && fallbackRecommendations[secondaryType].length >= 2) {
      recommendations.push(...fallbackRecommendations[secondaryType].slice(0, 2));
    }
    
    // If we don't have enough recommendations, fill with tech recommendations
    while (recommendations.length < 5) {
      const fillerType: string = recommendations.length < 3 ? dominantType : (recommendations.length < 5 ? secondaryType : 'tech');
      const availableRecs: any[] = fallbackRecommendations[fillerType] || fallbackRecommendations['tech'];
      
      if (availableRecs && availableRecs.length > 0) {
        const nextRec: any = availableRecs[recommendations.length % availableRecs.length];
        if (nextRec) {
          recommendations.push(nextRec);
        }
      }
    }
    
    // Ensure we have exactly 5 recommendations
    recommendations = recommendations.slice(0, 5);
    
    return {
      personalityInsight: `Based on your answers, you show a strong preference for ${dominantType}-related activities with secondary interests in ${secondaryType}-related fields.`,
      topFields: recommendations.map(r => r.field),
      recommendations: [
        {
          field: "Full-Stack Developer",
          roles: ["Frontend Developer", "Backend Engineer", "DevOps Specialist"],
          description: "Designs and builds complete web applications, handling both user interfaces and server-side functionality.",
          skills: ["JavaScript/TypeScript", "React/Angular/Vue", "Node.js", "Database management", "API development"],
          education: ["Computer Science degree", "Coding bootcamp", "Self-taught with portfolio"],
          fitReason: "Based on your answers, you might enjoy creating digital solutions and solving complex technical challenges."
        },
        {
          field: "Financial Analyst",
          roles: ["Investment Analyst", "Risk Assessment Specialist", "Portfolio Manager"],
          description: "Analyzes financial data to guide investment decisions and provide recommendations for individuals or organizations.",
          skills: ["Financial modeling", "Data analysis", "Market research", "Excel/financial software", "Critical thinking"],
          education: ["Finance or Economics degree", "MBA", "CFA certification"],
          fitReason: "Your answers suggest you have strong analytical abilities and an interest in making data-driven decisions."
        },
        {
          field: "Clinical Psychologist",
          roles: ["Therapist", "Counselor", "Mental Health Researcher"],
          description: "Assesses and treats mental, emotional, and behavioral disorders through various therapeutic approaches.",
          skills: ["Active listening", "Empathy", "Assessment techniques", "Treatment planning", "Research methodology"],
          education: ["Psychology degree", "PhD in Clinical Psychology", "State licensure"],
          fitReason: "Your responses indicate strong empathy and an interest in understanding human behavior and helping others."
        },
        {
          field: "Mechanical Engineer",
          roles: ["Product Designer", "Manufacturing Engineer", "Robotics Specialist"],
          description: "Designs, develops, and tests mechanical devices, components, and systems for various applications.",
          skills: ["CAD software", "Thermodynamics", "Material science", "Problem-solving", "Technical drawing"],
          education: ["Mechanical Engineering degree", "Professional Engineer (PE) license", "Specialized certifications"],
          fitReason: "Your answers suggest you enjoy building things, solving practical problems, and understanding how systems work."
        },
        {
          field: "UX/UI Designer",
          roles: ["Interaction Designer", "User Researcher", "Visual Designer"],
          description: "Creates intuitive, accessible, and visually appealing digital interfaces that enhance user experience.",
          skills: ["User research", "Wireframing", "Prototyping", "Visual design", "Usability testing"],
          education: ["Design degree", "UX certification", "Strong portfolio"],
          fitReason: "Your responses indicate creative thinking and an interest in combining aesthetics with functionality to solve problems."
        }
      ]
    };
  }
};

/**
 * Extracts the dominant personality traits from the AI response
 */
export const extractPersonalityTraits = (aiResponse: AICareerResponse): Record<string, number> => {
  const traits: Record<string, number> = {};
  
  // Extract fields and assign weights based on their position in the recommendations
  aiResponse.topFields.forEach((field, index) => {
    const weight = aiResponse.topFields.length - index;
    traits[field] = weight;
  });
  
  return traits;
};

/**
 * Check if Gemini API is available and configured
 */
export const isGeminiAvailable = (): boolean => {
  return isGeminiConfigured();
};

