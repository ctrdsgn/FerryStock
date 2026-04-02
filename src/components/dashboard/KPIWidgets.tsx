"use client";

import React from "react";
import { useStock } from "@/hooks/useStock";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: "blue" | "green" | "orange" | "red";
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  color,
}) => {
  const colorClasses = {
    blue: "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400",
    green:
      "bg-success-50 text-success-500 dark:bg-success-500/10 dark:text-success-400",
    orange:
      "bg-warning-50 text-warning-500 dark:bg-warning-500/10 dark:text-warning-400",
    red: "bg-error-50 text-error-500 dark:bg-error-500/10 dark:text-error-400",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            {value}
          </h3>
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trendUp
                  ? "text-success-500"
                  : "text-error-500"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function KPIWidgets() {
  const { totalStockValue, totalSKUs, criticallyLowItems, lowStockProducts } =
    useStock();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <KPICard
        title="Nilai Stok Total"
        value={formatRupiah(totalStockValue)}
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        color="green"
        trend="+12.5% dari bulan lalu"
        trendUp={true}
      />

      <KPICard
        title="Total SKU"
        value={totalSKUs}
        icon={
          <svg
            className="h-6 w-6"
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
        }
        color="blue"
        trend="+3 produk baru"
        trendUp={true}
      />

      <KPICard
        title="Item Stok Kritis"
        value={criticallyLowItems}
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        }
        color="red"
        trend={
          criticallyLowItems > 0
            ? `${criticallyLowItems} item perlu perhatian`
            : "Semua item aman"
        }
        trendUp={criticallyLowItems === 0}
      />

      <KPICard
        title="Produk Stok Rendah"
        value={lowStockProducts.length}
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        }
        color="orange"
        trend={
          lowStockProducts.length > 0
            ? "Perlu restok segera"
            : "Stok aman"
        }
        trendUp={lowStockProducts.length === 0}
      />
    </div>
  );
}
