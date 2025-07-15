import React, { useState } from 'react';
import { X, Plus, Search, User, Mail, Phone, MapPin, Gift, Calendar, DollarSign } from 'lucide-react';
import { Customer } from '../types';

interface CustomerManagementProps {
  customers: Customer[];
  onClose: () => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onClose,
  onAddCustomer,
  onUpdateCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    preferences: {
      emailReceipts: true,
      marketingEmails: false,
      smsNotifications: false
    }
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer = {
      ...formData,
      loyaltyPoints: 0,
      totalSpent: 0,
      joinDate: new Date()
    };
    onAddCustomer(newCustomer);
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      preferences: {
        emailReceipts: true,
        marketingEmails: false,
        smsNotifications: false
      }
    });
  };

  const handleUpdatePreferences = (customerId: string, preferences: any) => {
    onUpdateCustomer(customerId, { preferences });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Customer Management</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customers ({filteredCustomers.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {customer.loyaltyPoints} pts
                        </div>
                        <div className="text-sm text-gray-500">
                          ${customer.totalSpent.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div>
              {selectedCustomer ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Gift className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">Loyalty Points</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          {selectedCustomer.loyaltyPoints}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Total Spent</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          ${selectedCustomer.totalSpent.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedCustomer.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedCustomer.phone}</span>
                        </div>
                        {selectedCustomer.address && (
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="text-sm">
                              <div>{selectedCustomer.address.street}</div>
                              <div>
                                {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedCustomer.preferences?.emailReceipts || false}
                            onChange={(e) => handleUpdatePreferences(selectedCustomer.id, {
                              ...selectedCustomer.preferences,
                              emailReceipts: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">Email receipts</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedCustomer.preferences?.marketingEmails || false}
                            onChange={(e) => handleUpdatePreferences(selectedCustomer.id, {
                              ...selectedCustomer.preferences,
                              marketingEmails: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">Marketing emails</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedCustomer.preferences?.smsNotifications || false}
                            onChange={(e) => handleUpdatePreferences(selectedCustomer.id, {
                              ...selectedCustomer.preferences,
                              smsNotifications: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">SMS notifications</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined: {selectedCustomer.joinDate.toLocaleDateString()}</span>
                        </div>
                        {selectedCustomer.lastVisit && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Last visit: {selectedCustomer.lastVisit.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Select a customer to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Customer Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Customer</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.address.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, zipCode: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferences
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.preferences.emailReceipts}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, emailReceipts: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Email receipts</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.preferences.marketingEmails}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, marketingEmails: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Marketing emails</span>
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Add Customer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;