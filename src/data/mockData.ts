import { Product, Transaction, InventoryMovement, Supplier, StockReceiving, Customer, Discount, User, Shift, Expense } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    price: 2.99,
    costPrice: 1.50,
    category: 'Fruits',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890123',
    stock: 50,
    minStock: 10,
    description: 'Fresh organic bananas',
    supplier: 'Fresh Farms Co.'
  },
  {
    id: '2',
    name: 'Whole Milk',
    price: 3.49,
    costPrice: 2.20,
    category: 'Dairy',
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890124',
    stock: 25,
    minStock: 5,
    description: 'Fresh whole milk 1 gallon',
    supplier: 'Dairy Direct'
  },
  {
    id: '3',
    name: 'Artisan Bread',
    price: 4.99,
    costPrice: 2.80,
    category: 'Bakery',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890125',
    stock: 15,
    minStock: 3,
    description: 'Freshly baked artisan bread',
    supplier: 'Local Bakery'
  },
  {
    id: '4',
    name: 'Ground Coffee',
    price: 8.99,
    costPrice: 5.50,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890126',
    stock: 30,
    minStock: 8,
    description: 'Premium ground coffee beans',
    supplier: 'Coffee Roasters Inc.'
  },
  {
    id: '5',
    name: 'Fresh Salmon',
    price: 12.99,
    costPrice: 8.50,
    category: 'Seafood',
    image: 'https://images.pexels.com/photos/1879020/pexels-photo-1879020.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890127',
    stock: 8,
    minStock: 2,
    description: 'Fresh Atlantic salmon fillet',
    supplier: 'Ocean Fresh'
  },
  {
    id: '6',
    name: 'Organic Apples',
    price: 4.99,
    costPrice: 2.75,
    category: 'Fruits',
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890128',
    stock: 40,
    minStock: 12,
    description: 'Fresh organic red apples',
    supplier: 'Fresh Farms Co.'
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    price: 5.99,
    costPrice: 3.20,
    category: 'Dairy',
    image: 'https://images.pexels.com/photos/1435733/pexels-photo-1435733.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890129',
    stock: 20,
    minStock: 6,
    description: 'Creamy Greek yogurt',
    supplier: 'Dairy Direct'
  },
  {
    id: '8',
    name: 'Chocolate Cake',
    price: 15.99,
    costPrice: 9.50,
    category: 'Bakery',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300',
    barcode: '1234567890130',
    stock: 5,
    minStock: 1,
    description: 'Rich chocolate layer cake',
    supplier: 'Local Bakery'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Farms Co.',
    contact: 'John Smith',
    email: 'orders@freshfarms.com',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Dairy Direct',
    contact: 'Sarah Johnson',
    email: 'supply@dairydirect.com',
    phone: '(555) 234-5678'
  },
  {
    id: '3',
    name: 'Local Bakery',
    contact: 'Mike Wilson',
    email: 'wholesale@localbakery.com',
    phone: '(555) 345-6789'
  },
  {
    id: '4',
    name: 'Coffee Roasters Inc.',
    contact: 'Lisa Brown',
    email: 'b2b@coffeeroasters.com',
    phone: '(555) 456-7890'
  },
  {
    id: '5',
    name: 'Ocean Fresh',
    contact: 'David Lee',
    email: 'orders@oceanfresh.com',
    phone: '(555) 567-8901'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Oak Street',
      city: 'Springfield',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    loyaltyPoints: 150,
    totalSpent: 450.75,
    joinDate: new Date('2023-06-15'),
    lastVisit: new Date('2024-01-14'),
    preferences: {
      emailReceipts: true,
      marketingEmails: true,
      smsNotifications: false
    }
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '(555) 234-5678',
    loyaltyPoints: 75,
    totalSpent: 225.50,
    joinDate: new Date('2023-08-22'),
    lastVisit: new Date('2024-01-10'),
    preferences: {
      emailReceipts: false,
      marketingEmails: false,
      smsNotifications: true
    }
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    phone: '(555) 345-6789',
    loyaltyPoints: 300,
    totalSpent: 890.25,
    joinDate: new Date('2023-03-10'),
    lastVisit: new Date('2024-01-15'),
    preferences: {
      emailReceipts: true,
      marketingEmails: false,
      smsNotifications: false
    }
  }
];

