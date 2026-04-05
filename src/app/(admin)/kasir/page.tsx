"use client";

import React, { useState } from "react";
import { useStock } from "@/hooks/useStock";
import { useNotification } from "@/context/NotificationContext";
import KasirProductSearch from "@/components/kasir/KasirProductSearch";
import KasirCart from "@/components/kasir/KasirCart";
import KasirCheckout from "@/components/kasir/KasirCheckout";
import RecentKasirTransactions from "@/components/kasir/RecentKasirTransactions";
import { KasirCartItem, KasirSource } from "@/types";
import { processKasirTransaction, getRecentKasirTransactions } from "@/actions/stock";

export default function Kasir() {
  const { products, stockLogs, refreshData } = useStock();
  const { notify } = useNotification();
  const [cart, setCart] = useState<KasirCartItem[]>([]);
  const [processing, setProcessing] = useState(false);

  // Add product to cart
  const handleAddToCart = (product: any, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    notify("success", `${product.name} ditambahkan ke keranjang`);
  };

  // Update cart item quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Process checkout
  const handleCheckout = async (
    source: KasirSource,
    referenceNumber: string,
    notes: string
  ) => {
    if (cart.length === 0) {
      notify("error", "Keranjang kosong");
      return;
    }

    setProcessing(true);

    try {
      const result = await processKasirTransaction({
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        source,
        referenceNumber,
        notes,
      });

      if (result.success) {
        notify("success", "Transaksi berhasil diproses");
        setCart([]);
        await refreshData();
      } else {
        notify("error", result.error || "Gagal memproses transaksi");
      }
    } catch (error) {
      notify("error", "Terjadi kesalahan saat memproses transaksi");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  // Get only OUT transactions for kasir history
  const kasirTransactions = stockLogs.filter((log) => log.type === "OUT");

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Kasir
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Catat pengambilan barang dan penjualan dari Shopee/Website
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left Column - Search & Recent Transactions */}
        <div className="space-y-6">
          {/* Product Search */}
          <KasirProductSearch
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
          />

          {/* Recent Transactions */}
          <RecentKasirTransactions
            transactions={kasirTransactions}
            products={products}
          />
        </div>

        {/* Right Column - Cart & Checkout */}
        <div className="space-y-6">
          {/* Cart */}
          <KasirCart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />

          {/* Checkout */}
          <KasirCheckout
            cart={cart}
            onCheckout={handleCheckout}
            processing={processing}
          />
        </div>
      </div>
    </>
  );
}
