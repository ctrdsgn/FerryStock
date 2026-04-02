'use server';

import { prisma } from '@/lib/prisma';
import { CreateProductInput, Product } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { sku },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product by SKU:', error);
    return null;
  }
}

export async function createProduct(input: CreateProductInput): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    // Check if SKU already exists
    const existing = await getProductBySku(input.sku);
    if (existing) {
      return { success: false, error: 'SKU already exists' };
    }

    const product = await prisma.product.create({
      data: {
        sku: input.sku,
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.stock ?? 0,
        minStock: input.minStock ?? 5,
        category: input.category ?? 'General',
        imageUrl: input.imageUrl,
      },
    });

    // Create initial stock log if stock > 0
    if (product.stock > 0) {
      await prisma.stockLog.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: product.stock,
          prevStock: 0,
          nextStock: product.stock,
          note: 'Initial stock',
        },
      });
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');

    return { success: true, product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductInput>
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    // Check if new SKU already exists (if SKU is being changed)
    if (data.sku) {
      const existing = await prisma.product.findUnique({
        where: { sku: data.sku },
      });
      if (existing && existing.id !== id) {
        return { success: false, error: 'SKU already exists' };
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    revalidatePath('/inventory');
    revalidatePath('/dashboard');

    return { success: true, product };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/inventory');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}
