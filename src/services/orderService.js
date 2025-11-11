import { ORDER_ENDPOINTS } from '../config/api';

class OrderService {
  // Helper method to make authenticated requests
  async makeRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // User Order Management
  async getUserOrders(params = {}) {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.sort) searchParams.append('sort', params.sort);

      const url = `${ORDER_ENDPOINTS.GET_USER_ORDERS}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      return await this.makeRequest(`${ORDER_ENDPOINTS.GET_ORDER_BY_ID}/${orderId}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async cancelOrder(orderId, reason) {
    try {
      return await this.makeRequest(`${ORDER_ENDPOINTS.CANCEL_ORDER}/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          reason,
          cancellationDate: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  async requestRefund(orderId, refundData) {
    try {
      return await this.makeRequest(`${ORDER_ENDPOINTS.REQUEST_REFUND}/${orderId}`, {
        method: 'POST',
        body: JSON.stringify({
          ...refundData,
          requestDate: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  }

  // Admin Order Management
  async getAllOrders(filters = {}) {
    try {
      const searchParams = new URLSearchParams();
      
      // Add filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          searchParams.append(key, value);
        }
      });

      const url = `${ORDER_ENDPOINTS.GET_ALL_ORDERS}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status, notes = '') {
    try {
      return await this.makeRequest(`${ORDER_ENDPOINTS.UPDATE_ORDER_STATUS}/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          status,
          notes,
          updatedAt: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async getRefundRequests(status = 'all') {
    try {
      const url = status === 'all' 
        ? ORDER_ENDPOINTS.GET_REFUND_REQUESTS 
        : `${ORDER_ENDPOINTS.GET_REFUND_REQUESTS}?status=${status}`;
        
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      throw error;
    }
  }

  async processRefund(orderId, refundData) {
    try {
      return await this.makeRequest(`${ORDER_ENDPOINTS.PROCESS_REFUND}/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...refundData,
          processedDate: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getOrderAnalytics(timeframe = 'month') {
    try {
      return await this.makeRequest(`${ORDER_ENDPOINTS.GET_ORDER_ANALYTICS}?timeframe=${timeframe}`);
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      throw error;
    }
  }

  // Utility Methods
  getOrderStatusColor(status) {
    const statusColors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      refunded: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      returned: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }

  canCancelOrder(order) {
    const cancellableStatuses = ['pending', 'processing'];
    return cancellableStatuses.includes(order.status);
  }

  canRequestRefund(order) {
    const refundableStatuses = ['delivered', 'completed'];
    return refundableStatuses.includes(order.status) && !order.refundRequest;
  }

  canReturnOrder(order) {
    if (!order.deliveryDate) return false;
    
    const deliveryDate = new Date(order.deliveryDate);
    const now = new Date();
    const daysDifference = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));
    
    // Allow returns within 30 days of delivery
    return daysDifference <= 30 && order.status === 'delivered';
  }

  formatOrderTotal(total, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(total);
  }

  getEstimatedDeliveryDate(orderDate, shippingMethod = 'standard') {
    const order = new Date(orderDate);
    const deliveryDays = {
      standard: 5,
      express: 3,
      overnight: 1
    };
    
    const days = deliveryDays[shippingMethod] || 5;
    order.setDate(order.getDate() + days);
    
    return order.toISOString();
  }

  generateTrackingNumber() {
    const prefix = 'TRK';
    const number = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `${prefix}${number}`;
  }

  // Order Status Workflow
  getNextStatus(currentStatus) {
    const statusFlow = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
      delivered: 'completed'
    };
    return statusFlow[currentStatus] || currentStatus;
  }

  getPreviousStatus(currentStatus) {
    const statusFlow = {
      processing: 'pending',
      shipped: 'processing',
      delivered: 'shipped',
      completed: 'delivered'
    };
    return statusFlow[currentStatus] || currentStatus;
  }

  getAvailableStatusTransitions(currentStatus) {
    const transitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['completed', 'returned'],
      completed: ['returned'],
      cancelled: [], // Cannot transition from cancelled
      returned: [], // Cannot transition from returned
      refunded: []  // Cannot transition from refunded
    };
    return transitions[currentStatus] || [];
  }

  // Validation Methods
  validateRefundAmount(requestedAmount, orderTotal) {
    return requestedAmount > 0 && requestedAmount <= orderTotal;
  }

  validateCancellationReason(reason) {
    const validReasons = [
      'Changed my mind',
      'Found a better price elsewhere',
      'No longer needed',
      'Ordered by mistake',
      'Product delivery too slow',
      'Payment issues',
      'Product out of stock',
      'Other'
    ];
    return validReasons.includes(reason) || (typeof reason === 'string' && reason.trim().length > 0);
  }
}

// Create and export a singleton instance
const orderService = new OrderService();
export default orderService;