import API from './api';

export const notificationService = {
  getMyNotifications: async () => {
    const res = await API.get('/notifications');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await API.put(`/notifications/${id}/read`);
    return res.data;
  },
  sendAnnouncement: async (eventId, announcement) => {
    const res = await API.post(`/events/${eventId}/announcements`, announcement);
    return res.data;
  }
};
