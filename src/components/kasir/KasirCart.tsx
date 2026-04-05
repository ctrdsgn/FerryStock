"use client";

import React from "react";
import { KasirCartItem } from "@/types";

interface KasirCartProps {
  cart: KasirCartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function KasirCart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: KasirCartProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="mb-4 text-gray-300 dark:text-gray-600"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Keranjang Kosong
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cari dan tambahkan produk ke keranjang
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-white/[0.05]">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Keranjang Kasir
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {cart.length} produk • {totalItems} total item
          </p>
        </div>
        <button
          onClick={onClearCart}
          className="rounded-lg border border-error-200 bg-error-50 px-4 py-2 text-sm font-medium text-error-600 transition-colors hover:bg-error-100 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400 dark:hover:bg-error-500/20"
        >
          Hapus Semua
        </button>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-auto">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {cart.map((item) => {
            const isExceedingStock =
              item.quantity > item.product.stock;
            const isLowStock =
              item.quantity > item.product.stock - item.product.minStock;

            return (
              <div
                key={item.product.id}
                className="px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800 dark:text-white/90">
                        {item.product.name}
                      </h4>
                      {isExceedingStock && (
                        <span className="rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-600 dark:bg-error-500/15 dark:text-error-400">
                          Melebihi Stok
                        </span>
                      )}
                      {!isExceedingStock && isLowStock && (
                        <span className="rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-600 dark:bg-warning-500/15 dark:text-orange-400">
                          Stok Menipis
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SKU: {item.product.sku} • Tersedia: {item.product.stock}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-error-500 dark:hover:bg-gray-700 dark:hover:text-error-400"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          onUpdateQuantity(item.product.id, val);
                        }
                      }}
                      className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          Math.min(item.product.stock, item.quantity + 1)
                        )
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Jumlah: {item.quantity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-white/[0.05] dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Item
          </span>
          <span className="text-lg font-bold text-gray-800 dark:text-white/90">
            {totalItems}
          </span>
        </div>
      </div>
    </div>
  );
}
