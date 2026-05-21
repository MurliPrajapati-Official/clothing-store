import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';
import { ChevronRight, CheckCircle2, CreditCard, Wallet, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatCurrency, cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { items, getTotalPrice, clearCart, removeItem } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressData, setAddressData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    pin: ''
  });
  const [orderId, setOrderId] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const [savedAddressExists, setSavedAddressExists] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved local address cache
    const savedAddress = localStorage.getItem('uniformTrends_savedAddress');
    if (savedAddress) {
      setSavedAddressExists(true);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email || '');
      } else {
        // Redirect to login if not authenticated
        navigate('/account?redirect=checkout');
      }
    });
  }, [navigate]);

  const total = getTotalPrice();
  const hasBulkItems = items.some(item => item.quantity >= 100);
  const totalSavings = items.reduce((acc, item) => {
    if (item.quantity >= 100) {
      return acc + (item.price * 0.10 * item.quantity);
    }
    return acc;
  }, 0);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const fullAddress = `${addressData.firstName} ${addressData.lastName}, ${addressData.street}, ${addressData.city}, ${addressData.state} - ${addressData.pin} (${userEmail})${hasBulkItems ? '\n\n--- ORDER TYPE ---\nbulk' : ''}`;
      const orderData = {
        user_id: userId,
        total_amount: total * 1.18, // Total with GST
        shipping_address: fullAddress,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.quantity >= 100 ? item.price * 0.9 : item.price
        }))
      };

      const apiUrl = getApiUrl();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Checkout failed');
      }

      const result = await response.json();
      setOrderId(result.orderId);
      clearCart();
      setOrderComplete(true);
    } catch (error: any) {
      console.error(error);
      alert(`Order Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-canvas flex flex-col items-center justify-center">
        <Helmet>
          <title>Order Confirmed | Uniform trends</title>
          <link rel="canonical" href="https://uniformtrends.in/checkout" />
        </Helmet>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="bg-surface-card p-12 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-hairline max-w-lg text-center"
        >
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-4">Order Confirmed!</h1>
          <p className="text-muted mb-8 text-lg">Thank you for choosing Uniform Trends. Your order #{orderId ? orderId.substring(0, 8) : Math.floor(Math.random() * 100000)} represents the beginning of a fresh academic year.</p>
          <Link to="/" className="btn-primary w-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <Helmet>
          <title>Checkout | Uniform trends</title>
          <link rel="canonical" href="https://uniformtrends.in/checkout" />
        </Helmet>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-ink mb-4"
        >
          Your cart is empty
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/shop" className="btn-primary">Browse Catalogue</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Secure Checkout | Uniform trends</title>
        <link rel="canonical" href="https://uniformtrends.in/checkout" />
      </Helmet>
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-12"
        >
          <div className="flex items-center gap-4">
            <div className={cn("flex flex-col items-center gap-2 transition-colors duration-500", step >= 1 ? "text-ink" : "text-muted")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500", step >= 1 ? "bg-primary text-on-primary" : "bg-surface-elevated text-muted")}>1</div>
              <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block">Shipping</span>
            </div>
            <div className={cn("w-12 sm:w-24 h-1 rounded-full transition-colors duration-500", step >= 2 ? "bg-primary" : "bg-surface-elevated")} />
            <div className={cn("flex flex-col items-center gap-2 transition-colors duration-500", step >= 2 ? "text-ink" : "text-muted")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500", step >= 2 ? "bg-primary text-on-primary" : "bg-surface-elevated text-muted")}>2</div>
              <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block">Payment</span>
            </div>
            <div className={cn("w-12 sm:w-24 h-1 rounded-full transition-colors duration-500", step >= 3 ? "bg-primary" : "bg-surface-elevated")} />
            <div className={cn("flex flex-col items-center gap-2 transition-colors duration-500", step >= 3 ? "text-ink" : "text-muted")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500", step >= 3 ? "bg-primary text-on-primary" : "bg-surface-elevated text-muted")}>3</div>
              <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block">Review</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-ink">Shipping Address</h2>
                    {savedAddressExists && (
                      <button 
                        type="button"
                        onClick={() => {
                          const savedAddress = localStorage.getItem('uniformTrends_savedAddress');
                          if (savedAddress) {
                            try {
                              setAddressData(JSON.parse(savedAddress));
                            } catch (e) {}
                          }
                        }}
                        className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        Use Saved Address
                      </button>
                    )}
                  </div>
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-ink mb-2">First Name</label>
                        <input required type="text" onChange={(e) => setAddressData({...addressData, firstName: e.target.value})} value={addressData.firstName} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Last Name</label>
                        <input required type="text" onChange={(e) => setAddressData({...addressData, lastName: e.target.value})} value={addressData.lastName} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Delivery Address</label>
                      <input required type="text" onChange={(e) => setAddressData({...addressData, street: e.target.value})} value={addressData.street} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none transition-colors mb-4" placeholder="Street Address" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-ink mb-2">City</label>
                        <input required type="text" onChange={(e) => setAddressData({...addressData, city: e.target.value})} value={addressData.city} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none transition-colors" />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-ink mb-2">State</label>
                        <input required type="text" onChange={(e) => setAddressData({...addressData, state: e.target.value})} value={addressData.state} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none transition-colors" />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-ink mb-2">PIN Code</label>
                        <input required type="text" onChange={(e) => setAddressData({...addressData, pin: e.target.value})} value={addressData.pin} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="pt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-primary w-full md:w-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      >
                        Continue to Confirmation
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-8"
                >
                  <h2 className="text-2xl font-bold text-ink mb-8">Confirm Order Method</h2>
                  <div className="space-y-4 mb-8">
                    <label className="flex items-center gap-4 p-5 border-2 border-ink rounded-xl cursor-pointer bg-canvas shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all">
                      <input type="radio" name="payment" defaultChecked className="hidden" />
                      <Truck className="text-ink" />
                      <span className="font-semibold text-ink">{hasBulkItems ? 'Institutional Bulk Billing' : 'Cash on Delivery'}</span>
                      <div className="w-4 h-4 rounded-full border border-ink ml-auto flex items-center justify-center">
                        <div className="w-2 h-2 bg-ink rounded-full" />
                      </div>
                    </label>
                    {hasBulkItems ? (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-sm leading-relaxed flex gap-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                        <span className="text-lg">ℹ️</span>
                        <div>
                          <strong className="font-semibold text-ink block mb-0.5">Institutional Order Billing:</strong>
                          Since your order contains a bulk quantity (MOQ &gt;= 100), it has been upgraded to corporate invoicing. Our accounts department will verify details and reach out within 2 hours to coordinate priority shipping and dispatch an electronic invoice for secure institutional wire transfer.
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted">For bulk orders, our team will contact you for payment arrangements after reviewing your requirements.</p>
                    )}
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline hover:scale-105 transition-transform">Back</button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-primary shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    >
                      Review Order
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-8"
                >
                  <h2 className="text-2xl font-bold text-ink mb-8">Review Your Order</h2>

                  <div className="space-y-6 mb-10">
                    {items.map(item => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 items-center">
                        <div className="w-20 h-24 overflow-hidden rounded-lg bg-canvas shrink-0 flex items-center justify-center border border-hairline">
                          {item.images && item.images.length > 0 ? (
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl font-bold text-muted/30 uppercase">{item.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-ink line-clamp-2">{item.name}</h4>
                          <p className="text-sm text-muted mt-1">Size: {item.selectedSize}</p>
                          <p className="text-sm text-muted mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-bold text-ink text-right flex flex-col items-end gap-0.5">
                          {item.quantity >= 100 ? (
                            <>
                              <span className="text-success">{formatCurrency(item.price * 0.9 * item.quantity)}</span>
                              <span className="text-xs text-muted line-through">{formatCurrency(item.price * item.quantity)}</span>
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20 mt-0.5">10% Off Applied</span>
                            </>
                          ) : (
                            formatCurrency(item.price * item.quantity)
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="border-hairline mb-8" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div>
                      <h4 className="font-bold text-ink mb-3">Shipping Detail</h4>
                      <p className="text-body-text text-sm leading-relaxed">
                        {addressData.firstName} {addressData.lastName}<br />
                        {addressData.street}<br />
                        {addressData.city}, {addressData.state} - {addressData.pin}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-ink mb-3">Order Method</h4>
                      <p className="text-body-text text-sm flex items-center gap-2">
                        <Truck size={16} className="text-muted" />
                        {hasBulkItems ? 'Institutional Bulk Billing' : 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setStep(2)} className="btn-outline hover:scale-105 transition-transform">Back</button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="btn-primary w-full border border-transparent flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(10,37,64,0.5)] disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="animate-spin" size={20} /> Processing...</>
                      ) : 'Place Order Now'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-shadow border border-hairline p-8 sticky top-28">
              <h3 className="text-xl font-bold text-ink mb-6 pb-4 border-b border-hairline">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-body-text">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-semibold text-ink">{formatCurrency(total + totalSavings)}</span>
                </div>
                {hasBulkItems && (
                  <div className="flex flex-col gap-1 text-success bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        🎉 Bulk Discount Applied
                      </span>
                      <span className="font-bold">-10%</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">
                      Saved {formatCurrency(totalSavings)} on volume items (MOQ &gt;= 100).
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-body-text">
                  <span className="text-sm">Estimated Tax (18% GST)</span>
                  <span className="font-semibold text-ink">{formatCurrency(total * 0.18)}</span>
                </div>
                <div className="flex justify-between items-center text-body-text">
                  <span className="text-sm">Shipping Delivery</span>
                  <span className="font-semibold text-success">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-hairline mb-8">
                <span className="font-bold text-ink text-lg">Total</span>
                <span className="font-bold text-ink text-2xl">{formatCurrency(total * 1.18)}</span>
              </div>

              <div className="p-4 bg-canvas rounded-xl border border-hairline-strong transition-colors hover:border-ink/50">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck size={18} className="text-warning" />
                  <span className="font-semibold text-ink text-sm">Safe & Secure Payment</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Your payment information is encrypted and securely processed. We never store credit card details.
                </p>
              </div>
            </div>
          </motion.aside>

        </div>
      </div>
    </div>
  );
}
