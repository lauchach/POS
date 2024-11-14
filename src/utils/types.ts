export interface BillDetails {
  billNumber: string;
  date: string;
  time: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  paymentMethod: string;
  notes: string;
}

export interface DailyReport {
  date: string;
  bills: BillDetails[];
  totalSales: number;
  totalBills: number;
  salesByCategory: Record<string, number>;
  salesByPaymentMethod: Record<string, number>;
  peakHours: { hour: number; sales: number }[];
}

export interface MonthlyReport {
  month: string;
  totalBills: number;
  totalSales: number;
  salesByCategory: Record<string, number>;
  averageDailySales: number;
  totalCustomers: number;
  salesByPaymentMethod: Record<string, number>;
  peakTimes: { hour: number; sales: number }[];
  expenses: {
    ingredients: number;
    wages: number;
    utilities: number;
    other: number;
  };
  netProfit: number;
}