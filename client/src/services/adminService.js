import API from './api';

export const adminService = {
  getPendingEvents: async () => {
    const res = await API.get('/admin/events/pending');
    return res.data;
  },
  approveEvent: async (id) => {
    const res = await API.put(`/admin/events/${id}/approve`);
    return res.data;
  },
  rejectEvent: async (id, rejectionReason) => {
    const res = await API.put(`/admin/events/${id}/reject`, { rejectionReason });
    return res.data;
  },
  getAllUsers: async (params = {}) => {
    const res = await API.get('/admin/users', { params });
    return res.data;
  },
  toggleUserStatus: async (id) => {
    const res = await API.put(`/admin/users/${id}/toggle-status`);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await API.delete(`/admin/users/${id}`);
    return res.data;
  },
  getPlatformAnalytics: async () => {
    const res = await API.get('/admin/analytics');
    return res.data;
  }
};
