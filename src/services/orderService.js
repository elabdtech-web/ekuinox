import axiosInstance from '../config/axiosInstance';

const orderService = {
  // Get all orders of the logged-in user
  getUserOrders: async () => {
    try {
      const response = await axiosInstance.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get orders');
    }
  },

  // Cancel a pending order
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await axiosInstance.post('/payments/cancel', { orderId, reason });
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  },

  // Request cancellation for a paid order
  requestCancellation: async (orderId, reason, additionalInfo = '') => {
    try {
      const response = await axiosInstance.post('/payments/cancel-request', { orderId, reason, additionalInfo });
      return response.data;
    } catch (error) {
      console.error('Request cancellation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to request cancellation');
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/payments/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get order');
    }
  },

  // Helper: get color classes based on status
  getOrderStatusColor: (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'succeeded':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'canceled':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancellation_requested':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'refunded':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  },

  // Format order data for frontend
  formatOrderData: (order) => ({
    _id: order._id,
    orderId: order.orderId,
    amount: order.amount,
    status: order.status,
    items: order.items || [],
    customerInfo: order.customerInfo,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    cancellationReason: order.cancellationReason,
    cancellationRequestedAt: order.cancellationRequestedAt,
  }),
};

export default orderService;
