"use client";

import TransactionsTable from "@/components/transactions/TransactionsTable";

export default function Transactions() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Transaksi
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Riwayat semua pergerakan stok
        </p>
      </div>
      <TransactionsTable />
    </>
  );
}
