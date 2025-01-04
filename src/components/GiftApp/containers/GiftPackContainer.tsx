import React from 'react';
import { Product } from '@/types/product';
import { Trash2, MoveDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface GiftPackContainerProps {
  title: string;
  item?: Product;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onItemClick?: (product: Product) => void;
  onRemoveItem?: (index: number) => void;
  containerIndex: number;
  className?: string;
}

const GiftPackContainer = ({
  title,
  item,
  onDrop,
  onItemClick,
  onRemoveItem,
  containerIndex,
  className = ""
}: GiftPackContainerProps) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!item) {
      e.preventDefault();
    }
  };

  const isSecondaryPack = containerIndex > 0;

  return (
    <div className={className}>
      <div className="p-4 h-full flex flex-col">
        <h3 className="text-lg font-medium text-[#6D0201] mb-3 border-b pb-2">{title}</h3>
        <div
          onDrop={onDrop}
          onDragOver={handleDragOver}
          className="relative flex-1 flex items-center justify-center"
        >
          {!item && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-gray-500 pointer-events-none">
              <MoveDown className="w-8 h-8 mb-2 text-gray-400" />
              <span>Glissez un article ici</span>
              <span className="text-xs text-gray-400 mt-1">
                {item ? '1/1' : '0/1'} emplacement utilisé
              </span>
            </div>
          )}

          {item && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group w-full"
            >
              <div
                onClick={() => onItemClick?.(item)}
                className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="relative">
                  <div className={`${isSecondaryPack ? 'w-16 h-16' : 'w-24 h-24'} rounded-md overflow-hidden bg-gray-50 flex-shrink-0`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  {item.size && (
                    <div className={`
                      absolute -top-2 -right-2 
                      ${isSecondaryPack ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'} 
                      bg-[#6D0201] text-white rounded-full font-medium
                    `}>
                      {item.size}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`${isSecondaryPack ? 'text-base' : 'text-lg'} font-medium text-gray-900 truncate`}>
                    {item.name}
                  </div>
                  <div className={`${isSecondaryPack ? 'text-xs' : 'text-sm'} text-gray-600 mt-2`}>
                    {item.color && <span>Couleur: {item.color}</span>}
                  </div>
                  <div className={`${isSecondaryPack ? 'text-sm' : 'text-base'} text-[#6D0201] font-medium mt-2`}>
                    {item.price.toFixed(2)} TND
                  </div>
                </div>
              </div>
              {onRemoveItem && (
                <button
                  onClick={() => onRemoveItem(containerIndex)}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                  aria-label="Retirer l'article"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftPackContainer;