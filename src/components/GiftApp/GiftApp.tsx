import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useCart } from "../cart/CartProvider";
import { toast } from "@/components/ui/use-toast";
import { playTickSound } from "@/utils/audio";
import ProductSelectionPanel from "./ProductSelectionPanel";
import GiftBasket3D from "./GiftBasket3D";
import PackSummary from "./PackSummary";
import ConfirmationButton from "./ConfirmationButton";
import { Product } from "@/types/product";
import { Package2, Gift } from 'lucide-react';

export interface GiftPack {
  items: Product[];
  totalPrice: number;
  note?: string;
}

const GiftApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [packNote, setPackNote] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const packType = window.location.pathname.split('/').pop();
    if (packType) {
      const formattedPackType = packType === 'packpremuim' ? 'Pack Premium' :
                               packType === 'packprestige' ? 'Pack Prestige' :
                               packType === 'packtrio' ? 'Pack Trio' :
                               packType === 'packduo' ? 'Pack Duo' :
                               packType === 'packminiduo' ? 'Pack Mini Duo' :
                               packType === 'packmono' ? 'Pack Mono' : 'aucun';
      sessionStorage.setItem('selectedPackType', formattedPackType);
    }
    
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleItemDrop = (item: Product) => {
    setSelectedItems((prev) => [...prev, item]);
    playTickSound();
    toast({
      title: "Article Ajouté! 🎁",
      description: "N'oubliez pas que vous pouvez ajouter un message personnalisé à votre pack!",
      style: {
        backgroundColor: '#700100',
        color: 'white',
        border: '1px solid #590000',
      },
    });
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    playTickSound();
  };

  const handleConfirmPack = async () => {
    setIsLoading(true);
    
    for (const item of selectedItems) {
      await new Promise(resolve => setTimeout(resolve, 500));
      addToCart({
        ...item,
        quantity: 1,
        personalization: item.personalization || packNote,
      });
    }

    toast({
      title: "Pack Ajouté au Panier! 🎉",
      description: "Vous allez être redirigé vers votre panier",
      style: {
        backgroundColor: '#700100',
        color: 'white',
        border: '1px solid #590000',
      },
    });

    setIsLoading(false);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f6f7f9] to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-4 border-[#700100] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[#700100] font-medium">Création de votre pack cadeau...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f7f9] to-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Package2 className="w-8 h-8 text-[#700100]" />
            <h1 className="text-3xl font-['WomanFontBold'] text-[#700100]">
              Créez Votre Pack Cadeau Personnalisé
            </h1>
            <Gift className="w-8 h-8 text-[#700100]" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sélectionnez vos articles préférés et créez un pack cadeau unique qui fera plaisir à vos proches.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            className="lg:col-span-4 h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductSelectionPanel onItemDrop={handleItemDrop} />
          </motion.div>

          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GiftBasket3D 
              items={selectedItems}
              onItemDrop={handleItemDrop}
              onRemoveItem={handleRemoveItem}
            />
          </motion.div>

          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PackSummary
              items={selectedItems}
              note={packNote}
              onNoteChange={setPackNote}
            />
            <ConfirmationButton
              onConfirm={handleConfirmPack}
              disabled={selectedItems.length === 0}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GiftApp;