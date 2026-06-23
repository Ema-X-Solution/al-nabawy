export interface Product {
  slug: string
  category: 'milk' | 'cheese' | 'butter' | 'cream' | 'milkPowder' | 'ingredients'
  image: string
  nameKey: string
  descKey: string
  packaging: string
  weight: string
  shelfLife: string
  storage: string
  origin: string
}

export const products: Product[] = [
  {
    slug: 'uht-full-cream-milk',
    category: 'milk',
    image: '/images/cat_milk.png',
    nameKey: 'UHT Full Cream Milk',
    descKey: 'Premium full cream UHT milk with a rich, creamy taste. Long shelf life, no refrigeration needed until opened. Ideal for retail and food service.',
    packaging: '1L Tetra Pak, 250ml, 200ml',
    weight: '1L / 250ml / 200ml',
    shelfLife: '12 Months',
    storage: 'Ambient – Cool & Dry Place',
    origin: 'Egypt',
  },
  {
    slug: 'skimmed-milk-powder',
    category: 'milkPowder',
    image: '/images/cat_milk.png',
    nameKey: 'Skimmed Milk Powder',
    descKey: 'High-quality spray-dried skimmed milk powder. Ideal for food manufacturers, bakeries, and confectionery. Available in bulk export bags.',
    packaging: '25kg Paper Bag, 1kg Pouch',
    weight: '25kg / 1kg',
    shelfLife: '24 Months',
    storage: 'Cool & Dry Place, Below 25°C',
    origin: 'Egypt',
  },
  {
    slug: 'full-cream-milk-powder',
    category: 'milkPowder',
    image: '/images/cat_milk.png',
    nameKey: 'Full Cream Milk Powder',
    descKey: 'Premium full cream spray-dried milk powder from fresh cow\'s milk. Rich in protein and calcium. Available in wholesale export packaging.',
    packaging: '25kg Bag, 2kg Tin',
    weight: '25kg / 2kg',
    shelfLife: '24 Months',
    storage: 'Cool & Dry Place',
    origin: 'Egypt',
  },
  {
    slug: 'mozzarella-cheese',
    category: 'cheese',
    image: '/images/cat_cheese.png',
    nameKey: 'Mozzarella Cheese',
    descKey: 'Premium fresh mozzarella cheese with excellent melting properties. Perfect for pizza, pasta, and food service applications worldwide.',
    packaging: '2.5kg Block, 500g Portion',
    weight: '2.5kg / 500g',
    shelfLife: '45 Days',
    storage: '2°C – 6°C Refrigerated',
    origin: 'Egypt',
  },
  {
    slug: 'white-cheese',
    category: 'cheese',
    image: '/images/cat_cheese.png',
    nameKey: 'White Brine Cheese',
    descKey: 'Traditional white brine cheese with a firm texture and mild flavor. Popular across Middle Eastern markets. Available in tins and vacuum packs.',
    packaging: '15kg Tin, 500g Vacuum',
    weight: '15kg / 500g',
    shelfLife: '12 Months',
    storage: '2°C – 8°C Refrigerated',
    origin: 'Egypt',
  },
  {
    slug: 'cheddar-cheese',
    category: 'cheese',
    image: '/images/cat_cheese.png',
    nameKey: 'Cheddar Cheese',
    descKey: 'Rich, mature cheddar cheese with bold flavor. Available in blocks and slices. Suitable for retail, food service, and food manufacturing.',
    packaging: '5kg Block, 200g Slices',
    weight: '5kg / 200g',
    shelfLife: '6 Months',
    storage: '2°C – 6°C Refrigerated',
    origin: 'Egypt',
  },
  {
    slug: 'unsalted-butter',
    category: 'butter',
    image: '/images/cat_butter.png',
    nameKey: 'Unsalted Dairy Butter',
    descKey: 'Premium pure dairy butter with a rich, creamy flavor. Made from fresh pasteurized cream. Ideal for baking, cooking, and retail.',
    packaging: '25kg Block, 500g, 250g',
    weight: '25kg / 500g / 250g',
    shelfLife: '6 Months',
    storage: '-18°C Frozen',
    origin: 'Egypt',
  },
  {
    slug: 'heavy-cream',
    category: 'cream',
    image: '/images/cat_cream.png',
    nameKey: 'Heavy Whipping Cream',
    descKey: 'Rich heavy cream with 35%+ fat content. Perfect for whipping, cooking, and dessert applications in food service and manufacturing.',
    packaging: '1L Carton, 200ml',
    weight: '1L / 200ml',
    shelfLife: '4 Months (UHT)',
    storage: 'Ambient until opened, then refrigerate',
    origin: 'Egypt',
  },
  {
    slug: 'whey-powder',
    category: 'ingredients',
    image: '/images/cat_milk.png',
    nameKey: 'Sweet Whey Powder',
    descKey: 'High-quality spray-dried sweet whey powder. Rich in lactose and protein. Used in infant formula, bakery, confectionery and animal feed.',
    packaging: '25kg Paper Bag',
    weight: '25kg',
    shelfLife: '18 Months',
    storage: 'Cool & Dry Place, Below 25°C',
    origin: 'Egypt',
  },
]

export const categories = ['milk', 'cheese', 'butter', 'cream', 'milkPowder', 'ingredients'] as const
export type CategoryKey = (typeof categories)[number]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(cat: CategoryKey): Product[] {
  return products.filter((p) => p.category === cat)
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const product = getProductBySlug(slug)
  if (!product) return []
  return products.filter((p) => p.slug !== slug && p.category === product.category).slice(0, limit)
}
