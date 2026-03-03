import api from './api';

class UserService {
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getLeaderboard() {
    try {
      const response = await api.get('/users/leaderboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getDailyMotivation() {
    try {
      const response = await api.get('/users/motivation');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new UserService();