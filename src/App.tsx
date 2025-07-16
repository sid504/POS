import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import Receipt from './components/Receipt';
import TransactionHistory from './components/TransactionHistory';
import InventoryManagement from './components/InventoryManagement';
import StockReceiving from './components/StockReceiving';
import ReturnManagement from './components/ReturnManagement';
import CustomerManagement from './components/CustomerManagement';
import DiscountManagement from './components/DiscountManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import ShiftManagement from './components/ShiftManagement';
import StoreSettings from './components/StoreSettings';
import VariantTypeManagement from './components/VariantTypeManagement';
import ProductManagement from './components/ProductManagement';
import { Product, CartItem, Transaction, InventoryMovement, Customer, Discount, Shift, Expense, PaymentMethod } from './types';
import { 
  mockProducts, 
  mockTransactions, 
  mockInventoryMovements, 
  mockSuppliers, 
  mockCustomers,
  mockDiscounts,
  mockShifts,
  mockExpenses,
  mockVariantTypes,
  categories 
} from './data/mockData';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(mockInventoryMovements);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [variantTypes, setVariantTypes] = useState(mockVariantTypes);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  
  // Modal states
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showStockReceiving, setShowStockReceiving] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showShifts, setShowShifts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVariantTypes, setShowVariantTypes] = useState(false);
  const [showProductManagement, setShowProductManagement] = useState(false);
  
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const addToCart = (product: Product) => {
    const currentProduct = products.find(p => p.id === product.id);
    if (!currentProduct || currentProduct.stock <= 0) {
      alert('Product is out of stock');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > currentProduct.stock) {
          alert('Not enough stock available');
          return prevCart;
        }
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevCart, { product: currentProduct, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      alert('Not enough stock available');
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const applyDiscount = (discountCode: string) => {
    const discount = discounts.find(d => 
      d.code === discountCode && 
      d.isActive && 
      new Date() >= d.startDate && 
      new Date() <= d.endDate &&
      (!d.usageLimit || d.usageCount < d.usageLimit)
    );

    if (!discount) {
      alert('Invalid or expired discount code');
      return false;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    if (discount.minPurchase && subtotal < discount.minPurchase) {
      alert(`Minimum purchase of $${discount.minPurchase.toFixed(2)} required`);
      return false;
    }

    setAppliedDiscount(discount);
    return true;
  };

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    switch (appliedDiscount.type) {
      case 'percentage':
        const percentageDiscount = subtotal * (appliedDiscount.value / 100);
        return appliedDiscount.maxDiscount 
          ? Math.min(percentageDiscount, appliedDiscount.maxDiscount)
          : percentageDiscount;
      case 'fixed':
        return Math.min(appliedDiscount.value, subtotal);
      default:
        return 0;
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentComplete = (paymentMethods: PaymentMethod[]) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = calculateDiscount();
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.08;
    const total = discountedSubtotal + tax;

    const transaction: Transaction = {
      id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
      items: cart,
      subtotal,
      total,
      tax,
      discount: discountAmount,
      paymentMethod: paymentMethods,
      timestamp: new Date(),
      cashier: user?.name || 'Unknown',
      customer: selectedCustomer,
      type: 'sale',
      status: 'completed'
    };

    // Update product stock and create inventory movements
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.product.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    });

    const newInventoryMovements = cart.map(item => ({
      id: `INV${String(inventoryMovements.length + cart.indexOf(item) + 1).padStart(3, '0')}`,
      productId: item.product.id,
      productName: item.product.name,
      type: 'out' as const,
      quantity: item.quantity,
      reason: 'Sale',
      reference: transaction.id,
      timestamp: new Date(),
      user: user?.name || 'Unknown'
    }));

    // Update customer loyalty points and spending
    if (selectedCustomer) {
      const pointsEarned = Math.floor(total);
      const updatedCustomers = customers.map(customer =>
        customer.id === selectedCustomer.id
          ? {
              ...customer,
              loyaltyPoints: customer.loyaltyPoints + pointsEarned,
              totalSpent: customer.totalSpent + total,
              lastVisit: new Date()
            }
          : customer
      );
      setCustomers(updatedCustomers);
    }

    // Update discount usage
    if (appliedDiscount) {
      const updatedDiscounts = discounts.map(discount =>
        discount.id === appliedDiscount.id
          ? { ...discount, usageCount: discount.usageCount + 1 }
          : discount
      );
      setDiscounts(updatedDiscounts);
    }

    setProducts(updatedProducts);
    setInventoryMovements(prev => [...prev, ...newInventoryMovements]);
    setTransactions(prev => [...prev, transaction]);
    setCurrentTransaction(transaction);
    setCart([]);
    setSelectedCustomer(null);
    setAppliedDiscount(null);
    setShowCheckout(false);
    setShowReceipt(true);
  };

  const handleUpdateStock = (productId: string, newStock: number, reason: string, notes?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const difference = newStock - product.stock;
    const movementType = difference > 0 ? 'in' : 'out';
    const quantity = Math.abs(difference);

    if (quantity === 0) return;

    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, stock: newStock } : p
    );

    const newMovement: InventoryMovement = {
      id: `INV${String(inventoryMovements.length + 1).padStart(3, '0')}`,
      productId,
      productName: product.name,
      type: movementType,
      quantity,
      reason,
      timestamp: new Date(),
      user: user?.name || 'Unknown',
      notes
    };

    setProducts(updatedProducts);
    setInventoryMovements(prev => [...prev, newMovement]);
  };

  const handleReceiveStock = (
    supplierId: string,
    items: { productId: string; quantity: number; unitCost: number }[],
    notes?: string
  ) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    const updatedProducts = products.map(product => {
      const receivedItem = items.find(item => item.productId === product.id);
      if (receivedItem) {
        return {
          ...product,
          stock: product.stock + receivedItem.quantity,
          costPrice: receivedItem.unitCost
        };
      }
      return product;
    });

    const newMovements = items.map((item, index) => {
      const product = products.find(p => p.id === item.productId);
      return {
        id: `INV${String(inventoryMovements.length + index + 1).padStart(3, '0')}`,
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        type: 'in' as const,
        quantity: item.quantity,
        reason: 'Stock Receiving',
        reference: `RCV${String(Date.now()).slice(-6)}`,
        timestamp: new Date(),
        user: user?.name || 'Unknown',
        notes,
        unitCost: item.unitCost
      };
    });

    setProducts(updatedProducts);
    setInventoryMovements(prev => [...prev, ...newMovements]);
  };

  const handleProcessReturn = (
    items: { productId: string; quantity: number; reason: string }[],
    originalTransactionId?: string
  ) => {
    const updatedProducts = products.map(product => {
      const returnItem = items.find(item => item.productId === product.id);
      if (returnItem) {
        return { ...product, stock: product.stock + returnItem.quantity };
      }
      return product;
    });

    const newMovements = items.map((item, index) => {
      const product = products.find(p => p.id === item.productId);
      return {
        id: `INV${String(inventoryMovements.length + index + 1).padStart(3, '0')}`,
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        type: 'return' as const,
        quantity: item.quantity,
        reason: `Return: ${item.reason}`,
        reference: originalTransactionId,
        timestamp: new Date(),
        user: user?.name || 'Unknown',
        notes: `Return processed - ${item.reason}`
      };
    });

    setProducts(updatedProducts);
    setInventoryMovements(prev => [...prev, ...newMovements]);
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST${String(customers.length + 1).padStart(3, '0')}`
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleUpdateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === id ? { ...customer, ...updates } : customer
      )
    );
  };

  const handleAddDiscount = (discountData: Omit<Discount, 'id' | 'usageCount'>) => {
    const newDiscount: Discount = {
      ...discountData,
      id: `DISC${String(discounts.length + 1).padStart(3, '0')}`,
      usageCount: 0
    };
    setDiscounts(prev => [...prev, newDiscount]);
  };

  const handleUpdateDiscount = (id: string, updates: Partial<Discount>) => {
    setDiscounts(prev =>
      prev.map(discount =>
        discount.id === id ? { ...discount, ...updates } : discount
      )
    );
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(discount => discount.id !== id));
  };

  const handleStartShift = (startingCash: number) => {
    const newShift: Shift = {
      id: `SHIFT${String(shifts.length + 1).padStart(3, '0')}`,
      userId: user?.id || '',
      userName: user?.name || 'Unknown',
      startTime: new Date(),
      startingCash,
      totalSales: 0,
      totalTransactions: 0,
      status: 'active'
    };
    setShifts(prev => [...prev, newShift]);
  };

  const handleEndShift = (shiftId: string, endingCash: number, notes?: string) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId
          ? {
              ...shift,
              endTime: new Date(),
              endingCash,
              status: 'closed' as const,
              notes
            }
          : shift
      )
    );
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={user?.name || 'Unknown'}
        currentTime={currentTime}
        cartItemCount={cartItemCount}
        onViewHistory={() => setShowHistory(true)}
        onViewInventory={() => setShowInventory(true)}
        onViewStockReceiving={() => setShowStockReceiving(true)}
        onViewReturns={() => setShowReturns(true)}
        onViewCustomers={() => setShowCustomers(true)}
        onViewDiscounts={() => setShowDiscounts(true)}
        onViewReports={() => setShowReports(true)}
        onViewShifts={() => setShowShifts(true)}
        onViewSettings={() => setShowSettings(true)}
        onViewVariantTypes={() => setShowVariantTypes(true)}
        onViewProductManagement={() => setShowProductManagement(true)}
        userRole={user?.role || 'cashier'}
      />
      
      <div className="flex">
        <ProductGrid
          products={products}
          categories={categories}
          onAddToCart={addToCart}
        />
        
        <ShoppingCart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={setSelectedCustomer}
          customers={customers}
          appliedDiscount={appliedDiscount}
          onApplyDiscount={applyDiscount}
          onRemoveDiscount={() => setAppliedDiscount(null)}
          discountAmount={calculateDiscount()}
        />
      </div>

      {showCheckout && (
        <Checkout
          items={cart}
          customer={selectedCustomer}
          discount={appliedDiscount}
          discountAmount={calculateDiscount()}
          onBack={() => setShowCheckout(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {showReceipt && currentTransaction && (
        <Receipt
          transaction={currentTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {showHistory && (
        <TransactionHistory
          transactions={transactions}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showInventory && (
        <InventoryManagement
          products={products}
          inventoryMovements={inventoryMovements}
          onClose={() => setShowInventory(false)}
          onUpdateStock={handleUpdateStock}
        />
      )}

      {showStockReceiving && (
        <StockReceiving
          products={products}
          suppliers={mockSuppliers}
          onClose={() => setShowStockReceiving(false)}
          onReceiveStock={handleReceiveStock}
        />
      )}

      {showReturns && (
        <ReturnManagement
          products={products}
          transactions={transactions}
          onClose={() => setShowReturns(false)}
          onProcessReturn={handleProcessReturn}
        />
      )}

      {showCustomers && (
        <CustomerManagement
          customers={customers}
          onClose={() => setShowCustomers(false)}
          onAddCustomer={handleAddCustomer}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}

      {showDiscounts && (
        <DiscountManagement
          discounts={discounts}
          onClose={() => setShowDiscounts(false)}
          onAddDiscount={handleAddDiscount}
          onUpdateDiscount={handleUpdateDiscount}
          onDeleteDiscount={handleDeleteDiscount}
        />
      )}

      {showReports && (
        <ReportsAnalytics
          transactions={transactions}
          products={products}
          customers={customers}
          onClose={() => setShowReports(false)}
        />
      )}

      {showShifts && (
        <ShiftManagement
          shifts={shifts}
          transactions={transactions}
          onClose={() => setShowShifts(false)}
          onStartShift={handleStartShift}
          onEndShift={handleEndShift}
        />
      )}

      {showSettings && (
        <StoreSettings
          onClose={() => setShowSettings(false)}
        />
      )}

      {showVariantTypes && (
        <VariantTypeManagement
          variantTypes={variantTypes}
          onClose={() => setShowVariantTypes(false)}
          onAddVariantType={(variantType) => {
            const newVariantType = {
              ...variantType,
              id: `VT${String(variantTypes.length + 1).padStart(3, '0')}`
            };
            setVariantTypes(prev => [...prev, newVariantType]);
          }}
          onUpdateVariantType={(id, updates) => {
            setVariantTypes(prev =>
              prev.map(vt => vt.id === id ? { ...vt, ...updates } : vt)
            );
          }}
          onDeleteVariantType={(id) => {
            setVariantTypes(prev => prev.filter(vt => vt.id !== id));
          }}
        />
      )}

      {showProductManagement && (
        <ProductManagement
          products={products}
          variantTypes={variantTypes}
          onClose={() => setShowProductManagement(false)}
          onAddProduct={(product) => {
            const newProduct = {
              ...product,
              id: `PROD${String(products.length + 1).padStart(3, '0')}`
            };
            setProducts(prev => [...prev, newProduct]);
          }}
          onUpdateProduct={(id, updates) => {
            setProducts(prev =>
              prev.map(p => p.id === id ? { ...p, ...updates } : p)
            );
          }}
          onDeleteProduct={(id) => {
            setProducts(prev => prev.filter(p => p.id !== id));
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;