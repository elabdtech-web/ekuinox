import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaShoppingBag,
  FaCheckCircle,
  FaTimes,
  FaMoneyBillWave,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
  FaSync,
} from "react-icons/fa";

// API Service for admin orders
class AdminOrderService {
  async getAllOrders(filters = {}) {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          searchParams.append(key, value);
        }
      });

      const queryString = searchParams.toString()
        ? `?${searchParams.toString()}`
        : "";
      const response = await axiosInstance.get(
        `/admin/payments/getAllOrders${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }

  async getCancellationRequests() {
    try {
      const response = await axiosInstance.get(
        "/admin/payments/getCancellationRequests"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cancellation requests:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch cancellation requests"
      );
    }
  }

  async processCancellation(orderId, action, adminNotes) {
    try {
      const response = await axiosInstance.post(
        `/admin/payments/processCancellation?id=${orderId}`,
        {
          action,
          adminNotes,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error processing cancellation:", error);
      throw new Error(
        error.response?.data?.message || "Failed to process cancellation"
      );
    }
  }

  async updateOrderStatus(orderId, status, notes = "") {
    try {
      const response = await axiosInstance.put(
        `/admin/payments/updateStatus?id=${orderId}`,
        {
          status,
          adminNotes: notes,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }

  async deleteOrder(orderId) {
    try {
      const response = await axiosInstance.delete(
        `/admin/payments/deleteOrder?id=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
}

