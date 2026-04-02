"use client";

import React, { useState, useMemo } from "react";
import { useStock } from "@/hooks/useStock";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TransactionsTable() {
  const { stockLogs, products } = useStock();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get product name by ID
  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Produk Tidak Dikenal";
  };

  // Get product SKU by ID
  const getProductSku = (productId: string) => {
    return products.find((p) => p.id === productId)?.sku || "N/A";
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    return stockLogs.filter((log) => {
      const productName = getProductName(log.productId);
      const productSku = getProductSku(log.productId);
      const supplier = log.supplier || "";

      const matchesSearch =
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.note && log.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        supplier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || log.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [stockLogs, products, searchTerm, typeFilter]);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "IN":
        return "success";
      case "OUT":
        return "error";
      case "ADJUST":
        return "warning";
      default:
        return "light";
    }
  };

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

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header with filters */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-white/[0.05]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Riwayat Transaksi
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Semua pergerakan dan penyesuaian stok
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Cari produk, supplier, atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Tipe</option>
              <option value="IN">Stok Masuk</option>
              <option value="OUT">Stok Keluar</option>
              <option value="ADJUST">Penyesuaian</option>
            </select>
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
                Supplier
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Tipe
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
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada transaksi yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
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
                    {log.supplier ? (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {log.supplier}
                      </span>
                    ) : log.type === "IN" ? (
                      <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge size="sm" color={getTypeBadgeColor(log.type)}>
                      {log.type === "IN"
                        ? "Masuk"
                        : log.type === "OUT"
                        ? "Keluar"
                        : "Sesuaikan"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        log.type === "IN"
                          ? "text-success-500"
                          : log.type === "OUT"
                          ? "text-error-500"
                          : "text-warning-500"
                      }`}
                    >
                      {log.type === "IN" ? "+" : ""}
                      {log.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{log.prevStock}</span>
                    <span className="mx-2">→</span>
                    <span
                      className={`font-medium ${
                        log.nextStock > log.prevStock
                          ? "text-success-500"
                          : log.nextStock < log.prevStock
                          ? "text-error-500"
                          : "text-gray-500"
                      }`}
                    >
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
          Menampilkan {filteredLogs.length} dari {stockLogs.length} transaksi
        </p>
      </div>
    </div>
  );
}
