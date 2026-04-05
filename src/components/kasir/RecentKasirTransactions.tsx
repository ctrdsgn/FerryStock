"use client";

import React, { useState, useMemo } from "react";
import { StockLog, Product } from "@/types";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentKasirTransactionsProps {
  transactions: StockLog[];
  products: Product[];
}

export default function RecentKasirTransactions({
  transactions,
  products,
}: RecentKasirTransactionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Get product name by ID
  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Produk Tidak Dikenal";
  };

  // Get product SKU by ID
  const getProductSku = (productId: string) => {
    return products.find((p) => p.id === productId)?.sku || "N/A";
  };

  // Extract source from supplier field
  const getSource = (supplier: string | null) => {
    if (!supplier) return "Unknown";
    return supplier;
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((log) => {
      const productName = getProductName(log.productId);
      const productSku = getProductSku(log.productId);
      const source = getSource(log.supplier);
      const note = log.note || "";

      const matchesSearch =
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource =
        sourceFilter === "all" || source.toLowerCase() === sourceFilter.toLowerCase();

      return matchesSearch && matchesSource;
    });
  }, [transactions, products, searchTerm, sourceFilter]);

  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get unique sources for filter
  const uniqueSources = useMemo(() => {
    const sources = new Set(transactions.map((t) => getSource(t.supplier)));
    return Array.from(sources);
  }, [transactions]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header with filters */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-white/[0.05]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Riwayat Transaksi Kasir
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Semua pengeluaran stok terbaru
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Cari produk atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />

            {/* Source Filter */}
            {uniqueSources.length > 0 && (
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full sm:w-48 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">Semua Sumber</option>
                {uniqueSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Tanggal
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Produk
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Sumber
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Jumlah
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Perubahan Stok
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Catatan
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada transaksi yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div>
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        {getProductName(log.productId)}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {getProductSku(log.productId)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge size="sm" color="warning">
                      {log.supplier || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="font-semibold text-error-500">
                      -{log.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{log.prevStock}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium text-error-500">
                      {log.nextStock}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {log.note || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with count */}
      <div className="border-t border-gray-200 px-6 py-4 dark:border-white/[0.05]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredTransactions.length} dari {transactions.length}{" "}
          transaksi
        </p>
      </div>
    </div>
  );
}
