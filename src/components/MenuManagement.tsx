import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Product, Category } from '../types';

interface MenuManagementProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export function MenuManagement({
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: MenuManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
    };

    if (editingProduct) {
      onEditProduct({ ...productData, id: editingProduct.id });
    } else {
      onAddProduct(productData);
    }

    setFormData({ name: '', price: '', category: '', image: '' });
    setIsAdding(false);
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
    });
    setIsAdding(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingProduct ? 'Edit Item' : 'Add New Item'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingProduct ? 'Save Changes' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingProduct(null);
                setFormData({ name: '', price: '', category: '', image: '' });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden bg-white shadow-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
              <p className="text-gray-600">
                {categories.find((c) => c.id === product.category)?.name}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700
                           rounded hover:bg-blue-200"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700
                           rounded hover:bg-red-200"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}