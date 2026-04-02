'use server';

import { prisma } from '@/lib/prisma';
import { StockType, StockLog } from '@/types';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export interface StockUpdateInput {
  type: StockType;
  quantity: number;
  supplier?: string;
  note?: string;
}

export async function updateStock(
  productId: string,
  input: StockUpdateInput
): Promise<{ success: boolean; log?: StockLog; error?: string }> {
  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get current product
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      let newStock = product.stock;
      let actualQuantity = input.quantity;

      switch (input.type) {
        case 'IN':
          newStock = product.stock + input.quantity;
          break;
        case 'OUT':
          if (input.quantity > product.stock) {
            throw new Error('Insufficient stock');
          }
          newStock = product.stock - input.quantity;
          break;
        case 'ADJUST':
          newStock = Math.max(0, product.stock + input.quantity);
          actualQuantity = newStock - product.stock;
          break;
      }

      // Update product stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      // Create stock log entry
      const stockLog = await tx.stockLog.create({
        data: {
          productId,
          type: input.type,
          quantity: actualQuantity,
          prevStock: product.stock,
          nextStock: newStock,
          supplier: input.supplier,
          note: input.note,
        },
      });

      return { product: updatedProduct, log: stockLog };
    });

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    revalidatePath('/transactions');

    return { success: true, log: result.log };
  } catch (error) {
    console.error('Error updating stock:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update stock' };
  }
}

export async function getStockLogs(productId?: string): Promise<StockLog[]> {
  try {
    const where = productId ? { productId } : {};
    const logs = await prisma.stockLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limit for performance
    });
    return logs;
  } catch (error) {
    console.error('Error fetching stock logs:', error);
    return [];
  }
}

export async function getProductLogs(productId: string): Promise<StockLog[]> {
  try {
    const logs = await prisma.stockLog.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    return logs;
  } catch (error) {
    console.error('Error fetching product logs:', error);
    return [];
  }
}
