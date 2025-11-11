import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const CancelOrderModal = ({ order, onClose, onCancel }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cancellationReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'No longer needed',
    'Ordered by mistake',
    'Product delivery too slow',
    'Payment issues',
    'Product out of stock',
    'Other (please specify)'
  ];

  const handleSubmit = async () => {
    const selectedReason = reason === 'Other (please specify)' ? customReason : reason;
    
    if (!selectedReason.trim()) {
      toast.error('Please select or enter a cancellation reason');
      return;
    }

    if (reason === 'Other (please specify)' && !customReason.trim()) {
      toast.error('Please specify your reason for cancellation');
      return;
    }

    try {
      setSubmitting(true);
      await onCancel(order.id, selectedReason);
      toast.success('Order cancellation requested successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to cancel order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canCancel = () => {
    // Orders can only be cancelled if they're in pending or processing status
    return ['pending', 'processing'].includes(order.status);
  };

  const getCancellationPolicy = () => {
    switch (order.status) {
      case 'pending':
        return {
          allowed: true,
          message: 'You can cancel this order free of charge as it hasn\'t been processed yet.',
          refundInfo: 'Full refund will be processed within 3-5 business days.'
        };
      case 'processing':
        return {
          allowed: true,
          message: 'Your order is being prepared. Cancellation may incur a small processing fee.',
          refundInfo: 'Refund (minus processing fee) will be processed within 5-7 business days.'
        };
      case 'shipped':
        return {
          allowed: false,
          message: 'This order has already been shipped and cannot be cancelled.',
          refundInfo: 'You can return the item after delivery for a refund.'
        };
      default:
        return {
          allowed: false,
          message: 'This order cannot be cancelled at this time.',
          refundInfo: 'Please contact customer support for assistance.'
        };
    }
  };

  const policy = getCancellationPolicy();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d2740] border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaExclamationTriangle className="text-orange-400" />
              Cancel Order
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Order Information */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Total:</span>
                  <span className="text-white font-semibold">${order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Payment:</span>
                  <span className="text-white capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Items:</span>
                  <span className="text-white">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className={`border rounded-lg p-4 mb-6 ${
            policy.allowed 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : 'bg-orange-500/10 border-orange-500/30'
          }`}>
            <div className="flex items-start gap-3">
              <FaInfoCircle className={`text-lg mt-0.5 ${
                policy.allowed ? 'text-blue-400' : 'text-orange-400'
              }`} />
              <div>
                <h4 className="text-white font-semibold mb-2">Cancellation Policy</h4>
                <p className="text-white/80 text-sm mb-2">{policy.message}</p>
                <p className="text-white/60 text-xs">{policy.refundInfo}</p>
              </div>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Items to Cancel</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 pb-3 border-b border-white/10 last:border-b-0">
                  <img
                    src={item.image || '/Luxury1.png'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg bg-white/10"
                    onError={(e) => {
                      e.target.src = '/Luxury1.png';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{item.name}</p>
                    <p className="text-white/60 text-xs">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-white font-semibold text-sm">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {policy.allowed ? (
            <>
              {/* Cancellation Reason */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  Please tell us why you're cancelling this order *
                </label>
                <div className="space-y-3">
                  {cancellationReasons.map((reasonOption, index) => (
                    <label
                      key={index}
                      className="flex items-center p-3 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reasonOption}
                        checked={reason === reasonOption}
                        onChange={(e) => setReason(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border mr-3 ${
                        reason === reasonOption 
                          ? 'border-[#5695F5] bg-[#5695F5]' 
                          : 'border-white/40'
                      }`}>
                        {reason === reasonOption && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                      <span className="text-white text-sm">{reasonOption}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Reason Input */}
                {reason === 'Other (please specify)' && (
                  <div className="mt-4">
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Please specify your reason for cancelling this order..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 resize-none"
                      maxLength={500}
                    />
                    <p className="text-white/60 text-xs mt-1">
                      {customReason.length}/500 characters
                    </p>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                  <FaExclamationTriangle />
                  Important Information
                </h4>
                <ul className="text-orange-100 text-sm space-y-1 list-disc list-inside">
                  <li>Cancellation requests are typically processed within 24 hours</li>
                  <li>Refunds will be processed to your original payment method</li>
                  <li>You'll receive an email confirmation once cancellation is complete</li>
                  <li>Some processing fees may apply depending on order status</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !reason}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Cannot Cancel Message */
            <div className="text-center py-8">
              <FaExclamationTriangle className="mx-auto text-4xl text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Cannot Cancel Order</h3>
              <p className="text-white/70 mb-4">{policy.message}</p>
              <p className="text-white/60 text-sm mb-6">{policy.refundInfo}</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#5695F5] hover:bg-blue-600 rounded-lg text-white font-medium transition"
              >
                Understood
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;