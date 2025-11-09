import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductCart } from "../context/ProductCartContext";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import { FaChevronDown } from "react-icons/fa";

const Checkout = () => {
  const { items, total, loading } = useProductCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    shippingMethod: "standard",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Country-State-City dropdowns
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [useCustomState, setUseCustomState] = useState(false);

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const cities = selectedCountry && selectedState
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.isoCode === countryCode);
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setUseCustomState(false);
    setUseCustomCity(false);
    set('country', country ? country.name : '');
    set('state', '');
    set('city', '');
    clearFieldError('country');
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setUseCustomState(true);
      setSelectedState(null);
      set('state', '');
    } else {
      const state = states.find(s => s.isoCode === value);
      setSelectedState(state);
      setUseCustomState(false);
      set('state', state ? state.name : '');
      clearFieldError('state');
    }
    setSelectedCity(null);
    setUseCustomCity(false);
    set('city', '');
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setUseCustomCity(true);
      setSelectedCity(null);
      set('city', '');
    } else {
      const city = cities.find(c => c.name === value);
      setSelectedCity(city);
      setUseCustomCity(false);
      set('city', value);
      clearFieldError('city');
    }
  };

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address (e.g. name@example.com).";
    if (!form.phone.trim()) e.phone = "Phone number is required. Include country code if applicable.";
    if (!form.address.trim()) e.address = "Street address is required.";
    if (!form.country.trim()) e.country = "Country is required.";
    if (!form.state.trim()) e.state = "State / Province is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.zip.trim()) e.zip = "ZIP / Postal code is required.";

    // optional: example of cross-field validation (not required but helpful)
    if (form.country === "United States" && form.zip && !/^\d{5}(-\d{4})?$/.test(form.zip)) {
      e.zip = "Please enter a valid US ZIP code (e.g. 12345 or 12345-6789).";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validate()) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Prepare checkout data to pass to payment page
    const checkoutData = {
      contactInfo: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      shippingAddress: {
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zip,
        country: form.country,
      },
      shippingMethod: form.shippingMethod,
      specialInstructions: form.notes,
      total,
    };

    // Navigate to payment page with checkout data
    navigate("/payment", { state: { checkoutData } });
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white">
      <div className="max-w-[1440px] mx-auto px-6 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Checkout</h1>
          <Link to="/product" className="text-white/70 hover:text-white text-sm">Continue shopping →</Link>
        </div>

        <div className="flex  gap-6">
          {/* Left: Form */}
          <div className="space-y-6 rounded-2xl w-2/3 border border-white/10 bg-white/5 p-6">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => {
                      set('firstName', e.target.value);
                      clearFieldError('firstName');
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => {
                      set('lastName', e.target.value);
                      clearFieldError('lastName');
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    set('email', e.target.value);
                    clearFieldError('email');
                  }}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                    }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    set('phone', e.target.value);
                    clearFieldError('phone');
                  }}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                    }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Shipping Address
              </h3>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Street Address *
                </label>
                <input
                  id="address"
                  type="text"
                  value={form.address}
                  onChange={(e) => {
                    set('address', e.target.value);
                    clearFieldError('address');
                  }}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.address
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                    }`}
                  placeholder="Enter street address"
                />
                {errors.address && (
                  <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Country Dropdown */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Country *
                </label>
                <div className="relative">
                  <select
                    value={selectedCountry?.isoCode || ''}
                    onChange={handleCountryChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white appearance-none focus:outline-none focus:ring-2 transition cursor-pointer ${errors.country
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                  >
                    <option value="" className="bg-[#0d2740] text-white/70">
                      Select a country
                    </option>
                    {countries.map((country) => (
                      <option
                        key={country.isoCode}
                        value={country.isoCode}
                        className="bg-[#0d2740] text-white"
                      >
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                </div>
                {errors.country && (
                  <p className="text-red-400 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State/Province Dropdown or Input */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    State/Province *
                  </label>
                  {!selectedCountry ? (
                    <input
                      type="text"
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white/40 cursor-not-allowed"
                      placeholder="Select country first"
                    />
                  ) : useCustomState || states.length === 0 ? (
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => {
                        set('state', e.target.value);
                        clearFieldError('state');
                      }}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.state
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                        placeholder="Enter state/province"
                      />
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedState?.isoCode || ''}
                        onChange={handleStateChange}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white appearance-none focus:outline-none focus:ring-2 transition cursor-pointer ${errors.state
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                          }`}
                      >
                        <option value="" className="bg-[#0d2740] text-white/70">
                          Select a state/province
                        </option>
                        {states.map((state) => (
                          <option
                            key={state.isoCode}
                            value={state.isoCode}
                            className="bg-[#0d2740] text-white"
                          >
                            {state.name}
                          </option>
                        ))}
                        <option value="custom" className="bg-[#0d2740] text-white/70 italic">
                          + Enter custom state
                        </option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                    </div>
                  )}
                  {errors.state && (
                    <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                {/* City Dropdown or Input */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    City *
                  </label>
                  {!selectedCountry ? (
                    <input
                      type="text"
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white/40 cursor-not-allowed"
                      placeholder="Select country first"
                    />
                  ) : useCustomCity || cities.length === 0 ? (
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => {
                        set('city', e.target.value);
                        clearFieldError('city');
                      }}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.city
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                        }`}
                      placeholder="Enter city"
                    />
                  ) : (
                    <div className="relative">
                      <select
                        value={form.city}
                        onChange={handleCityChange}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white appearance-none focus:outline-none focus:ring-2 transition cursor-pointer ${errors.city
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                          }`}
                      >
                        <option value="" className="bg-[#0d2740] text-white/70">
                          Select a city
                        </option>
                        {cities.map((city) => (
                          <option
                            key={city.name}
                            value={city.name}
                            className="bg-[#0d2740] text-white"
                          >
                            {city.name}
                          </option>
                        ))}
                        <option value="custom" className="bg-[#0d2740] text-white/70 italic">
                          + Enter custom city
                        </option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                    </div>
                  )}
                  {errors.city && (
                    <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    ZIP/Postal Code *
                  </label>
                  <input
                    id="zip"
                    type="text"
                    value={form.zip}
                    onChange={(e) => {
                      set('zip', e.target.value);
                      clearFieldError('zip');
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${errors.zip
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    placeholder="Enter ZIP/postal code"
                  />
                  {errors.zip && (
                    <p className="text-red-400 text-sm mt-1">{errors.zip}</p>
                  )}
                </div>

              </div>
            </div>

            {/* Shipping & Notes */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Shipping & Notes
              </h3>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Shipping Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'standard', label: 'Standard Shipping', desc: '5-7 business days' },
                    { id: 'express', label: 'Express Shipping', desc: '2-3 business days' },
                    { id: 'overnight', label: 'Overnight', desc: '1 business day' },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`relative p-4 rounded-lg border cursor-pointer transition-all ${form.shippingMethod === method.id
                        ? 'border-[#5695F5] bg-[#5695F5]/10'
                        : 'border-white/30 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={form.shippingMethod === method.id}
                        onChange={(e) => set('shippingMethod', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="font-medium text-white text-sm">{method.label}</div>
                        <div className="text-white/60 text-xs mt-1">{method.desc}</div>
                      </div>
                      {form.shippingMethod === method.id && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-[#5695F5] rounded-full"></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition resize-none"
                  placeholder="Any special instructions or notes for your order..."
                />
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={loading || items.length === 0}
              className={`w-full py-4 px-6 rounded-lg transition font-semibold text-lg ${loading || items.length === 0
                  ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                  : 'bg-[#5695F5] hover:bg-blue-600 text-white'
                }`}
            >
              Proceed to Payment →
            </button>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4 w-1/3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {items.map(it => (
                  <div key={it.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={it.img || '/Luxury1.png'} 
                        alt={it.name} 
                        className="w-14 h-16 object-contain rounded-md bg-white/10"
                        onError={(e) => {
                          console.log('Checkout image failed to load:', it.img, 'for item:', it.name);
                          e.target.src = '/Luxury1.png';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="truncate">{it.name}</div>
                        <div className="text-white/60 text-xs">Qty: {it.qty}{it.size?`, ${it.size}`:''}{it.color?`, ${it.color}`:''}</div>
                      </div>
                    </div>
                    <div className="font-medium">${(it.priceNum * it.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span>Total</span>
                <span className="text-[#7fb2ff] font-semibold">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/cart" className="inline-block text-white/70 hover:text-white text-sm">← Back to cart</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
