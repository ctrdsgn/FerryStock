"use client";

import React, { useState } from "react";
import { KasirCartItem, KasirSource } from "@/types";

interface KasirCheckoutProps {
  cart: KasirCartItem[];
  onCheckout: (
    source: KasirSource,
    referenceNumber: string,
    notes: string
  ) => void;
  processing: boolean;
}

export default function KasirCheckout({
  cart,
  onCheckout,
  processing,
}: KasirCheckoutProps) {
  const [source, setSource] = useState<KasirSource>("INTERNAL");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasExceedingStock = cart.some(
    (item) => item.quantity > item.product.stock
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onCheckout(source, referenceNumber, notes);
    setShowConfirmation(false);
    setReferenceNumber("");
    setNotes("");
  };

  const getSourceLabel = (s: KasirSource) => {
    switch (s) {
      case "INTERNAL":
        return "Pengambilan Internal";
      case "SHOPEE":
        return "Penjualan Shopee";
      case "WEBSITE":
        return "Penjualan Website";
      case "OTHER":
        return "Lainnya";
      default:
        return s;
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-white/[0.05]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Checkout
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Proses pengeluaran stok
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Source Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sumber Pengeluaran *
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as KasirSource)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="INTERNAL">Pengambilan Internal (Staff mengambil barang)</option>
                <option value="SHOPEE">Penjualan Shopee</option>
                <option value="WEBSITE">Penjualan Website</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </div>

            {/* Reference Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nomor Referensi (Opsional)
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Contoh: Order ID, No. Resi, dll."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Catatan (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alasan pengambilan atau catatan tambahan..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Ringkasan
              </h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Jumlah Produk:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {cart.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Item:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {totalItems}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sumber:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {getSourceLabel(source)}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            {hasExceedingStock && (
              <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-500/20 dark:bg-error-500/10">
                <div className="flex gap-2">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-error-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-error-600 dark:text-error-400">
                    Beberapa item melebihi stok yang tersedia. Silakan perbaiki
                    jumlah di keranjang.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={cart.length === 0 || hasExceedingStock || processing}
              className="w-full rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
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
                  Memproses...
                </span>
              ) : (
                "Proses Pengeluaran Stok"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Konfirmasi Transaksi
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Anda akan memproses pengeluaran {totalItems} item dari {cart.length}{" "}
              produk. Apakah Anda yakin?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Ya, Proses
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
