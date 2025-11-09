import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProductCart } from "../context/ProductCartContext";
import { toast } from "react-toastify";
import { FaCreditCard, FaPaypal, FaMoneyBillWave, FaLock, FaShieldAlt } from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkout, items, total } = useProductCart();

  // Get checkout data from navigation state
  const checkoutData = location.state?.checkoutData;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Redirect if no checkout data
  useEffect(() => {
    if (!checkoutData) {
      toast.error("Please complete the checkout form first", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/checkout");
    }
  }, [checkoutData, navigate]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const validatePayment = () => {
    if (paymentMethod === 'cod') {
      return true;
    }

    if (paymentMethod === 'paypal') {
      return true;
    }

    const e = {};
    if (!cardDetails.cardNumber.trim()) {
      e.cardNumber = "Card number is required.";
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
      e.cardNumber = "Please enter a valid 16-digit card number.";
    }

    if (!cardDetails.cardName.trim()) {
      e.cardName = "Cardholder name is required.";
    }

    if (!cardDetails.expiryDate.trim()) {
      e.expiryDate = "Expiry date is required.";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      e.expiryDate = "Please enter a valid expiry date (MM/YY).";
    }

    if (!cardDetails.cvv.trim()) {
      e.cvv = "CVV is required.";
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      e.cvv = "Please enter a valid CVV (3-4 digits).";
    }

    setPaymentErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validatePayment()) {
      toast.error("Please enter valid payment details", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const orderData = {
        ...checkoutData,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          last4: cardDetails.cardNumber.replace(/\s/g, '').slice(-4),
          cardName: cardDetails.cardName,
        } : { method: paymentMethod },
      };

      await checkout(orderData);
      
      toast.success(`Order placed successfully!`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
      
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Payment failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!checkoutData) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white">
      <div className="max-w-[1440px] mx-auto px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/checkout")}
            className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-2"
          >
            ← Back to Checkout
          </button>
          <h1 className="text-3xl md:text-4xl font-semibold flex items-center gap-3">
            <FaLock className="text-green-400" />
            Secure Payment
          </h1>
          <p className="text-white/60 mt-2">Complete your order securely</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Payment Form */}
          <div className="lg:w-2/3 space-y-6">
            {/* Payment Method Selection */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-3 mb-6">
                Select Payment Method
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: FaCreditCard, desc: 'Pay with card' },
                  { id: 'paypal', label: 'PayPal', icon: FaPaypal, desc: 'Fast & secure' },
                  { id: 'cod', label: 'Cash on Delivery', icon: FaMoneyBillWave, desc: 'Pay at doorstep' },
                ].map(method => (
                  <label
                    key={method.id}
                    className={`relative p-5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-[#5695F5] bg-[#5695F5]/10 shadow-lg shadow-[#5695F5]/20'
                        : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setPaymentErrors({});
                      }}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <method.icon className={`mx-auto text-3xl mb-3 ${
                        paymentMethod === method.id ? 'text-[#5695F5]' : 'text-white/60'
                      }`} />
                      <div className="font-semibold text-white text-base mb-1">{method.label}</div>
                      <div className="text-white/50 text-xs">{method.desc}</div>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="absolute top-3 right-3 w-4 h-4 bg-[#5695F5] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-3 mb-6">
                  Card Information
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setCardDetails(prev => ({ ...prev, cardNumber: formatted }));
                          if (paymentErrors.cardNumber) {
                            setPaymentErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.cardNumber;
                              return newErrors;
                            });
                          }
                        }}
                        maxLength="19"
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-3 pl-12 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${
                          paymentErrors.cardNumber
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                        }`}
                      />
                      <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    </div>
                    {paymentErrors.cardNumber && (
                      <p className="text-red-400 text-sm mt-1">{paymentErrors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardName}
                      onChange={(e) => {
                        setCardDetails(prev => ({ ...prev, cardName: e.target.value.toUpperCase() }));
                        if (paymentErrors.cardName) {
                          setPaymentErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.cardName;
                            return newErrors;
                          });
                        }
                      }}
                      placeholder="JOHN DOE"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition uppercase ${
                        paymentErrors.cardName
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    />
                    {paymentErrors.cardName && (
                      <p className="text-red-400 text-sm mt-1">{paymentErrors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setCardDetails(prev => ({ ...prev, expiryDate: formatted }));
                          if (paymentErrors.expiryDate) {
                            setPaymentErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.expiryDate;
                              return newErrors;
                            });
                          }
                        }}
                        maxLength="5"
                        placeholder="MM/YY"
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${
                          paymentErrors.expiryDate
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                        }`}
                      />
                      {paymentErrors.expiryDate && (
                        <p className="text-red-400 text-sm mt-1">{paymentErrors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        CVV *
                      </label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setCardDetails(prev => ({ ...prev, cvv: value }));
                          if (paymentErrors.cvv) {
                            setPaymentErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.cvv;
                              return newErrors;
                            });
                          }
                        }}
                        maxLength="4"
                        placeholder="123"
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${
                          paymentErrors.cvv
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                        }`}
                      />
                      {paymentErrors.cvv && (
                        <p className="text-red-400 text-sm mt-1">{paymentErrors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg mt-6">
                    <FaShieldAlt className="text-green-400 text-xl mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-white font-medium mb-1">Secure Payment</p>
                      <p className="text-white/70 text-xs">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Message */}
            {paymentMethod === 'paypal' && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <FaPaypal className="mx-auto text-6xl text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">PayPal Payment</h3>
                <p className="text-white/70 mb-6">
                  You will be redirected to PayPal to complete your payment securely. 
                  Your order will be processed after successful payment.
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-white/60 bg-white/5 px-4 py-2 rounded-lg">
                  <FaLock className="text-green-400" />
                  Protected by PayPal
                </div>
              </div>
            )}

            {/* Cash on Delivery Message */}
            {paymentMethod === 'cod' && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <FaMoneyBillWave className="mx-auto text-6xl text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Cash on Delivery</h3>
                <p className="text-white/70 mb-4">
                  Pay with cash when your order is delivered to your doorstep. 
                  Please keep exact change ready for smooth delivery.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-left">
                  <p className="text-amber-200 text-sm font-medium mb-2">Important Notes:</p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Payment should be made in cash to the delivery person</li>
                    <li>• Orders may be subject to verification call</li>
                    <li>• COD charges may apply based on order value</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-1/3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-3 mb-4">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <img 
                      src={item.img || '/Luxury1.png'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg bg-white/10"
                      onError={(e) => {
                        e.target.src = '/Luxury1.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{item.name}</p>
                      <p className="text-white/60 text-xs">
                        Qty: {item.qty} × ${item.priceNum?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      ${((item.priceNum || 0) * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              {checkoutData && (
                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-white/60 text-xs mb-2">Shipping to:</p>
                  <p className="text-white text-sm font-medium">
                    {checkoutData.contactInfo.firstName} {checkoutData.contactInfo.lastName}
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    {checkoutData.shippingAddress.address}, {checkoutData.shippingAddress.city}
                  </p>
                  <p className="text-white/70 text-xs">
                    {checkoutData.shippingAddress.state}, {checkoutData.shippingAddress.country} {checkoutData.shippingAddress.zipCode}
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="pt-2 border-t border-white/20 flex justify-between">
                  <span className="text-white font-semibold text-lg">Total</span>
                  <span className="text-[#5695F5] font-bold text-xl">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`w-full py-4 px-6 rounded-lg transition font-semibold text-lg flex items-center justify-center gap-2 ${
                  submitting
                    ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                    : 'bg-[#5695F5] hover:bg-blue-600 text-white shadow-lg shadow-[#5695F5]/30'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Pay ${total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-white/50 text-xs text-center mt-4">
                By completing this purchase you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
