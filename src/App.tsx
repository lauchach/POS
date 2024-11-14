import React, { useState } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CategoryFilter } from './components/CategoryFilter';
import { ExportButtons } from './components/ExportButtons';
import { MenuManagement } from './components/MenuManagement';
import { initialProducts, categories } from './data';
import { Product, CartItem } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allOrders, setAllOrders] = useState<CartItem[][]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleProductClick = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setAllOrders((prev) => [...prev, [...cartItems]]);
    alert('Order placed successfully!');
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Modern POS</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700
                       rounded-lg hover:bg-gray-200"
            >
              <Menu size={18} />
              Menu Management
            </button>
            <ExportButtons
              currentOrder={cartItems}
              allOrders={allOrders}
              total={total}
            />
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs
                               w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {showMenu ? (
          <MenuManagement
            products={products}
            categories={categories}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        ) : (
          <>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ProductGrid
              products={filteredProducts}
              onProductClick={handleProductClick}
            />
          </>
        )}
      </main>

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform
                   transition-transform duration-300 ease-in-out ${
                     isCartOpen ? 'translate-x-0' : 'translate-x-full'
                   }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

export default App;