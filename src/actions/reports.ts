'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface ReportFilters {
  period: 'daily' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

export interface StockMovement {
  date: string;
  productId: string;
  productName: string;
  category: string | null;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  prevStock: number;
  nextStock: number;
  note: string | null;
}

export interface ReportSummary {
  totalMovements: number;
  totalStockIn: number;
  totalStockOut: number;
  totalAdjustments: number;
  netChange: number;
  topMovedProducts: {
    productId: string;
    productName: string;
    category: string | null;
    totalMovements: number;
    netChange: number;
  }[];
  categoryBreakdown: {
    category: string | null;
    totalMovements: number;
    stockIn: number;
    stockOut: number;
  }[];
  dailyTrend: {
    date: string;
    movements: number;
    stockIn: number;
    stockOut: number;
  }[];
}

export async function getStockReport(filters: ReportFilters): Promise<ReportSummary> {
  try {
    const where: Prisma.StockLogWhereInput = {};

    // Date filtering
    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    // Get all stock logs for the period
    const logs = await prisma.stockLog.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate summary statistics
    const totalMovements = logs.length;
    const totalStockIn = logs
      .filter((log) => log.type === 'IN')
      .reduce((sum, log) => sum + log.quantity, 0);
    const totalStockOut = logs
      .filter((log) => log.type === 'OUT')
      .reduce((sum, log) => sum + log.quantity, 0);
    const totalAdjustments = logs
      .filter((log) => log.type === 'ADJUST')
      .reduce((sum, log) => sum + log.quantity, 0);
    const netChange = totalStockIn - totalStockOut + totalAdjustments;

    // Top moved products
    const productStats = new Map<
      string,
      { productId: string; productName: string; category: string | null; movements: number; netChange: number }
    >();

    logs.forEach((log) => {
      const existing = productStats.get(log.productId) || {
        productId: log.productId,
        productName: log.product.name,
        category: log.product.category,
        movements: 0,
        netChange: 0,
      };
      existing.movements += 1;
      existing.netChange += log.type === 'IN' ? log.quantity : log.type === 'OUT' ? -log.quantity : log.quantity;
      productStats.set(log.productId, existing);
    });

    const topMovedProducts = Array.from(productStats.values())
      .sort((a, b) => b.movements - a.movements)
      .slice(0, 5)
      .map((p) => ({
        productId: p.productId,
        productName: p.productName,
        category: p.category,
        totalMovements: p.movements,
        netChange: p.netChange,
      }));

    // Category breakdown
    const categoryStats = new Map<
      string,
      { category: string | null; movements: number; stockIn: number; stockOut: number }
    >();

    logs.forEach((log) => {
      const category = log.product.category || 'Lainnya';
      const existing = categoryStats.get(category) || {
        category,
        movements: 0,
        stockIn: 0,
        stockOut: 0,
      };
      existing.movements += 1;
      if (log.type === 'IN') existing.stockIn += log.quantity;
      if (log.type === 'OUT') existing.stockOut += log.quantity;
      categoryStats.set(category, existing);
    });

    const categoryBreakdown = Array.from(categoryStats.values()).sort(
      (a, b) => b.movements - a.movements
    );

    // Daily trend (group by date)
    const dailyStats = new Map<
      string,
      { date: string; movements: number; stockIn: number; stockOut: number }
    >();

    logs.forEach((log) => {
      const date = new Date(log.createdAt).toISOString().split('T')[0];
      const existing = dailyStats.get(date) || {
        date,
        movements: 0,
        stockIn: 0,
        stockOut: 0,
      };
      existing.movements += 1;
      if (log.type === 'IN') existing.stockIn += log.quantity;
      if (log.type === 'OUT') existing.stockOut += log.quantity;
      dailyStats.set(date, existing);
    });

    const dailyTrend = Array.from(dailyStats.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return {
      totalMovements,
      totalStockIn,
      totalStockOut,
      totalAdjustments,
      netChange,
      topMovedProducts,
      categoryBreakdown,
      dailyTrend,
    };
  } catch (error) {
    console.error('Error fetching stock report:', error);
    return {
      totalMovements: 0,
      totalStockIn: 0,
      totalStockOut: 0,
      totalAdjustments: 0,
      netChange: 0,
      topMovedProducts: [],
      categoryBreakdown: [],
      dailyTrend: [],
    };
  }
}

export async function getStockLogs(filters: ReportFilters): Promise<StockMovement[]> {
  try {
    const where: Prisma.StockLogWhereInput = {};

    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    const logs = await prisma.stockLog.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    return logs.map((log) => ({
      date: log.createdAt.toISOString(),
      productId: log.productId,
      productName: log.product.name,
      category: log.product.category,
      type: log.type as 'IN' | 'OUT' | 'ADJUST',
      quantity: log.quantity,
      prevStock: log.prevStock,
      nextStock: log.nextStock,
      note: log.note,
    }));
  } catch (error) {
    console.error('Error fetching stock logs:', error);
    return [];
  }
}
