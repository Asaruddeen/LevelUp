import api from './api';

class HabitService {
  async getAllHabits() {
    try {
      const response = await api.get('/habits');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async createHabit(habitData) {
    try {
      const response = await api.post('/habits', habitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async completeHabit(habitId) {
    try {
      const response = await api.put(`/habits/${habitId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async deleteHabit(habitId) {
    try {
      const response = await api.delete(`/habits/${habitId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new HabitService();