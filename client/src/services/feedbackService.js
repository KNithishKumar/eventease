import API from './api';

export const feedbackService = {
  submitFeedback: async (eventId, data) => {
    const res = await API.post(`/events/${eventId}/feedback`, data);
    return res.data;
  },
  getEventFeedback: async (eventId) => {
    const res = await API.get(`/events/${eventId}/feedback`);
    return res.data;
  }
};
