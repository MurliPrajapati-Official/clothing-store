import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../../store/cartStore';
import { cn } from '../../lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
    const { getTotalItems, setDrawerOpen } = useCartStore();
    const totalItems = getTotalItems();
    
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
    const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);

    const categories = ['School', 'College', 'Corporate', 'Hospital', 'Hotels', 'Factory'];
  
    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    useEffect(() => {
      setIsMenuOpen(false);
    }, [location]);
  
    return (
      <>
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            scrolled ? "bg-surface-card/90 backdrop-blur-md border-b border-hairline py-3 shadow-[0_2px_10px_rgba(0,0,0,0.5)]" : "bg-transparent border-transparent py-6"
          )}
        >
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 -ml-2 text-ink hover:bg-surface-elevated rounded-full transition-colors"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
  
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <span className={cn(
                  "font-extrabold text-xl sm:text-2xl tracking-tight transition-colors duration-300 text-ink"
                )}>
                  Uniform trends
                </span>
              </Link>
            </div>
  
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/"
                className={cn(
                  "text-[15px] font-medium transition-colors hover:text-m-red relative group whitespace-nowrap flex items-center h-10",
                  location.pathname === '/' ? "text-m-red" : "text-body-text"
                )}
              >
                Home
                <span className={cn(
                  "absolute bottom-0 left-0 w-0 h-0.5 bg-m-red transition-all duration-300 group-hover:w-full",
                  location.pathname === '/' && "w-full"
                )} />
              </Link>

              {/* Shop Mega Menu Trigger */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
              >
                <Link
                  to="/shop"
                  className={cn(
                    "text-[15px] font-medium transition-colors hover:text-m-red flex items-center gap-1 group whitespace-nowrap h-10",
                    location.pathname === '/shop' ? "text-m-red" : "text-body-text"
                  )}
                >
                  Shop
                  <ChevronDown size={14} className={cn("transition-transform duration-300", isShopDropdownOpen && "rotate-180")} />
                  <span className={cn(
                    "absolute bottom-0 left-0 w-0 h-0.5 bg-m-red transition-all duration-300 group-hover:w-full",
                    location.pathname === '/shop' && "w-full"
                  )} />
                </Link>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {isShopDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-64 bg-surface-card border border-hairline rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden py-4 z-50"
                    >
                      <div className="px-6 py-2 mb-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted">Shop by Category</h4>
                      </div>
                      <div className="flex flex-col">
                        {categories.map((cat) => (
                          <Link
                            key={cat}
                            to={`/shop?category=${encodeURIComponent(cat)}`}
                            onClick={() => setIsShopDropdownOpen(false)}
                            className="px-6 py-3 text-[14px] font-medium text-body-text hover:text-ink hover:bg-surface-elevated transition-colors flex items-center justify-between group/item"
                          >
                            {cat}
                            <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { name: 'About Us', path: '/about' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact Us', path: '/contact' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-[15px] font-medium transition-colors hover:text-m-red relative group whitespace-nowrap flex items-center h-10",
                    location.pathname === item.path
                      ? "text-m-red"
                      : "text-body-text"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-0 h-0.5 bg-m-red transition-all duration-300 group-hover:w-full",
                    location.pathname === item.path && "w-full"
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
  
              <button
                onClick={() => setDrawerOpen(true)}
                className="group relative p-2 ml-2 flex items-center hover:scale-110 active:scale-95 transition-transform"
              >
                <ShoppingBag size={22} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 bg-m-red text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.5)] ring-2 ring-white"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-transparent z-[55]"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-[88px] left-0 right-0 bg-transparent p-6 z-[60]"
            >
              <div className="container mx-auto">
                <div className="relative max-w-2xl mx-auto">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for uniforms, schools, accessories..."
                    className="w-full bg-transparent border-2 border-hairline rounded-full px-14 py-4 focus:border-ink text-ink outline-none font-medium transition-all shadow-lg backdrop-blur-md"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsSearchOpen(false);
                        window.location.href = `/shop?q=${encodeURIComponent(e.currentTarget.value)}`;
                      }
                    }}
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
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-canvas/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-surface-card border-r border-hairline z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-8 mb-4">
                <Link to="/" className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-ink">
                    Uniform trends
                  </span>
                </Link>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 text-muted hover:text-ink hover:bg-surface-elevated rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col px-4">
                {/* Mobile Home */}
                <Link
                  to="/"
                  className={cn(
                    "flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-bold transition-all",
                    location.pathname === '/' ? "bg-primary/10 text-primary" : "text-ink hover:bg-surface-elevated"
                  )}
                >
                  Home
                  <ChevronRight size={18} className={cn("transition-transform", location.pathname === '/' ? "translate-x-0" : "-translate-x-2 opacity-0")} />
                </Link>

                {/* Mobile Shop with Accordion */}
                <div className="flex flex-col">
                  <button
                    onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                    className={cn(
                      "flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-bold transition-all w-full text-left",
                      location.pathname.startsWith('/shop') ? "bg-primary/10 text-primary" : "text-ink hover:bg-surface-elevated"
                    )}
                  >
                    Shop
                    <ChevronDown size={18} className={cn("transition-transform duration-300", isMobileShopOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isMobileShopOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-surface-elevated/30 rounded-2xl mx-2 mb-2"
                      >
                        {categories.map((cat) => (
                          <Link
                            key={cat}
                            to={`/shop?category=${encodeURIComponent(cat)}`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsMobileShopOpen(false);
                            }}
                            className="flex items-center justify-between px-6 py-3 text-base font-medium text-muted hover:text-ink transition-colors"
                          >
                            {cat}
                            <ChevronRight size={16} />
                          </Link>
                        ))}
                        <Link
                          to="/shop"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileShopOpen(false);
                          }}
                          className="flex items-center justify-between px-6 py-3 text-base font-bold text-primary hover:text-ink transition-colors border-t border-hairline/50 mt-2"
                        >
                          View All Shop
                          <ArrowRight size={16} />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Contact Us', path: '/contact' }
                ].map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-bold transition-all",
                        location.pathname === item.path ? "bg-primary/10 text-primary" : "text-ink hover:bg-surface-elevated"
                      )}
                    >
                      {item.name}
                      <ChevronRight size={18} className={cn("transition-transform", location.pathname === item.path ? "translate-x-0" : "-translate-x-2 opacity-0")} />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto p-8 bg-surface-elevated/50 border-t border-hairline">
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/wishlist" className="flex flex-col items-center justify-center gap-2 p-4 bg-surface-card rounded-2xl border border-hairline hover:border-ink transition-all">
                    <Heart size={20} className="text-muted" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted">Wishlist</span>
                  </Link>
                  <Link to="/account" className="flex flex-col items-center justify-center gap-2 p-4 bg-surface-card rounded-2xl border border-hairline hover:border-ink transition-all">
                    <User size={20} className="text-muted" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted">Account</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
