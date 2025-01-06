import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/services/productsApi';
import { Input } from "@/components/ui/input";
import { Product } from '@/types/product';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CategoriesDisplay from './components/CategoriesDisplay';
import ProductGrid from './components/ProductGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';

interface ProductSelectionPanelProps {
  onItemDrop: (item: Product) => void;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const itemsPerPage = 4;
  const isMobile = useIsMobile();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', packType, selectedContainerIndex, selectedItems],
    queryFn: fetchAllProducts,
    select: (data) => {
      let filteredProducts = data;
      const categories = getAvailableCategories();
      
      if (categories.length > 0) {
        filteredProducts = data.filter(product => {
          return categories.some(category => {
            if (category.type === 'itemgroup') {
              return product.itemgroup_product === category.value;
            } else if (category.type === 'type') {
              return product.type_product === category.value;
            }
            return false;
          });
        });
      }

      return filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleProductSelect = (product: Product) => {
    onItemDrop(product);
    setShowMobileDialog(false);
    toast({
      title: "Article sélectionné",
      description: "Cliquez sur un emplacement pour placer l'article",
      duration: 3000,
    });
  };

  const getAvailableCategories = () => {
    switch (packType) {
      case 'Pack Prestige':
        return selectedContainerIndex === 0 
          ? [{ label: 'Chemises', type: 'itemgroup', value: 'chemises' }]
          : [{ label: 'Accessoires', type: 'type', value: 'Accessoires' }];
      
      case 'Pack Premium':
        return selectedContainerIndex === 0
          ? [{ label: 'Cravates', type: 'itemgroup', value: 'Cravates' }]
          : [{ label: 'Accessoires', type: 'type', value: 'Accessoires' }];
      
      case 'Pack Trio':
        if (selectedContainerIndex === 0) {
          return [{ label: 'Portefeuilles', type: 'itemgroup', value: 'Portefeuilles' }];
        } else if (selectedContainerIndex === 1) {
          return [{ label: 'Ceintures', type: 'itemgroup', value: 'Ceintures' }];
        } else {
          return [{ label: 'Accessoires', type: 'type', value: 'Accessoires' }];
        }
      
      case 'Pack Duo':
        return selectedContainerIndex === 0
          ? [{ label: 'Portefeuilles', type: 'itemgroup', value: 'Portefeuilles' }]
          : [{ label: 'Ceintures', type: 'itemgroup', value: 'Ceintures' }];
      
      case 'Pack Mini Duo':
        return selectedContainerIndex === 0
          ? [{ label: 'Porte-cartes', type: 'itemgroup', value: 'Porte-cartes' }]
          : [{ label: 'Porte-clés', type: 'itemgroup', value: 'Porte-clés' }];
      
      default:
        return [];
    }
  };

  const content = (
    <div className="space-y-4 flex-1 flex flex-col max-h-[calc(100vh-10rem)]">
      <div className="relative flex-shrink-0 px-2">
        <Search className="absolute left-5 top-3 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Rechercher des produits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/50 border-white/30"
        />
      </div>

      <CategoriesDisplay 
        categories={getAvailableCategories()} 
        selectedItems={selectedItems}
        packType={packType}
      />
      
      <div className="flex-1 overflow-y-auto min-h-0">
        <ProductGrid 
          products={paginatedProducts}
          onDragStart={(e, product) => e.dataTransfer.setData('product', JSON.stringify(product))}
          onProductSelect={handleProductSelect}
        />
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 px-2 sticky bottom-0 bg-white/90 backdrop-blur-sm">
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
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="bg-[#700100] hover:bg-[#590000] text-white border-none"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button 
          onClick={() => setShowMobileDialog(true)}
          className="w-full mb-4 bg-[#700100] hover:bg-[#590000] text-white"
        >
          Sélectionner un article
        </Button>
        
        <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
          <DialogContent className="w-[95vw] max-w-[500px] h-[80vh] flex flex-col">
            <DialogTitle className="text-lg font-medium text-[#700100]">
              Sélectionner un article
            </DialogTitle>
            {content}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 h-[90%] flex flex-col">
      {content}
    </div>
  );
};

export default ProductSelectionPanel;