"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types";
import { KasirCartItem } from "@/types";

interface KasirProductSearchProps {
  products: Product[];
  cart: KasirCartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function KasirProductSearch({
  products,
  cart,
  onAddToCart,
}: KasirProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
    );
  }, [searchTerm, products]);

  const handleSelectProduct = (product: Product) => {
    onAddToCart(product, 1);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const getCartQuantity = (productId: string) => {
    const cartItem = cart.find((item) => item.product.id === productId);
    return cartItem?.quantity || 0;
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Cari Produk (SKU atau Nama)
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            // Delay hiding dropdown to allow click events
            setTimeout(() => setShowDropdown(false), 200);
          }}
          placeholder="Ketik SKU atau nama produk..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      {/* Dropdown */}
      {showDropdown && searchTerm.trim() && (
        <div className="absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {filteredProducts.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Tidak ada produk ditemukan
            </div>
          ) : (
            <div className="p-2">
              {filteredProducts.map((product) => {
                const inCart = getCartQuantity(product.id);
                const isLowStock = product.stock <= product.minStock;
                const isOutOfStock = product.stock === 0;

                return (
                  <button
                    key={product.id}
                    onClick={() => !isOutOfStock && handleSelectProduct(product)}
                    disabled={isOutOfStock}
                    className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${
                      isOutOfStock
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 dark:text-white/90">
                            {product.name}
                          </span>
                          {inCart > 0 && (
                            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-500 dark:bg-brand-500/15">
                              {inCart} di keranjang
                            </span>
                          )}
                        </div>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          SKU: {product.sku}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`block text-sm font-semibold ${
                            isOutOfStock
                              ? "text-error-500"
                              : isLowStock
                              ? "text-warning-500"
                              : "text-success-500"
                          }`}
                        >
                          Stok: {product.stock}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          Rp {Number(product.price).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
