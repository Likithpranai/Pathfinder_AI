// Store your API keys here
// IMPORTANT: In a production environment, these should be stored in environment variables
// or a secure key management system, not directly in the code

export const GROK_API_KEY = "xai-y7JSLBVvUBk6HSwRHguojSep0sVMi8SnT4GL0npNI1v7MyJWzzp1wmbi9UIFAB1DkcO3z5jqspm1lbNn";

// Function to check if the API key is configured
export const isGrokConfigured = (): boolean => {
  return GROK_API_KEY.length > 0;
};
