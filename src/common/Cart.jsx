import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import { FiX } from "react-icons/fi";
import { useProductCart } from "../context/ProductCartContext";

export default function Cart({ open, onClose }) {
  const { items, inc, dec, remove, subtotal, delivery, total } =
    useProductCart();

  function currency(n) {
    return `$${Number(n || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  // Don't render anything if cart is closed
  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[998] bg-[#293A51]/50 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in panel: make it a flex column so children can size properly */}
      {/* <aside
        className={`fixed top-0 right-0 h-full rounded-3xl w-full  sm:w-[490px] z-[999]
          bg-[#293A5180] backdrop-blur-xl border-l border-white/10 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
        aria-hidden={!open}
      > */}

      <aside
        className="fixed top-0 right-0 h-full  rounded-4xl w-full sm:w-[490px] z-[999]
          bg-[#293A51]/50 backdrop-blur-xl border-l border-white/10 shadow-2xl
          animate-slideIn flex flex-col"
      >
        {/* Header */}
        <div className="relative h-16 flex items-center justify-center border-b border-white/10 flex-shrink-0 px-4">
          <span className="text-white/95 text-lg tracking-wider">CART</span>
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/12 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Scrollable items area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 md:px-6 py-6 space-y-6 min-h-0">
          {items.length === 0 && (
            <div className="h-40 grid place-items-center text-white/60">
              Your cart is empty.
            </div>
          )}

          {items.map((it) => (
            <div
              key={it.id}
              className="relative rounded-[22px] mb-14 h-32 border border-white/10 bg-white/[0.06] backdrop-blur-md px-5 md:px-6 py-5 overflow-visible"
            >
              {/* Remove */}
              <button
                onClick={() => remove(it.id)}
                className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow transition"
                aria-label="Remove item"
              >
                <FiX size={14} />
              </button>

              {/* Image */}
              <div className="absolute left-5 -top-4 w-[120px] h-[160px] pointer-events-none select-none">
                <img
                  src={it.img}
                  alt={it.name}
                  className="h-full w-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Content (shifted to the right of the image) */}
              <div className="pl-[110px] min-h-[96px] flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold leading-6">
                      {it.name}
                    </h3>
                    <p className="text-[#7fb2ff] font-semibold text-[18px] md:text-[20px]">
                      {it.price}
                    </p>
                  </div>

                  {/* Qty pill */}
                  <div className="flex items-center gap-2 bg-white/12 border border-white/10 rounded-full h-9 px-2 shrink-0">
                    <button
                      onClick={() => dec(it.id)}
                      className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                      aria-label="Decrease"
                    >
                      <HiMinusSm />
                    </button>
                    <span className="px-1 w-6 text-center text-white select-none">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => inc(it.id)}
                      className="h-7 w-7 rounded-full bg-[#4f83ff] hover:brightness-110 text-white flex items-center justify-center transition"
                      aria-label="Increase"
                    >
                      <HiPlusSm />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add some bottom padding so last item doesn't get hidden behind footer */}
          <div className="h-8" />
        </div>

        {/* Footer (fixed area outside scroll) */}
        <div className="p-4">
          <div className="rounded-[18px] bg-white/06 border border-white/10 backdrop-blur-md px-4 py-4">
            <div className="flex items-center justify-between text-white/80 py-1">
              <span>Subtotal</span>
              <span className="font-medium">{currency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-white/80 py-1">
              <span>Delivery Charges</span>
              <span className="font-medium">{currency(delivery)}</span>
            </div>
            <div className="flex items-center justify-between text-white font-semibold text-lg pt-2">
              <span>Total</span>
              <span className="text-[#7fb2ff]">{currency(total)}</span>
            </div>

            <div className="-mb-4 mt-2 -mx-4">
              <button
                className="w-full h-12 rounded-[18px] bg-gradient-to-r from-[#5ea0ff] to-[#3a7cff] text-white font-semibold shadow-lg hover:brightness-105 transition"
                disabled={items.length === 0}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}




