"use client";

import React, { useState, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { useStock } from "@/hooks/useStock";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: "IN" | "OUT" | "ADJUST";
    quantity: number;
    supplier?: string;
    note: string;
  }) => void;
  productName: string;
  currentStock: number;
}

const COMMON_SUPPLIERS = [
  "PT. Sumber Jaya Abadi",
  "CV. Mitra Sejahtera",
  "PT. Global Distribusi",
  "UD. Berkah Sentosa",
  "PT. Indo Retail Supply",
];

export default function StockModal({
  isOpen,
  onClose,
  onSubmit,
  productName,
  currentStock,
}: StockModalProps) {
  const { stockLogs } = useStock();
  const [stockType, setStockType] = useState<"IN" | "OUT" | "ADJUST">("IN");
  const [quantity, setQuantity] = useState<string>("");
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Get unique suppliers from existing stock logs
  const existingSuppliers = useMemo(() => {
    const suppliers = new Set(
      stockLogs
        .filter((log) => log.supplier && log.supplier.trim() !== "" && log.type === "IN")
        .map((log) => log.supplier!)
    );
    return Array.from(suppliers).sort();
  }, [stockLogs]);

  // All supplier options
  const allSuppliers = useMemo(() => {
    const combined = new Set([...existingSuppliers, ...COMMON_SUPPLIERS]);
    return Array.from(combined).sort();
  }, [existingSuppliers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError("Masukkan jumlah yang valid");
      return;
    }

    if (stockType === "OUT" && qty > currentStock) {
      setError(`Tidak dapat menghapus lebih dari stok saat ini (${currentStock})`);
      return;
    }

    // For IN transactions, require supplier
    if (stockType === "IN" && !supplier.trim()) {
      setError("Supplier wajib diisi untuk stok masuk");
      return;
    }

    onSubmit({
      type: stockType,
      quantity: qty,
      supplier: stockType === "IN" ? supplier.trim() : undefined,
      note: note.trim(),
    });

    // Reset form
    setQuantity("");
    setSupplier("");
    setNote("");
  };

  const getModalTitle = () => {
    switch (stockType) {
      case "IN":
        return "Stok Masuk";
      case "OUT":
        return "Stok Keluar";
      case "ADJUST":
        return "Sesuaikan Stok";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 md:p-0">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {getModalTitle()}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {productName}
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

        {/* Product Info Card */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 p-4 dark:from-brand-900/20 dark:to-brand-900/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
                Stok Saat Ini
              </p>
              <p className="mt-1 text-3xl font-bold text-brand-700 dark:text-brand-300">
                {currentStock}
              </p>
            </div>
            <div className="rounded-full bg-brand-500 p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Transaction Type */}
            <div>
              <Label>Jenis Transaksi</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["IN", "OUT", "ADJUST"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setStockType(type);
                      setError("");
                    }}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                      stockType === type
                        ? "border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                        : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {type === "IN" ? "+ Masuk" : type === "OUT" ? "- Keluar" : "≈ Sesuaikan"}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Jumlah</Label>
              <div className="relative mt-2">
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError("");
                  }}
                  placeholder="0"
                  required
                  className="h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 pl-4 text-lg font-semibold text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              {stockType === "OUT" && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Maksimum tersedia: <span className="font-semibold">{currentStock}</span>
                </p>
              )}
            </div>

            {/* Supplier Input (only for IN transactions) */}
            {stockType === "IN" && (
              <div>
                <Label htmlFor="supplier">
                  Supplier <span className="text-error-500">*</span>
                </Label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="supplier"
                    list="supplier-options"
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Ketik atau pilih supplier..."
                    required
                    className="h-12 flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <datalist id="supplier-options">
                    {allSuppliers.map((sup) => (
                      <option key={sup} value={sup} />
                    ))}
                  </datalist>
                  <button
                    type="button"
                    onClick={() => {
                      if (allSuppliers.length > 0) {
                        const random = allSuppliers[Math.floor(Math.random() * allSuppliers.length)];
                        setSupplier(random);
                      }
                    }}
                    className="h-12 rounded-xl bg-gray-100 px-3 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    title="Pilih supplier acak"
                  >
                    🎲
                  </button>
                </div>
                {allSuppliers.length > 0 && (
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    💡 Ketik untuk mencari atau pilih dari {allSuppliers.length} supplier yang tersedia
                  </p>
                )}
              </div>
            )}

            {/* Note */}
            <div>
              <Label htmlFor="note">
                Catatan{" "}
                {stockType === "ADJUST" && (
                  <span className="text-error-500">*</span>
                )}
              </Label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Masukkan catatan untuk transaksi ini..."
                rows={3}
                required={stockType === "ADJUST"}
                className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

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
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/40"
            >
              {stockType === "IN"
                ? "✓ Tambah Stok"
                : stockType === "OUT"
                ? "✓ Kurangi Stok"
                : "✓ Sesuaikan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
