import type { Category } from "./categories";
export type { Category };
export { categories } from "./categories";

export type Product = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  featured?: boolean;
  outOfStock?: boolean;
  inventory?: number;
};

export const products: Product[] = [
  {
    id: 1290,
    slug: "black-pashmina-shawl-silver-tilla",
    title: "Black Pashmina Shawl",
    subtitle: "Hand Embroidered in Silver Tilla",
    description:
      "A timeless black Pashmina shawl adorned with exquisite hand-embroidered silver Tilla work. Each thread is meticulously placed by skilled Kashmiri artisans. Size: 40×80 inches. Material: Premium Pashmina with silver Tilla.",
    price: 35999,
    image: "/images/products/6.jpg",
    category: "pashmina-shawls",
    featured: true,
  },
  {
    id: 1296,
    slug: "double-dye-maroon-pashmina-shawl",
    title: "Double Dye Maroon Pashmina Shawl",
    subtitle: "Black Palla, Golden Tilla Embroidery",
    description:
      "A stunning double-dyed maroon Pashmina shawl featuring a rich black palla and hand Tilla embroidery in golden thread. Size: 40×80 inches. Material: 100% Authentic Pashmina with Tilla work.",
    price: 25499,
    image: "/images/products/16.jpg",
    category: "pashmina-shawls",
    featured: true,
  },
  {
    id: 1299,
    slug: "pashmina-patch-work-shawl-sozni",
    title: "Pashmina Patch Work Shawl",
    subtitle: "Hand Embroidered in Sozni Work",
    description:
      "An extraordinary Pashmina shawl featuring intricate patch work with delicate hand-embroidered Sozni work. A true collector's piece from Kashmir. Size: 40×80 inches. Material: 100% Authentic Pashmina with Sozni embroidery.",
    price: 37999,
    image: "/images/products/13.jpg",
    category: "pashmina-shawls",
    featured: true,
  },
  {
    id: 1304,
    slug: "pink-pashmina-shawl-tilla",
    title: "Pink Pashmina Shawl",
    subtitle: "Hand Embroidered in Tilla Work",
    description:
      "A delicate pink Pashmina shawl beautifully adorned with hand-embroidered Tilla work. The soft pink hue combined with golden Tilla embroidery creates an enchanting piece. Size: 40×80 inches. Material: 100% Authentic Pashmina with Tilla.",
    price: 25499,
    image: "/images/products/35.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1307,
    slug: "pashmina-shawl-tilla-craft",
    title: "Pashmina Shawl",
    subtitle: "Hand Embroidered in Tilla Craft",
    description:
      "A magnificent Pashmina shawl showcasing the finest Tilla embroidery craft of Kashmir. Each motif is hand-stitched with precision and care by master craftsmen. Size: 40×80 inches. Material: 100% Authentic Pashmina with Tilla.",
    price: 33999,
    image: "/images/products/31.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1310,
    slug: "golden-threads-maroon-pashmina",
    title: "Golden Threads Maroon Pashmina",
    subtitle: "Romancing with Maroon Base",
    description:
      "Golden threads dancing on a rich maroon base — this woollen shawl is a celebration of Kashmir's textile heritage. The intricate golden weave creates a mesmerizing pattern. Size: 40×80 inches. Material: 100% Authentic Woollen.",
    price: 22999,
    image: "/images/products/24.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1336,
    slug: "fine-marino-wool-white-shawl",
    title: "Fine Marino Wool White Shawl",
    subtitle: "Sozni & Tilla Hand Embroidery",
    description:
      "A pristine white Marino wool shawl featuring the rare combination of both Sozni and Tilla embroidery crafts. The white canvas beautifully showcases intricate Kashmir needlework.",
    price: 9199,
    image: "/images/products/whatsapp-shawl.jpeg",
    category: "pashmina-shawls",
  },
  {
    id: 1346,
    slug: "pashmina-shawl-tilla-craft-ii",
    title: "Pashmina Shawl in Tilla Craft",
    subtitle: "Master Artisan Hand Embroidery",
    description:
      "A premium Pashmina shawl featuring elaborate hand-embroidered Tilla craft. This piece represents the pinnacle of Kashmiri artisanal skill passed down through generations.",
    price: 33999,
    image: "/images/products/41.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1357,
    slug: "pashmina-shawl-sozni-craft",
    title: "Pashmina Shawl",
    subtitle: "Hand Embroidered in Sozni Craft",
    description:
      "An exquisite Pashmina shawl adorned with intricate Sozni embroidery — Kashmir's most delicate needlework tradition. Ideal for special occasions and gifting.",
    price: 24999,
    image: "/images/products/37.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1358,
    slug: "fine-wool-shawl-tilla-craft",
    title: "Fine Wool Shawl",
    subtitle: "Hand Embroidered in Tilla Craft",
    description:
      "A fine wool shawl with beautiful hand-embroidered Tilla craft. The lightweight wool base makes it ideal for year-round wear while the Tilla embroidery adds a touch of regal elegance.",
    price: 13999,
    image: "/images/products/45.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1370,
    slug: "mustard-pashmina-shawl-tilla",
    title: "Mustard Pashmina Shawl",
    subtitle: "Hand Embroidered in Tilla Craft",
    description:
      "A vibrant mustard Pashmina shawl with hand-embroidered Tilla work. The rich mustard hue is a signature of Kashmir's dyeing tradition, complemented beautifully by golden Tilla embroidery.",
    price: 24999,
    image: "/images/products/39.jpg",
    category: "pashmina-shawls",
    featured: true,
  },
  {
    id: 1451,
    slug: "silk-saree-kashmiri-tilla",
    title: "Silk Saree",
    subtitle: "Hand Embroidered in Kashmiri Tilla Craft",
    description:
      "An elegant silk saree adorned with the finest Kashmiri Tilla embroidery. The lustrous silk base catches the light beautifully, making the gold Tilla work shimmer with every movement.",
    price: 26000,
    image: "/images/products/blue-saree.jpg",
    category: "sarees",
    featured: true,
  },
  {
    id: 1457,
    slug: "marino-white-wrap",
    title: "Marino White Wrap",
    subtitle: "Marino Wool Hand Embroidered Tilla Shawl",
    description:
      "A soft and luxurious Marino wool wrap in pristine white with hand-embroidered Tilla work. Perfect for evening wear or as a sophisticated accessory for any occasion.",
    price: 12000,
    image: "/images/products/marino-white-wrap.jpg",
    category: "stoles-and-scarves",
  },
  {
    id: 1460,
    slug: "pink-paldar-blush",
    title: "Pink Paldar Blush",
    subtitle: "Blend Pashmina Sozni Stole",
    description:
      "A soft blush pink stole featuring MP Pallu worked in delicate Sozni embroidery. A blend pashmina piece that combines softness with intricate artistry.",
    price: 900,
    image: "/images/products/pink-paldar-blush.jpg",
    category: "stoles-and-scarves",
  },
  {
    id: 1468,
    slug: "emerald-green-tilla-shawl",
    title: "Emerald Green Tilla Shawl Wrap",
    subtitle: "Paldar Tilla Embroidery",
    description:
      "A striking emerald green shawl wrap featuring Paldar Tilla embroidery along the borders. The deep jewel tone of the base fabric creates a dramatic contrast with the golden Tilla work.",
    price: 18500,
    image: "/images/products/emerald-green-tilla.jpg",
    category: "stoles-and-scarves",
    featured: true,
  },
  {
    id: 1469,
    slug: "butidar-pashmina-shawl-wrap",
    title: "Butidar Pashmina Shawl Wrap",
    subtitle: "Royal Blue Pashmina",
    description:
      "A magnificent royal blue Butidar (all-over motif) Pashmina shawl wrap. The Butidar pattern features traditional Kashmiri motifs repeated in a field pattern across the entire shawl.",
    price: 23500,
    image: "/images/products/butidar-pashmina.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1472,
    slug: "sozni-print-jamavaar-pashmina",
    title: "Sozni Print Jamavaar Pashmina",
    subtitle: "Traditional Jamavaar Weave",
    description:
      "A treasured Jamavaar Pashmina featuring Sozni print embroidery. Jamavaar is one of the oldest and most prestigious weaving traditions of Kashmir, known for its intricate tapestry-like patterns.",
    price: 48500,
    image: "/images/products/sozni-jamavaar.jpg",
    category: "pashmina-shawls",
  },
  {
    id: 1489,
    slug: "pink-cashmere-wrap",
    title: "Pink Cashmere Wrap",
    subtitle: "Hand Embroidered Cashmere",
    description:
      "A delicately crafted pink cashmere wrap that is soft as a cloud. This lightweight yet warm piece features hand embroidery and is perfect for gifting or personal indulgence.",
    price: 4500,
    image: "/images/products/pink-cashmere-wrap.jpg",
    category: "stoles-and-scarves",
  },
  {
    id: 1492,
    slug: "paldar-sozni-pashmina",
    title: "Paldar Sozni Pashmina",
    subtitle: "Traditional Paldar Border Work",
    description:
      "An exquisite Pashmina shawl with Paldar (border) Sozni embroidery. The intricate hand-stitched borders frame the shawl beautifully, celebrating the heritage of Kashmiri needlework.",
    price: 24999,
    image: "/images/products/paldar-sozni-pashmina.jpg",
    category: "pashmina-shawls",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
