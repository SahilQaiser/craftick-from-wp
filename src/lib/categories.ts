export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "pashmina-shawls",
    name: "Pashmina Shawls",
    description: "Luxurious hand-woven Pashmina shawls with intricate embroidery",
  },
  {
    slug: "stoles-and-scarves",
    name: "Stoles & Scarves",
    description: "Elegant wraps and stoles in fine wool and pashmina",
  },
  {
    slug: "sarees",
    name: "Sarees",
    description: "Silk and pashmina sarees with Kashmiri embroidery",
  },
];
