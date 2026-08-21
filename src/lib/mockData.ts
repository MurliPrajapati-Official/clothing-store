import { Product, Review, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Men - Oversized Heavyweight Tee
  {
    id: 'p1',
    name: 'Oversized Heavyweight Cotton Tee',
    slug: 'oversized-heavyweight-cotton-tee',
    price: 1299,
    originalPrice: 1799,
    description: 'Crafted from 280 GSM premium organic combed cotton. Features a relaxed drop-shoulder silhouette, thick ribbed collar, and durable double-needle stitching.',
    category: 'Men',
    subCategory: 'Tops & Shirts',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Vintage Black', hex: '#1C1C1E' },
      { name: 'Warm Cream', hex: '#F3EFE0' },
      { name: 'Sage Olive', hex: '#6B7A66' },
      { name: 'Earth Clay', hex: '#A36852' }
    ],
    gender: 'men',
    inStock: true,
    stockCount: 45,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    materials: '100% Ring-Spun Organic Cotton (280 GSM)',
    fit: 'Relaxed / Oversized Silhouette',
    care: ['Machine wash cold inside out', 'Tumble dry low', 'Do not iron on prints', 'Do not bleach'],
    specifications: {
      'Fabric Weight': '280 GSM Heavyweight',
      'Origin': 'Ethically sourced & crafted in India',
      'Collar': '1.25" High-density ribbed crew collar',
      'Pre-shrunk': 'Yes, pre-washed for zero shrinkage'
    },
    tags: ['Streetwear', 'Essentials', 'Heavyweight', 'Summer']
  },

  // 2. Women - Tailored Wool Trench Coat
  {
    id: 'p2',
    name: 'Minimalist Structured Trench Coat',
    slug: 'minimalist-structured-trench-coat',
    price: 4999,
    originalPrice: 6999,
    description: 'An architectural outerwear masterpiece featuring clean lines, notched lapels, storm flap detail, and an adjustable belted waist for a timeless silhouette.',
    category: 'Women',
    subCategory: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel Tan', hex: '#C29B38' },
      { name: 'Slate Charcoal', hex: '#333333' },
      { name: 'Oatmeal Beige', hex: '#E6DEC9' }
    ],
    gender: 'women',
    inStock: true,
    stockCount: 22,
    rating: 4.8,
    reviewsCount: 84,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    materials: '70% Wool, 30% Recycled Poly Blend with Satin Lining',
    fit: 'Tailored relaxed coat with removable belt',
    care: ['Dry clean only', 'Store on structured wooden hanger', 'Steam on low setting'],
    specifications: {
      'Closure': 'Double-breasted horn button closure',
      'Pockets': 'Two deep front welt pockets, one interior chest pocket',
      'Lining': 'Smooth silky viscose interior'
    },
    tags: ['Outerwear', 'Winter', 'Tailoring', 'Luxury']
  },

  // 3. Men - Tailored Italian Wool Blazer
  {
    id: 'p3',
    name: 'Modern Executive Wool Blazer',
    slug: 'modern-executive-wool-blazer',
    price: 5499,
    originalPrice: 7200,
    description: 'Impeccably tailored unstructured blazer. Balances sharp professional aesthetics with lightweight unlined breathability and subtle natural stretch.',
    category: 'Men',
    subCategory: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Midnight Navy', hex: '#192841' },
      { name: 'Dark Ash Grey', hex: '#4A4A4A' },
      { name: 'Espresso Brown', hex: '#3B2F2F' }
    ],
    gender: 'men',
    inStock: true,
    stockCount: 18,
    rating: 4.9,
    reviewsCount: 65,
    isFeatured: true,
    isBestSeller: true,
    materials: 'Fine Virgin Wool blend with natural crease-resistance',
    fit: 'Modern Slim-Straight Fit',
    care: ['Dry clean only', 'Do not machine wash', 'Cool iron with press cloth'],
    specifications: {
      'Vents': 'Dual back vent for freedom of movement',
      'Lapel': '3.25" Classic Notch Lapel with lapel buttonhole',
      'Cuffs': 'Functional four-button surgeon cuffs'
    },
    tags: ['Formal', 'Blazers', 'Business', 'Tailored']
  },

  // 4. Women - Silk Touch Bias Cut Slip Dress
  {
    id: 'p4',
    name: 'Satin Silk Bias-Cut Midi Dress',
    slug: 'satin-silk-bias-cut-midi-dress',
    price: 2799,
    originalPrice: 3899,
    description: 'An effortlessly fluid midi dress cut on the bias to drape gracefully around every curve. Featuring adjustable delicate straps and a soft cowl neckline.',
    category: 'Women',
    subCategory: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Forest', hex: '#124E3F' },
      { name: 'Champagne Gold', hex: '#EED9A4' },
      { name: 'Midnight Noir', hex: '#111111' },
      { name: 'Wine Burgundy', hex: '#581825' }
    ],
    gender: 'women',
    inStock: true,
    stockCount: 30,
    rating: 4.9,
    reviewsCount: 92,
    isFeatured: true,
    isNewArrival: true,
    materials: 'High-grade Mulberry Satin (Silky touch, breathable non-static)',
    fit: 'Fluid bias drape hugging natural contours',
    care: ['Gentle hand wash cold or delicate cycle in wash bag', 'Line dry in shade'],
    specifications: {
      'Length': 'Midi length (approx 48" from shoulder)',
      'Neckline': 'Soft cowl front with low back detail'
    },
    tags: ['Dresses', 'Evening', 'Occasion', 'Silk']
  },

  // 5. Unisex - Heavyweight Fleece Boxy Hoodie
  {
    id: 'p5',
    name: 'Essential 450 GSM Heavyweight Hoodie',
    slug: 'essential-450-gsm-heavyweight-hoodie',
    price: 2499,
    originalPrice: 3499,
    description: 'The definitive streetwear hoodie. Constructed from dense 450 GSM French terry cotton fleece. Double-layered hood without eyelets for a clean, sculptural drape.',
    category: 'Streetwear',
    subCategory: 'Knitwear',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Heather Grey', hex: '#9E9E9E' },
      { name: 'Pitch Black', hex: '#151515' },
      { name: 'Washed Brown', hex: '#4A3B32' },
      { name: 'Forest Green', hex: '#2A4436' }
    ],
    gender: 'unisex',
    inStock: true,
    stockCount: 50,
    rating: 5.0,
    reviewsCount: 174,
    isFeatured: true,
    isBestSeller: true,
    materials: '100% Heavy Combed Cotton French Terry (450 GSM)',
    fit: 'Boxy drop-shoulder modern streetwear fit',
    care: ['Machine wash cold with like colors', 'Lay flat to dry', 'Do not tumble dry high'],
    specifications: {
      'Hood': 'Double-layer seamless construction',
      'Pockets': 'Seamless kangaroo pouch',
      'Ribbing': '2x2 Heavy Spandex Rib Cuffs & Hem'
    },
    tags: ['Streetwear', 'Hoodie', 'Unisex', 'Fleece']
  },

  // 6. Men - Relaxed Linen Resort Shirt
  {
    id: 'p6',
    name: 'Pure French Linen Resort Shirt',
    slug: 'pure-french-linen-resort-shirt',
    price: 1899,
    originalPrice: 2499,
    description: 'Woven from 100% natural European flax linen. Softened through garment washing for immediate broken-in comfort, breezy summer ventilation, and relaxed Cuban collar.',
    category: 'Men',
    subCategory: 'Tops & Shirts',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Sky Chambray', hex: '#8BA9C4' },
      { name: 'Olive Green', hex: '#5A6B53' },
      { name: 'Terracotta', hex: '#B85D43' }
    ],
    gender: 'men',
    inStock: true,
    stockCount: 35,
    rating: 4.7,
    reviewsCount: 56,
    isFeatured: false,
    isNewArrival: true,
    materials: '100% Pure Flax Linen (Pre-washed)',
    fit: 'Relaxed Camp Collar Fit',
    care: ['Machine wash gentle cold', 'Hang dry', 'Steam while slightly damp'],
    specifications: {
      'Buttons': 'Genuine Mother-of-Pearl buttons',
      'Collar': 'Convertible Cuban / Camp Collar'
    },
    tags: ['Summer', 'Linen', 'Vacation', 'Shirts']
  },

  // 7. Women - High-Waist Pleated Wide-Leg Trousers
  {
    id: 'p7',
    name: 'Pleated High-Rise Wide-Leg Trousers',
    slug: 'pleated-high-rise-wide-leg-trousers',
    price: 2199,
    originalPrice: 2999,
    description: 'Elegantly structured trousers featuring sharp front double pleats, comfortable high waist, side slash pockets, and a fluid cascading wide-leg silhouette.',
    category: 'Women',
    subCategory: 'Bottoms & Pants',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Off-White Ivory', hex: '#F7F6F2' },
      { name: 'Charcoal Black', hex: '#1E1E1E' },
      { name: 'Mocha Beige', hex: '#9E8B76' }
    ],
    gender: 'women',
    inStock: true,
    stockCount: 28,
    rating: 4.8,
    reviewsCount: 79,
    isFeatured: true,
    isBestSeller: true,
    materials: 'Flowy Viscose Poly Crepe with stretch inner waistband',
    fit: 'High-Rise Wide-Leg Cut',
    care: ['Gentle machine wash or dry clean', 'Low iron'],
    specifications: {
      'Rise': '12.5" High Rise',
      'Inseam': '32" full-length break'
    },
    tags: ['Tailored', 'Workwear', 'Trousers', 'Chic']
  },

  // 8. Unisex - Relaxed Carpenter Utility Pants
  {
    id: 'p8',
    name: 'Heavy Twill Carpenter Utility Pants',
    slug: 'heavy-twill-carpenter-utility-pants',
    price: 2299,
    originalPrice: 3199,
    description: 'Rugged yet refined utility trousers cut from durable 12oz cotton duck canvas. Equipped with hammer loop, utility side pockets, and triple-stitched seams.',
    category: 'Streetwear',
    subCategory: 'Bottoms & Pants',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Washed Khaki', hex: '#C2B280' },
      { name: 'Washed Black', hex: '#262626' },
      { name: 'Forest Olive', hex: '#4B5320' }
    ],
    gender: 'unisex',
    inStock: true,
    stockCount: 40,
    rating: 4.9,
    reviewsCount: 110,
    isFeatured: false,
    isBestSeller: true,
    materials: '100% Heavy Cotton Duck Canvas (12 oz)',
    fit: 'Relaxed Straight Leg with slight taper',
    care: ['Machine wash warm', 'Tumble dry medium'],
    specifications: {
      'Hardware': 'YKK brass zipper and heavy-duty rivets',
      'Reinforcement': 'Double-layer knee panels'
    },
    tags: ['Workwear', 'Streetwear', 'Pants', 'Utility']
  },

  // 9. Women - Cashmere Touch Knit Cardigan
  {
    id: 'p9',
    name: 'Chunky Ribbed Knit Cardigan',
    slug: 'chunky-ribbed-knit-cardigan',
    price: 2699,
    originalPrice: 3599,
    description: 'An ultra-soft chunky cardigan featuring an oversized horn-button front, deep V-neck, and relaxed balloon sleeves. Perfect for effortless layering year-round.',
    category: 'Women',
    subCategory: 'Knitwear',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream Butter', hex: '#FFF8DC' },
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Cocoa Brown', hex: '#5C4033' }
    ],
    gender: 'women',
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    reviewsCount: 68,
    isFeatured: false,
    isNewArrival: true,
    materials: '50% Merino Wool, 30% Cotton, 20% Soft Acrylic',
    fit: 'Slouchy Relaxed Fit',
    care: ['Hand wash cold flat dry', 'Do not wring'],
    specifications: {
      'Knit Gauge': '5 Gauge Chunky Fisherman Rib',
      'Buttons': 'Faux tortoiseshell buttons'
    },
    tags: ['Knitwear', 'Cozy', 'Autumn', 'Cardigans']
  },

  // 10. Men - Vintage Washed Denim Jacket
  {
    id: 'p10',
    name: 'Vintage Trucker Denim Jacket',
    slug: 'vintage-trucker-denim-jacket',
    price: 3299,
    originalPrice: 4499,
    description: 'A tribute to iconic 90s Americana. Crafted from authentic 14oz non-stretch rigid denim with authentic hand-sanded whiskering and matte silver shank buttons.',
    category: 'Men',
    subCategory: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Stonewash Indigo', hex: '#4169E1' },
      { name: 'Vintage Black', hex: '#2B2B2B' },
      { name: 'Bleach Light Blue', hex: '#A4C2E6' }
    ],
    gender: 'men',
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviewsCount: 88,
    isFeatured: true,
    materials: '100% Heavy Rigid Cotton Denim (14 oz)',
    fit: 'Classic Boxy Trucker Cut',
    care: ['Wash cold inside out sparingly', 'Line dry to preserve color'],
    specifications: {
      'Pockets': 'Two chest flap pockets, two interior welt pockets',
      'Waist': 'Adjustable side waist tabs'
    },
    tags: ['Denim', 'Jacket', 'Vintage', 'Men']
  },

  // 11. Activewear - Seamless Ribbed Workout Set
  {
    id: 'p11',
    name: 'Sculpt Seamless Ribbed Active Set',
    slug: 'sculpt-seamless-ribbed-active-set',
    price: 2199,
    originalPrice: 2899,
    description: 'Engineered for high-intensity movement and studio comfort. Includes moisture-wicking compressive sports bra and squat-proof high-waisted ribbed leggings.',
    category: 'Activewear',
    subCategory: 'Activewear',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Matte Onyx', hex: '#1E1E1E' },
      { name: 'Espresso', hex: '#4A3B32' },
      { name: 'Muted Sage', hex: '#8A9A86' }
    ],
    gender: 'women',
    inStock: true,
    stockCount: 38,
    rating: 4.9,
    reviewsCount: 142,
    isFeatured: false,
    isBestSeller: true,
    materials: '82% Micro-Nylon, 18% Spandex with 4-way stretch',
    fit: 'Second-skin compression fit with tummy control waistband',
    care: ['Machine wash cold gentle', 'Do not tumble dry'],
    specifications: {
      'Compression': 'Medium-High Support',
      'Technology': 'Quick-dry anti-chafing micro-knit'
    },
    tags: ['Activewear', 'Fitness', 'Yoga', 'Sets']
  },

  // 12. Accessories - Full-Grain Leather Minimalist Tote
  {
    id: 'p12',
    name: 'Italian Leather Minimalist Everyday Tote',
    slug: 'italian-leather-minimalist-everyday-tote',
    price: 3499,
    originalPrice: 4999,
    description: 'Handcrafted from vegetable-tanned full-grain leather. Accommodates up to a 15-inch laptop with interior organizer pockets and magnetic top closure.',
    category: 'Accessories',
    subCategory: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Cognac Saddle Brown', hex: '#8B4513' },
      { name: 'Matte Black', hex: '#1A1A1A' },
      { name: 'Olive Green', hex: '#4A5B43' }
    ],
    gender: 'unisex',
    inStock: true,
    stockCount: 15,
    rating: 5.0,
    reviewsCount: 47,
    isFeatured: true,
    materials: '100% Genuine Full-Grain Vegetable-Tanned Leather',
    fit: 'Dimensions: 16" W x 13" H x 5.5" D',
    care: ['Wipe clean with dry cloth', 'Condition with leather balm yearly'],
    specifications: {
      'Hardware': 'Brushed brass rivets and YKK inner zipper',
      'Laptop Sleeve': 'Padded compartment fits up to 15" MacBook'
    },
    tags: ['Bags', 'Leather', 'Accessories', 'Luxury']
  }
];

