"use client";

import KPIWidgets from "@/components/dashboard/KPIWidgets";
import LowStockTable from "@/components/dashboard/LowStockTable";
import StockValueChart from "@/components/dashboard/StockValueChart";

export default function Dashboard() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ikhtisar inventory dan stok Anda
        </p>
      </div>

      <div className="space-y-6">
        {/* KPI Widgets */}
        <KPIWidgets />

        {/* Stock Value Chart */}
        <StockValueChart />

        {/* Low Stock Alert Table */}
        <div className="grid grid-cols-1 gap-6">
          <LowStockTable />
        </div>
      </div>
    </>
  );
}
