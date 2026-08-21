import React, { useState } from 'react';
import SEO from '../components/layout/SEO';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Tag, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';
import { STORE_NAME } from '../constants';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const FREE_SHIPPING_THRESHOLD = 1999;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 150;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = Math.round(taxableAmount * 0.12); // Standard apparel GST
  const grandTotal = taxableAmount + gstAmount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.trim().toUpperCase() === 'STYLE20') {
      setDiscountPercent(20);
      setCouponApplied('STYLE20 (20% OFF)');
      setCouponCode('');
    } else if (couponCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      setCouponApplied('WELCOME10 (10% OFF)');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try STYLE20 or WELCOME10.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4 flex flex-col items-center min-h-[75vh] justify-center bg-canvas">
        <SEO title={`Shopping Bag | ${STORE_NAME}`} description="Your shopping bag is empty." />
        <div className="w-20 h-20 bg-surface-card border border-hairline flex items-center justify-center text-muted mb-6">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-ink mb-3">Your Bag is Empty</h1>
        <p className="text-sm text-muted mb-8 max-w-sm text-center">Looks like you haven't added any elevated essentials to your shopping bag yet.</p>
        <Link to="/shop" className="btn-primary py-4 px-10 text-xs flex items-center gap-2">
          <span>Start Shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO title={`Shopping Bag (${items.length} items) | ${STORE_NAME}`} description="Review items in your shopping bag." />

      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink mb-8 pb-4 border-b border-hairline">
          Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
        </h1>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-surface-card border border-hairline p-4 mb-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5 text-ink">
              <Truck size={16} />
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <span className="text-emerald-700 font-black">You have unlocked Complimentary Express Shipping!</span>
              ) : (
                <span>Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for Free Express Shipping</span>
              )}
            </span>
            <span className="text-muted">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full bg-hairline h-2">
            <div
              className="bg-ink h-2 transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor || 'none'}`}
                className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-hairline transition-colors hover:border-ink/30"
              >
                {/* Image */}
                <div className="w-28 h-36 bg-surface-soft border border-hairline shrink-0 overflow-hidden">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{item.category}</span>
                        <Link to={`/product/${item.slug}`}>
                          <h3 className="font-bold text-base text-ink hover:underline">{item.name}</h3>
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                        className="text-muted hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-muted">
                      <span>Size: <strong className="text-ink">{item.selectedSize}</strong></span>
                      {item.selectedColor && (
                        <>
                          <span>•</span>
                          <span>Color: <strong className="text-ink">{item.selectedColor}</strong></span>
                        </>
                      )}
                      <span>•</span>
                      <span>Unit Price: {formatCurrency(item.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-hairline">
                    <div className="flex items-center border border-hairline bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1, item.selectedColor)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-elevated text-ink"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-ink">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1, item.selectedColor)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-elevated text-ink"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="text-base font-black text-ink">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-muted hover:text-ink underline">
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-bold uppercase tracking-wider text-muted hover:text-red-500"
              >
                Empty Bag
              </button>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-hairline p-6 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-ink pb-4 border-b border-hairline">
                Order Summary
              </h2>

              {/* Coupon Code Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-2">
                  Promo Code / Discount
                </label>
                {couponApplied ? (
                  <div className="p-3 bg-canvas border border-ink text-xs font-bold flex items-center justify-between text-ink">
                    <div className="flex items-center gap-1.5">
                      <Tag size={14} />
                      <span>{couponApplied}</span>
                    </div>
                    <button
                      onClick={() => {
                        setDiscountPercent(0);
                        setCouponApplied('');
                      }}
                      className="text-muted hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. STYLE20"
                      className="w-full bg-canvas border border-hairline px-3 py-2.5 text-xs uppercase font-medium text-ink outline-none focus:border-ink"
                    />
                    <button
                      type="submit"
                      className="bg-ink text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1 font-medium">{couponError}</p>}
                <p className="text-[10px] text-muted mt-1.5">Use promo code <strong className="text-ink">STYLE20</strong> for 20% off your bag.</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-hairline text-xs">
                <div className="flex justify-between text-muted font-medium">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-ink">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted font-medium">
                  <span>Standard GST (12%)</span>
                  <span className="font-bold text-ink">{formatCurrency(gstAmount)}</span>
                </div>

                <div className="flex justify-between text-muted font-medium">
                  <span>Express Shipping</span>
                  <span className="font-bold text-ink">{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-hairline text-base font-black text-ink">
                  <span>Total Amount</span>
                  <span className="text-2xl">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="pt-2 text-center text-[10px] text-muted space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-ink" /> 256-bit Encrypted Checkout
                </p>
                <p>30-Day Easy Returns & Doorstep Exchanges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