export const INITIAL_REVIEWS: Record<string, Review[]> = {
  p1: [
    {
      id: 'rev-1',
      product_id: 'p1',
      user_name: 'Aarav Patel',
      user_id: 'usr-1',
      rating: 5,
      comment: 'The collar structure is insane. I have washed it 4 times and it has not lost shape at all. 280 GSM feels super premium.',
      created_at: '2026-08-10T14:30:00Z',
      verifiedPurchase: true
    },
    {
      id: 'rev-2',
      product_id: 'p1',
      user_name: 'Karan Mehra',
      user_id: 'usr-2',
      rating: 5,
      comment: 'Best boxy oversized tee I own. The drop shoulder fits just right without looking sloppy.',
      created_at: '2026-08-14T09:15:00Z',
      verifiedPurchase: true
    },
    {
      id: 'rev-3',
      product_id: 'p1',
      user_name: 'Devika Singhania',
      user_id: 'usr-3',
      rating: 4,
      comment: 'Got size M for an oversized look. Fabric is thick and opaque, very pleased with the quality.',
      created_at: '2026-08-18T18:45:00Z',
      verifiedPurchase: true
    }
  ],
  p2: [
    {
      id: 'rev-4',
      product_id: 'p2',
      user_name: 'Ananya Roy',
      user_id: 'usr-4',
      rating: 5,
      comment: 'Looks straight out of an editorial lookbook. The drape of this coat is magnificent and keeps you wonderfully warm.',
      created_at: '2026-08-05T11:20:00Z',
      verifiedPurchase: true
    },
    {
      id: 'rev-5',
      product_id: 'p2',
      user_name: 'Pooja Iyer',
      user_id: 'usr-5',
      rating: 5,
      comment: 'The camel tone is breathtaking in person. Worth every rupee.',
      created_at: '2026-08-12T16:00:00Z',
      verifiedPurchase: true
    }
  ],
  p5: [
    {
      id: 'rev-6',
      product_id: 'p5',
      user_name: 'Rohan Gupta',
      user_id: 'usr-6',
      rating: 5,
      comment: 'Heavyweight, zero drawstrings, clean double-layered hood. This is exactly what essential streetwear should be.',
      created_at: '2026-08-15T12:00:00Z',
      verifiedPurchase: true
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-849201',
    user_id: 'usr-demo-1',
    user_email: 'demo@clothingstore.com',
    total_amount: 3798,
    status: 'delivered',
    shipping_address: 'Rohit Sharma, Flat 402 Palm Heights, Worli, Mumbai, Maharashtra - 400018 (demo@clothingstore.com)',
    created_at: '2026-08-12T10:15:00Z',
    tracking_number: 'TRK-98127391IN',
    estimated_delivery: '2026-08-15',
    payment_method: 'UPI / Online Express',
    items: [
      {
        productId: 'p1',
        name: 'Oversized Heavyweight Cotton Tee',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        quantity: 1,
        price: 1299,
        size: 'L',
        color: 'Vintage Black'
      },
      {
        productId: 'p5',
        name: 'Essential 450 GSM Heavyweight Hoodie',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        quantity: 1,
        price: 2499,
        size: 'L',
        color: 'Heather Grey'
      }
    ]
  },
  {
    id: 'ORD-910244',
    user_id: 'usr-demo-1',
    user_email: 'demo@clothingstore.com',
    total_amount: 4999,
    status: 'processing',
    shipping_address: 'Rohit Sharma, Flat 402 Palm Heights, Worli, Mumbai, Maharashtra - 400018 (demo@clothingstore.com)',
    created_at: '2026-08-20T14:40:00Z',
    tracking_number: 'TRK-44910291IN',
    estimated_delivery: '2026-08-24',
    payment_method: 'Credit Card',
    items: [
      {
        productId: 'p2',
        name: 'Minimalist Structured Trench Coat',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
        quantity: 1,
        price: 4999,
        size: 'M',
        color: 'Camel Tan'
      }
    ]
  }
];
