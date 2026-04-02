"use client";

import React from "react";
import { useStock } from "@/hooks/useStock";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function LowStockTable() {
  const { lowStockProducts } = useStock();

  if (lowStockProducts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400">
          Semua produk memiliki stok yang cukup!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Peringatan Stok Rendah
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Produk yang perlu segera di-restock
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
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
                SKU
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Kategori
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Stok
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Min Stok
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {lowStockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-6 py-4">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {product.name}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {product.sku}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {product.category || "Umum"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={`font-semibold ${
                      product.stock === 0
                        ? "text-error-500"
                        : product.stock <= product.minStock
                        ? "text-warning-500"
                        : "text-success-500"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {product.minStock}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    size="sm"
                    color={
                      product.stock === 0
                        ? "error"
                        : product.stock <= product.minStock
                        ? "warning"
                        : "success"
                    }
                  >
                    {product.stock === 0
                      ? "Habis"
                      : product.stock < product.minStock
                      ? "Kritis"
                      : "Rendah"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
