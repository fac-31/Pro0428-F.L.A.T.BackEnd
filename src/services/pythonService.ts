import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8001';

interface ChatMessage {
  role: string;
  content: string;
}

interface WelcomePreferences {
  user_preferences: Record<string, string | number | boolean>;
  house_preferences: Record<string, string | number | boolean>;
}

export const pythonService = {
  async welcomeChat(messages: ChatMessage[]) {
    try {
      console.log('Sending welcome chat request to:', `${PYTHON_API_URL}/api/welcome`);
      const response = await axios.post(`${PYTHON_API_URL}/api/welcome`, { messages });
      return response.data;
    } catch (error) {
      console.error('Error in welcome chat:', {
        error: error instanceof Error ? error.message : error,
        url: `${PYTHON_API_URL}/api/welcome`,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  async saveWelcomePreferences(preferences: WelcomePreferences, token: string) {
    try {
      console.log('🚀 [pythonService] Attempting to save preferences:', {
        preferences,
        tokenLength: token?.length,
        pythonApiUrl: PYTHON_API_URL
      });

      const response = await axios.post(`${PYTHON_API_URL}/api/save-preferences`, preferences, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ [pythonService] Preferences saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [pythonService] Error saving welcome preferences:', {
        error: error instanceof Error ? error.message : error,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
};
