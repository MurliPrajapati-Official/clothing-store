import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../../store/cartStore';
import { cn } from '../../lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-canvas/80 backdrop-blur-md border-hairline py-3" : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-ink"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex flex-col h-8 w-12 gap-0.5">
            <div className="flex-1 bg-m-blue-light" />
            <div className="flex-1 bg-m-blue-dark" />
            <div className="flex-1 bg-m-red" />
          </div>
          <span className={cn(
            "font-extrabold text-2xl tracking-tighter uppercase hidden sm:block",
            "text-white"
          )}>
            UNIFORM<span className="text-white italic opacity-50">KART</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {['Home', 'Shop', 'Schools', 'Track Order'].map((item) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
              className={cn(
                "text-[13px] font-bold uppercase tracking-[1.5px] transition-colors",
                location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`)
                  ? "text-primary"
                  : "text-muted hover:text-white"
              )}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            className="p-2 text-muted hover:text-white transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>
          
          <Link to="/wishlist" className="hidden sm:block p-2 text-muted hover:text-white transition-colors">
            <Heart size={20} />
          </Link>

          <Link to="/account" className="p-2 text-muted hover:text-white transition-colors">
            <User size={20} />
          </Link>

          <Link 
            to="/cart" 
            className="group relative p-2 bg-surface-card border border-hairline rounded-full hover:border-primary transition-all ml-2"
          >
            <ShoppingBag size={18} className="text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-canvas shadow-lg">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-canvas border-r border-hairline z-[70] p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-extrabold text-xl text-white uppercase italic tracking-tighter">UNIFORMKART</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {['Home', 'Shop', 'Schools', 'Track Order', 'Bulk Inquiries'].map((item) => (
                  <Link 
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-2xl font-bold text-white uppercase tracking-tighter border-b border-hairline pb-4"
                  >
                    {item}
                  </Link>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-6 pt-10 border-t border-hairline">
                <Link to="/wishlist" className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs text-muted">
                    Wishlist
                </Link>
                <Link to="/account" className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs text-muted">
                    Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-canvas border-b border-hairline shadow-2xl p-6"
          >
            <div className="container mx-auto">
              <div className="relative">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="SEARCH THE CATALOG..."
                  className="w-full bg-surface-card border border-hairline rounded-none px-14 py-5 focus:border-primary text-white outline-none font-bold tracking-widest text-sm transition-all"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
