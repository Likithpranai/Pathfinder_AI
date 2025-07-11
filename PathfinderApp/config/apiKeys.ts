// Store your API keys here
// IMPORTANT: In a production environment, these should be stored in environment variables
// or a secure key management system, not directly in the code

// Gemini API key
export const GEMINI_API_KEY = "AIzaSyC8i2zsCpZO7I7zqpeGn23MEQyCnE_xkrc";

// Function to check if the Gemini API key is configured
export const isGeminiConfigured = (): boolean => {
  return GEMINI_API_KEY.length > 0;
};

// Legacy function kept for compatibility
export const isOpenAIConfigured = (): boolean => {
  return false; // Always returns false as we've migrated to Gemini
};
