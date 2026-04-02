"use client";

import React from "react";
import { useStock } from "@/hooks/useStock";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function StockValueChart() {
  const { products } = useStock();

  // Calculate stock value by category
  const categoryData = React.useMemo(() => {
    const categories = new Map<
      string,
      { value: number; stock: number; products: number }
    >();

    products.forEach((product) => {
      const category = product.category || "Lainnya";
      const existing = categories.get(category) || {
        value: 0,
        stock: 0,
        products: 0,
      };

      existing.value += Number(product.price) * product.stock;
      existing.stock += product.stock;
      existing.products += 1;

      categories.set(category, existing);
    });

    return Array.from(categories.entries())
      .map(([name, data]) => ({
        name,
        value: data.value,
        stock: data.stock,
        products: data.products,
      }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  const maxValue = Math.max(...categoryData.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Nilai Stok per Kategori
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Distribusi nilai inventory berdasarkan kategori
        </p>
      </div>

      {categoryData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          Belum ada data produk
        </div>
      ) : (
        <div className="space-y-4">
          {categoryData.map((category, index) => (
            <div key={category.name} className="group">
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-3 w-3 rounded-full ${
                      index === 0
                        ? "bg-brand-500"
                        : index === 1
                        ? "bg-success-500"
                        : index === 2
                        ? "bg-warning-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {formatRupiah(category.value)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {category.stock} unit • {category.products} produk
                  </div>
                </div>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                    index === 0
                      ? "bg-gradient-to-r from-brand-500 to-brand-400"
                      : index === 1
                      ? "bg-gradient-to-r from-success-500 to-success-400"
                      : index === 2
                      ? "bg-gradient-to-r from-warning-500 to-warning-400"
                      : "bg-gradient-to-r from-gray-400 to-gray-300"
                  }`}
                  style={{
                    width: `${(category.value / maxValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Kategori
          </div>
          <div className="mt-1 text-xl font-bold text-gray-800 dark:text-white">
            {categoryData.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Produk
          </div>
          <div className="mt-1 text-xl font-bold text-gray-800 dark:text-white">
            {products.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Nilai
          </div>
          <div className="mt-1 text-sm font-bold text-brand-500">
            {formatRupiah(categoryData.reduce((sum, d) => sum + d.value, 0))}
          </div>
        </div>
      </div>
    </div>
  );
}
