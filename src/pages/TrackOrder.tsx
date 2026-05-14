import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Package, Search } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../config';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [session, setSession] = useState<any>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session: s } } = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
      setSession(s);
      if (s?.user) {
        setEmail(s.user.email || '');
        fetchUserOrders(s.user.id, s.user.email || '');
      }
    };
    checkUser();
  }, []);

  const fetchUserOrders = async (userId: string, userEmail: string) => {
    setIsTracking(true);
    setError('');
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/orders/user/${userId}`);
      let data = [];
      if (response.ok) {
        data = await response.json();
      }

      // Fallback to email search if no orders found by user_id
      if (data.length === 0 && userEmail) {
        const res = await fetch(`${apiUrl}/api/orders`);
        if (res.ok) {
          const allOrders = await res.json();
          data = allOrders.filter((o: any) => 
            o.shipping_address?.toLowerCase().includes(userEmail.toLowerCase())
          );
        }
      }
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch your orders.');
    } finally {
      setIsTracking(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setError('');
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/orders`);
      if (res.ok) {
        const allOrders = await res.json();
        const found = allOrders.filter((o: any) => 
          o.id.toLowerCase().includes(orderId.toLowerCase()) || 
          (email && o.shipping_address.toLowerCase().includes(email.toLowerCase()))
        );
        setOrders(found);
        if (found.length === 0) setError('No orders found with these details.');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Track Order | Uniform trends</title>
        <link rel="canonical" href="https://uniformtrends.in/track-order" />
      </Helmet>
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-surface-card rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm border border-hairline">
            <Package size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-ink tracking-tight">Track Your Order</h1>
          <p className="text-muted text-lg">
            {session?.user 
              ? `Hello ${session.user.user_metadata?.full_name || 'Customer'}, here are your recent orders.` 
              : 'Enter your order details below to check the current status of your shipment.'}
          </p>
        </motion.div>

        {!session?.user && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-card rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-hairline"
          >
            {error && (
              <div className="mb-6 p-4 bg-m-red/10 border border-m-red/20 text-m-red rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Order ID</label>
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" 
                    placeholder="Optional" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isTracking}
                className="w-full btn-primary py-4 text-base shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2"
              >
                {isTracking ? 'Searching...' : (
                  <>
                    <Search size={20} />
                    Track Order
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {isTracking && (
          <div className="space-y-4">
             {[...Array(2)].map((_, i) => (
               <div key={i} className="h-32 bg-surface-card animate-pulse rounded-2xl border border-hairline" />
             ))}
          </div>
        )}

        {orders.length > 0 && !isTracking && (
          <div className="mt-8 space-y-6">
            {!session?.user && <h3 className="text-lg font-bold text-ink border-b border-hairline pb-4">Found Orders</h3>}
            {orders.map((order: any) => (
              <div key={order.id} className="p-6 bg-surface-card rounded-3xl border border-hairline shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Order ID</p>
                    <p className="font-mono text-sm text-ink font-bold">UK-{order.id.substring(0, 8)}</p>
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    order.status === 'pending' ? "bg-warning/10 text-warning border-warning/20" : 
                    order.status === 'completed' ? "bg-success/10 text-success border-success/20" : 
                    "bg-m-red/10 text-m-red border-m-red/20"
                  )}>
                    {order.status}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-canvas rounded-2xl border border-hairline mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-ink">
                      {order.status === 'pending' ? 'Processing Order' : 
                       order.status === 'completed' ? 'Delivered' : 
                       'Order Cancelled'}
                    </p>
                    <p className="text-muted text-xs">Last update on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {order.shipping_address?.includes('\n\n--- CANCELLATION REASON ---') && (
                  <div className="p-4 bg-m-red/5 rounded-2xl border border-m-red/10 text-xs italic text-m-red mb-4">
                    Reason: {order.shipping_address.split('\n\n--- CANCELLATION REASON ---\n')[1]}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-hairline mb-4">
                  <span className="text-sm font-bold text-ink">Total Amount</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-[10px] bg-canvas text-ink px-3 py-1.5 rounded-lg border border-hairline font-bold uppercase hover:border-primary transition-all"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                    <span className="text-lg font-bold text-primary">₹{order.total_amount}</span>
                  </div>
                </div>

                {expandedOrder === order.id && (
                   <div className="p-4 bg-canvas rounded-2xl border border-hairline mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Delivery Details</h4>
                       <div className="space-y-4">
                         <div className="bg-surface-card p-4 rounded-lg border border-hairline shadow-sm">
                           <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Contact Name</p>
                           <p className="text-sm font-bold text-ink">{order.shipping_address.split(',')[0] || 'N/A'}</p>
                         </div>
                         <div className="bg-surface-card p-4 rounded-lg border border-hairline shadow-sm">
                           <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Shipping Address</p>
                           <p className="text-sm text-ink leading-relaxed">
                             {order.shipping_address.replace(/\((.*?)\)/g, '').split('\n\n---')[0].split(',').slice(1).join(', ').trim()}
                           </p>
                         </div>
                         <div className="bg-surface-card p-4 rounded-lg border border-hairline shadow-sm">
                           <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Payment Method</p>
                           <p className="text-sm font-bold text-ink">Cash on Delivery / Bulk Invoice</p>
                         </div>
                       </div>
                     </div>
                     <div>
                       <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Order Items</h4>
                       {order.order_items && order.order_items.length > 0 ? (
                          <div className="space-y-3">
                            {order.order_items.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center bg-surface-card p-3 rounded-lg border border-hairline shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-canvas rounded-md flex items-center justify-center overflow-hidden border border-hairline">
                                    {item.products?.images?.[0] ? (
                                      <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <Package size={16} className="text-muted" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-ink">{item.products?.name || 'Unknown Product'}</p>
                                    <p className="text-[10px] text-muted">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-bold text-ink">₹{item.price_at_time}</p>
                              </div>
                            ))}
                          </div>
                       ) : (
                         <p className="text-sm text-muted">No items found for this order.</p>
                       )}
                     </div>
                   </div>
                )}
              </div>
            ))}
          </div>
        )}

        {session?.user && orders.length === 0 && !isTracking && (
          <div className="text-center py-12 bg-surface-card rounded-3xl border border-hairline">
            <Package size={48} className="mx-auto text-muted mb-4 opacity-20" />
            <p className="text-muted mb-6">You haven't placed any orders yet.</p>
            <Link to="/shop" className="btn-primary inline-flex px-8">Shop Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}
