import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaShoppingBag,
  FaEye,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaExclamationTriangle,
} from "react-icons/fa";

import orderService from "../services/orderService";
import CancelOrderModal from "../components/CancelOrderModal";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders();
      setOrders(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await fetchOrders();
      setShowCancelModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to refresh orders");
    }
  };

  const getStatusColor = (status) => {
    return orderService.getOrderStatusColor(status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="w-4 h-4" />;
      case "succeeded":
        return <FaCheckCircle className="w-4 h-4" />;
      case "failed":
        return <FaTimes className="w-4 h-4" />;
      case "canceled":
        return <FaTimes className="w-4 h-4" />;
      case "cancellation_requested":
        return <FaExclamationTriangle className="w-4 h-4" />;
      case "refunded":
        return <FaCheckCircle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
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

  const getStatusShortLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pend";
      case "succeeded":
        return "Done";
      case "failed":
        return "Fail";
      case "canceled":
        return "Canc";
      case "cancellation_requested":
        return "Canc Req";
      case "refunded":
        return "Refund";
      case "all":
        return "All";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const canCancelOrder = (order) => {
    return (
      order.status === "pending" ||
      order.status === "requires_payment_method" ||
      order.status === "requires_confirmation"
    );
  };

  // const canRequestCancellation = (order) => {
  //   return (order.status === 'succeeded' || order.status === 'processing') && !order.cancellationRequestedAt;
  // };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <FaShoppingBag className="text-blue-400 text-2xl md:text-3xl" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">My Orders</h1>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-full md:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {[
                "all",
                "pending",
                "succeeded",
                "cancellation_requested",
                "canceled",
                "refunded",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-lg whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                    filter === status
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {status === "all" ? (
                    <span className="inline">All</span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">{getStatusLabel(status)}</span>
                      <span className="inline sm:hidden">{getStatusShortLabel(status)}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingBag className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-400">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `No ${getStatusLabel(filter)} orders found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">
                          Order #{order.orderId}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                        title={getStatusLabel(order.status)}
                      >
                        {getStatusIcon(order.status)}
                        <span className="hidden md:inline">{getStatusLabel(order.status)}</span>
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          ${order.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {order.items?.length || 1} item(s)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/Luxury1.png"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/Luxury1.png";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">
                            {item.name}
                          </h4>
                          <div className="text-sm text-gray-400">
                            <span>
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                      <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        Shipping Address
                      </h5>
                      <p className="text-gray-300 text-sm">
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                        <br />
                        {order.shippingAddress.country} -{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                      <FaCreditCard className="w-4 h-4" />
                      Payment Information
                    </h5>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Payment Method:{" "}
                        {order.paymentMethod === "card"
                          ? "Credit Card"
                          : order.paymentMethod.charAt(0).toUpperCase() +
                            order.paymentMethod.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === "succeeded"
                            ? "bg-green-100 text-green-800"
                            : order.status === "refunded"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                        title={getStatusLabel(order.status)}
                      >
                        {order.status === "succeeded" ? "Paid" : getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors w-full sm:w-auto"
                      >
                        <FaTimes className="w-4 h-4" />
                        <span className="truncate">Cancel Order</span>
                      </button>
                    )}
                  </div>

                  {/* Status Messages */}
                  {order.status === "canceled" && order.cancellationReason && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">
                        <FaExclamationTriangle className="inline w-4 h-4 mr-2" />
                        Cancelled: {order.cancellationReason}
                      </p>
                    </div>
                  )}

                  {order.status === "cancellation_requested" && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <p className="text-orange-400 text-sm">
                        <FaExclamationTriangle className="inline w-4 h-4 mr-2" />
                        Cancellation request submitted. Admin will review it
                        shortly.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <CancelOrderModal
          order={{
            id: selectedOrder._id,
            orderId: selectedOrder.orderId,
            status: selectedOrder.status,
            total: selectedOrder.amount,
            items: selectedOrder.items || [],
            orderDate: selectedOrder.createdAt,
            paymentMethod: selectedOrder.paymentMethod,
            paymentStatus:
              selectedOrder.status === "succeeded" ? "paid" : "pending",
          }}
          onClose={() => setShowCancelModal(false)}
          onCancel={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default MyOrders;
