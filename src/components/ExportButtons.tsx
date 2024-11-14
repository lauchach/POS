import React from 'react';
import { FileSpreadsheet, FileText, BarChart } from 'lucide-react';
import { CartItem } from '../types';
import { exportBill, exportDailySales, exportMonthlyReport } from '../utils/export';

interface ExportButtonsProps {
  currentOrder: CartItem[];
  allOrders: CartItem[][];
  total: number;
}

export function ExportButtons({ currentOrder, allOrders, total }: ExportButtonsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => exportBill(currentOrder, total)}
        disabled={currentOrder.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg
                 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700
                 transition-colors"
      >
        <FileText size={18} />
        Export Bill
      </button>
      <button
        onClick={() => exportDailySales(allOrders)}
        disabled={allOrders.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg
                 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700
                 transition-colors"
      >
        <FileSpreadsheet size={18} />
        Daily Report
      </button>
      <button
        onClick={() => exportMonthlyReport(allOrders)}
        disabled={allOrders.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700
                 transition-colors"
      >
        <BarChart size={18} />
        Monthly Report
      </button>
    </div>
  );
}