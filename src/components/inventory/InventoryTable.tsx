"use client";

import React, { useState, useMemo } from "react";
import { useStock } from "@/hooks/useStock";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StockModal from "./StockModal";
import AddProductModal from "./AddProductModal";
import { PlusIcon } from "@/icons";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function InventoryTable() {
  const { products, updateStock, addProduct } = useStock();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    stock: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || "Lainnya").filter(Boolean));
    return ["all", ...Array.from(cats).sort()];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleStockAction = (
    productId: string,
    name: string,
    stock: number
  ) => {
    setSelectedProduct({ id: productId, name, stock });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: {
    type: "IN" | "OUT" | "ADJUST";
    quantity: number;
    supplier?: string;
    note: string;
  }) => {
    if (selectedProduct) {
      updateStock(selectedProduct.id, {
        type: data.type,
        quantity: data.quantity,
        supplier: data.supplier,
        note: data.note,
      });
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = async (data: {
    sku: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    minStock: number;
    category: string | null;
  }) => {
    await addProduct({
      sku: data.sku,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
      minStock: data.minStock,
      category: data.category ?? null,
      imageUrl: null,
    });
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header with search and filters */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-white/[0.05]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Daftar Inventory
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kelola produk dan level stok Anda
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Add Product Button */}
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Produk
              </Button>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Cari nama atau SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "Semua Kategori" : cat}
                  </option>
                ))}
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
                  Harga
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
                <TableCell
                  isHeader
                  className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada produk yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="px-6 py-4">
                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          {product.name}
                        </span>
                        {product.description && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {product.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {product.sku}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {product.category || "Umum"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 dark:text-white/90">
                      {formatRupiah(Number(product.price))}
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
                          : product.stock <= product.minStock * 1.5
                          ? "Rendah"
                          : "Aman"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStockAction(
                              product.id,
                              product.name,
                              product.stock
                            )
                          }
                        >
                          Update Stok
                        </Button>
                      </div>
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
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </p>
        </div>
      </div>

      {/* Stock Update Modal */}
      {selectedProduct && (
        <StockModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleModalSubmit}
          productName={selectedProduct.name}
          currentStock={selectedProduct.stock}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </>
  );
}