const adminOrderService = new AdminOrderService();

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, cancellationResponse] = await Promise.all([
        adminOrderService.getAllOrders(),
        adminOrderService.getCancellationRequests(),
      ]);

      setOrders(ordersResponse.data || []);
      setCancellationRequests(cancellationResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    // Tab filter
    if (activeTab !== "all") {
      if (activeTab === "cancellation_requests") {
        filtered = orders.filter(
          (order) => order.status === "cancellation_requested"
        );
      } else {
        filtered = orders.filter((order) => order.status === activeTab);
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customerInfo?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customerInfo?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === now.toDateString();
          });
          break;
        case "week":
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          });
          break;
        case "month":
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear()
            );
          });
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-400" />;
      case "succeeded":
        return <FaCheckCircle className="text-green-400" />;
      case "failed":
        return <FaTimes className="text-red-400" />;
      case "canceled":
        return <FaTimes className="text-red-400" />;
      case "cancellation_requested":
        return <FaExclamationTriangle className="text-orange-400" />;
      case "refunded":
        return <FaMoneyBillWave className="text-blue-400" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "succeeded":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "canceled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "cancellation_requested":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "refunded":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "succeeded":
        return "Completed";
      case "failed":
        return "Failed";
      case "canceled":
        return "Cancelled";
      case "cancellation_requested":
        return "Cancellation Pending";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminOrderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  const handleCancellationAction = async (orderId, action, adminNotes) => {
    try {
      await adminOrderService.processCancellation(orderId, action, adminNotes);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: action === "approve" ? "canceled" : "succeeded",
                adminNotes,
                cancellationProcessedAt: new Date().toISOString(),
              }
            : order
        )
      );

      toast.success(`Cancellation ${action}d successfully`);
      setShowRefundModal(false);

      // Refresh data
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to process cancellation");
    }
  };

  const tabs = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      id: "succeeded",
      label: "Completed",
      count: orders.filter((o) => o.status === "succeeded").length,
    },
    {
      id: "canceled",
      label: "Cancelled",
      count: orders.filter((o) => o.status === "canceled").length,
    },
    {
      id: "cancellation_requested",
      label: "Cancellation Requests",
      count: orders.filter((o) => o.status === "cancellation_requested").length,
    },
  ];

  if (loading) {
    return (
      <section className="min-h-screen py-12 bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-0 py-16">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-t-2 border-[#5695F5]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-white/60 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-[#5695F5] rounded-lg text-white hover:bg-blue-600 transition flex items-center gap-2"
          >
            <FaSync className="text-sm" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "border-[#5695F5] text-[#5695F5]"
                  : "border-transparent text-white/60 hover:text-white/80 hover:border-white/20"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-[#5695F5]/20 text-[#5695F5]"
                      : "bg-white/10 text-white/60"
                  }`}
                >
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
          <option value="succeeded">Completed</option>
          <option value="failed">Failed</option>
          <option value="canceled">Cancelled</option>
          <option value="cancellation_requested">Cancellation Requested</option>
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
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`border-t border-white/10 ${
                    index % 2 === 0 ? "bg-white/5" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {order.orderId}
                    </div>
                    {order.stripePaymentIntentId && (
                      <div className="text-white/60 text-sm">
                        Stripe: {order.stripePaymentIntentId.slice(-8)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {order.customerInfo?.firstName}{" "}
                      {order.customerInfo?.lastName}
                    </div>
                    <div className="text-white/60 text-sm">
                      {order.customerInfo?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      {order.items?.length || 1} item
                      {(order.items?.length || 1) > 1 ? "s" : ""}
                    </div>
                    <div className="text-white/60 text-sm">
                      {order.items?.[0]?.name || "Order Items"}
                      {(order.items?.length || 0) > 1 &&
                        ` +${order.items.length - 1} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      ${order.amount?.toFixed(2)}
                    </div>
                    <div className="text-white/60 text-sm capitalize">
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{getStatusLabel(order.status)}</span>
                    </div>
                    {order.cancellationReason && (
                      <div className="mt-2">
                        <span className="text-white/60 text-xs">
                          Reason: {order.cancellationReason}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(order.createdAt).toLocaleTimeString()}
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

                      {order.status === "cancellation_requested" && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowRefundModal(true);
                          }}
                          className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition"
                          title="Process Cancellation"
                        >
                          <FaMoneyBillWave />
                        </button>
                      )}

                      {order.status !== "cancellation_requested" &&
                        order.status !== "canceled" && (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, e.target.value)
                            }
                            className="px-2 py-1 bg-gray-600 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#5695F5]"
                          >
                            <option value="pending">Pending</option>
                            <option value="succeeded">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="canceled">Cancelled</option>
                          </select>
                        )}
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
            <h3 className="text-xl font-semibold text-white mb-2">
              No Orders Found
            </h3>
            <p className="text-white/60">
              No orders match your current filters.
            </p>
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
          getStatusColor={getStatusColor}
        />
      )}

      {/* Cancellation Request Modal */}
      {showRefundModal && selectedOrder && (
        <CancellationRequestModal
          order={selectedOrder}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedOrder(null);
          }}
          onApprove={handleCancellationAction}
        />
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({
  order,
  onClose,
  onStatusUpdate,
  getStatusColor,
}) => {
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
                <h3 className="text-lg font-semibold text-white mb-3">
                  Order Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Order ID:</span>
                    <span className="text-white font-medium">
                      {order.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Date:</span>
                    <span className="text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Payment:</span>
                    <span className="text-white capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount:</span>
                    <span className="text-white">
                      ${order.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Name:</span>
                    <span className="text-white">
                      {order.customerInfo?.firstName}{" "}
                      {order.customerInfo?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Email:</span>
                    <span className="text-white">
                      {order.customerInfo?.email}
                    </span>
                  </div>
                  {order.customerInfo?.phone && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Phone:</span>
                      <span className="text-white">
                        {order.customerInfo.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping & Items */}
            <div className="space-y-4">
              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Shipping Address
                  </h3>
                  <div className="text-white/80 text-sm">
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>
                    <p>
                      {order.shippingAddress.country}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 pb-3 border-b border-white/10 last:border-b-0"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <FaShoppingBag className="text-white/60" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">
                          {item.name}
                        </p>
                        <p className="text-white/60 text-xs">
                          Qty: {item.quantity} × ${item.price?.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-white font-semibold text-sm">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  )) || (
                    <div className="text-white/60 text-sm">
                      No item details available
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-white/20">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-[#5695F5] font-bold text-lg">
                      ${order.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancellation Info */}
              {order.status === "cancellation_requested" && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">
                    Cancellation Request
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Requested At:</span>
                      <span className="text-white">
                        {order.cancellationRequestedAt
                          ? new Date(
                              order.cancellationRequestedAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    {order.cancellationReason && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Reason:</span>
                        <span className="text-white">
                          {order.cancellationReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cancellation Request Modal Component
const CancellationRequestModal = ({ order, onClose, onApprove }) => {
  const [action, setAction] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!action) {
      toast.error("Please select an action");
      return;
    }
    if (!adminNotes.trim()) {
      toast.error("Please add admin notes");
      return;
    }

    setProcessing(true);
    try {
      await onApprove(order._id, action, adminNotes);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d2740] border border-white/20 rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Process Cancellation Request
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-6">
            {/* Request Details */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Cancellation Request Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Order ID:</span>
                  <span className="text-white font-medium">
                    {order.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Customer:</span>
                  <span className="text-white">
                    {order.customerInfo?.firstName}{" "}
                    {order.customerInfo?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Amount:</span>
                  <span className="text-white">
                    ${order.amount?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Request Date:</span>
                  <span className="text-white">
                    {order.cancellationRequestedAt
                      ? new Date(
                          order.cancellationRequestedAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                {order.cancellationReason && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Reason:</span>
                    <span className="text-white">
                      {order.cancellationReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Action *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition">
                    <input
                      type="radio"
                      name="action"
                      value="approve"
                      checked={action === "approve"}
                      onChange={(e) => setAction(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border mr-3 ${
                        action === "approve"
                          ? "border-green-400 bg-green-400"
                          : "border-white/40"
                      }`}
                    >
                      {action === "approve" && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        Approve & Refund
                      </div>
                      <div className="text-white/60 text-sm">
                        Cancel order and process refund
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition">
                    <input
                      type="radio"
                      name="action"
                      value="reject"
                      checked={action === "reject"}
                      onChange={(e) => setAction(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border mr-3 ${
                        action === "reject"
                          ? "border-red-400 bg-red-400"
                          : "border-white/40"
                      }`}
                    >
                      {action === "reject" && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        Reject Request
                      </div>
                      <div className="text-white/60 text-sm">
                        Decline cancellation
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Admin Notes *
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 resize-none"
                  placeholder="Add notes about this decision..."
                />
              </div>

              {action === "approve" && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">
                    Refund Process
                  </h4>
                  <p className="text-blue-100 text-sm">
                    Approving this request will:
                  </p>
                  <ul className="text-blue-100 text-sm mt-2 space-y-1 list-disc list-inside">
                    <li>Cancel the order and mark it as "Canceled"</li>
                    <li>
                      Process a full refund via Stripe ($
                      {order.amount?.toFixed(2)})
                    </li>
                    <li>Send confirmation email to customer</li>
                    <li>Refund will appear in 3-5 business days</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                disabled={processing}
                className="flex-1 py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!action || processing}
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
                  action === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : action === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-500 cursor-not-allowed"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : action === "approve" ? (
                  "Approve & Refund"
                ) : action === "reject" ? (
                  "Reject Request"
                ) : (
                  "Select Action"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
