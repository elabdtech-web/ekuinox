import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProductCart } from "../context/ProductCartContext";
import { toast } from "react-toastify";
import { FaCreditCard, FaPaypal, FaMoneyBillWave, FaLock, FaShieldAlt } from "react-icons/fa";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripe';
import axiosInstance from '../config/axiosInstance';
import { Country } from 'country-state-city';

// Card Payment Form Component using Stripe Elements
const CardPaymentForm = ({ checkoutData, total, items, onSuccess, onError, submitting, setSubmitting }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useProductCart();
  const [cardholderName, setCardholderName] = useState("");

  // Helper function to convert country name to ISO code
  const getCountryCode = (countryName) => {
    if (!countryName) return 'US';
    if (countryName.length === 2) return countryName.toUpperCase();
    const country = Country.getAllCountries().find(c => 
      c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.isoCode : 'US';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found. Please refresh and try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!cardholderName.trim()) {
      toast.error("Please enter the cardholder name", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Basic client-side validation for checkout fields
    const contact = checkoutData?.contactInfo || {};
    const shipping = checkoutData?.shippingAddress || {};
    const billing = checkoutData?.billingAddress || shipping;

    if (!contact.firstName || !contact.lastName) {
      toast.error("Please provide your full name in contact info.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!contact.email) {
      toast.error("Please provide a valid email in contact info.", { position: "top-right", autoClose: 3000 });
      return;
    }

    // <-- Updated validation: require shipping.address at least 8 characters -->
    if (!shipping.address || String(shipping.address).trim().length < 8) {
      toast.error("Shipping address is required and must be at least 8 characters.", { position: "top-right", autoClose: 3000 });
      return;
    }
    // -------------------------------------------------------------------

    if (!shipping.city || !shipping.country) {
      toast.error("Shipping city and country are required.", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      setSubmitting(true);

      // Get auth token
      const token = localStorage.getItem('token');

      // Step 1: Create payment intent
      const paymentData = {
        amount: total,
        currency: 'usd',
        paymentMethod: 'card',
        customerInfo: {
          firstName: checkoutData.contactInfo.firstName,
          lastName: checkoutData.contactInfo.lastName,
          email: checkoutData.contactInfo.email,
          phone: checkoutData.contactInfo.phone
        },
        shippingAddress: {
          ...checkoutData.shippingAddress,
          country: getCountryCode(checkoutData.shippingAddress.country)
        },
        billingAddress: {
          ...(checkoutData.billingAddress || checkoutData.shippingAddress),
          country: getCountryCode((checkoutData.billingAddress || checkoutData.shippingAddress).country)
        },
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.priceNum,
          quantity: item.qty,
          total: item.priceNum * item.qty
        })),
        metadata: {
          source: 'web_checkout'
        }
      };

      const response = await axiosInstance.post('/payments/create-intent', paymentData);

      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment intent');
      }

      // Step 2: Confirm payment with Stripe
      const clientSecret = result.data.clientSecret;
      
      // Log for debugging
      console.log('🔑 Using clientSecret:', clientSecret);
      console.log('🆔 PaymentIntent ID:', result.data.paymentIntentId);
      
      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email: checkoutData.contactInfo.email,
            address: {
              line1: checkoutData.billingAddress?.address || checkoutData.shippingAddress.address,
              city: checkoutData.billingAddress?.city || checkoutData.shippingAddress.city,
              state: checkoutData.billingAddress?.state || checkoutData.shippingAddress.state,
              country: getCountryCode(checkoutData.billingAddress?.country || checkoutData.shippingAddress.country),
              postal_code: checkoutData.billingAddress?.zipCode || checkoutData.shippingAddress.zipCode,
            }
          }
        }
      });

      if (error) {
        console.error('❌ Stripe confirmation error:', error);
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded with Stripe:', paymentIntent.id);
        console.log('🎉 Payment completed successfully!');
        
        // Clear cart after successful payment
        try {
          await clearCart();
          console.log('✅ Cart cleared after successful payment');
        } catch (cartError) {
          console.warn('⚠️ Failed to clear cart:', cartError);
        }
        
        // Call success handler
        onSuccess();
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }

    } catch (err) {
      console.error('❌ Payment error:', err);
      onError(err?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.5)',
        },
        iconColor: 'rgba(255, 255, 255, 0.6)',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-3 mb-6">
        Card Information
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
            placeholder="JOHN DOE"
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-[#5695F5] focus:ring-[#5695F5]/20 transition uppercase"
            required
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Card Details *
          </label>
          <div className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus-within:border-[#5695F5] focus-within:ring-2 focus-within:ring-[#5695F5]/20 transition">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <FaShieldAlt className="text-green-400 text-xl mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-white font-medium mb-1">Secure Payment</p>
            <p className="text-white/70 text-xs">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>

        {/* Card Payment Button */}
        <button
          type="submit"
          disabled={!stripe || !elements || !cardholderName.trim() || submitting}
          className={`w-full py-4 px-6 rounded-lg transition font-semibold text-lg flex items-center justify-center gap-2 ${
            !stripe || !elements || !cardholderName.trim() || submitting
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
      </form>
    </div>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkout, items, total, clearCart } = useProductCart();

  // Get checkout data from navigation state
  const checkoutData = location.state?.checkoutData;

  const [paymentMethod, setPaymentMethod] = useState("card");
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

  // Handle payment success
  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Your order has been placed.", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
    });
    
    navigate("/");
  };

  // Handle payment error
  const handlePaymentError = (errorMessage) => {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleNonCardSubmit = async () => {
    // Handle non-card payments (existing logic)
    try {
      setSubmitting(true);
      
      const orderData = {
        ...checkoutData,
        paymentMethod: paymentMethod,
        paymentDetails: { method: paymentMethod },
      };

      // Preserve cart until user leaves or manually clears; store snapshot for success page
      // Create order then clear cart
      await checkout(orderData, { snapshot: true });
      try {
        await clearCart();
      } catch (e) {
        console.warn('Cart clear after non-card checkout failed:', e);
      }
      
      handlePaymentSuccess();
    } catch (err) {
      handlePaymentError(err?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!checkoutData) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
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
              <CardPaymentForm
                checkoutData={checkoutData}
                total={total}
                items={items}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                setSubmitting={setSubmitting}
              />
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

              {/* Action Button - Only for non-card payments */}
              {paymentMethod !== 'card' && (
                <button
                  onClick={handleNonCardSubmit}
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
              )}

              {paymentMethod === 'card' && (
                <p className="text-white/70 text-sm text-center">
                  Complete the card details above to proceed with payment
                </p>
              )}

              <p className="text-white/50 text-xs text-center mt-4">
                By completing this purchase you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </Elements>
  );
};

export default Payment;
