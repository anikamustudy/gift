import api from './api';

export const giftService = {
  getGifts: async (params) => {
    const response = await api.get('/gifts', { params });
    return response.data;
  },

  getGift: async (id) => {
    const response = await api.get(`/gifts/${id}`);
    return response.data;
  },

  createGift: async (giftData) => {
    const response = await api.post('/gifts', giftData);
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  createPaymentIntent: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/payment`);
    return response.data;
  },

  confirmPayment: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/confirm-payment`);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export const feedService = {
  getFeed: async (page = 1) => {
    const response = await api.get('/feed', { params: { page } });
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/feed/${postId}/like`);
    return response.data;
  },

  commentOnPost: async (postId, text) => {
    const response = await api.post(`/feed/${postId}/comment`, { text });
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },
};
