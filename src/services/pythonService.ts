import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8001';
const NODE_API_URL = process.env.NODE_API_URL || 'http://localhost:5000';

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
      const response = await axios.post(`${PYTHON_API_URL}/api/welcome`, { messages });
      return response.data;
    } catch (error) {
      console.error('Error in welcome chat:', error);
      throw error;
    }
  },

  async updatePreferences(messages: ChatMessage[]) {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/api/preferences`, { messages });
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  async saveWelcomePreferences(preferences: WelcomePreferences, token: string) {
    try {
      const response = await axios.post(`${NODE_API_URL}/api/welcome/save-preferences`, preferences, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error saving welcome preferences:', error);
      throw error;
    }
  },
};
