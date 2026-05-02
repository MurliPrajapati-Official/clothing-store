import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { PRODUCTS, SCHOOLS, CATEGORIES } from '../constants';
import { cn } from '../lib/utils';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const categoryFilter = searchParams.get('category');
  const schoolFilter = searchParams.get('school');
  const gradeFilter = searchParams.get('grade');
  const genderFilter = searchParams.get('gender');

  const filteredProducts = PRODUCTS.filter((product) => {
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (schoolFilter && product.schoolId !== schoolFilter) return false;
    if (gradeFilter && product.grade !== gradeFilter && product.grade !== 'All') return false;
    if (genderFilter && product.gender !== genderFilter && product.gender !== 'unisex') return false;
    return true;
  });

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="pt-24 pb-20 bg-canvas min-h-screen">
      <div className="border-b border-hairline mb-10 pt-10 pb-8 bg-surface-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-muted text-[12px] font-bold uppercase tracking-[1.5px] mb-4">
                <span>HOME</span>
                <span className="w-1 h-1 bg-muted rounded-none" />
                <span className="text-white">SHOP</span>
              </div>
              <h1 className="text-[56px] font-bold text-ink tracking-tight uppercase leading-[1.05]">
                {categoryFilter ? categoryFilter : 'THE CATALOG'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                 <input 
                    type="text" 
                    placeholder="SEARCH PRODUCTS..."
                    className="w-full bg-surface-elevated border border-hairline py-3 pl-12 pr-4 text-[14px] outline-none focus:border-white transition-all text-white font-bold uppercase tracking-[1.5px] placeholder:text-muted rounded-none"
                 />
               </div>
               <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden p-3 bg-white text-black rounded-none uppercase font-bold text-[14px]"
               >
                 <Filter size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-72 shrink-0">
             <div className="sticky top-28 bg-surface-card p-8 border border-hairline">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-[24px] uppercase text-white">FILTERS</h3>
                  <button onClick={clearFilters} className="text-[12px] font-bold text-muted uppercase tracking-[1.5px] hover:text-white transition-colors">CLEAR</button>
                </div>
                <div className="space-y-10">
                   <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white mb-6 border-b border-hairline pb-2">By Fleet</h4>
                      <div className="space-y-4">
                        {SCHOOLS.map(school => (
                          <label key={school.id} className="flex items-center gap-4 cursor-pointer group">
                             <div className="relative w-4 h-4 flex items-center justify-center">
                                <input 
                                   type="radio" 
                                   name="school" 
                                   checked={schoolFilter === school.id}
                                   onChange={() => setSearchParams({ ...Object.fromEntries(searchParams), school: school.id })}
                                   className="appearance-none w-4 h-4 border border-hairline bg-canvas checked:bg-white transition-all duration-200" 
                                />
                             </div>
                             <span className="text-[14px] font-bold uppercase tracking-[1.0px] text-muted group-hover:text-white transition-colors">{school.name}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white mb-6 border-b border-hairline pb-2">By Spec</h4>
                      <div className="space-y-4">
                        {CATEGORIES.map(cat => (
                          <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                             <div className="relative w-4 h-4 flex items-center justify-center">
                                <input 
                                   type="radio" 
                                   name="category" 
                                   checked={categoryFilter === cat}
                                   onChange={() => setSearchParams({ ...Object.fromEntries(searchParams), category: cat })}
                                   className="appearance-none w-4 h-4 border border-hairline bg-canvas checked:bg-white transition-all duration-200" 
                                />
                             </div>
                             <span className="text-[14px] font-bold uppercase tracking-[1.0px] text-muted group-hover:text-white transition-colors">{cat}</span>
                          </label>
                        ))}
                      </div>
                   </div>

                   <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white mb-6 border-b border-hairline pb-2">By Section</h4>
                      <div className="space-y-4">
                        {['Primary', 'Secondary', 'All'].map(grade => (
                          <label key={grade} className="flex items-center gap-4 cursor-pointer group">
                             <div className="relative w-4 h-4 flex items-center justify-center">
                                <input 
                                   type="radio" 
                                   name="grade" 
                                   checked={gradeFilter === grade}
                                   onChange={() => setSearchParams({ ...Object.fromEntries(searchParams), grade: grade })}
                                   className="appearance-none w-4 h-4 border border-hairline bg-canvas checked:bg-white transition-all duration-200" 
                                />
                             </div>
                             <span className="text-[14px] font-bold uppercase tracking-[1.0px] text-muted group-hover:text-white transition-colors">{grade}</span>
                          </label>
                        ))}
                      </div>
                   </div>

                   <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white mb-6 border-b border-hairline pb-2">By Target</h4>
                      <div className="space-y-4">
                        {['boys', 'girls', 'unisex'].map(gender => (
                          <label key={gender} className="flex items-center gap-4 cursor-pointer group">
                             <div className="relative w-4 h-4 flex items-center justify-center">
                                <input 
                                   type="radio" 
                                   name="gender" 
                                   checked={genderFilter === gender}
                                   onChange={() => setSearchParams({ ...Object.fromEntries(searchParams), gender: gender })}
                                   className="appearance-none w-4 h-4 border border-hairline bg-canvas checked:bg-white transition-all duration-200" 
                                />
                             </div>
                             <span className="text-[14px] font-bold uppercase tracking-[1.0px] text-muted group-hover:text-white transition-colors">{gender}</span>
                          </label>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </aside>

          <main className="flex-1">
             <div className="bg-surface-card p-4 border border-hairline flex items-center justify-between mb-8 rounded-none">
               <div className="flex items-center gap-3">
                  <span className="text-[14px] font-bold text-muted uppercase tracking-[1.5px]">AVAILABLE UNITS:</span>
                  <span className="text-[16px] font-black text-white">{filteredProducts.length}</span>
               </div>
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                   <SlidersHorizontal size={16} className="text-muted" />
                   <select className="bg-canvas border border-hairline text-[14px] font-bold uppercase tracking-[1.5px] text-white outline-none py-2 px-4 rounded-none">
                      <option className="bg-surface-card">SORT: POPULARITY</option>
                      <option className="bg-surface-card">SORT: PRICE ASC</option>
                   </select>
                 </div>
               </div>
             </div>

             {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
             ) : (
               <div className="py-[96px] text-center border border-hairline bg-surface-card">
                  <h3 className="text-[32px] font-bold text-ink uppercase">NO UNITS FOUND</h3>
                  <p className="text-[16px] text-body font-light mt-4">Adjust your filters parameters to explore the catalog.</p>
               </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
}
