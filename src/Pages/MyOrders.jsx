import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaShoppingBag, 
  FaEye, 
  FaTimes, 
  FaShippingFast,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
  FaSearch,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import CancelOrderModal from '../components/CancelOrderModal';
import orderService from '../services/orderService';

// Mock data - replace with actual API call
const mockOrders = [
  {
    id: 'ORD-001',
    items: [
      { 
        name: 'Aventis ChronoSport Watch', 
        quantity: 1, 
        price: 90000, 
        image: '/Luxury1.png',
        color: 'Silver',
        size: 'Medium'
      }
    ],
    total: 90000,
    status: 'pending',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderDate: '2025-11-10T10:30:00Z',
    estimatedDelivery: '2025-11-15',
    trackingNumber: 'TRK123456789',
    shippingAddress: {
      address: 'house no 45 street no 9 muzammi town kufri road shakrial',
      city: 'Barishal',
      state: 'Baridhara',
      country: 'Pakistan',
      zipCode: '46600'
    }
  },
  {
    id: 'ORD-002',
    items: [
      { 
        name: 'Luxury City Package', 
        quantity: 1, 
        price: 25000, 
        image: '/city1.jpg'
      }
    ],
    total: 25000,
    status: 'delivered',
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    orderDate: '2025-11-08T14:20:00Z',
    deliveryDate: '2025-11-12T16:30:00Z',
    trackingNumber: 'TRK987654321',
    shippingAddress: {
      address: '123 Main Street',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      zipCode: '75000'
    }
  },
  {
    id: 'ORD-003',
    items: [
      { 
        name: 'Premium Watch Collection', 
        quantity: 2, 
        price: 45000, 
        image: '/Luxury2.png',
        color: 'Gold',
        size: 'Large'
      }
    ],
    total: 90000,
    status: 'cancelled',
    paymentMethod: 'card',
    paymentStatus: 'refunded',
    orderDate: '2025-11-09T16:45:00Z',
    cancellationDate: '2025-11-09T18:00:00Z',
    cancellationReason: 'Changed my mind',
    shippingAddress: {
      address: '456 Oak Avenue',
      city: 'Lahore',
      state: 'Punjab',
      country: 'Pakistan',
      zipCode: '54000'
    }
  }
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const loadOrdersAsync = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await orderService.getUserOrders();
        // setOrders(response.data);
        
        // Mock data for demo
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error loading orders:', err);
        toast.error('Failed to load orders');
        setLoading(false);
      }
    };

    loadOrdersAsync();
  }, []);

  useEffect(() => {
    const filterOrdersAsync = () => {
      let filtered = orders;

      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter);
      }

      if (searchTerm) {
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      setFilteredOrders(filtered);
    };

    filterOrdersAsync();
  }, [orders, searchTerm, statusFilter]);

  const handleCancelOrder = async (orderId, reason) => {
    try {
      // Replace with actual API call
      // await orderService.cancelOrder(orderId, reason);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'cancelled',
              cancellationDate: new Date().toISOString(),
              cancellationReason: reason
            } 
          : order
      ));
      
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
      throw error;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-400" />;
      case 'processing': return <FaShoppingBag className="text-blue-400" />;
      case 'shipped': return <FaShippingFast className="text-purple-400" />;
      case 'delivered': return <FaCheckCircle className="text-green-400" />;
      case 'cancelled': return <FaTimes className="text-red-400" />;
      case 'refunded': return <FaMoneyBillWave className="text-orange-400" />;
      default: return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'refunded': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-8 lg:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-white/30 border-t-[#5695F5] rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white">
      <div className="max-w-[1440px] mx-auto px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Orders</h1>
            <p className="text-white/60 mt-2">Track and manage your orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition flex items-center gap-2">
              <FaDownload className="text-sm" />
              Download Invoices
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 focus:border-[#5695F5]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 focus:border-[#5695F5]"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-white/60">
            <FaFilter className="mr-2" />
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingBag className="mx-auto text-6xl text-white/30 mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              {searchTerm || statusFilter !== 'all' ? 'No Orders Found' : 'No Orders Yet'}
            </h3>
            <p className="text-white/60 mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Start shopping to see your orders here.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => window.location.href = '/product'}
                className="px-8 py-3 bg-[#5695F5] hover:bg-blue-600 rounded-lg text-white font-medium transition"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  {/* Order Info */}
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{order.id}</h3>
                      <p className="text-white/60 text-sm">
                        Ordered on {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    
                    {orderService.canCancelOrder(order) && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                        className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-white/10 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <img
                              src={item.image || '/Luxury1.png'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg bg-white/10"
                              onError={(e) => {
                                e.target.src = '/Luxury1.png';
                              }}
                            />
                            <div className="flex-1">
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-white/60 text-sm">
                                Qty: {item.quantity} × ${item.price.toLocaleString()}
                              </p>
                              {item.color && (
                                <p className="text-white/60 text-sm">Color: {item.color}</p>
                              )}
                              {item.size && (
                                <p className="text-white/60 text-sm">Size: {item.size}</p>
                              )}
                            </div>
                            <p className="text-white font-semibold">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Total:</span>
                          <span className="text-white font-semibold">${order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Payment:</span>
                          <span className="text-white capitalize">{order.paymentMethod}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Tracking:</span>
                            <span className="text-white">{order.trackingNumber}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Est. Delivery:</span>
                            <span className="text-white">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                          </div>
                        )}
                        {order.deliveryDate && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Delivered:</span>
                            <span className="text-white">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {order.cancellationReason && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Reason:</span>
                            <span className="text-white">{order.cancellationReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
          />
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && selectedOrder && (
          <CancelOrderModal
            order={selectedOrder}
            onClose={() => {
              setShowCancelModal(false);
              setSelectedOrder(null);
            }}
            onCancel={handleCancelOrder}
          />
        )}
      </div>
    </section>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d2740] border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Order Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Order ID:</span>
                  <span className="text-white font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Date:</span>
                  <span className="text-white">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Status:</span>
                  <span className="text-white capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Payment Method:</span>
                  <span className="text-white capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Payment Status:</span>
                  <span className="text-white capitalize">{order.paymentStatus}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Tracking Number:</span>
                    <span className="text-white">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
              <div className="text-white/80 text-sm">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country} {order.shippingAddress.zipCode}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-white/10 last:border-b-0">
                    <img
                      src={item.image || '/Luxury1.png'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-white/10"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <div className="text-white/60 text-sm space-y-1">
                        <p>Quantity: {item.quantity}</p>
                        {item.color && <p>Color: {item.color}</p>}
                        {item.size && <p>Size: {item.size}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-white/60 text-sm">${item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <span className="text-white font-semibold text-lg">Total:</span>
                  <span className="text-[#5695F5] font-bold text-xl">${order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;