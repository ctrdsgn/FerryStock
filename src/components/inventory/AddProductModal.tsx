"use client";

import React, { useState, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { useStock } from "@/hooks/useStock";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    sku: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    minStock: number;
    category: string;
  }) => Promise<void>;
}

const COMMON_CATEGORIES = [
  "Sepatu",
  "Pakaian",
  "Celana",
  "Tas",
  "Aksesoris",
  "Jaket",
  "Kaos",
  "Kemeja",
  "Hoodie",
  "Celana Pendek",
  "Sandal",
  "Topi",
];

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
}: AddProductModalProps) {
  const { products } = useStock();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get unique categories from existing products
  const existingCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(cats).sort();
  }, [products]);

  // All category options (existing + common)
  const allCategories = useMemo(() => {
    const combined = new Set([...existingCategories, ...COMMON_CATEGORIES]);
    return Array.from(combined).sort();
  }, [existingCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const selectedCategory = isCustomCategory ? customCategory.trim() : category.trim();

    if (!sku.trim() || !name.trim()) {
      setError("SKU dan Nama produk wajib diisi");
      return;
    }

    if (!selectedCategory) {
      setError("Kategori wajib diisi");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Masukkan harga yang valid");
      return;
    }

    const stockNum = parseInt(stock, 10) || 0;
    const minStockNum = parseInt(minStock, 10) || 5;

    setLoading(true);
    try {
      await onSubmit({
        sku: sku.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
        price: priceNum,
        stock: stockNum,
        minStock: minStockNum,
        category: selectedCategory || "General",
      });
      setSku("");
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setMinStock("5");
      setCategory("");
      setCustomCategory("");
      setIsCustomCategory(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah produk");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 md:p-0">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Tambah Produk Baru
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Lengkapi informasi produk di bawah ini
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-error-50 p-4 text-sm text-error-600 dark:bg-error-900/20 dark:text-error-400">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* SKU */}
              <div>
                <Label htmlFor="sku" className="font-semibold">
                  SKU <span className="text-error-500">*</span>
                </Label>
                <input
                  id="sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Contoh: SNK-001"
                  required
                  className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <Label htmlFor="category" className="font-semibold">
                  Kategori <span className="text-error-500">*</span>
                </Label>
                <div className="mt-2">
                  <select
                    id="category"
                    value={isCustomCategory ? "__custom__" : category}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Pilih Kategori</option>
                    {existingCategories.length > 0 && (
                      <optgroup label="Kategori Tersedia">
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {COMMON_CATEGORIES.length > 0 && (
                      <optgroup label="Kategori Umum">
                        {COMMON_CATEGORIES.filter(
                          (c) => !existingCategories.includes(c)
                        ).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <option value="__custom__">+ Kategori Lainnya...</option>
                  </select>

                  {isCustomCategory && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Masukkan kategori baru"
                      autoFocus
                      className="mt-2 h-12 w-full rounded-xl border-2 border-brand-500 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="font-semibold">
                Nama Produk <span className="text-error-500">*</span>
              </Label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Nike Air Max 270"
                required
                className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="font-semibold">
                Deskripsi
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi produk..."
                rows={3}
                className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Price */}
              <div>
                <Label htmlFor="price" className="font-semibold">
                  Harga (Rp) <span className="text-error-500">*</span>
                </Label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  required
                  className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Initial Stock */}
              <div>
                <Label htmlFor="stock" className="font-semibold">
                  Stok Awal
                </Label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Min Stock */}
              <div>
                <Label htmlFor="minStock" className="font-semibold">
                  Stok Minimum
                </Label>
                <input
                  id="minStock"
                  type="number"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  placeholder="5"
                  className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              className="rounded-xl"
            >
              Batal
            </Button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Tambah Produk
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
