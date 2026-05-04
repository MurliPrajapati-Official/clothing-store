import { useState, useEffect, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, ChevronDown, Check, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import { PRODUCTS, SCHOOLS, CATEGORIES } from '../constants';
import { Product } from '../types';
import { cn } from '../lib/utils';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

interface FilterDropdownProps {
  label: string;
  icon?: ReactNode;
  current: string;
  options: { id: string; name: string }[];
  onSelect: (id: string) => void;
}

function FilterDropdown({ label, icon, current, options, onSelect }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 bg-canvas border rounded-xl text-sm font-medium transition-all min-w-[160px] justify-between",
          isOpen ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]" : "border-hairline hover:border-muted"
        )}
      >
        <span className="flex items-center gap-2 text-ink">
          {icon && <span className="text-primary">{icon}</span>}
          <span className="text-muted mr-1">{label}:</span>
          {current}
        </span>
        <ChevronDown size={14} className={cn("text-muted transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 bg-surface-card border border-hairline rounded-2xl shadow-2xl z-50 p-2"
          >
            <div className="max-h-64 overflow-y-auto scrollbar-hide space-y-1">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelect(opt.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between",
                    current === opt.name || current === opt.id ? "bg-primary/10 text-primary font-bold" : "text-muted hover:bg-canvas hover:text-ink"
                  )}
                >
                  {opt.name}
                  {(current === opt.name || current === opt.id) && <Check size={14} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categoryFilter = searchParams.getAll('category');
  const schoolFilter = searchParams.get('school');
  const gradeFilter = searchParams.get('grade');
  const genderFilter = searchParams.get('gender');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (categoryFilter.length > 0 && !categoryFilter.includes(product.category)) return false;
    if (schoolFilter && schoolFilter !== 'all' && product.schoolId !== schoolFilter) return false;
    if (gradeFilter && gradeFilter !== 'All' && product.grade !== gradeFilter && product.grade !== 'All') return false;
    if (genderFilter && genderFilter !== 'All' && product.gender !== genderFilter.toLowerCase() && product.gender !== 'unisex') return false;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(lowerQuery) && !product.description.toLowerCase().includes(lowerQuery)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    return 0;
  });

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSortBy('popular');
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleToggleCategory = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = newParams.getAll('category');
    if (current.includes(cat)) {
      const filtered = current.filter(c => c !== cat);
      newParams.delete('category');
      filtered.forEach(c => newParams.append('category', c));
    } else {
      newParams.append('category', cat);
    }
    setSearchParams(newParams);
  };

  const getSortLabel = (id: string) => {
    const labels: Record<string, string> = {
      'popular': 'Relevance',
      'price-asc': 'Price: Low to High',
      'price-desc': 'Price: High to Low',
      'newest': 'Newest Arrivals',
      'name-asc': 'Name: A-Z'
    };
    return labels[id] || 'Relevance';
  };

  return (
    <div className="pt-24 pb-20 bg-canvas min-h-screen">
      <Helmet>
        <title>{categoryFilter.length > 0 ? `${categoryFilter.join(', ')} | Shop Uniform trends` : 'Shop All | Uniform trends'}</title>
        <meta name="description" content="Browse our premium selection of specialized uniforms for all sectors." />
      </Helmet>

      {/* Hero / Header Section */}
      <div className="bg-surface-card border-b border-hairline py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-4">
              <span>Catalog</span>
              <span className="w-1.5 h-1.5 bg-muted rounded-full" />
              <span className="text-muted">Specialized Attire</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-ink tracking-tight mb-6">
              Specialized <span className="text-primary">Uniform</span> Catalog
            </h1>
            <p className="text-xl text-muted font-light leading-relaxed max-w-2xl">
              Precision-engineered garments for academic, medical, and industrial excellence. Filter through our premium collection to find your perfect fit.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-card border-b border-hairline py-6 mb-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Dropdowns Group */}
              <div className="flex flex-wrap items-center gap-3">
                <FilterDropdown 
                  label="School" 
                  current={schoolFilter ? SCHOOLS.find(s => s.id === schoolFilter)?.name || 'All Schools' : 'All Schools'}
                  options={[
                    { id: 'all', name: 'All Schools' },
                    ...SCHOOLS.map(s => ({ id: s.id, name: s.name }))
                  ]}
                  onSelect={(id) => handleFilterChange('school', id)}
                />

                {/* Category Multi-select Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 bg-canvas border rounded-xl text-sm font-medium transition-all min-w-[160px] justify-between",
                      isCategoryOpen ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]" : "border-hairline hover:border-muted"
                    )}
                  >
                    <span className="flex items-center gap-2 text-ink">
                      <span className="text-muted">Category:</span>
                      {categoryFilter.length === 0 ? 'All' : `${categoryFilter.length} Selected`}
                    </span>
                    <ChevronDown size={14} className={cn("text-muted transition-transform duration-300", isCategoryOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-surface-card border border-hairline rounded-2xl shadow-2xl z-50 p-2"
                      >
                        <div className="max-h-64 overflow-y-auto scrollbar-hide space-y-1">
                          {CATEGORIES.map(cat => (
                            <button 
                              key={cat}
                              onClick={() => handleToggleCategory(cat)}
                              className={cn(
                                "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between",
                                categoryFilter.includes(cat) ? "bg-primary/10 text-primary font-bold" : "text-muted hover:bg-canvas hover:text-ink"
                              )}
                            >
                              {cat}
                              {categoryFilter.includes(cat) && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                        {categoryFilter.length > 0 && (
                          <button 
                            onClick={() => {
                              const p = new URLSearchParams(searchParams);
                              p.delete('category');
                              setSearchParams(p);
                            }}
                            className="w-full mt-2 py-2 text-[11px] font-bold text-m-red uppercase tracking-wider border-t border-hairline hover:bg-m-red/5 rounded-b-lg"
                          >
                            Reset Categories
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <FilterDropdown 
                  label="Grade" 
                  current={gradeFilter || 'All'}
                  options={[
                    { id: 'All', name: 'All Grades' },
                    { id: 'Primary', name: 'Primary' },
                    { id: 'Secondary', name: 'Secondary' }
                  ]}
                  onSelect={(id) => handleFilterChange('grade', id)}
                />

                <FilterDropdown 
                  label="Gender" 
                  current={genderFilter ? genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1) : 'All'}
                  options={[
                    { id: 'All', name: 'All Genders' },
                    { id: 'boys', name: 'Boys' },
                    { id: 'girls', name: 'Girls' },
                    { id: 'unisex', name: 'Unisex' }
                  ]}
                  onSelect={(id) => handleFilterChange('gender', id)}
                />

                {(schoolFilter || categoryFilter.length > 0 || gradeFilter || genderFilter) && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs font-bold text-m-red uppercase tracking-widest hover:underline ml-2"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search & Sort Group */}
              <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
                <div className="relative flex-1 md:w-64 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-card border border-hairline py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary transition-all text-ink rounded-xl"
                  />
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 bg-surface-card border rounded-xl text-sm font-medium transition-all min-w-[180px] justify-between",
                      isSortOpen ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]" : "border-hairline hover:border-muted"
                    )}
                  >
                    <span className="flex items-center gap-2 text-ink">
                      <SlidersHorizontal size={14} className="text-primary" />
                      {getSortLabel(sortBy)}
                    </span>
                    <ChevronDown size={14} className={cn("text-muted transition-transform duration-300", isSortOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-surface-card border border-hairline rounded-2xl shadow-2xl z-50 p-2"
                      >
                        {[
                          { id: 'popular', name: 'Relevance' },
                          { id: 'price-asc', name: 'Price: Low to High' },
                          { id: 'price-desc', name: 'Price: High to Low' },
                          { id: 'newest', name: 'Newest Arrivals' },
                          { id: 'name-asc', name: 'Name: A-Z' }
                        ].map(opt => (
                          <button 
                            key={opt.id}
                            onClick={() => {
                              setSortBy(opt.id);
                              setIsSortOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between",
                              sortBy === opt.id ? "bg-primary/10 text-primary font-bold" : "text-muted hover:bg-canvas hover:text-ink"
                            )}
                          >
                            {opt.name}
                            {sortBy === opt.id && <Check size={14} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm text-muted">
            Showing <span className="text-ink font-bold">{filteredProducts.length}</span> items
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <>
            {/* Mobile Dual Independent Carousels */}
            <div className="lg:hidden space-y-6 pb-8">
              {/* Row 1 */}
              <motion.div
                variants={staggerContainer}
                initial={false}
                animate="visible"
                className="flex overflow-x-auto -mx-4 px-4 gap-4 snap-x snap-mandatory scrollbar-hide"
              >
                {filteredProducts.filter((_, i) => i % 2 === 0).map((product) => (
                  <div key={product.id} className="snap-start min-w-[min(70vw,260px)]">
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </div>
                ))}
              </motion.div>

              {/* Row 2 */}
              <motion.div
                variants={staggerContainer}
                initial={false}
                animate="visible"
                className="flex overflow-x-auto -mx-4 px-4 gap-4 snap-x snap-mandatory scrollbar-hide"
              >
                {filteredProducts.filter((_, i) => i % 2 !== 0).map((product) => (
                  <div key={product.id} className="snap-start min-w-[min(70vw,260px)]">
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Desktop Grid */}
            <motion.div
              variants={staggerContainer}
              initial={false}
              animate="visible"
              className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-12"
            >
              {filteredProducts.map((product) => (
                <motion.div variants={fadeUpVariant} key={product.id}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center bg-surface-card rounded-3xl shadow-xl border border-hairline max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-canvas rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="text-muted" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-ink mb-3">No Products Found</h3>
            <p className="text-lg text-muted mb-8 px-8">We couldn't find any premium uniforms matching your current filter selection. Try adjusting your search or clearing the filters.</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
