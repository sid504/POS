import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, User, Tag, X } from 'lucide-react';
import { CartItem, Customer, Discount } from '../types';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  selectedCustomer?: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  customers: Customer[];
  appliedDiscount?: Discount | null;
  onApplyDiscount: (code: string) => boolean;
  onRemoveDiscount: () => void;
  discountAmount: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  selectedCustomer,
  onSelectCustomer,
  customers,
  appliedDiscount,
  onApplyDiscount,
  onRemoveDiscount,
  discountAmount
}) => {
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08; // 8% tax
  const total = discountedSubtotal + tax;

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const handleApplyDiscount = () => {
    if (onApplyDiscount(discountCode)) {
      setDiscountCode('');
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
        </div>
      </div>
      
      {/* Customer Selection */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Customer</span>
          <button
            onClick={() => setShowCustomerSelect(!showCustomerSelect)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {selectedCustomer ? 'Change' : 'Select'}
          </button>
        </div>
        
        {selectedCustomer ? (
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-900">{selectedCustomer.name}</div>
                <div className="text-xs text-blue-600">{selectedCustomer.loyaltyPoints} points</div>
              </div>
            </div>
            <button
              onClick={() => onSelectCustomer(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No customer selected</div>
        )}
        
        {showCustomerSelect && (
          <div className="mt-2 border rounded-lg p-2 bg-gray-50">
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
            />
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filteredCustomers.slice(0, 5).map(customer => (
                <button
                  key={customer.id}
                  onClick={() => {
                    onSelectCustomer(customer);
                    setShowCustomerSelect(false);
                    setCustomerSearch('');
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-xs text-gray-500">{customer.phone}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ShoppingBag className="w-12 h-12 mb-2" />
            <p>Cart is empty</p>
            <p className="text-sm">Add items to get started</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ${item.product.price.toFixed(2)} each
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className="font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Discount Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Discount</span>
            </div>
            
            {appliedDiscount ? (
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-900">{appliedDiscount.name}</div>
                    <div className="text-xs text-green-600">{appliedDiscount.code}</div>
                  </div>
                </div>
                <button
                  onClick={onRemoveDiscount}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Checkout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;