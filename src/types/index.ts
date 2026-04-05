import { Product as PrismaProduct, StockLog as PrismaStockLog, StockType } from '@prisma/client';

export type Product = PrismaProduct;
export type StockLog = PrismaStockLog & { product?: Product };
export { StockType };

export interface StockUpdate {
  type: StockType;
  quantity: number;
  supplier?: string;
  note?: string;
}

export interface CreateProductInput {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  minStock?: number;
  category?: string;
  imageUrl?: string;
}

export interface DashboardStats {
  totalStockValue: number;
  totalSKUs: number;
  criticallyLowItems: number;
  lowStockProducts: Product[];
}

// Kasir (Cashier) types
export type KasirSource = 'INTERNAL' | 'SHOPEE' | 'WEBSITE' | 'OTHER';

export interface KasirCartItem {
  product: Product;
  quantity: number;
}

export interface KasirTransactionInput {
  items: {
    productId: string;
    quantity: number;
  }[];
  source: KasirSource;
  referenceNumber?: string;
  notes?: string;
}
