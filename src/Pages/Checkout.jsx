import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductCart } from "../context/ProductCartContext";

const Checkout = () => {
  const { items, total, loading, checkout } = useProductCart();
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
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
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
      const res = await checkout(checkoutData);
      alert(`Order placed successfully${res?.data?.orderId ? ` (#${res.data.orderId})` : ""}`);
      navigate("/");
    } catch (err) {
      alert(err?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Checkout</h1>
          <Link to="/product" className="text-white/70 hover:text-white text-sm">Continue shopping →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" error={errors.firstName}>
                <input value={form.firstName} onChange={(e)=>set('firstName', e.target.value)} className="input" />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <input value={form.lastName} onChange={(e)=>set('lastName', e.target.value)} className="input" />
              </Field>
            </div>

            <Field label="Email" error={errors.email}>
              <input type="email" value={form.email} onChange={(e)=>set('email', e.target.value)} className="input" />
            </Field>

            <Field label="Phone" error={errors.phone}>
              <input value={form.phone} onChange={(e)=>set('phone', e.target.value)} className="input" />
            </Field>

            <Field label="Address" error={errors.address}>
              <input value={form.address} onChange={(e)=>set('address', e.target.value)} className="input" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="City" error={errors.city}>
                <input value={form.city} onChange={(e)=>set('city', e.target.value)} className="input" />
              </Field>
              <Field label="State" error={errors.state}>
                <input value={form.state} onChange={(e)=>set('state', e.target.value)} className="input" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="ZIP / Postal" error={errors.zip}>
                <input value={form.zip} onChange={(e)=>set('zip', e.target.value)} className="input" />
              </Field>
              <Field label="Country">
                <select value={form.country} onChange={(e)=>set('country', e.target.value)} className="input">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </Field>
            </div>

            <Field label="Shipping Method">
              <div className="flex gap-3">
                {[
                  { id: 'standard', label: 'Standard' },
                  { id: 'express', label: 'Express' },
                  { id: 'overnight', label: 'Overnight' },
                ].map(m => (
                  <label key={m.id} className={`px-3 py-2 rounded-lg border cursor-pointer ${form.shippingMethod===m.id? 'border-[#5695F5] bg-white/10':'border-white/10 bg-white/5'}`}>
                    <input type="radio" name="ship" value={m.id} checked={form.shippingMethod===m.id} onChange={(e)=>set('shippingMethod', e.target.value)} className="mr-2" />
                    {m.label}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Order Notes (optional)">
              <textarea value={form.notes} onChange={(e)=>set('notes', e.target.value)} rows={3} className="input resize-none" />
            </Field>

            <button
              onClick={onSubmit}
              disabled={submitting || loading || items.length===0}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#5ea0ff] to-[#3a7cff] text-white font-semibold hover:brightness-105 transition disabled:opacity-50"
            >
              {submitting ? 'Placing order...' : 'Place Order'}
            </button>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {items.map(it => (
                  <div key={it.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={it.img} alt={it.name} className="w-14 h-16 object-contain rounded-md bg-white/10" />
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

      <style>{`
        .input { @apply w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#5695F5]; }
      `}</style>
    </section>
  );
};

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="text-sm text-white/80 mb-1">{label}{error && <span className="text-red-400 ml-1">- {error}</span>}</div>
      {children}
    </label>
  );
}

export default Checkout;
