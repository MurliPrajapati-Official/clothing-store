import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/layout/SEO';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../lib/mockAuth';
import { mockOrderService } from '../lib/mockService';
import { ShieldCheck, Truck, CreditCard, QrCode, Banknote, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { STORE_NAME } from '../constants';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pin: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Prefill from user session or localStorage
    if (session?.user) {
      const nameParts = (session.user.user_metadata?.full_name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user.email || '',
        phone: session.user.user_metadata?.phone || ''
      }));
    }

    try {
      const saved = localStorage.getItem('uniformTrends_savedAddress');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, [session]);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  const gst = Math.round(subtotal * 0.12);
  const total = subtotal + gst + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = `${formData.firstName} ${formData.lastName}, ${formData.street}, ${formData.city}, ${formData.state} - ${formData.pin} (${formData.email}, ${formData.phone})`;

      const paymentLabel = paymentMethod === 'card'
        ? 'Credit / Debit Card'
        : paymentMethod === 'upi'
        ? 'UPI Instant Transfer'
        : 'Cash on Delivery';

      const { orderId } = await mockOrderService.createOrder({
        user_id: session?.user?.id || 'usr-demo-1',
        user_email: formData.email || session?.user?.email || 'demo@clothingstore.com',
        total_amount: total,
        shipping_address: fullAddress,
        payment_method: paymentLabel,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSize,
          color: item.selectedColor || null
        }))
      });

      // Save address for future
      localStorage.setItem('uniformTrends_savedAddress', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pin: formData.pin,
        phone: formData.phone
      }));

      clearCart();
      navigate(`/success?id=${orderId}`);
    } catch (err: any) {
      alert(`Order creation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] bg-canvas flex flex-col items-center justify-center text-center">
        <SEO title={`Checkout | ${STORE_NAME}`} description="Checkout your order." />
        <h1 className="text-3xl font-black uppercase text-ink mb-4">Your Bag is Empty</h1>
        <p className="text-muted text-sm mb-8">Add clothing items to your bag before checking out.</p>
        <Link to="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO title={`Secure Checkout | ${STORE_NAME}`} description="Complete your clothing order." />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between pb-6 border-b border-hairline mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-muted">Checkout Process</span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-ink">
              Shipping & Payment
            </h1>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">
            <Lock size={14} className="text-ink" />
            <span>Secure 256-bit Encryption</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Details */}
            <div className="bg-white border border-hairline p-6 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-ink pb-3 border-b border-hairline">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-hairline p-6 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-ink pb-3 border-b border-hairline">
                2. Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Alex"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Morgan"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Street Address & Landmark *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Flat 402, Avenue Residency, MG Road"
                  className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pin"
                    required
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="400001"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-hairline p-6 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-ink pb-3 border-b border-hairline">
                3. Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                  paymentMethod === 'upi' ? 'border-ink bg-surface-elevated' : 'border-hairline hover:bg-canvas'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-ink"
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink">UPI / Instant QR</p>
                      <p className="text-[11px] text-muted">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <QrCode size={20} className="text-ink" />
                </label>

                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'border-ink bg-surface-elevated' : 'border-hairline hover:bg-canvas'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-ink"
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink">Credit / Debit Card</p>
                      <p className="text-[11px] text-muted">Visa, MasterCard, RuPay, Amex</p>
                    </div>
                  </div>
                  <CreditCard size={20} className="text-ink" />
                </label>

                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-ink bg-surface-elevated' : 'border-hairline hover:bg-canvas'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-ink"
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-muted">Pay in cash or UPI upon doorstep handover</p>
                    </div>
                  </div>
                  <Banknote size={20} className="text-ink" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-hairline p-6 sticky top-28 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-ink pb-4 border-b border-hairline">
                Review Items ({items.length})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4 text-xs">
                    <div className="w-14 h-16 bg-surface-soft border border-hairline shrink-0 overflow-hidden">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink truncate">{item.name}</p>
                      <p className="text-muted">Size: {item.selectedSize} {item.selectedColor ? `• ${item.selectedColor}` : ''} • Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-ink">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 pt-4 border-t border-hairline text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-ink">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>GST (12%)</span>
                  <span className="font-bold text-ink">{formatCurrency(gst)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="font-bold text-ink">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-hairline text-base font-black text-ink">
                  <span>Total Amount</span>
                  <span className="text-2xl">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-xs uppercase tracking-widest font-black flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Place Order Now'}</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-[11px] text-muted space-y-1 text-center pt-2">
                <p className="flex items-center justify-center gap-1 font-semibold text-ink">
                  <CheckCircle2 size={13} /> Prototype Mode: Instant Mock Order Confirmation
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
