import axios from 'axios';
import { onboardingQuestions, Question, Option } from '../components/OnboardingQuestions';

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
  topFields: string[];
  recommendations: CareerRecommendation[];
}

/**
 * Formats the user's answers into a structured prompt for the AI
 */
export const formatUserAnswersForAI = (selectedOptions: Record<number, string>): string => {
  let prompt = "Based on the following questionnaire responses from a high school student, suggest the most suitable career fields and specific job roles:\n\n";
  
  Object.entries(selectedOptions).forEach(([questionId, optionId]) => {
    const question = onboardingQuestions.find(q => q.id === parseInt(questionId));
    if (!question) return;
    
    const option = question.options.find((o: Option) => o.id === optionId);
    if (!option) return;
    
    prompt += `Question: ${question.text}\n`;
    prompt += `Answer: ${option.text}\n\n`;
  });
  
  prompt += "Based on the student's answers to the career aptitude questionnaire, please analyze their interests, strengths, and preferences.\n\n";
  prompt += "Please provide a detailed analysis of this student's interests and aptitudes based on their answers. Then recommend 3-5 career fields that would be most suitable for them, along with specific job roles within each field. For each recommendation, include:\n";
  prompt += "1. Career field name\n";
  prompt += "2. Specific job roles within that field\n";
  prompt += "3. Brief description of the field\n";
  prompt += "4. Key skills needed\n";
  prompt += "5. Typical education requirements\n";
  prompt += "6. IMPORTANT: Provide a detailed justification (3-5 sentences) explaining why this field matches their profile. You MUST specifically reference their questionnaire answers by mentioning the exact questions or scenarios they responded to (e.g., 'Your preference for solving technical problems in Question 3...' or 'Your choice to analyze data in the group project scenario...'). Make direct connections between their specific responses and the career field's characteristics.\n\n";
  prompt += "Format your response in JSON with the following structure:\n";
  prompt += "{\n";
  prompt += '  "personalityInsight": "Overall analysis of their personality and aptitudes",\n';
  prompt += '  "topFields": ["Field1", "Field2", "Field3"],\n';
  prompt += '  "recommendations": [\n';
  prompt += '    {\n';
  prompt += '      "field": "Career Field Name",\n';
  prompt += '      "roles": ["Role 1", "Role 2", "Role 3"],\n';
  prompt += '      "description": "Brief description of the field",\n';
  prompt += '      "skills": ["Skill 1", "Skill 2", "Skill 3"],\n';
  prompt += '      "education": ["Education requirement 1", "Education requirement 2"],\n';
  prompt += '      "fitReason": "Detailed justification (3-5 sentences) that specifically references their questionnaire answers and connects them to this career field"\n';
  prompt += '    }\n';
  prompt += '  ]\n';
  prompt += "}\n";
  
  return prompt;
};

/**
 * Calls the Grok API to get career recommendations based on user answers
 * Uses Grok's AI capabilities to analyze responses and provide personalized recommendations
 */
export const getAICareerRecommendations = async (
  selectedOptions: Record<number, string>,
  apiKey: string
): Promise<AICareerResponse> => {
  try {
    const prompt = formatUserAnswersForAI(selectedOptions);
    
    // Grok API endpoint
    const endpoint = 'https://api.grok.ai/v1/chat/completions';
    
    const response = await axios.post(
      endpoint,
      {
        model: "grok-1",
        messages: [
          {
            role: "system",
            content: "You are a career counselor for high school students. Your task is to analyze the student's questionnaire responses and provide personalized career recommendations in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the text response from the model
    const textResponse = response.data.choices[0].message.content;
    
    // Parse the JSON response
    // Find the JSON object in the response (in case there's additional text)
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]);
    return jsonResponse as AICareerResponse;
  } catch (error) {
    console.error("Error calling Grok API:", error);
    
    // Return a fallback response in case of API failure
    return {
      personalityInsight: "Unable to analyze profile due to API error. Please try again later.",
      topFields: ["Technology", "Business", "Science"],
      recommendations: [
        {
          field: "Technology",
          roles: ["Software Developer", "Data Analyst", "IT Support Specialist"],
          description: "The technology field involves creating, maintaining, and improving computer systems and applications.",
          skills: ["Programming", "Problem-solving", "Technical knowledge"],
          education: ["Computer Science degree", "Coding bootcamp", "Self-taught with certifications"],
          fitReason: "Based on your answers, you might enjoy solving technical problems and working with technology."
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
