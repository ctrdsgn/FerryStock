"use client";

import React, { useState, useMemo, useEffect } from "react";
import { getStockReport, getStockLogs, type ReportFilters } from "@/actions/reports";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Set default dates based on period
  useEffect(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case "daily":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now);
        break;
      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now);
        break;
      case "yearly":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now);
        break;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, [period]);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      try {
        const [report, logsData] = await Promise.all([
          getStockReport({ period, startDate, endDate }),
          getStockLogs({ period, startDate, endDate }),
        ]);
        setReportData(report);
        setLogs(logsData);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchReport, 500);
    return () => clearTimeout(debounce);
  }, [period, startDate, endDate]);

  const periodOptions = [
    { value: "daily", label: "Harian", icon: "📅" },
    { value: "monthly", label: "Bulanan", icon: "📆" },
    { value: "yearly", label: "Tahunan", icon: "📊" },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Laporan
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Analisis pergerakan stok dan transaksi
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* Period Selection */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Periode Laporan
            </label>
            <div className="flex gap-2">
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    period === opt.value
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Memuat laporan...</p>
          </div>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Transaksi"
              value={reportData.totalMovements.toString()}
              icon="📦"
              color="brand"
            />
            <SummaryCard
              title="Stok Masuk"
              value={`+${reportData.totalStockIn}`}
              icon="📥"
              color="success"
            />
            <SummaryCard
              title="Stok Keluar"
              value={`-${reportData.totalStockOut}`}
              icon="📤"
              color="error"
            />
            <SummaryCard
              title="Perubahan Bersih"
              value={`${reportData.netChange >= 0 ? "+" : ""}${reportData.netChange}`}
              icon="📈"
              color={reportData.netChange >= 0 ? "success" : "error"}
            />
          </div>

          {/* Top Moved Products */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
              🏆 Produk Paling Banyak Bergerak
            </h3>
            {reportData.topMovedProducts.length > 0 ? (
              <div className="space-y-3">
                {reportData.topMovedProducts.map((product: any, index: number) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                            ? "bg-gray-400 text-white"
                            : index === 2
                            ? "bg-amber-600 text-white"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {product.productName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.category || "Lainnya"} • {product.totalMovements} transaksi
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        product.netChange >= 0
                          ? "text-success-500"
                          : "text-error-500"
                      }`}
                    >
                      {product.netChange >= 0 ? "+" : ""}
                      {product.netChange}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                Belum ada data pergerakan produk
              </p>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
              📊 Pergerakan per Kategori
            </h3>
            {reportData.categoryBreakdown.length > 0 ? (
              <div className="space-y-4">
                {reportData.categoryBreakdown.map((cat: any) => (
                  <div key={cat.category}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {cat.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {cat.movements} transaksi • Masuk: {cat.stockIn} • Keluar: {cat.stockOut}
                      </span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                        style={{
                          width: `${(cat.movements / reportData.totalMovements) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                Belum ada data kategori
              </p>
            )}
          </div>

          {/* Recent Transactions Table */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
              📋 Riwayat Transaksi Terbaru
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Tanggal
                    </th>
                    <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Produk
                    </th>
                    <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Tipe
                    </th>
                    <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Jumlah
                    </th>
                    <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Stok
                    </th>
                    <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Catatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {logs.slice(0, 20).map((log: any, index: number) => (
                    <tr key={index} className="text-sm">
                      <td className="py-3 text-gray-500 dark:text-gray-400">
                        {formatDate(log.date)}
                      </td>
                      <td className="py-3 font-medium text-gray-800 dark:text-white">
                        {log.productName}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            log.type === "IN"
                              ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                              : log.type === "OUT"
                              ? "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400"
                              : "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400"
                          }`}
                        >
                          {log.type === "IN" ? "Masuk" : log.type === "OUT" ? "Keluar" : "Sesuaikan"}
                        </span>
                      </td>
                      <td
                        className={`py-3 font-semibold ${
                          log.type === "IN"
                            ? "text-success-500"
                            : log.type === "OUT"
                            ? "text-error-500"
                            : "text-warning-500"
                        }`}
                      >
                        {log.type === "IN" ? "+" : ""}
                        {log.quantity}
                      </td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">
                        {log.prevStock} → {log.nextStock}
                      </td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">
                        {log.note || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {logs.length === 0 && (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                Belum ada transaksi pada periode ini
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: "brand" | "success" | "error";
}) {
  const colorClasses = {
    brand: "from-brand-500 to-brand-600 shadow-brand-500/30",
    success: "from-success-500 to-success-600 shadow-success-500/30",
    error: "from-error-500 to-error-600 shadow-error-500/30",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg ${colorClasses[color]}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