export const mockDiscounts: Discount[] = [
  {
    id: '1',
    code: 'SAVE10',
    name: '10% Off Everything',
    type: 'percentage',
    value: 10,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    usageCount: 25,
    usageLimit: 100
  },
  {
    id: '2',
    code: 'NEWCUSTOMER',
    name: 'New Customer $5 Off',
    type: 'fixed',
    value: 5,
    minPurchase: 25,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    usageCount: 12,
    usageLimit: 50
  },
  {
    id: '3',
    code: 'BULK20',
    name: '20% Off $100+',
    type: 'percentage',
    value: 20,
    minPurchase: 100,
    maxDiscount: 50,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    isActive: true,
    usageCount: 8
  }
];

export const mockShifts: Shift[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    startTime: new Date('2024-01-15T08:00:00'),
    endTime: new Date('2024-01-15T16:00:00'),
    startingCash: 200,
    endingCash: 285.50,
    totalSales: 1250.75,
    totalTransactions: 15,
    status: 'closed',
    notes: 'Busy day, no issues'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    startTime: new Date('2024-01-15T16:00:00'),
    endTime: new Date('2024-01-16T00:00:00'),
    startingCash: 200,
    endingCash: 195.25,
    totalSales: 875.50,
    totalTransactions: 12,
    status: 'closed'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Office Supplies',
    amount: 45.99,
    category: 'Supplies',
    date: new Date('2024-01-14'),
    approvedBy: 'Manager',
    notes: 'Printer paper and pens'
  },
  {
    id: '2',
    description: 'Equipment Repair',
    amount: 125.00,
    category: 'Maintenance',
    date: new Date('2024-01-12'),
    approvedBy: 'Manager',
    notes: 'Fixed cash register drawer'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    items: [
      { product: mockProducts[0], quantity: 2 },
      { product: mockProducts[1], quantity: 1 }
    ],
    subtotal: 8.47,
    total: 9.15,
    tax: 0.95,
    discount: 0,
    paymentMethod: [{ type: 'card', amount: 9.15 }],
    timestamp: new Date('2024-01-15T10:30:00'),
    cashier: 'John Doe',
    customer: mockCustomers[0],
    type: 'sale',
    status: 'completed'
  },
  {
    id: 'TXN002',
    items: [
      { product: mockProducts[2], quantity: 1 },
      { product: mockProducts[3], quantity: 1 }
    ],
    subtotal: 13.38,
    total: 14.45,
    tax: 1.44,
    discount: 0.60,
    paymentMethod: [{ type: 'cash', amount: 14.45 }],
    timestamp: new Date('2024-01-15T11:15:00'),
    cashier: 'Jane Smith',
    type: 'sale',
    status: 'completed'
  }
];

export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: 'INV001',
    productId: '1',
    productName: 'Organic Bananas',
    type: 'in',
    quantity: 100,
    reason: 'Stock Receiving',
    reference: 'RCV001',
    timestamp: new Date('2024-01-14T09:00:00'),
    user: 'Manager',
    unitCost: 1.50
  },
  {
    id: 'INV002',
    productId: '1',
    productName: 'Organic Bananas',
    type: 'out',
    quantity: 2,
    reason: 'Sale',
    reference: 'TXN001',
    timestamp: new Date('2024-01-15T10:30:00'),
    user: 'John Doe'
  },
  {
    id: 'INV003',
    productId: '2',
    productName: 'Whole Milk',
    type: 'in',
    quantity: 50,
    reason: 'Stock Receiving',
    reference: 'RCV002',
    timestamp: new Date('2024-01-14T14:30:00'),
    user: 'Manager',
    unitCost: 2.20
  }
];

export const mockStockReceiving: StockReceiving[] = [
  {
    id: 'RCV001',
    supplierId: '1',
    supplierName: 'Fresh Farms Co.',
    items: [
      { productId: '1', productName: 'Organic Bananas', quantity: 100, unitCost: 1.50 },
      { productId: '6', productName: 'Organic Apples', quantity: 80, unitCost: 2.75 }
    ],
    totalCost: 370.00,
    receivedBy: 'Manager',
    timestamp: new Date('2024-01-14T09:00:00'),
    notes: 'Weekly delivery - all items in good condition'
  }
];

export const categories = ['All', 'Fruits', 'Dairy', 'Bakery', 'Beverages', 'Seafood'];