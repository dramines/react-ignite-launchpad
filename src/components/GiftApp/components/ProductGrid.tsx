import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { GripVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductGridProps {
  products: Product[];
  onDragStart: (event: React.DragEvent<HTMLDivElement>, product: Product) => void;
  onProductSelect?: (product: Product) => void;
}

const ProductGrid = ({ products, onDragStart, onProductSelect }: ProductGridProps) => {
  const isMobile = useIsMobile();

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-center italic">
          Aucun article disponible pour le moment
        </p>
      </div>
    );
  }

  const handleProductInteraction = (e: React.MouseEvent<HTMLDivElement>, product: Product) => {
    if (isMobile && onProductSelect) {
      onProductSelect(product);
    } else if (!isMobile && e.type === 'dragstart') {
      onDragStart(e as React.DragEvent<HTMLDivElement>, product);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 overflow-y-auto flex-1 min-h-0 px-2">
      {products.map((product) => (
        <motion.div
          key={product.id}
          draggable={!isMobile}
          onDragStart={(e) => handleProductInteraction(e, product)}
          onClick={(e) => handleProductInteraction(e, product)}
          data-product-type={product.itemgroup_product}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`bg-white rounded-lg shadow-sm p-2 md:p-4 border border-gray-100/50 
            ${isMobile ? 'active:scale-95 transition-transform cursor-pointer' : 'cursor-grab active:cursor-grabbing'} 
            hover:shadow-md transition-all`}
        >
          <div className="relative">
            {!isMobile && <GripVertical className="absolute top-0 right-0 text-gray-400" size={16} />}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-16 md:h-24 object-contain mb-2"
            />
            <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-xs md:text-sm text-[#700100] font-medium mt-1">
              {product.price} TND
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;