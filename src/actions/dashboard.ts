'use server';

import { prisma } from '@/lib/prisma';
import { DashboardStats, Product } from '@/types';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const products = await prisma.product.findMany();

    // Calculate total stock value
    const totalStockValue = products.reduce(
      (sum: number, product: Product) => sum + Number(product.price) * product.stock,
      0
    );

    // Calculate total SKUs
    const totalSKUs = products.length;

    // Get critically low items (stock <= minStock)
    const criticallyLowItems = products.filter(
      (p: Product) => p.stock <= p.minStock
    ).length;

    // Get low stock products
    const lowStockProducts = products.filter(
      (p: Product) => p.stock <= p.minStock
    );

    return {
      totalStockValue,
      totalSKUs,
      criticallyLowItems,
      lowStockProducts,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalStockValue: 0,
      totalSKUs: 0,
      criticallyLowItems: 0,
      lowStockProducts: [],
    };
  }
}

export async function getLowStockProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.minStock,
        },
      },
      orderBy: { stock: 'asc' },
    });
    return products;
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
}
