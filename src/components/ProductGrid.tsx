import React from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductClick(product)}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-800">{product.name}</h3>
            <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}