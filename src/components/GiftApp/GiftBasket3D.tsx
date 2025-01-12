import React, { useState } from 'react';
import { Product } from '@/types/product';
import { playTickSound } from '@/utils/audio';
import { toast } from '@/hooks/use-toast';
import GiftPackContainer from './containers/GiftPackContainer';
import AddItemDialog from './dialogs/AddItemDialog';
import ProductDetailsDialog from './dialogs/ProductDetailsDialog';
import AddItemParticles from '../effects/AddItemParticles';

interface GiftBasket3DProps {
  items: Product[];
  onItemDrop: (item: Product, size: string, personalization: string) => void;
  onRemoveItem?: (index: number) => void;
  containerCount: number;
  onContainerSelect: (index: number) => void;
}

const GiftBasket3D = ({ 
  items, 
  onItemDrop, 
  onRemoveItem,
  containerCount,
  onContainerSelect
}: GiftBasket3DProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [personalization, setPersonalization] = useState('');
  const [droppedItem, setDroppedItem] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetContainer, setTargetContainer] = useState<number>(0);
  const [particlePosition, setParticlePosition] = useState<{ x: number; y: number } | null>(null);

  const handleDrop = (containerId: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('product'));
    setDroppedItem(item);
    setTargetContainer(containerId);
    onContainerSelect(containerId);
    setShowAddDialog(true);
    playTickSound();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setParticlePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setTimeout(() => {
      setParticlePosition(null);
    }, 1000);
  };

  const handleConfirm = () => {
    if (droppedItem && selectedSize && onItemDrop) {
      onItemDrop(droppedItem, selectedSize, personalization);
      setShowAddDialog(false);
      setSelectedSize('');
      setPersonalization('');
      setDroppedItem(null);
      toast({
        title: "Article ajouté au pack",
        description: "L'article a été ajouté avec succès à votre pack cadeau",
        style: {
          backgroundColor: '#700100',
          color: 'white',
          border: '1px solid #590000',
        },
        duration: 3000,
      });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <div className="space-y-2"> {/* Reduced from space-y-4 to space-y-2 */}
      <div className="p-6 bg-[#700100]/100 border-4 border-black rounded-xl shadow-xl">
        {containerCount === 3 ? (
          <div className="flex gap-3"> {/* Reduced from gap-4 to gap-3 */}
            {/* Left side - GRAND FORMAT container */}
            <div className="w-[65%] h-[583px]"> {/* Increased from 60% to 65% width and height from 530px to 583px (10% increase) */}
              <GiftPackContainer
                title="GRAND FORMAT"
                item={items[0]}
                onDrop={handleDrop(0)}
                onItemClick={handleProductClick}
                onRemoveItem={() => onRemoveItem?.(0)}
                containerIndex={0}
                className="h-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-[#ab2a3a]/20"
              />
              {particlePosition && targetContainer === 0 && (
                <AddItemParticles position={particlePosition} />
              )}
            </div>
            
            {/* Right side - Two MINI containers stacked */}
            <div className="w-[35%] flex flex-col gap-3"> {/* Increased from 40% to 35% width and reduced gap from gap-4 to gap-3 */}
              {[1, 2].map((index) => (
                <div key={index} className="h-[280px]"> {/* Increased from 255px to 280px (10% increase) */}
                  <GiftPackContainer
                    title="MINI"
                    item={items[index]}
                    onDrop={handleDrop(index)}
                    onItemClick={handleProductClick}
                    onRemoveItem={() => onRemoveItem?.(index)}
                    containerIndex={index}
                    className="h-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-[#ab2a3a]/20"
                  />
                  {particlePosition && targetContainer === index && (
                    <AddItemParticles position={particlePosition} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // For Pack Duo and Pack Mini Duo (2 containers)
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: containerCount }).map((_, index) => (
              <div key={index} className="relative h-[300px]">
                <GiftPackContainer
                  title="GRAND FORMAT"
                  item={items[index]}
                  onDrop={handleDrop(index)}
                  onItemClick={handleProductClick}
                  onRemoveItem={() => onRemoveItem?.(index)}
                  containerIndex={index}
                  className="h-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-[#ab2a3a]/20"
                />
                {particlePosition && targetContainer === index && (
                  <AddItemParticles position={particlePosition} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        droppedItem={droppedItem}
        selectedSize={selectedSize}
        personalization={personalization}
        onSizeSelect={setSelectedSize}
        onPersonalizationChange={setPersonalization}
        onConfirm={handleConfirm}
      />

      <ProductDetailsDialog
        open={showProductModal}
        onOpenChange={setShowProductModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default GiftBasket3D;