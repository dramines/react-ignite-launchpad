import React from 'react';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onProductDrop: (product: Product, event: React.MouseEvent<HTMLDivElement>) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, onProductDrop }) => {
  const handleDragEnd = (product: Product) => (event: React.MouseEvent<HTMLDivElement>) => {
    onProductDrop(product, event);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="relative cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => onProductClick(product)}
          onDragEnd={(e: React.MouseEvent<HTMLDivElement>) => handleDragEnd(product)(e)}
          draggable
        >
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.material}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">{product.price} TND</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;