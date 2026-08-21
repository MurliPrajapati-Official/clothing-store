import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/layout/SEO';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import { Product } from '../types';
import { mockProductService } from '../lib/mockService';
import { CATEGORIES, SIZES, STORE_NAME } from '../constants';
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const categoryParam = searchParams.get('category') || 'All';
  const genderParam = searchParams.get('gender') || 'All';
  const sizeParam = searchParams.get('size') || '';
  const searchParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await mockProductService.getProducts();
        setAllProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category filter
        if (categoryParam !== 'All') {
          const matchCat = p.category.toLowerCase() === categoryParam.toLowerCase() ||
            p.subCategory?.toLowerCase() === categoryParam.toLowerCase();
          if (!matchCat) return false;
        }

        // Gender filter
        if (genderParam !== 'All') {
          if (p.gender !== genderParam.toLowerCase() && p.gender !== 'unisex') return false;
        }

        // Size filter
        if (sizeParam) {
          if (!p.sizes.includes(sizeParam)) return false;
        }

        // Max Price filter
        if (maxPriceParam) {
          const max = Number(maxPriceParam);
          if (p.price > max) return false;
        }

        // Search query
        if (searchParam) {
          const q = searchParam.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q));
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortParam === 'price-asc') return a.price - b.price;
        if (sortParam === 'price-desc') return b.price - a.price;
        if (sortParam === 'rating') return b.rating - a.rating;
        if (sortParam === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [allProducts, categoryParam, genderParam, sizeParam, searchParam, sortParam, maxPriceParam]);

  const activeFilterCount = (categoryParam !== 'All' ? 1 : 0) +
    (genderParam !== 'All' ? 1 : 0) +
    (sizeParam ? 1 : 0) +
    (searchParam ? 1 : 0) +
    (maxPriceParam ? 1 : 0);

  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO
        title={`Shop All Apparel | ${STORE_NAME}`}
        description={`Explore our contemporary wardrobe catalog at ${STORE_NAME}. Tops, trousers, outerwear, streetwear, knitwear, and accessories.`}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Page Header */}
        <div className="py-8 border-b border-hairline mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-muted mb-1">Catalog</p>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
                {categoryParam !== 'All' ? `${categoryParam} Collection` : 'All Apparel & Essentials'}
              </h1>
            </div>
            <p className="text-xs text-muted font-medium">
              Showing <span className="font-bold text-ink">{filteredProducts.length}</span> items
            </p>
          </div>

          {/* Active Filters Pill Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-hairline">
              <span className="text-xs font-bold uppercase tracking-wider text-muted mr-1">Active:</span>
              {categoryParam !== 'All' && (
                <button
                  onClick={() => updateFilter('category', 'All')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold text-ink hover:bg-neutral-100"
                >
                  <span>Category: {categoryParam}</span>
                  <X size={12} />
                </button>
              )}
              {genderParam !== 'All' && (
                <button
                  onClick={() => updateFilter('gender', 'All')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold text-ink hover:bg-neutral-100"
                >
                  <span>Gender: {genderParam}</span>
                  <X size={12} />
                </button>
              )}
              {sizeParam && (
                <button
                  onClick={() => updateFilter('size', '')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold text-ink hover:bg-neutral-100"
                >
                  <span>Size: {sizeParam}</span>
                  <X size={12} />
                </button>
              )}
              {searchParam && (
                <button
                  onClick={() => updateFilter('q', '')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold text-ink hover:bg-neutral-100"
                >
                  <span>Search: "{searchParam}"</span>
                  <X size={12} />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-muted hover:text-ink underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-hairline text-xs font-bold uppercase tracking-wider text-ink"
          >
            <Filter size={14} />
            <span>Filters ({activeFilterCount})</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={14} className="text-muted" />
            <span className="text-xs uppercase font-bold tracking-wider text-muted hidden sm:inline">Sort by:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-white border border-hairline px-3 py-2 text-xs font-bold text-ink outline-none focus:border-ink"
            >
              <option value="featured">Featured First</option>
              <option value="newest">New Arrivals</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Main Grid + Desktop Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8">
            {/* Categories */}
            <div className="border border-hairline p-6 bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink mb-4 pb-2 border-b border-hairline">
                Department
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={cn(
                      "block w-full text-left py-1 text-xs transition-colors",
                      categoryParam.toLowerCase() === cat.toLowerCase()
                        ? "font-black text-ink"
                        : "text-muted hover:text-ink font-medium"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="border border-hairline p-6 bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink mb-4 pb-2 border-b border-hairline">
                Gender
              </h3>
              <div className="space-y-1.5">
                {['All', 'Men', 'Women', 'Unisex'].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateFilter('gender', g)}
                    className={cn(
                      "block w-full text-left py-1 text-xs transition-colors",
                      genderParam.toLowerCase() === g.toLowerCase()
                        ? "font-black text-ink"
                        : "text-muted hover:text-ink font-medium"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="border border-hairline p-6 bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink mb-4 pb-2 border-b border-hairline">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter('size', sizeParam === s ? '' : s)}
                    className={cn(
                      "w-10 h-10 border text-xs font-bold uppercase transition-all",
                      sizeParam === s
                        ? "bg-ink text-white border-ink"
                        : "bg-white text-ink border-hairline hover:border-ink"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border border-hairline p-6 bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink mb-4 pb-2 border-b border-hairline">
                Price
              </h3>
              <div className="space-y-2 text-xs font-medium text-muted">
                <button
                  onClick={() => updateFilter('maxPrice', '2000')}
                  className={cn("block text-left w-full", maxPriceParam === '2000' && "font-black text-ink")}
                >
                  Under ₹2,000
                </button>
                <button
                  onClick={() => updateFilter('maxPrice', '3500')}
                  className={cn("block text-left w-full", maxPriceParam === '3500' && "font-black text-ink")}
                >
                  Under ₹3,500
                </button>
                <button
                  onClick={() => updateFilter('maxPrice', '6000')}
                  className={cn("block text-left w-full", maxPriceParam === '6000' && "font-black text-ink")}
                >
                  Under ₹6,000
                </button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-surface-card animate-pulse border border-hairline" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white border border-hairline px-4">
                <SlidersHorizontal size={40} className="mx-auto text-muted mb-4 opacity-40" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-ink mb-2">No matching apparel</h3>
                <p className="text-sm text-muted mb-6">Try clearing or adjusting your selected filters.</p>
                <button onClick={clearAllFilters} className="btn-primary py-3 px-8 text-xs">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-[85%] max-w-sm bg-white h-full p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                <span className="text-sm font-black uppercase tracking-widest text-ink">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Department */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-3">Department</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateFilter('category', cat);
                        setMobileFiltersOpen(false);
                      }}
                      className={cn(
                        "block w-full text-left py-1 text-xs",
                        categoryParam.toLowerCase() === cat.toLowerCase() ? "font-black text-ink" : "text-muted"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateFilter('size', sizeParam === s ? '' : s);
                        setMobileFiltersOpen(false);
                      }}
                      className={cn(
                        "w-10 h-10 border text-xs font-bold",
                        sizeParam === s ? "bg-ink text-white" : "border-hairline"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-primary py-3 text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full text-xs font-bold uppercase tracking-wider text-muted py-2 text-center"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
