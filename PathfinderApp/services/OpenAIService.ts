import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/apiKeys';
import { AICareerResponse } from '../types/CareerTypes';

// Format user answers into a prompt for the AI
const formatUserAnswersForAI = (selectedOptions: Record<number, string>): string => {
  return `
    I've completed a career aptitude questionnaire. Based on my answers, please suggest career paths that would be a good fit for me.
    
    Here are my answers (question number: selected option):
    ${Object.entries(selectedOptions)
      .map(([questionNumber, optionId]) => `Question ${questionNumber}: Option ${optionId}`)
      .join('\n')}
    
    Please analyze my answers and provide career recommendations in the following JSON format:
    {
      "personalityInsights": "A brief analysis of my personality traits based on my answers",
      "recommendations": [
        {
          "field": "Career field name",
          "description": "Brief description of the field",
          "skills": ["Skill 1", "Skill 2", "Skill 3"],
          "education": ["Education path 1", "Education path 2", "Education path 3"],
          "roles": ["Specific job role 1", "Specific job role 2", "Specific job role 3"],
          "fitReason": "Explanation of why this career fits my personality and answers"
        }
      ]
    }
    
    Include exactly 5 career recommendations. Make sure the fitReason specifically references my questionnaire answers and explains why each career would be a good match for me.
  `;
};

// Fallback data in case the API call fails
const fallbackData: AICareerResponse = {
  personalityInsights: "You appear to be analytical and technically-minded with an interest in solving problems.",
  recommendations: [
    {
      field: "Technology",
      description: "The technology field involves creating, maintaining, and improving computer systems and applications.",
      skills: ["Programming", "Problem-solving", "Technical knowledge"],
      education: ["Computer Science degree", "Coding bootcamp", "Self-taught with certifications"],
      roles: ["Software Developer", "Data Analyst", "IT Support Specialist"],
      fitReason: "Based on your answers, you might enjoy solving technical problems and working with technology."
    }
  ]
};

// Call OpenAI API to get career recommendations
export const getAICareerRecommendations = async (
  selectedOptions: Record<number, string>,
  apiKey: string
): Promise<AICareerResponse> => {
  try {
    const prompt = formatUserAnswersForAI(selectedOptions);
    
    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    });
    
    // Call the OpenAI API using the SDK
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a career counselor for high school students. Provide career recommendations based on their questionnaire answers. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2048
    });
    
    const textResponse = response.choices[0].message.content;
    if (!textResponse) {
      throw new Error("Empty response from OpenAI");
    }
    
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]);
    return jsonResponse as AICareerResponse;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return { ...fallbackData };
  }
};
