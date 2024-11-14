import { CartItem } from '../types';
import { BillDetails, DailyReport, MonthlyReport } from './types';

const TAX_RATE = 0.10; // 10% tax
const SERVICE_CHARGE_RATE = 0.05; // 5% service charge

export const generateBillNumber = (date: Date): string => {
  return `BILL-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${date.getTime().toString().slice(-4)}`;
};

export const calculateBillDetails = (
  items: CartItem[],
  date: Date,
  paymentMethod: string = 'Cash',
  notes: string = ''
): BillDetails => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + tax + serviceCharge;

  return {
    billNumber: generateBillNumber(date),
    date: date.toISOString().split('T')[0],
    time: date.toLocaleTimeString(),
    items: items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity
    })),
    subtotal,
    tax,
    serviceCharge,
    total,
    paymentMethod,
    notes
  };
};

export const aggregateDailyReport = (bills: BillDetails[]): DailyReport => {
  const salesByCategory: Record<string, number> = {};
  const salesByPaymentMethod: Record<string, number> = {};
  const hourlyStats: Record<number, number> = {};

  bills.forEach(bill => {
    // Aggregate payment methods
    salesByPaymentMethod[bill.paymentMethod] = (salesByPaymentMethod[bill.paymentMethod] || 0) + bill.total;

    // Aggregate hourly stats
    const hour = new Date(bill.time).getHours();
    hourlyStats[hour] = (hourlyStats[hour] || 0) + bill.total;

    // Aggregate categories
    bill.items.forEach(item => {
      const category = item.name.split(' ')[0]; // Simplified category extraction
      salesByCategory[category] = (salesByCategory[category] || 0) + item.subtotal;
    });
  });

  const peakHours = Object.entries(hourlyStats)
    .map(([hour, sales]) => ({ hour: parseInt(hour), sales }))
    .sort((a, b) => b.sales - a.sales);

  return {
    date: bills[0]?.date || new Date().toISOString().split('T')[0],
    bills,
    totalSales: bills.reduce((sum, bill) => sum + bill.total, 0),
    totalBills: bills.length,
    salesByCategory,
    salesByPaymentMethod,
    peakHours
  };
};

export const aggregateMonthlyReport = (dailyReports: DailyReport[]): MonthlyReport => {
  const totalSales = dailyReports.reduce((sum, day) => sum + day.totalSales, 0);
  const totalBills = dailyReports.reduce((sum, day) => sum + day.totalBills, 0);
  
  // Aggregate all sales by category
  const salesByCategory = dailyReports.reduce((acc, day) => {
    Object.entries(day.salesByCategory).forEach(([category, amount]) => {
      acc[category] = (acc[category] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  // Aggregate all sales by payment method
  const salesByPaymentMethod = dailyReports.reduce((acc, day) => {
    Object.entries(day.salesByPaymentMethod).forEach(([method, amount]) => {
      acc[method] = (acc[method] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  // Calculate peak hours across the month
  const hourlyStats: Record<number, number> = {};
  dailyReports.forEach(day => {
    day.peakHours.forEach(({ hour, sales }) => {
      hourlyStats[hour] = (hourlyStats[hour] || 0) + sales;
    });
  });

  const peakTimes = Object.entries(hourlyStats)
    .map(([hour, sales]) => ({ hour: parseInt(hour), sales }))
    .sort((a, b) => b.sales - a.sales);

  // Estimated monthly expenses (placeholder values)
  const expenses = {
    ingredients: totalSales * 0.3, // 30% of sales
    wages: totalSales * 0.25, // 25% of sales
    utilities: totalSales * 0.05, // 5% of sales
    other: totalSales * 0.05 // 5% of sales
  };

  const netProfit = totalSales - (
    expenses.ingredients +
    expenses.wages +
    expenses.utilities +
    expenses.other
  );

  return {
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    totalBills,
    totalSales,
    salesByCategory,
    averageDailySales: totalSales / dailyReports.length,
    totalCustomers: totalBills, // Assuming 1 bill = 1 customer
    salesByPaymentMethod,
    peakTimes,
    expenses,
    netProfit
  };
};