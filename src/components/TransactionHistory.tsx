import React, { useState } from 'react';
import { X, Search, Calendar, DollarSign } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClose: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.cashier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const totalTransactions = transactions.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600">Total Revenue</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">
                ${totalRevenue.toFixed(2)}
              </span>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600">Total Transactions</span>
              </div>
              <span className="text-2xl font-bold text-green-900">
                {totalTransactions}
              </span>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">
                    Cashier
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">
                    Items
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-900">
                    Payment
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-900">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm font-mono text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {transaction.timestamp.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {transaction.cashier}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {transaction.items.length} items
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600 capitalize">
                      {transaction.paymentMethod}
                    </td>
                    <td className="py-3 px-2 text-sm font-semibold text-gray-900 text-right">
                      ${transaction.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;