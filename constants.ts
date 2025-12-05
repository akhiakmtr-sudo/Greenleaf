import { Product } from './types';

// Helper to generate manufacturer
const DEFAULT_MANUFACTURER = {
  name: "Green Leaf Organics Pvt Ltd",
  contact: "+91 98765 43210",
  email: "support@greenleaf.com",
  address: "Plot 42, Herbal Industrial Estate, Kerala, India - 682001"
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vegan Protein Mix',
    price: 2499,
    category: 'Weightloss',
    images: [
      'https://picsum.photos/id/292/800/800',
      'https://picsum.photos/id/293/800/800',
      'https://picsum.photos/id/294/800/800',
      'https://picsum.photos/id/295/800/800',
      'https://picsum.photos/id/296/800/800'
    ],
    description: 'Start your day with plant-based power. Contains pea protein, flax seeds, and digestive enzymes to support healthy weight loss and muscle retention.',
    howToUse: 'Mix 1 scoop (30g) with 250ml water or almond milk. Shake well and consume immediately after workout or as breakfast.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Consult your dietician before use if you are pregnant or nursing.',
    rating: 4.8,
    reviews: 120
  },
  {
    id: '2',
    name: 'Pain Relief Balm',
    price: 399,
    category: 'Pain Relief',
    images: [
      'https://picsum.photos/id/514/800/800',
      'https://picsum.photos/id/515/800/800',
      'https://picsum.photos/id/516/800/800',
      'https://picsum.photos/id/517/800/800',
      'https://picsum.photos/id/518/800/800'
    ],
    description: 'Ancient ayurvedic formula using wintergreen oil and menthol for instant relief from joint pain, backache, and muscular sprains.',
    howToUse: 'Apply a small amount to the affected area and massage gently. Repeat 2-3 times a day.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'For external use only. Avoid contact with eyes.',
    rating: 4.9,
    reviews: 500
  },
  {
    id: '3',
    name: 'Herbal Hair Oil',
    price: 899,
    category: 'Haircare',
    images: [
      'https://picsum.photos/id/445/800/800',
      'https://picsum.photos/id/446/800/800',
      'https://picsum.photos/id/447/800/800',
      'https://picsum.photos/id/448/800/800',
      'https://picsum.photos/id/449/800/800'
    ],
    description: 'Infused with Bhringraj, Amla, and Hibiscus. Promotes hair growth, reduces hair fall, and prevents premature graying.',
    howToUse: 'Massage scalp with oil for 10-15 minutes. Leave it overnight or for at least 1 hour before washing.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Store in a cool, dry place away from sunlight.',
    rating: 4.7,
    reviews: 340
  },
  {
    id: '4',
    name: 'Glow Face Serum',
    price: 1299,
    category: 'Skincare',
    images: [
      'https://picsum.photos/id/64/800/800',
      'https://picsum.photos/id/65/800/800',
      'https://picsum.photos/id/66/800/800',
      'https://picsum.photos/id/67/800/800',
      'https://picsum.photos/id/68/800/800'
    ],
    description: 'Vitamin C rich serum for radiant, glowing skin. Reduces dark spots and pigmentation within 4 weeks of regular use.',
    howToUse: 'Apply 2-3 drops on clean face and neck. Gently pat into skin. Use morning and night.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Patch test recommended before first use.',
    rating: 4.6,
    reviews: 150
  },
  {
    id: '5',
    name: 'Slimming Tea',
    price: 599,
    category: 'Weightloss',
    images: [
      'https://picsum.photos/id/225/800/800',
      'https://picsum.photos/id/226/800/800',
      'https://picsum.photos/id/227/800/800',
      'https://picsum.photos/id/228/800/800',
      'https://picsum.photos/id/229/800/800'
    ],
    description: 'A metabolism-boosting blend of green tea, garcinia cambogia, and lemongrass. Helps burn fat and suppress appetite.',
    howToUse: 'Steep 1 teabag in hot water for 3-5 minutes. Drink 30 minutes before meals.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Contains caffeine.',
    rating: 4.5,
    reviews: 85
  },
  {
    id: '6',
    name: 'Bamboo Toothbrush',
    price: 150,
    category: 'Other',
    images: [
      'https://picsum.photos/id/431/800/800',
      'https://picsum.photos/id/432/800/800',
      'https://picsum.photos/id/433/800/800',
      'https://picsum.photos/id/434/800/800',
      'https://picsum.photos/id/435/800/800'
    ],
    description: 'Eco-friendly biodegradable toothbrush made from sustainably sourced bamboo. Charcoal infused bristles for whitening.',
    howToUse: 'Brush twice daily. Replace every 3 months.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Dry handle after use to prevent mold.',
    rating: 4.8,
    reviews: 98
  },
  {
    id: '7',
    name: 'Joint Support Caps',
    price: 1450,
    category: 'Pain Relief',
    images: [
      'https://picsum.photos/id/106/800/800',
      'https://picsum.photos/id/107/800/800',
      'https://picsum.photos/id/108/800/800',
      'https://picsum.photos/id/109/800/800',
      'https://picsum.photos/id/110/800/800'
    ],
    description: 'Glucosamine and Chondroitin supplements for improving joint flexibility and reducing inflammation.',
    howToUse: 'Take 1 capsule twice daily after meals.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Not suitable for shellfish allergies.',
    rating: 4.7,
    reviews: 180
  },
  {
    id: '8',
    name: 'Anti-Dandruff Shampoo',
    price: 450,
    category: 'Haircare',
    images: [
      'https://picsum.photos/id/312/800/800',
      'https://picsum.photos/id/313/800/800',
      'https://picsum.photos/id/314/800/800',
      'https://picsum.photos/id/315/800/800',
      'https://picsum.photos/id/316/800/800'
    ],
    description: 'Tea tree and neem based shampoo that effectively controls dandruff and soothes itchy scalp.',
    howToUse: 'Apply to wet hair, lather, and rinse thoroughly. Repeat if necessary.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Avoid contact with eyes.',
    rating: 4.4,
    reviews: 65
  }
];

export const APP_NAME = "Green Leaf Herbals";