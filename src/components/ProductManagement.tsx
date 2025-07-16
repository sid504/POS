import React, { useState } from 'react';
import { X, Plus, Search, Package, Edit, Trash2, Save, Upload, Palette } from 'lucide-react';
import { Product, VariantType, ProductVariant } from '../types';

interface ProductManagementProps {
  products: Product[];
  variantTypes: VariantType[];
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  variantTypes,
  onClose,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    costPrice: 0,
    category: '',
    subcategory: '',
    image: '',
    barcode: '',
    stock: 0,
    minStock: 0,
    description: '',
    supplier: '',
    variants: [] as ProductVariant[],
    isWeighted: false,
    weight: 0
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Fruits', 'Dairy', 'Bakery', 'Beverages', 'Seafood', 'Clothing', 'Electronics', 'Books', 'Home & Garden'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      id: `PROD${String(products.length + 1).padStart(3, '0')}`
    };
    onAddProduct(newProduct);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      costPrice: 0,
      category: '',
      subcategory: '',
      image: '',
      barcode: '',
      stock: 0,
      minStock: 0,
      description: '',
      supplier: '',
      variants: [],
      isWeighted: false,
      weight: 0
    });
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}`,
      name: '',
      type: '',
      value: '',
      priceModifier: 0,
      stock: 0
    };
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant]
    });
  };

  const updateVariant = (variantId: string, updates: Partial<ProductVariant>) => {
    setFormData({
      ...formData,
      variants: formData.variants.map(variant =>
        variant.id === variantId ? { ...variant, ...updates } : variant
      )
    });
  };

  const removeVariant = (variantId: string) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter(variant => variant.id !== variantId)
    });
  };

  const getVariantTypeOptions = (typeName: string) => {
    const variantType = variantTypes.find(vt => vt.name === typeName);
    return variantType?.options || [];
  };

  const generateBarcode = () => {
    const barcode = Math.random().toString().slice(2, 15);
    setFormData({ ...formData, barcode });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Product Management</h2>
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
                placeholder="Search products..."
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
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Products ({filteredProducts.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                          <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                          {product.variants && product.variants.length > 0 && (
                            <div className="text-xs text-blue-600">{product.variants.length} variants</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          ${product.price.toFixed(2)}
                        </div>
                        <div className="flex space-x-2 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProduct(product.id);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProduct(product.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              {selectedProduct ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                        <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                        <p className="text-sm text-gray-500">Barcode: {selectedProduct.barcode}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">Price</div>
                        <div className="text-lg font-bold text-green-600">${selectedProduct.price.toFixed(2)}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">Cost</div>
                        <div className="text-lg font-bold text-blue-600">${selectedProduct.costPrice.toFixed(2)}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">Stock</div>
                        <div className="text-lg font-bold text-gray-900">{selectedProduct.stock}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">Min Stock</div>
                        <div className="text-lg font-bold text-orange-600">{selectedProduct.minStock}</div>
                      </div>
                    </div>

                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                      <div className="bg-white rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">Product Variants</h5>
                        <div className="space-y-2">
                          {selectedProduct.variants.map(variant => {
                            const variantType = variantTypes.find(vt => vt.name === variant.type);
                            const option = variantType?.options.find(opt => opt.value === variant.value);
                            
                            return (
                              <div key={variant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  {variantType?.type === 'color' && option?.colorCode && (
                                    <div
                                      className="w-4 h-4 rounded border border-gray-300"
                                      style={{ backgroundColor: option.colorCode }}
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium">{variant.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {variantType?.displayName}: {option?.displayValue || variant.value}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">Stock: {variant.stock}</div>
                                  <div className="text-xs text-gray-500">
                                    {variant.priceModifier >= 0 ? '+' : ''}${variant.priceModifier.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Select a product to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
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
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subcategory
                        </label>
                        <input
                          type="text"
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier
                        </label>
                        <input
                          type="text"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Pricing & Inventory */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Pricing & Inventory</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selling Price *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cost Price *
                        </label>
                        <input
                          type="number"
                          value={formData.costPrice}
                          onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Initial Stock *
                        </label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Stock Level *
                        </label>
                        <input
                          type="number"
                          value={formData.minStock}
                          onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Identification */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Product Identification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Barcode *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={formData.barcode}
                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={generateBarcode}
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Generate
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.isWeighted}
                          onChange={(e) => setFormData({ ...formData, isWeighted: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">This is a weighted product (sold by weight)</span>
                      </label>
                      {formData.isWeighted && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Variants */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-semibold text-gray-900">Product Variants</h4>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Variant</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {formData.variants.map(variant => (
                        <div key={variant.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Variant Name</label>
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="e.g., Red Large"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Type</label>
                              <select
                                value={variant.type}
                                onChange={(e) => updateVariant(variant.id, { type: e.target.value, value: '' })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              >
                                <option value="">Select type</option>
                                {variantTypes.map(vt => (
                                  <option key={vt.id} value={vt.name}>{vt.displayName}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Value</label>
                              <select
                                value={variant.value}
                                onChange={(e) => {
                                  const selectedOption = getVariantTypeOptions(variant.type).find(opt => opt.value === e.target.value);
                                  updateVariant(variant.id, { 
                                    value: e.target.value,
                                    priceModifier: selectedOption?.priceModifier || 0
                                  });
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                disabled={!variant.type}
                              >
                                <option value="">Select value</option>
                                {getVariantTypeOptions(variant.type).map(option => (
                                  <option key={option.id} value={option.value}>
                                    {option.displayValue}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Price Modifier</label>
                              <input
                                type="number"
                                value={variant.priceModifier}
                                onChange={(e) => updateVariant(variant.id, { priceModifier: parseFloat(e.target.value) || 0 })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                step="0.01"
                              />
                            </div>
                            
                            <div className="flex items-end space-x-1">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Stock</label>
                                <input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) => updateVariant(variant.id, { stock: parseInt(e.target.value) || 0 })}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  min="0"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVariant(variant.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Add Product
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

export default ProductManagement;