import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/services/productsApi';
import { Input } from "@/components/ui/input";
import { Product } from '@/types/product';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CategoriesDisplay from './components/CategoriesDisplay';
import ProductGrid from './components/ProductGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import AddItemDialog from './dialogs/AddItemDialog';
import { playTickSound } from '@/utils/audio';
import { toast } from '@/hooks/use-toast';
import { getAvailableCategories } from '@/utils/categoryUtils';
import { preloadImage } from '@/utils/imageOptimization';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProductSelectionPanelProps {
  onItemDrop: (item: Product, size: string, personalization: string) => void;
  packType: string;
  selectedContainerIndex: number;
  selectedItems: Product[];
}

const ProductSelectionPanel = ({ 
  onItemDrop, 
  packType, 
  selectedContainerIndex,
  selectedItems 
}: ProductSelectionPanelProps) => {
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [personalization, setPersonalization] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsPerPage = 4;
  const isMobile = useIsMobile();

  const containerCount = React.useMemo(() => {
    if (['Pack Chemise', 'Pack Ceinture', 'Pack Cravatte', 'Pack Malette'].includes(packType)) return 1;
    return ['Pack Duo', 'Pack Mini Duo'].includes(packType) ? 2 : 3;
  }, [packType]);

  const isPackComplete = selectedItems.length >= containerCount;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', packType, selectedContainerIndex, selectedItems, searchTerm],
    queryFn: fetchAllProducts,
    select: (data) => {
      if (isPackComplete) return [];
      
      let filteredProducts = data;
      const categories = getAvailableCategories(packType, selectedContainerIndex, selectedItems);
      
      if (categories.length > 0) {
        filteredProducts = data.filter(product => {
          return categories.some(category => {
            if (category.type === 'itemgroup') {
              if (category.additionalFilter) {
                return product.itemgroup_product === category.value && 
                       product[category.additionalFilter.field as keyof Product] === category.additionalFilter.value;
              }
              return product.itemgroup_product === category.value;
            }
            if (category.type === 'type') {
              return product.type_product === category.value;
            }
            return false;
          });
        });

        filteredProducts = filteredProducts.filter(product => 
          !selectedItems.some(item => item.id === product.id)
        );

        if (packType === 'Pack Trio') {
          const orderMap = {
            'ceintures': 1,
            'portefeuilles': 2,
            'porte-cles': 3
          };
          
          filteredProducts.sort((a, b) => {
            const orderA = orderMap[a.itemgroup_product as keyof typeof orderMap] || 999;
            const orderB = orderMap[b.itemgroup_product as keyof typeof orderMap] || 999;
            return orderA - orderB;
          });
        }
      }

      return filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  // Preload images
  useEffect(() => {
    if (products && products.length > 0 && !isImagesLoaded) {
      const preloadImages = async () => {
        try {
          console.log('Starting to preload product images');
          
          // First preload thumbnails
          await Promise.all(
            products.map(product => preloadImage(product.image, 160, 'thumbnail'))
          );
          console.log('Thumbnails preloaded successfully');
          
          // Then preload full-size images
          await Promise.all(
            products.map(product => preloadImage(product.image, 400, 'preview'))
          );
          console.log('Full-size images preloaded successfully');
          
          setIsImagesLoaded(true);
        } catch (error) {
          console.error('Error preloading images:', error);
          // Still set images as loaded to prevent blocking indefinitely
          setIsImagesLoaded(true);
        }
      };

      preloadImages();
    }
  }, [products]);

  const handleProductSelect = (product: Product) => {
    if (isMobile) {
      setSelectedProduct(product);
      setShowAddDialog(true);
      playTickSound();
    }
  };

  const handleConfirm = () => {
    if (selectedProduct && selectedSize) {
      const productWithSize = {
        ...selectedProduct,
        size: selectedSize,
        personalization: personalization
      };
      onItemDrop(productWithSize, selectedSize, personalization);
      setShowAddDialog(false);
      setSelectedSize('');
      setPersonalization('');
      setSelectedProduct(null);
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

  if (isLoading || !isImagesLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/30 to-red-900/30 blur-xl" />
          <motion.div 
            className="relative backdrop-blur-md rounded-full p-8 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </motion.div>
        </div>
        <motion.p 
          className="absolute bottom-1/4 text-white text-xl font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Chargement des produits...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 h-[90%] flex flex-col">
      <div className="space-y-6 flex-1 flex flex-col">
        {isPackComplete ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-2xl font-semibold text-[#700100] text-center">
              Pack Complété !
            </div>
            <p className="text-gray-600 text-center">
              Vous avez sélectionné tous les articles pour votre pack.
            </p>
          </div>
        ) : (
          <>
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/30"
              />
            </div>

            <CategoriesDisplay 
              categories={getAvailableCategories(packType, selectedContainerIndex, selectedItems)} 
              selectedItems={selectedItems}
              packType={packType}
            />
            
            <ProductGrid 
              products={products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
              onDragStart={(e, product) => {
                e.dataTransfer.setData('product', JSON.stringify(product));
              }}
              onProductSelect={handleProductSelect}
            />

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-[#700100] hover:bg-[#590000] text-white border-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} sur {Math.ceil((products?.length || 0) / itemsPerPage)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(Math.ceil((products?.length || 0) / itemsPerPage), p + 1))}
                disabled={currentPage >= Math.ceil((products?.length || 0) / itemsPerPage)}
                className="bg-[#700100] hover:bg-[#590000] text-white border-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        droppedItem={selectedProduct}
        selectedSize={selectedSize}
        personalization={personalization}
        onSizeSelect={setSelectedSize}
        onPersonalizationChange={setPersonalization}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ProductSelectionPanel;
