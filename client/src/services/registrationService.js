import API from './api';

export const registrationService = {
  registerForEvent: async (eventId, paymentData = {}) => {
    const res = await API.post(`/events/${eventId}/register`, paymentData);
    return res.data;
  },
  getMyRegistrations: async () => {
    const res = await API.get('/registrations/my');
    return res.data;
  },
  getTicketById: async (ticketId) => {
    const res = await API.get(`/registrations/ticket/${ticketId}`);
    return res.data;
  },
  getEventRegistrations: async (eventId, params = {}) => {
    const res = await API.get(`/events/${eventId}/registrations`, { params });
    return res.data;
  }
};
