export type ProductCategory =
  | "T-Shirts"
  | "Tanks"
  | "Hoodies"
  | "Joggers"
  | "Shorts"
  | "Headwear"
  | "Bags & Accessories"
  | "Sweatshirts"
  | "Slides & Accessories"
  | "Performance"
  | "Accessories";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface BrandPillar {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "dumbbell" | "lion" | "mountain" | "crown";
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: BrandPillar["icon"];
}

export interface CollectionCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

export interface BrandCopy {
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  heroImage: string;
  essenceTitle: string;
  essenceText: string;
  aboutHeroTitle: string;
  aboutHeroText: string;
  founderSectionTitle: string;
  founderStory: string;
  founderName: string;
  founderRole: string;
  founderSignature: string;
  founderImage: string;
  midBannerLeft: string;
  midBannerRight: string;
  aboutTitle: string;
  aboutStory: string;
  aboutMission: string;
  collectionsTitle: string;
  collectionsSubheadline: string;
  collectionsHeroImage: string;
  contactTitle: string;
  contactSubheadline: string;
  contactHeroText: string;
  contactTagline: string;
  teamOrdersTitle: string;
  teamOrdersText: string;
  footerStatement: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface ThemeColors {
  gold: string;
  background: string;
  surface: string;
  surfaceLight: string;
}

export interface StoreSettings {
  brandCopy: BrandCopy;
  contact: ContactInfo;
  theme: ThemeColors;
  products: Product[];
  pillars: BrandPillar[];
  coreValues: CoreValue[];
  collections: CollectionCategory[];
}
