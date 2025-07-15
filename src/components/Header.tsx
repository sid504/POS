import React from 'react';
import { ShoppingCart, User, Clock, BarChart3, Package, Truck, RotateCcw, Users, Tag, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentUser: string;
  currentTime: string;
  cartItemCount: number;
  onViewHistory: () => void;
  onViewInventory: () => void;
  onViewStockReceiving: () => void;
  onViewReturns: () => void;
  onViewCustomers: () => void;
  onViewDiscounts: () => void;
  onViewReports: () => void;
  onViewShifts: () => void;
  onViewSettings: () => void;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  currentTime, 
  cartItemCount, 
  onViewHistory,
  onViewInventory,
  onViewStockReceiving,
  onViewReturns,
  onViewCustomers,
  onViewDiscounts,
  onViewReports,
  onViewShifts,
  onViewSettings,
  userRole
}) => {
  const { logout, hasPermission } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                ModernPOS
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{currentTime}</span>
            </div>
            
            {hasPermission('manage_inventory') && (
              <button
                onClick={onViewInventory}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Inventory</span>
              </button>
            )}
            
            {hasPermission('manage_inventory') && (
              <button
                onClick={onViewStockReceiving}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium">Receiving</span>
              </button>
            )}
            
            {hasPermission('process_returns') && (
              <button
                onClick={onViewReturns}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Returns</span>
              </button>
            )}
            
            <button
              onClick={onViewCustomers}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Customers</span>
            </button>
            
            {hasPermission('manage_discounts') && (
              <button
                onClick={onViewDiscounts}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium">Discounts</span>
              </button>
            )}
            
            {hasPermission('view_reports') && (
              <button
                onClick={onViewReports}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Reports</span>
              </button>
            )}
            
            <button
              onClick={onViewShifts}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Shifts</span>
            </button>
            
            <button
              onClick={onViewHistory}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">History</span>
            </button>
            
            {hasPermission('manage_settings') && (
              <button
                onClick={onViewSettings}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-4 h-4" />
                <div className="text-right">
                  <div className="text-sm font-medium">{currentUser}</div>
                  <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">{cartItemCount}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;