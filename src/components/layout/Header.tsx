import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { cn } from '../../lib/utils';
import { CATEGORIES, STORE_NAME } from '../../constants';
import { useAuth } from '../../lib/mockAuth';
import { mockProductService } from '../../lib/mockService';
import { Product } from '../../types';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { getTotalItems, setDrawerOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const totalItems = getTotalItems();
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    mockProductService.getProducts().then((data) => setAllProducts(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setSearchResults(filtered.slice(0, 6));
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navCategories = ['Men', 'Women', 'Streetwear', 'Outerwear', 'Knitwear', 'Accessories'];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-ink text-white text-[11px] font-medium tracking-widest uppercase py-2 px-4 text-center z-50">
        <span>Complimentary Express Shipping on Orders Above ₹1,999 • Code: <strong className="text-sand font-bold">STYLE20</strong> for 20% Off</span>
      </div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "sticky top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-hairline py-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
            : "bg-white border-b border-hairline/60 py-4"
        )}
      >
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              aria-label="Open Mobile Menu"
              className="lg:hidden p-2 text-ink hover:bg-surface-elevated transition-colors border border-hairline"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-black text-sm tracking-tighter">
                CS
              </div>
              <span className="font-black text-xl sm:text-2xl tracking-tighter text-ink uppercase">
                {STORE_NAME}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 h-9">
            <Link
              to="/"
              className={cn(
                "text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-ink relative h-9 flex items-center",
                location.pathname === '/' ? "text-ink" : "text-muted"
              )}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
              )}
            </Link>

            <div
              className="relative group h-9 flex items-center"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <Link
                to="/shop"
                className={cn(
                  "text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-ink flex items-center gap-1 h-9 relative",
                  location.pathname === '/shop' ? "text-ink" : "text-muted"
                )}
              >
                <span>Shop</span>
                <ChevronDown size={13} className={cn("transition-transform duration-200 mt-0.5", isShopDropdownOpen && "rotate-180")} />
                {location.pathname === '/shop' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
                )}
              </Link>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isShopDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-64 bg-white border border-hairline shadow-2xl py-3 px-2 z-50 mt-0.5"
                  >
                    <Link
                      to="/shop"
                      className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink hover:bg-surface-elevated transition-colors"
                    >
                      All Apparel
                    </Link>
                    <div className="h-px bg-hairline my-1" />
                    {navCategories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/shop?category=${encodeURIComponent(cat)}`}
                        className="block px-4 py-2 text-xs font-medium text-muted hover:text-ink hover:bg-surface-elevated transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/shop?gender=men"
              className={cn(
                "text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-ink h-9 flex items-center relative",
                location.search.includes('gender=men') ? "text-ink" : "text-muted"
              )}
            >
              Men
              {location.search.includes('gender=men') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
              )}
            </Link>

            <Link
              to="/shop?gender=women"
              className={cn(
                "text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-ink h-9 flex items-center relative",
                location.search.includes('gender=women') ? "text-ink" : "text-muted"
              )}
            >
              Women
              {location.search.includes('gender=women') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
              )}
            </Link>

            <Link
              to="/collections"
              className={cn(
                "text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-ink h-9 flex items-center relative",
                location.pathname === '/collections' ? "text-ink" : "text-muted"
              )}
            >
              Lookbook
              {location.pathname === '/collections' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
              )}
            </Link>

            <Link
              to="/about"
              className={cn(
                "text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-ink h-9 flex items-center relative",
                location.pathname === '/about' ? "text-ink" : "text-muted"
              )}
            >
              About
              {location.pathname === '/about' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
              )}
            </Link>

            <Link
              to="/contact"
              className={cn(
                "text-[13px] font-semibold tracking-wider uppercase transition-colors hover:text-ink h-9 flex items-center relative",
                location.pathname === '/contact' ? "text-ink" : "text-muted"
              )}
            >
              Contact
              {location.pathname === '/contact' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
              )}
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search catalog"
              className="p-2 text-ink hover:bg-surface-elevated transition-colors rounded-none"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="p-2 text-ink hover:bg-surface-elevated transition-colors relative rounded-none hidden sm:flex items-center"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-ink text-white text-[9px] font-black flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              to="/account"
              aria-label="Account"
              className="p-2 text-ink hover:bg-surface-elevated transition-colors relative rounded-none flex items-center"
            >
              <User size={20} />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Shopping Cart"
              className="p-2 text-ink hover:bg-surface-elevated transition-colors relative rounded-none flex items-center gap-1.5"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="bg-ink text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Interactive Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-white border-b border-hairline z-[110] shadow-2xl p-6 sm:p-10"
            >
              <div className="container mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-muted">Search Catalog</span>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-ink hover:bg-surface-elevated"
                  >
                    <X size={22} />
                  </button>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative mb-6">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tees, jackets, trousers, dresses..."
                    className="w-full bg-canvas border border-ink/30 px-5 py-4 text-lg text-ink font-medium outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-ink text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                  >
                    Search
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-muted mb-3">Instant Results</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-4 p-3 bg-canvas border border-hairline hover:border-ink transition-colors group"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-14 h-16 object-cover bg-surface-soft"
                          />
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted font-semibold">{product.category}</p>
                            <p className="text-sm font-bold text-ink group-hover:text-neutral-600 line-clamp-1">{product.name}</p>
                            <p className="text-xs font-black text-ink">₹{product.price.toLocaleString('en-IN')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 bottom-0 left-0 w-[85%] max-w-sm bg-white z-[110] p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-hairline mb-6">
                  <span className="font-black text-xl uppercase tracking-tight text-ink">{STORE_NAME}</span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 text-ink">
                    <X size={22} />
                  </button>
                </div>

                <nav className="space-y-4">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    All Clothing
                  </Link>
                  <Link
                    to="/shop?gender=men"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    Men's Collection
                  </Link>
                  <Link
                    to="/shop?gender=women"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    Women's Collection
                  </Link>
                  <Link
                    to="/collections"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    Lookbook
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    Wishlist ({wishlistItems.length})
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    About Store
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-bold uppercase tracking-wider text-ink hover:text-muted"
                  >
                    Contact & Support
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-hairline text-xs text-muted">
                <p className="font-semibold text-ink mb-1">Customer Support</p>
                <p>care@clothingstore.com</p>
                <p>+91 XXXXX XXXXX</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
