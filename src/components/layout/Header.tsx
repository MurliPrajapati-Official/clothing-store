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
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-surface-card/90 backdrop-blur-md border-b border-hairline py-3 shadow-[0_2px_10px_rgba(0,0,0,0.5)]" : "bg-transparent border-transparent py-6"
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
        <Link to="/" className="flex items-center gap-2 group">
          {/* A Premium looking text-based logo or icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-surface-elevated rounded-lg border border-hairline text-warning font-serif font-black text-xl group-hover:scale-105 transition-transform shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
            U
          </div>
          <span className={cn(
            "font-extrabold text-2xl tracking-tight hidden sm:block transition-colors duration-300",
            scrolled ? "text-ink" : "text-ink"
          )}>
            Uniform<span className="font-light text-ink">Kart</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {['Home', 'Shop', 'Schools', 'Track Order'].map((item) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-m-red relative group",
                location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`)
                  ? "text-m-red"
                  : "text-body-text"
              )}
            >
              {item}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-m-red transition-all duration-300 group-hover:w-full",
                location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`) && "w-full"
              )} />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 text-ink">
          <button 
            className="p-2 hover:text-m-red transition-colors hover:scale-110 active:scale-95"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={22} />
          </button>
          
          <Link to="/wishlist" className="hidden sm:block p-2 hover:text-m-red transition-colors hover:scale-110 active:scale-95">
            <Heart size={22} />
          </Link>

          <Link to="/account" className="hidden sm:block p-2 hover:text-m-red transition-colors hover:scale-110 active:scale-95">
            <User size={22} />
          </Link>

          <Link 
            to="/cart" 
            className="group relative p-2 ml-2 flex items-center hover:scale-110 active:scale-95 transition-transform"
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute 0 top-0 right-0 bg-m-red text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.5)] ring-2 ring-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
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
              className="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-canvas border-r border-hairline z-[70] p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-surface-elevated border border-hairline rounded-lg text-warning font-serif font-black text-lg">
                      U
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-ink">
                      Uniform<span className="font-light">Kart</span>
                    </span>
                 </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-muted hover:text-ink hover:bg-surface-elevated rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {['Home', 'Shop', 'Schools', 'Track Order', 'Bulk Inquiries'].map((item) => (
                  <Link 
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-xl font-medium text-ink hover:text-m-red transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-6 pt-8 border-t border-hairline">
                <Link to="/wishlist" className="flex items-center gap-3 font-medium text-muted hover:text-ink transition-colors">
                    <Heart size={20} />
                    Wishlist
                </Link>
                <Link to="/account" className="flex items-center gap-3 font-medium text-muted hover:text-ink transition-colors">
                    <User size={20} />
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
            className="absolute top-full left-0 right-0 bg-surface-card border-b border-hairline shadow-xl p-6"
          >
            <div className="container mx-auto">
              <div className="relative max-w-2xl mx-auto">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search for uniforms, schools, accessories..."
                  className="w-full bg-canvas border-2 border-hairline rounded-full px-14 py-4 focus:border-ink text-ink outline-none font-medium transition-all"
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-muted hover:text-m-red transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
