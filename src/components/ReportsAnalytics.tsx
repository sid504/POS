import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, DollarSign, Users, Package, Calendar, Download, Filter } from 'lucide-react';
import { Transaction, Product, Customer } from '../types';

interface ReportsAnalyticsProps {
  transactions: Transaction[];
  products: Product[];
  customers: Customer[];
  onClose: () => void;
}

const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({
  transactions,
  products,
  customers,
  onClose
}) => {
  const [selectedReport, setSelectedReport] = useState<'sales' | 'inventory' | 'customer' | 'financial'>('sales');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = transaction.timestamp.toISOString().split('T')[0];
    return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
  });

  // Sales Analytics
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const totalTax = filteredTransactions.reduce((sum, t) => sum + t.tax, 0);
  const totalDiscount = filteredTransactions.reduce((sum, t) => sum + t.discount, 0);

  // Product Analytics
  const productSales = products.map(product => {
    const sales = filteredTransactions.reduce((sum, transaction) => {
      const item = transaction.items.find(item => item.product.id === product.id);
      return sum + (item ? item.quantity : 0);
    }, 0);
    const revenue = filteredTransactions.reduce((sum, transaction) => {
      const item = transaction.items.find(item => item.product.id === product.id);
      return sum + (item ? item.quantity * item.product.price : 0);
    }, 0);
    return { ...product, sales, revenue };
  }).sort((a, b) => b.sales - a.sales);

  const topProducts = productSales.slice(0, 10);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  // Customer Analytics
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(c => {
    const joinDate = c.joinDate.toISOString().split('T')[0];
    return joinDate >= dateRange.start && joinDate <= dateRange.end;
  }).length;

  // Payment Method Analytics
  const paymentMethods = filteredTransactions.reduce((acc, transaction) => {
    transaction.paymentMethod.forEach(payment => {
      acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
    });
    return acc;
  }, {} as Record<string, number>);

  // Daily Sales Data
  const dailySales = filteredTransactions.reduce((acc, transaction) => {
    const date = transaction.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + transaction.total;
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    // In a real app, this would generate and download a report
    alert('Export functionality would be implemented here');
  };

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-600">Total Revenue</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">${totalRevenue.toFixed(2)}</span>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600">Transactions</span>
          </div>
          <span className="text-2xl font-bold text-green-900">{totalTransactions}</span>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-600">Avg Order Value</span>
          </div>
          <span className="text-2xl font-bold text-purple-900">${averageOrderValue.toFixed(2)}</span>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-600">Items Sold</span>
          </div>
          <span className="text-2xl font-bold text-orange-900">
            {filteredTransactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {Object.entries(paymentMethods).map(([method, amount]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="capitalize text-gray-600">{method.replace('_', ' ')}</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gross Revenue</span>
              <span className="font-semibold">${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Tax</span>
              <span className="font-semibold">${totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Discounts</span>
              <span className="font-semibold text-red-600">-${totalDiscount.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Net Revenue</span>
                <span className="font-bold text-lg">${(totalRevenue - totalDiscount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-600">Total Products</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">{products.length}</span>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-600">Low Stock Items</span>
          </div>
          <span className="text-2xl font-bold text-orange-900">{lowStockProducts.length}</span>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600">Inventory Value</span>
          </div>
          <span className="text-2xl font-bold text-green-900">
            ${products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Units Sold</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{product.sales}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">${product.revenue.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomerReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-600">Total Customers</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">{totalCustomers}</span>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600">New Customers</span>
          </div>
          <span className="text-2xl font-bold text-green-900">{newCustomers}</span>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-600">Avg Customer Value</span>
          </div>
          <span className="text-2xl font-bold text-purple-900">
            ${totalCustomers > 0 ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Total Spent</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Loyalty Points</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {customers
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 10)
                .map(customer => (
                  <tr key={customer.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.loyaltyPoints}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {customer.lastVisit ? customer.lastVisit.toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gross Sales</span>
              <span className="font-semibold">${(totalRevenue - totalTax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax Collected</span>
              <span className="font-semibold">${totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discounts Given</span>
              <span className="font-semibold text-red-600">-${totalDiscount.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Total Revenue</span>
                <span className="font-bold text-lg">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost of Goods Sold</span>
              <span className="font-semibold">
                ${filteredTransactions.reduce((sum, t) => 
                  sum + t.items.reduce((itemSum, item) => 
                    itemSum + (item.quantity * item.product.costPrice), 0), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gross Profit</span>
              <span className="font-semibold text-green-600">
                ${(totalRevenue - filteredTransactions.reduce((sum, t) => 
                  sum + t.items.reduce((itemSum, item) => 
                    itemSum + (item.quantity * item.product.costPrice), 0), 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profit Margin</span>
              <span className="font-semibold">
                {totalRevenue > 0 ? 
                  (((totalRevenue - filteredTransactions.reduce((sum, t) => 
                    sum + t.items.reduce((itemSum, item) => 
                      itemSum + (item.quantity * item.product.costPrice), 0), 0)) / totalRevenue) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'sales', label: 'Sales', icon: DollarSign },
                { id: 'inventory', label: 'Inventory', icon: Package },
                { id: 'customer', label: 'Customer', icon: Users },
                { id: 'financial', label: 'Financial', icon: BarChart3 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedReport(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedReport === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <button
                onClick={handleExport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="min-h-96">
            {selectedReport === 'sales' && renderSalesReport()}
            {selectedReport === 'inventory' && renderInventoryReport()}
            {selectedReport === 'customer' && renderCustomerReport()}
            {selectedReport === 'financial' && renderFinancialReport()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;