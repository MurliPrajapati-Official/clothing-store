import { School } from './types';

export const STORE_NAME = 'Clothing Store';
export const STORE_TAGLINE = 'Contemporary Everyday Wardrobe Essentials';

export const CATEGORIES = [
  'All',
  'Men',
  'Women',
  'Streetwear',
  'Outerwear',
  'Tops & Shirts',
  'Bottoms & Pants',
  'Dresses',
  'Knitwear',
  'Activewear',
  'Accessories'
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export const GENDERS = ['All', 'Men', 'Women', 'Unisex'];

// Compatibility interface
export const SCHOOLS: School[] = [
  {
    id: '1',
    name: 'Main Flagship Store',
    slug: 'flagship',
    logo: '/images/gen_school_logo.png',
    location: 'Mumbai, India',
    description: 'Premier retail collection and flagship showroom.',
  },
];
