import API from './api';

export const eventService = {
  getEvents: async (params = {}) => {
    const res = await API.get('/events', { params });
    return res.data;
  },
  getEventById: async (id) => {
    const res = await API.get(`/events/${id}`);
    return res.data;
  },
  createEvent: async (formData) => {
    const res = await API.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  updateEvent: async (id, formData) => {
    const res = await API.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await API.delete(`/events/${id}`);
    return res.data;
  },
  getOrganizerEvents: async () => {
    const res = await API.get('/events/organizer/my');
    return res.data;
  }
};
