import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/product/ProductCard';
import { PRODUCTS, SCHOOLS, CATEGORIES } from '../constants';
import { cn } from '../lib/utils';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const slideRightVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('popular');
  
  const categoryFilter = searchParams.get('category');
  const schoolFilter = searchParams.get('school');
  const gradeFilter = searchParams.get('grade');
  const genderFilter = searchParams.get('gender');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (schoolFilter && product.schoolId !== schoolFilter) return false;
    if (gradeFilter && product.grade !== gradeFilter && product.grade !== 'All') return false;
    if (genderFilter && product.gender !== genderFilter && product.gender !== 'unisex') return false;
    
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
    return 0;
  });

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSortBy('popular');
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get(key) === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="pt-24 pb-20 bg-canvas min-h-screen">
      <Helmet>
        <title>{categoryFilter ? `${categoryFilter} | Shop Ovi Global Uniform` : 'Shop All | Ovi Global Uniform'}</title>
        <meta name="description" content="Browse our premium selection of school uniforms, accessories, and shoes." />
      </Helmet>
      
      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-transparent z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85vw] sm:w-[400px] bg-surface-card border-l border-hairline shadow-[0_0_40px_rgba(0,0,0,0.8)] z-[70] flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-hairline-strong">
                <h3 className="text-xl font-bold text-ink">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-muted hover:text-ink hover:bg-surface-elevated rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="font-bold text-ink">Selected Filters</h4>
                   <button onClick={() => { clearFilters(); setIsFilterOpen(false); }} className="text-sm font-medium text-m-red hover:text-red-700">Clear All</button>
                </div>
                <div className="space-y-8">
                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By School</h4>
                      <div className="space-y-3">
                        {SCHOOLS.map(school => (
                          <label key={school.id} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="mobile-school" 
                                   checked={schoolFilter === school.id}
                                   onChange={() => handleFilterChange('school', school.id)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors",
                               schoolFilter === school.id ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{school.name}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By Category</h4>
                      <div className="space-y-3">
                        {CATEGORIES.map(cat => (
                          <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="mobile-category" 
                                   checked={categoryFilter === cat}
                                   onChange={() => handleFilterChange('category', cat)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors",
                               categoryFilter === cat ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{cat}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By Grade Level</h4>
                      <div className="space-y-3">
                        {['Primary', 'Secondary', 'All'].map(grade => (
                          <label key={grade} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="mobile-grade" 
                                   checked={gradeFilter === grade}
                                   onChange={() => handleFilterChange('grade', grade)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors",
                               gradeFilter === grade ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{grade}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By Gender</h4>
                      <div className="space-y-3">
                        {['boys', 'girls', 'unisex'].map(gender => (
                          <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="mobile-gender" 
                                   checked={genderFilter === gender}
                                   onChange={() => handleFilterChange('gender', gender)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors capitalize",
                               genderFilter === gender ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{gender}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-hairline mb-10 pt-10 pb-8 bg-surface-card shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-muted text-sm font-medium mb-4">
                <span>Home</span>
                <span className="w-1 h-1 bg-text-muted rounded-full" />
                <span className="text-ink">Shop</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight">
                {categoryFilter ? categoryFilter : 'All Products'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-canvas border border-hairline py-3 pl-12 pr-4 text-base outline-none focus:border-ink transition-all text-ink rounded-full"
                 />
               </div>
               <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden p-3 bg-surface-card text-ink border border-hairline rounded-xl hover:bg-surface-card flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
               >
                 <Filter size={18} />
               </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="flex gap-10">
          <motion.aside 
            variants={slideRightVariant}
            initial="hidden"
            animate="visible"
            className="hidden lg:block w-72 shrink-0"
          >
             <div className="sticky top-28 bg-surface-card p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl text-ink">Filters</h3>
                  <button onClick={clearFilters} className="text-sm font-medium text-m-red hover:text-red-700 transition-colors">Clear All</button>
                </div>
                <div className="space-y-8">
                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By School</h4>
                      <div className="space-y-3">
                        {SCHOOLS.map(school => (
                          <label key={school.id} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="school" 
                                   checked={schoolFilter === school.id}
                                   onChange={() => handleFilterChange('school', school.id)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors",
                               schoolFilter === school.id ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{school.name}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By Category</h4>
                      <div className="space-y-3">
                        {CATEGORIES.map(cat => (
                          <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="category" 
                                   checked={categoryFilter === cat}
                                   onChange={() => handleFilterChange('category', cat)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors",
                               categoryFilter === cat ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{cat}</span>
                          </label>
                        ))}
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By Grade Level</h4>
                      <div className="space-y-3">
                        {['Primary', 'Secondary', 'All'].map(grade => (
                          <label key={grade} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="grade" 
                                   checked={gradeFilter === grade}
                                   onChange={() => handleFilterChange('grade', grade)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors",
                               gradeFilter === grade ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{grade}</span>
                          </label>
                        ))}
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-bold text-ink mb-4 border-b border-hairline pb-2">By Gender</h4>
                      <div className="space-y-3">
                        {['boys', 'girls', 'unisex'].map(gender => (
                          <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="checkbox" 
                                   name="gender" 
                                   checked={genderFilter === gender}
                                   onChange={() => handleFilterChange('gender', gender)}
                                   className="w-4 h-4 text-ink focus:ring-navy border-gray-300 cursor-pointer rounded-sm" 
                                />
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors capitalize",
                               genderFilter === gender ? "text-ink" : "text-muted group-hover:text-ink"
                             )}>{gender}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </motion.aside>

          <main className="flex-1">
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="bg-surface-card p-4 border border-hairline flex flex-wrap items-center justify-between mb-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] gap-4"
             >
               <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted">Showing</span>
                  <span className="text-base font-bold text-ink">{filteredProducts.length} items</span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <SlidersHorizontal size={18} className="text-muted" />
                   <select 
                     value={sortBy} 
                     onChange={(e) => setSortBy(e.target.value)} 
                     className="bg-canvas border-none text-sm font-medium text-ink outline-none py-2 px-4 rounded-lg cursor-pointer"
                   >
                      <option value="popular">Sort by: Popularity</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                   </select>
                 </div>
               </div>
             </motion.div>

             {filteredProducts.length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[45%] md:auto-cols-[40%] gap-4 overflow-x-auto snap-x snap-mandatory pb-8 lg:grid-rows-none lg:grid-flow-row lg:auto-cols-auto lg:overflow-x-visible lg:snap-none lg:grid-cols-2 lg:pb-0 xl:grid-cols-3"
                >
                  {filteredProducts.map((product) => (
                    <motion.div variants={fadeUpVariant} key={product.id} className="snap-start h-full">
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
             ) : (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-24 text-center bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline"
                >
                  <div className="w-20 h-20 bg-canvas rounded-full flex items-center justify-center mx-auto mb-6">
                     <Search className="text-muted" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-ink mb-2">No Products Found</h3>
                  <p className="text-muted mb-6">We couldn't find any items matching your selected filters.</p>
                  <button onClick={clearFilters} className="btn-outline">
                    Clear All Filters
                  </button>
               </motion.div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
}
