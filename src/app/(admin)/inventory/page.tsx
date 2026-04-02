"use client";

import InventoryTable from "@/components/inventory/InventoryTable";

export default function Inventory() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola semua produk inventory Anda
        </p>
      </div>
      <InventoryTable />
    </>
  );
}
