import api from './api';

class TaskService {
  async getAllTasks() {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async completeTask(taskId) {
    try {
      const response = await api.put(`/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async checkMissedTasks() {
    try {
      const response = await api.post('/tasks/check-missed');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new TaskService();