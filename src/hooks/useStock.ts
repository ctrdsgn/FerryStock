"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getProducts, createProduct as createProductAction, updateProduct as updateProductAction } from "@/actions/products";
import { updateStock as updateStockAction, getStockLogs } from "@/actions/stock";
import { getDashboardStats } from "@/actions/dashboard";
import { Product, StockLog, StockType } from "@/types";
import { useNotification } from "@/context/NotificationContext";

export interface StockUpdate {
  type: StockType;
  quantity: number;
  supplier?: string;
  note?: string;
}

export function useStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);
  const { notify } = useNotification();

  // Initial data fetch
  const fetchData = useCallback(async () => {
    try {
      const [productsData, logsData] = await Promise.all([
        getProducts(),
        getStockLogs(),
      ]);
      setProducts(productsData);
      setStockLogs(logsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!initialized.current) {
      fetchData();
      initialized.current = true;
    }
  }, [fetchData]);

  // Real-time subscription for products (disabled for development)
  useEffect(() => {
    // Realtime subscriptions require proper Supabase Realtime setup
    // Uncomment when needed:
    /*
    const productsChannel = supabase
      .channel('products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Product',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [payload.new as Product, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev =>
              prev.map(p => p.id === (payload.new as Product).id ? payload.new as Product : p)
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== (payload.old as Product).id));
          }
        }
      )
      .subscribe();

    const logsChannel = supabase
      .channel('stocklogs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'StockLog',
        },
        (payload) => {
          setStockLogs(prev => [payload.new as StockLog, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(logsChannel);
    };
    */
  }, []);

  // Calculate total stock value
  const totalStockValue = products.reduce(
    (sum, product) => sum + Number(product.price) * product.stock,
    0
  );

  // Calculate total SKUs
  const totalSKUs = products.length;

  // Calculate critically low items (stock <= minStock)
  const criticallyLowItems = products.filter(
    (product) => product.stock <= product.minStock
  ).length;

  // Get low stock products
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock
  );

  // Update stock with transaction
  const updateStock = useCallback(
    async (productId: string, update: StockUpdate) => {
      const result = await updateStockAction(productId, update);
      if (!result.success) {
        notify("error", result.error || "Gagal update stok");
        throw new Error(result.error);
      }

      // Show notification based on stock type
      const product = products.find(p => p.id === productId);
      if (update.type === "IN") {
        const supplierText = update.supplier ? ` dari ${update.supplier}` : '';
        notify("success", `Stok masuk: ${update.quantity} unit ${product ? `untuk ${product.name}` : ''}${supplierText}`);
      } else if (update.type === "OUT") {
        notify("warning", `Stok keluar: ${update.quantity} unit ${product ? `dari ${product.name}` : ""}`);
      } else {
        notify("info", `Stok disesuaikan: ${update.quantity} unit ${product ? `untuk ${product.name}` : ""}`);
      }

      return result;
    },
    [products, notify]
  );

  // Add new product
  const addProduct = useCallback(
    async (product: {
      sku: string;
      name: string;
      description?: string | null;
      price: number;
      stock: number;
      minStock: number;
      category?: string | null;
      imageUrl?: string | null;
    }) => {
      const result = await createProductAction({
        sku: product.sku,
        name: product.name,
        description: product.description ?? undefined,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        category: product.category ?? undefined,
        imageUrl: product.imageUrl ?? undefined,
      });

      if (!result.success) {
        notify("error", result.error || "Gagal menambah produk");
        throw new Error(result.error);
      }
      
      notify("success", `Produk "${product.name}" berhasil ditambahkan`);
      return result.product;
    },
    [notify]
  );

  // Edit product
  const editProduct = useCallback(
    async (id: string, data: Partial<Product>) => {
      const result = await updateProductAction(id, {
        sku: data.sku,
        name: data.name,
        description: data.description ?? undefined,
        price: data.price != null ? Number(data.price) : undefined,
        minStock: data.minStock,
        category: data.category ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
      });

      if (!result.success) {
        notify("error", result.error || "Gagal update produk");
        throw new Error(result.error);
      }
      
      notify("success", `Produk "${data.name || id}" berhasil diupdate`);
      return result.product;
    },
    [notify]
  );

  // Get product by ID
  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  // Get stock logs for a product
  const getProductLogs = useCallback(
    (productId: string) => {
      return stockLogs.filter((log) => log.productId === productId);
    },
    [stockLogs]
  );

  return {
    products,
    stockLogs,
    loading,
    error,
    totalStockValue,
    totalSKUs,
    criticallyLowItems,
    lowStockProducts,
    updateStock,
    addProduct,
    editProduct,
    getProductById,
    getProductLogs,
    refreshData: fetchData,
  };
}
