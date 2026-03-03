import api from './api';

class ReminderService {
  async getAllReminders() {
    try {
      const response = await api.get('/reminders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async createReminder(reminderData) {
    try {
      const response = await api.post('/reminders', reminderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async toggleReminder(reminderId) {
    try {
      const response = await api.put(`/reminders/${reminderId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async deleteReminder(reminderId) {
    try {
      const response = await api.delete(`/reminders/${reminderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new ReminderService();