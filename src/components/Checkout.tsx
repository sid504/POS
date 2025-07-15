import React, { useState } from 'react';
import { CreditCard, DollarSign, Smartphone, ArrowLeft, Receipt, Gift, User, Tag } from 'lucide-react';
import { CartItem, Customer, Discount, PaymentMethod } from '../types';

interface CheckoutProps {
  items: CartItem[];
  customer?: Customer | null;
  discount?: Discount | null;
  discountAmount: number;
  onBack: () => void;
  onComplete: (paymentMethods: PaymentMethod[]) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, customer, discount, discountAmount, onBack, onComplete }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [currentPaymentType, setCurrentPaymentType] = useState<'cash' | 'card' | 'digital' | 'gift_card' | 'store_credit'>('card');
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;
  const totalPaid = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
  const remainingAmount = total - totalPaid;

  const addPaymentMethod = () => {
    const amount = parseFloat(currentPaymentAmount);
    if (amount > 0 && amount <= remainingAmount) {
      setPaymentMethods(prev => [...prev, {
        type: currentPaymentType,
        amount
      }]);
      setCurrentPaymentAmount('');
    }
  };

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(prev => prev.filter((_, i) => i !== index));
  };
  const handlePayment = async () => {
    if (remainingAmount > 0.01) {
      alert('Please complete payment for the full amount');
      return;
    }
    
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    onComplete(paymentMethods);
  };

  const paymentOptions = [
    {
      id: 'card' as const,
      name: 'Credit Card',
      icon: CreditCard,
      description: 'Visa, MasterCard, Amex'
    },
    {
      id: 'cash' as const,
      name: 'Cash',
      icon: DollarSign,
      description: 'Physical cash payment'
    },
    {
      id: 'digital' as const,
      name: 'Digital Wallet',
      icon: Smartphone,
      description: 'Apple Pay, Google Pay'
    },
    {
      id: 'gift_card' as const,
      name: 'Gift Card',
      icon: Gift,
      description: 'Store gift card'
    },
    {
      id: 'store_credit' as const,
      name: 'Store Credit',
      icon: User,
      description: 'Customer store credit'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
            <div className="w-16"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Order Summary */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {customer && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Customer</h3>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-blue-600">{customer.loyaltyPoints} loyalty points</div>
                  </div>
                </div>
              )}

              {discount && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <h3 className="font-medium text-green-900">Applied Discount</h3>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{discount.name}</div>
                    <div className="text-green-600">{discount.code} - ${discountAmount.toFixed(2)} off</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Payment */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
                
                {/* Current Payments */}
                {paymentMethods.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {paymentMethods.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm capitalize">{payment.type.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${payment.amount.toFixed(2)}</span>
                          <button
                            onClick={() => removePaymentMethod(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="text-sm text-gray-600">
                      Remaining: ${remainingAmount.toFixed(2)}
                    </div>
                  </div>
                )}
                
                {/* Add Payment Method */}
                {remainingAmount > 0.01 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {paymentOptions.map(method => (
                        <button
                          key={method.id}
                          onClick={() => setCurrentPaymentType(method.id)}
                          className={`p-2 rounded-lg border transition-colors text-left ${
                            currentPaymentType === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <method.icon className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">{method.name}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={currentPaymentAmount}
                        onChange={(e) => setCurrentPaymentAmount(e.target.value)}
                        placeholder="Amount"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        step="0.01"
                        max={remainingAmount}
                      />
                      <button
                        onClick={() => setCurrentPaymentAmount(remainingAmount.toFixed(2))}
                        className="px-3 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Full
                      </button>
                      <button
                        onClick={addPaymentMethod}
                        disabled={!currentPaymentAmount || parseFloat(currentPaymentAmount) <= 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || remainingAmount > 0.01}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Receipt className="w-4 h-4" />
                    <span>Complete Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;