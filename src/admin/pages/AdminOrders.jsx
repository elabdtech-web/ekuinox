import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaShoppingBag, 
  FaCheckCircle, 
  FaTimes, 
  FaMoneyBillWave,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
  FaRefresh
} from 'react-icons/fa';

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundRequest, setRefundRequest] = useState(null);

  // Mock data - replace with actual API calls
  const mockOrders = [
    {
      id: 'ORD-001',
      customerName: 'Hadia Asghar',
      customerEmail: 'hadia@email.com',
      items: [
        { name: 'Aventis ChronoSport Watch', quantity: 1, price: 90000, image: '/Luxury1.png' }
      ],
      total: 90000,
      status: 'pending',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      shippingAddress: {
        address: 'house no 45 street no 9 muzammi town kufri road shakrial',
        city: 'Barishal',
        state: 'Baridhara',
        country: 'Pakistan',
        zipCode: '46600'
      },
      orderDate: '2025-11-10T10:30:00Z',
      estimatedDelivery: '2025-11-15',
      trackingNumber: 'TRK123456789',
      refundRequest: null
    },
    {
      id: 'ORD-002',
      customerName: 'Esha Khan',
      customerEmail: 'esha@email.com',
      items: [
        { name: 'Luxury City Package', quantity: 1, price: 25000, image: '/city1.jpg' }
      ],
      total: 25000,
      status: 'completed',
      paymentMethod: 'paypal',
      paymentStatus: 'paid',
      shippingAddress: {
        address: '123 Main Street',
        city: 'Karachi',
        state: 'Sindh',
        country: 'Pakistan',
        zipCode: '75000'
      },
      orderDate: '2025-11-08T14:20:00Z',
      estimatedDelivery: '2025-11-13',
      trackingNumber: 'TRK987654321',
      refundRequest: null
    },
    {
      id: 'ORD-003',
      customerName: 'Ali Hassan',
      customerEmail: 'ali@email.com',
      items: [
        { name: 'Premium Watch Collection', quantity: 2, price: 45000, image: '/Luxury2.png' }
      ],
      total: 90000,
      status: 'cancelled',
      paymentMethod: 'card',
      paymentStatus: 'refunded',
      shippingAddress: {
        address: '456 Oak Avenue',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        zipCode: '54000'
      },
      orderDate: '2025-11-09T16:45:00Z',
      estimatedDelivery: '2025-11-14',
      trackingNumber: null,
      refundRequest: {
        id: 'REF-001',
        amount: 90000,
        reason: 'Product not as described',
        status: 'approved',
        requestDate: '2025-11-09T18:00:00Z',
        processedDate: '2025-11-10T09:00:00Z',
        adminNotes: 'Full refund approved due to quality issue'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    // Tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'refunds') {
        filtered = filtered.filter(order => order.refundRequest);
      } else {
        filtered = filtered.filter(order => order.status === activeTab);
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const orderDate = new Date(order.orderDate);
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          });
          break;
        case 'month':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          });
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-400" />;
      case 'processing': return <FaShoppingBag className="text-blue-400" />;
      case 'shipped': return <FaShoppingBag className="text-purple-400" />;
      case 'completed': return <FaCheckCircle className="text-green-400" />;
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
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'refunded': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // API call would go here
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleRefundApproval = async (orderId, action, amount, adminNotes) => {
    try {
      // API call would go here
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              refundRequest: {
                ...order.refundRequest,
                status: action,
                processedDate: new Date().toISOString(),
                adminNotes,
                ...(action === 'approved' && { amount })
              }
            } 
          : order
      ));
      toast.success(`Refund request ${action} successfully`);
      setShowRefundModal(false);
    } catch (error) {
      toast.error('Failed to process refund request');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
    { id: 'refunds', label: 'Refund Requests', count: orders.filter(o => o.refundRequest).length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-white/30 border-t-[#5695F5] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-white/60 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition flex items-center gap-2">
            <FaDownload className="text-sm" />
            Export
          </button>
          <button className="px-4 py-2 bg-[#5695F5] rounded-lg text-white hover:bg-blue-600 transition flex items-center gap-2">
            <FaRefresh className="text-sm" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-[#5695F5] text-[#5695F5]'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/20'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-[#5695F5]/20 text-[#5695F5]' : 'bg-white/10 text-white/60'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 focus:border-[#5695F5]"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        {/* Results Count */}
        <div className="flex items-center text-white/60">
          <FaFilter className="mr-2" />
          {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Items</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className={`border-t border-white/10 ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{order.id}</div>
                    {order.trackingNumber && (
                      <div className="text-white/60 text-sm">Track: {order.trackingNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{order.customerName}</div>
                    <div className="text-white/60 text-sm">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-white/60 text-sm">
                      {order.items[0]?.name}
                      {order.items.length > 1 && ` +${order.items.length - 1} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">${order.total.toLocaleString()}</div>
                    <div className="text-white/60 text-sm capitalize">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    {order.refundRequest && (
                      <div className="mt-2">
                        <span className="text-orange-400 text-xs">Refund: {order.refundRequest.status}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">
                    {new Date(order.orderDate).toLocaleDateString()}
                    <br />
                    {new Date(order.orderDate).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
                      
                      {order.refundRequest && order.refundRequest.status === 'pending' && (
                        <button
                          onClick={() => {
                            setRefundRequest(order.refundRequest);
                            setSelectedOrder(order);
                            setShowRefundModal(true);
                          }}
                          className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition"
                          title="Process Refund"
                        >
                          <FaMoneyBillWave />
                        </button>
                      )}

                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#5695F5]"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FaShoppingBag className="mx-auto text-4xl text-white/30 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
            <p className="text-white/60">No orders match your current filters.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Refund Request Modal */}
      {showRefundModal && refundRequest && selectedOrder && (
        <RefundRequestModal
          order={selectedOrder}
          refundRequest={refundRequest}
          onClose={() => {
            setShowRefundModal(false);
            setRefundRequest(null);
            setSelectedOrder(null);
          }}
          onApprove={handleRefundApproval}
        />
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
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
            {/* Order Info */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
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
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
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
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Name:</span>
                    <span className="text-white">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Email:</span>
                    <span className="text-white">{order.customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Items */}
            <div className="space-y-4">
              {/* Shipping Address */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                <div className="text-white/80 text-sm">
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.country} {order.shippingAddress.zipCode}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 pb-3 border-b border-white/10 last:border-b-0">
                      <img
                        src={item.image || '/Luxury1.png'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-white/10"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{item.name}</p>
                        <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white font-semibold text-sm">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t border-white/20">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-[#5695F5] font-bold text-lg">${order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Refund Request Modal Component
const RefundRequestModal = ({ order, refundRequest, onClose, onApprove }) => {
  const [action, setAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState(refundRequest.amount || order.total);

  const handleSubmit = () => {
    if (!action) {
      toast.error('Please select an action');
      return;
    }
    if (!adminNotes.trim()) {
      toast.error('Please add admin notes');
      return;
    }
    
    onApprove(order.id, action, action === 'approved' ? refundAmount : 0, adminNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d2740] border border-white/20 rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Process Refund Request</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-6">
            {/* Refund Details */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Refund Request Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Order ID:</span>
                  <span className="text-white font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Customer:</span>
                  <span className="text-white">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Original Amount:</span>
                  <span className="text-white">${order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Request Date:</span>
                  <span className="text-white">{new Date(refundRequest.requestDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Reason:</span>
                  <span className="text-white">{refundRequest.reason}</span>
                </div>
              </div>
            </div>

            {/* Action Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Action *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition">
                    <input
                      type="radio"
                      name="action"
                      value="approved"
                      checked={action === 'approved'}
                      onChange={(e) => setAction(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border mr-3 ${action === 'approved' ? 'border-green-400 bg-green-400' : 'border-white/40'}`}>
                      {action === 'approved' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                    </div>
                    <div>
                      <div className="text-white font-medium">Approve Refund</div>
                      <div className="text-white/60 text-sm">Full or partial refund</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition">
                    <input
                      type="radio"
                      name="action"
                      value="rejected"
                      checked={action === 'rejected'}
                      onChange={(e) => setAction(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border mr-3 ${action === 'rejected' ? 'border-red-400 bg-red-400' : 'border-white/40'}`}>
                      {action === 'rejected' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                    </div>
                    <div>
                      <div className="text-white font-medium">Reject Refund</div>
                      <div className="text-white/60 text-sm">Decline the request</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Refund Amount (only if approved) */}
              {action === 'approved' && (
                <div>
                  <label className="block text-white font-medium mb-2">Refund Amount *</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    max={order.total}
                    min={0}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50"
                    placeholder="Enter refund amount"
                  />
                  <p className="text-white/60 text-sm mt-1">
                    Maximum refundable amount: ${order.total.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="block text-white font-medium mb-2">Admin Notes *</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 resize-none"
                  placeholder="Add notes about this decision..."
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition ${
                  action === 'approved' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : action === 'rejected'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
                disabled={!action}
              >
                {action === 'approved' ? 'Approve Refund' : action === 'rejected' ? 'Reject Request' : 'Select Action'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;