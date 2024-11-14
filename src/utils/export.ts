import { utils, writeFile } from 'xlsx';
import { CartItem } from '../types';
import { BillDetails, DailyReport, MonthlyReport } from './types';
import { calculateBillDetails, aggregateDailyReport, aggregateMonthlyReport } from './reportHelpers';

export const exportBill = (items: CartItem[], total: number) => {
  const billDetails = calculateBillDetails(items, new Date());
  
  const billData = [
    ['Bill Number:', billDetails.billNumber],
    ['Date:', billDetails.date],
    ['Time:', billDetails.time],
    [],
    ['Item', 'Quantity', 'Unit Price', 'Subtotal'],
    ...billDetails.items.map(item => [
      item.name,
      item.quantity,
      item.unitPrice.toFixed(2),
      item.subtotal.toFixed(2)
    ]),
    [],
    ['Subtotal:', '', '', billDetails.subtotal.toFixed(2)],
    ['Tax:', '', '', billDetails.tax.toFixed(2)],
    ['Service Charge:', '', '', billDetails.serviceCharge.toFixed(2)],
    ['Total:', '', '', billDetails.total.toFixed(2)],
    [],
    ['Payment Method:', billDetails.paymentMethod],
    ['Notes:', billDetails.notes]
  ];

  const ws = utils.aoa_to_sheet(billData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Bill');

  writeFile(wb, `bill-${billDetails.billNumber}.xlsx`);
};

export const exportDailySales = (sales: CartItem[][]) => {
  // Convert sales to bill details
  const bills = sales.map(order => 
    calculateBillDetails(order, new Date())
  );
  
  const dailyReport = aggregateDailyReport(bills);

  const wb = utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Daily Sales Report'],
    ['Date:', dailyReport.date],
    ['Total Bills:', dailyReport.totalBills],
    ['Total Sales:', dailyReport.totalSales.toFixed(2)],
    [],
    ['Sales by Category'],
    ...Object.entries(dailyReport.salesByCategory).map(([category, amount]) => 
      [category, amount.toFixed(2)]
    ),
    [],
    ['Sales by Payment Method'],
    ...Object.entries(dailyReport.salesByPaymentMethod).map(([method, amount]) => 
      [method, amount.toFixed(2)]
    ),
    [],
    ['Peak Hours'],
    ...dailyReport.peakHours.map(({ hour, sales }) => 
      [`${hour}:00`, sales.toFixed(2)]
    )
  ];

  const wsSummary = utils.aoa_to_sheet(summaryData);
  utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Detailed bills sheet
  const billsData = bills.map(bill => ({
    'Bill Number': bill.billNumber,
    'Time': bill.time,
    'Items': bill.items.map(i => `${i.name} (${i.quantity})`).join(', '),
    'Subtotal': bill.subtotal,
    'Tax': bill.tax,
    'Service Charge': bill.serviceCharge,
    'Total': bill.total,
    'Payment Method': bill.paymentMethod
  }));

  const wsBills = utils.json_to_sheet(billsData);
  utils.book_append_sheet(wb, wsBills, 'Detailed Bills');

  writeFile(wb, `daily-report-${dailyReport.date}.xlsx`);
};

export const exportMonthlyReport = (sales: CartItem[][]) => {
  // Convert sales to daily reports
  const salesByDate: Record<string, CartItem[][]> = sales.reduce((acc, order) => {
    const date = new Date().toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {} as Record<string, CartItem[][]>);

  const dailyReports = Object.entries(salesByDate).map(([date, orders]) => {
    const bills = orders.map(order => calculateBillDetails(order, new Date(date)));
    return aggregateDailyReport(bills);
  });

  const monthlyReport = aggregateMonthlyReport(dailyReports);

  const wb = utils.book_new();

  // Monthly Summary sheet
  const summaryData = [
    ['Monthly Sales Report'],
    ['Month:', monthlyReport.month],
    ['Total Bills:', monthlyReport.totalBills],
    ['Total Sales:', monthlyReport.totalSales.toFixed(2)],
    ['Average Daily Sales:', monthlyReport.averageDailySales.toFixed(2)],
    ['Total Customers:', monthlyReport.totalCustomers],
    [],
    ['Sales by Category'],
    ...Object.entries(monthlyReport.salesByCategory).map(([category, amount]) => 
      [category, amount.toFixed(2)]
    ),
    [],
    ['Sales by Payment Method'],
    ...Object.entries(monthlyReport.salesByPaymentMethod).map(([method, amount]) => 
      [method, amount.toFixed(2)]
    ),
    [],
    ['Peak Hours'],
    ...monthlyReport.peakTimes.slice(0, 5).map(({ hour, sales }) => 
      [`${hour}:00`, sales.toFixed(2)]
    ),
    [],
    ['Expenses'],
    ['Ingredients:', monthlyReport.expenses.ingredients.toFixed(2)],
    ['Wages:', monthlyReport.expenses.wages.toFixed(2)],
    ['Utilities:', monthlyReport.expenses.utilities.toFixed(2)],
    ['Other:', monthlyReport.expenses.other.toFixed(2)],
    [],
    ['Net Profit:', monthlyReport.netProfit.toFixed(2)]
  ];

  const wsSummary = utils.aoa_to_sheet(summaryData);
  utils.book_append_sheet(wb, wsSummary, 'Monthly Summary');

  // Daily Breakdown sheet
  const dailyData = dailyReports.map(day => ({
    'Date': day.date,
    'Total Bills': day.totalBills,
    'Total Sales': day.totalSales.toFixed(2),
    'Peak Hour': `${day.peakHours[0]?.hour || 0}:00`,
    'Peak Hour Sales': day.peakHours[0]?.sales.toFixed(2) || '0.00'
  }));

  const wsDaily = utils.json_to_sheet(dailyData);
  utils.book_append_sheet(wb, wsDaily, 'Daily Breakdown');

  writeFile(wb, `monthly-report-${monthlyReport.month}.xlsx`);
};