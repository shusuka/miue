
export interface Review {
  id: number;
  name: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RequestConfig {
  id: number;
  product: string;
  discord: string;
  orderId: string;
  status: 'pending' | 'completed';
}

export interface ProductStyle {
  bgUrl?: string;
  iconUrl?: string;
  gradient?: string;
  // New customization fields
  bgSize?: string;     // 'cover', 'contain', '100%'
  bgPosition?: string; // 'center', 'top', 'bottom', etc.
  iconScale?: number;  // Scale factor (e.g. 1.0, 1.5)
}

export interface LinkOverride {
  crypto?: string;
  fiat?: string;
  fiatWorld?: string;
  fiatRegion?: string;
}

export interface AppConfig {
  whatsappNumber: string;
  discordLink: string;
  youtubeLink: string;
  facebookLink: string;
  reviews: Review[];
  requests: RequestConfig[];
  productStyles: Record<string, ProductStyle>;
  overrides: Record<string, LinkOverride>;
  adminAuth: {
      username: string;
      password: string; // In a real app, hash this
  };
}

export enum PaymentMethodType {
  CRYPTO = 'crypto',
  FIAT = 'fiat',
  FIAT_WORLD = 'fiat-world',
  FIAT_REGION = 'fiat-region'
}
