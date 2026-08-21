import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/layout/SEO';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check, ArrowRight, Share2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatCurrency, cn } from '../lib/utils';
import { Product } from '../types';
import { mockProductService } from '../lib/mockService';
import ProductCard from '../components/product/ProductCard';
import ProductReviews from '../components/product/ProductReviews';
import { STORE_NAME } from '../constants';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care' | 'shipping' | 'reviews'>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const p = await mockProductService.getProductBySlug(slug);
        if (p) {
          setProduct(p);
          setSelectedImage(p.images[0] || '');
          setSelectedSize(p.sizes[0] || '');
          setSelectedColor(p.colors?.[0]?.name || '');
          setQuantity(1);

          const related = await mockProductService.getRelatedProducts(p.id, p.category);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] bg-canvas flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-bold tracking-widest text-muted">Loading Apparel Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[70vh] flex flex-col items-center justify-center bg-canvas">
        <SEO title="Product Not Found" description="The requested apparel item could not be found." />
        <h1 className="text-3xl font-black uppercase text-ink mb-4">Item Not Found</h1>
        <p className="text-muted mb-8">This clothing item may have been moved or is out of stock.</p>
        <Link to="/shop" className="btn-primary">Browse All Clothing</Link>
      </div>
    );
  }

  const existsInWishlist = isInWishlist(product.id);

  const handleAddToCart = (openDrawer = true) => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, quantity, selectedColor || undefined);
    if (openDrawer) {
      setDrawerOpen(true);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO
        title={`${product.name} | ${STORE_NAME}`}
        description={product.description}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted mb-8 uppercase tracking-wider">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">{product.category}</Link>
          <span>/</span>
          <span className="text-ink font-bold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 max-h-[600px] pb-2 md:pb-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "w-16 h-20 md:w-20 md:h-24 bg-surface-soft border overflow-hidden shrink-0 transition-all",
                      selectedImage === img ? "border-ink scale-95" : "border-hairline opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image with 3:4 Aspect Ratio */}
            <div className="relative flex-1 aspect-[3/4] bg-surface-soft border border-hairline overflow-hidden group">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-ink text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Product Info & Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between mb-3 text-xs text-muted uppercase tracking-wider font-bold">
                <span>{product.category} • {product.gender.toUpperCase()}</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1 text-ink hover:underline"
                >
                  <Star size={14} className="fill-ink text-ink" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                  <span className="text-muted">({product.reviewsCount} reviews)</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-hairline">
                <span className="text-3xl font-black text-ink">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-muted line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-muted ml-auto font-medium">Taxes included</span>
              </div>

              {/* Short Description */}
              <p className="text-sm text-body-text leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink">
                      Color: <span className="font-normal text-muted">{selectedColor}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all border",
                          selectedColor === c.name ? "ring-2 ring-ink ring-offset-2 scale-110" : "border-black/20 hover:scale-105"
                        )}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColor === c.name && (
                          <Check size={14} className={c.hex === '#FFFFFF' || c.hex === '#F7F6F2' ? 'text-black' : 'text-white'} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink">Select Size</label>
                  <Link to="/size-guide" target="_blank" className="text-xs text-muted underline hover:text-ink">
                    Size & Fit Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 border text-xs font-bold uppercase transition-all flex items-center justify-center",
                        selectedSize === size
                          ? "bg-ink text-white border-ink shadow-md"
                          : "bg-white text-ink border-hairline hover:border-ink"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-ink">Quantity</span>
                <div className="flex items-center border border-hairline bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface-elevated text-ink"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-ink">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface-elevated text-ink"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 btn-primary py-4 text-xs flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Shopping Bag</span>
                  </button>

                  <button
                    onClick={() => {
                      if (existsInWishlist) removeFromWishlist(product.id);
                      else addToWishlist(product);
                    }}
                    aria-label="Toggle Wishlist"
                    className={cn(
                      "p-4 border border-hairline transition-colors flex items-center justify-center",
                      existsInWishlist ? "text-ink bg-surface-elevated" : "text-muted hover:text-ink hover:bg-surface-elevated"
                    )}
                  >
                    <Heart size={20} className={existsInWishlist ? "fill-ink text-ink" : ""} />
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label="Share product"
                    className="p-4 border border-hairline text-muted hover:text-ink hover:bg-surface-elevated transition-colors flex items-center justify-center"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-sand text-ink border border-ink/20 hover:bg-sand/80 font-bold text-xs uppercase tracking-wider py-4 transition-colors"
                >
                  Buy Now — Instant Checkout
                </button>
              </div>

              {copied && (
                <p className="text-xs font-bold text-ink mt-2 text-center">Product link copied to clipboard!</p>
              )}

              {/* Value Promises */}
              <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-hairline text-center">
                <div className="p-3 bg-surface-card border border-hairline">
                  <Truck size={18} className="mx-auto text-ink mb-1" />
                  <p className="text-[10px] font-bold uppercase text-ink">Free Express Delivery</p>
                </div>
                <div className="p-3 bg-surface-card border border-hairline">
                  <RotateCcw size={18} className="mx-auto text-ink mb-1" />
                  <p className="text-[10px] font-bold uppercase text-ink">30-Day Doorstep Returns</p>
                </div>
                <div className="p-3 bg-surface-card border border-hairline">
                  <ShieldCheck size={18} className="mx-auto text-ink mb-1" />
                  <p className="text-[10px] font-bold uppercase text-ink">Authentic Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section: Details, Fabric & Care, Reviews */}
        <div className="border-t border-hairline pt-12 mb-20">
          <div className="flex border-b border-hairline gap-8 overflow-x-auto mb-8">
            {[
              { id: 'details', label: 'Description & Fit' },
              { id: 'materials', label: 'Fabric & Composition' },
              { id: 'care', label: 'Care Instructions' },
              { id: 'shipping', label: 'Delivery & Returns' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewsCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap",
                  activeTab === tab.id ? "text-ink font-black" : "text-muted hover:text-ink"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === 'details' && (
              <div className="space-y-4 text-sm text-body-text leading-relaxed">
                <p>{product.description}</p>
                {product.fit && (
                  <p><strong className="text-ink">Fit Profile:</strong> {product.fit}</p>
                )}
                {product.specifications && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-hairline">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="p-3 bg-surface-card border border-hairline">
                        <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">{k}</span>
                        <span className="text-xs font-bold text-ink">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4 text-sm text-body-text leading-relaxed">
                <p className="font-bold text-ink">Material Composition:</p>
                <p>{product.materials || '100% Premium Organic Cotton'}</p>
                <p className="text-xs text-muted">Ethically milled and spun in certified facilities adhering to zero hazardous chemical discharges.</p>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3 text-sm text-body-text leading-relaxed">
                <p className="font-bold text-ink">Recommended Care for Longevity:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-muted">
                  {product.care ? (
                    product.care.map((c, i) => <li key={i}>{c}</li>)
                  ) : (
                    <>
                      <li>Machine wash cold inside out with similar colors</li>
                      <li>Line dry in natural shade to preserve vibrant tones</li>
                      <li>Iron at low-to-medium setting with press cloth</li>
                      <li>Do not tumble dry on high heat</li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs text-muted leading-relaxed">
                <p><strong className="text-ink">Shipping:</strong> Standard orders are dispatched within 24-48 hours. Express delivery arrives within 3-5 business days across India.</p>
                <p><strong className="text-ink">Returns & Exchanges:</strong> 30-day effortless returns. Simply log in to your account and initiate a courier pickup at your convenience.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews
                productId={product.id}
                onReviewAdded={async () => {
                  const updated = await mockProductService.getProductById(product.id);
                  if (updated) setProduct(updated);
                }}
              />
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-hairline pt-16">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
