import api from './api';

export const paymentService = {
  createOrder: async (eventId) => {
    const response = await api.post('/payment/create-order', { eventId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  }
};
