




import { ORDER_ENDPOINTS } from '../config/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }
  return data;
};

const orderService = {
  // Get all orders of the logged-in user
  getUserOrders: async () => {
    try {
      const response = await fetch(ORDER_ENDPOINTS.GET_USER_ORDERS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },

  // Cancel a pending order
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await fetch(ORDER_ENDPOINTS.CANCEL_ORDER, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderId, reason }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  },

  // Request cancellation for a paid order
  requestCancellation: async (orderId, reason, additionalInfo = '') => {
    try {
      const response = await fetch(ORDER_ENDPOINTS.REQUEST_CANCELLATION, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderId, reason, additionalInfo }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Request cancellation error:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`${ORDER_ENDPOINTS.GET_ORDER_BY_ID}/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
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
