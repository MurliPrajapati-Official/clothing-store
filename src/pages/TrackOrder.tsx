import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Package, Search } from 'lucide-react';
import React, { useState } from 'react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    // Simulate tracking delay
    setTimeout(() => {
      setIsTracking(false);
      alert('Tracking information sent to your email! (This is a simulation)');
    }, 1000);
  };

  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Track Order | Uniform trends</title>
        <link rel="canonical" href="https://uniformtrends.pages.dev/track-order" />
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
          <p className="text-muted text-lg">Enter your order details below to check the current status of your shipment.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-card rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-hairline"
        >
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Order ID</label>
              <input 
                required 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" 
                placeholder="e.g. UK-123456" 
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
      </div>
    </div>
  );
}
