import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import orderService from '../services/orderService';

const CancelOrderModal = ({ order, onClose, onCancelSuccess, onCancel }) => {
  // Normalize different order shapes (caller sometimes passes id/total/orderDate)
  const normalizedId = order?._id || order?.id;
  const normalizedAmount = order?.amount ?? order?.total ?? 0;
  const normalizedCreatedAt = order?.createdAt || order?.orderDate;
  const normalizedItems = order?.items || [];

  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cancellationReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'No longer needed',
    'Ordered by mistake',
    'Product delivery too slow',
    'Payment issues',
    'Product out of stock',
    'Delivery address changed',
    'Emergency/urgent situation',
    'Product specifications not as expected',
    'Other (please specify)'
  ];

  const handleSubmit = async () => {
    const selectedReason = reason === 'Other (please specify)' ? customReason : reason;

    if (!selectedReason.trim()) {
      toast.error('Please select or enter a cancellation reason');
      return;
    }

    try {
      setSubmitting(true);

      if (!normalizedId) {
        throw new Error('Order id is missing');
      }

      if (order.status === 'pending' || order.status === 'requires_payment_method' || order.status === 'requires_confirmation') {
        // Cancel pending order directly - pass reason in the second parameter
        await orderService.cancelOrder(normalizedId, selectedReason);
        toast.success('Order cancelled successfully.');
      } else if (order.status === 'succeeded' || order.status === 'processing') {
        // Request cancellation for paid orders
        await orderService.requestCancellation(normalizedId, selectedReason, additionalInfo);
        toast.success('Cancellation request submitted successfully. Admin will review it shortly.');
      } else {
        throw new Error(`Orders with status "${order.status}" cannot be cancelled.`);
      }

      // Call whichever callback prop the parent provided
      const cb = onCancelSuccess || onCancel;
      if (typeof cb === 'function') {
        try { 
          // Pass the correct parameters to the callback
          cb(normalizedId, selectedReason, { additionalInfo });
        } catch (e) { 
          console.warn('Parent callback error:', e);
        }
      }

      onClose();
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error(error.message || 'Failed to cancel order.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCancellationPolicy = () => {
    switch (order.status) {
      case 'pending':
        return {
          allowed: true,
          message: 'You can cancel this order free of charge as it hasn\'t been processed yet.',
          refundInfo: 'No charges will be applied since payment is still pending.'
        };
      case 'succeeded':
        return {
          allowed: true,
          message: 'Your order is paid. Cancellation request will be reviewed by admin.',
          refundInfo: 'Full refund will be processed within 3-5 business days after approval.'
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
              {order.status === 'pending' ? 'Cancel Order' : 'Request Cancellation'}
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
                  <span className="text-white font-medium">{order.orderId || order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Date:</span>
                  <span className="text-white">{normalizedCreatedAt ? new Date(normalizedCreatedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Status:</span>
                  <span className="text-white capitalize">{order.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Total:</span>
                  <span className="text-white font-semibold">${(Number(normalizedAmount) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Payment:</span>
                  <span className="text-white capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Items:</span>
                  <span className="text-white">{normalizedItems.length} item{normalizedItems.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className={`border rounded-lg p-4 mb-6 ${policy.allowed ? 'bg-blue-500/10 border-blue-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
            <div className="flex items-start gap-3">
              <FaInfoCircle className={`text-lg mt-0.5 ${policy.allowed ? 'text-blue-400' : 'text-orange-400'}`} />
              <div>
                <h4 className="text-white font-semibold mb-2">Cancellation Policy</h4>
                <p className="text-white/80 text-sm mb-2">{policy.message}</p>
                <p className="text-white/60 text-xs">{policy.refundInfo}</p>
              </div>
            </div>
          </div>

          {policy.allowed && (
            <>
              {/* Cancellation Reason */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  Please tell us why you're {order.status === 'pending' ? 'cancelling' : 'requesting cancellation of'} this order *
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
                      <div className={`w-4 h-4 rounded-full border mr-3 ${reason === reasonOption ? 'border-[#5695F5] bg-[#5695F5]' : 'border-white/40'}`}>
                        {reason === reasonOption && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
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
                      placeholder="Please specify your reason..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 resize-none"
                      maxLength={500}
                    />
                    <p className="text-white/60 text-xs mt-1">{customReason.length}/500 characters</p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Additional Information (Optional)</label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any additional details..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5695F5]/50 resize-none"
                  maxLength={300}
                />
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
                      {order.status === 'pending' ? 'Cancelling...' : 'Submitting...'}
                    </>
                  ) : (
                    order.status === 'pending' ? 'Cancel Order' : 'Request Cancellation'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
