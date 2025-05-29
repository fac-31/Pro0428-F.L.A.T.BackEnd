import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

interface ChatMessage {
  role: string;
  content: string;
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
};
