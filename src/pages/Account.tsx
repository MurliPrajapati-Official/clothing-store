import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { User, Mail, Lock, ShoppingBag, Settings, LogOut, ChevronRight, Package, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (!isLoggedIn) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-canvas flex items-center justify-center">
        <Helmet>
          <title>Sign In & Register | UniformKart</title>
          <meta name="description" content="Log in to your account or create a new one to track orders and manage profile." />
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card p-8 sm:p-12 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md"
        >
           <h1 className="text-3xl font-bold text-ink mb-2 text-center">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
           </h1>
           <p className="text-muted text-center mb-8">
              {authMode === 'login' ? 'Sign in to access your orders and profile.' : 'Join us for a premium shopping experience.'}
           </p>

           <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input required type="text" placeholder="John Doe" className="w-full bg-canvas border border-hairline-strong rounded-xl py-3 pl-12 pr-4 text-ink focus:border-ink outline-none" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input required type="email" placeholder="you@example.com" className="w-full bg-canvas border border-hairline-strong rounded-xl py-3 pl-12 pr-4 text-ink focus:border-ink outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input required type="password" placeholder="••••••••" className="w-full bg-canvas border border-hairline-strong rounded-xl py-3 pl-12 pr-4 text-ink focus:border-ink outline-none" />
                </div>
              </div>

              {authMode === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm font-medium text-ink hover:text-m-red transition-colors">Forgot Password?</button>
                </div>
              )}

              <button type="submit" className="btn-primary w-full mt-4">
                 {authMode === 'login' ? 'Sign In' : 'Register'}
              </button>
           </form>

           <div className="mt-8 text-center">
              <span className="text-muted text-sm">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-sm font-bold text-ink hover:text-m-red transition-colors"
              >
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
           </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard for logged in state
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>My Account | UniformKart</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-6xl">
         
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
               <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-6 sticky top-28">
                 <div className="flex items-center gap-4 mb-8 pb-6 border-b border-hairline">
                    <div className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center text-xl font-bold shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                       JD
                    </div>
                    <div>
                       <h3 className="font-bold text-ink">John Doe</h3>
                       <p className="text-sm text-muted">john@example.com</p>
                    </div>
                 </div>

                 <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-canvas text-ink font-semibold transition-colors">
                       <User size={18} />
                       My Profile
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-muted hover:bg-canvas hover:text-ink font-medium transition-colors">
                       <Package size={18} />
                       Orders
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-muted hover:bg-canvas hover:text-ink font-medium transition-colors">
                       <MapPin size={18} />
                       Addresses
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-muted hover:bg-canvas hover:text-ink font-medium transition-colors">
                       <Settings size={18} />
                       Settings
                    </button>
                    <div className="h-px bg-surface-elevated my-2" />
                    <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 w-full p-3 rounded-xl text-m-red hover:bg-surface-card hover:bg-m-red/10 font-medium transition-colors">
                       <LogOut size={18} />
                       Logout
                    </button>
                 </nav>
               </div>
            </aside>

            <div className="lg:col-span-3 space-y-8">
               
               <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-8">
                  <h2 className="text-2xl font-bold text-ink mb-6">Personal Information</h2>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">First Name</label>
                       <input type="text" defaultValue="John" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">Last Name</label>
                       <input type="text" defaultValue="Doe" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
                       <input type="email" defaultValue="john@example.com" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">Phone Number</label>
                       <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none" />
                     </div>
                     <div className="md:col-span-2 pt-4">
                       <button type="button" className="btn-primary">Save Changes</button>
                     </div>
                  </form>
               </div>

               <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-8">
                  <h2 className="text-2xl font-bold text-ink mb-6">Recent Orders</h2>
                  
                  <div className="border border-hairline rounded-xl overflow-hidden">
                     <div className="bg-canvas p-4 flex justify-between items-center border-b border-hairline">
                        <div>
                           <p className="text-xs text-muted font-medium mb-1">Order #UK-29481</p>
                           <p className="text-sm font-bold text-ink">Placed on Oct 24, 2026</p>
                        </div>
                        <div className="text-right">
                           <span className="inline-block px-3 py-1 bg-success/20 text-success font-semibold text-xs rounded-full">Delivered</span>
                        </div>
                     </div>
                     <div className="p-4 flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                           <div className="w-16 h-16 bg-canvas rounded-md overflow-hidden shrink-0">
                              <img src="https://picsum.photos/seed/shirt1/200/200" alt="Item" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="font-semibold text-ink line-clamp-1">DPS Boys White Shirt</p>
                              <p className="text-sm text-muted mt-1">Size: 28 • Qty: 2</p>
                           </div>
                        </div>
                        <Link to="/account/orders/UK-29481" className="p-2 text-muted hover:text-ink transition-colors">
                           <ChevronRight />
                        </Link>
                     </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button className="text-sm font-bold text-ink hover:text-m-red transition-colors inline-flex items-center gap-1">
                      View All Orders <ChevronRight size={16} />
                    </button>
                  </div>
               </div>

            </div>
         </div>

      </div>
    </div>
  );
}
