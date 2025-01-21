import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleProduct } from '@/services/productsApi';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import ProductDetailContent from './ProductDetailContent';
import { Product } from '@/types/product';
import { preloadImage } from '@/utils/imageOptimization';

const ProductDetailContainer = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [personalizationText, setPersonalizationText] = useState('');

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchSingleProduct(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Preload images while showing loading spinner
  useEffect(() => {
    if (product) {
      const preloadProductImages = async () => {
        console.log('Starting to preload product images');
        const images = [
          product.image,
          product.image2,
          product.image3,
          product.image4,
        ].filter(Boolean) as string[];

        try {
          // First preload thumbnails for quick display
          await Promise.all(
            images.map(image => preloadImage(image, 160, 'thumbnail'))
          );
          console.log('Thumbnails preloaded successfully');

          // Then preload full-size images
          await Promise.all(
            images.map(image => preloadImage(image, 800, 'full'))
          );
          console.log('Full-size images preloaded successfully');
        } catch (error) {
          console.error('Error preloading images:', error);
        }
      };

      preloadProductImages();
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const availableSizes = Object.entries(product.sizes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([size]) => size);
      
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      }
    }
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) return <div>Error loading product</div>;

  return (
    <ProductDetailContent
      product={product}
      selectedSize={selectedSize}
      selectedQuantity={selectedQuantity}
      isPersonalized={isPersonalized}
      personalizationText={personalizationText}
      onQuantityChange={setSelectedQuantity}
      onSizeChange={setSelectedSize}
      onPersonalizationChange={setIsPersonalized}
      onPersonalizationTextChange={setPersonalizationText}
    />
  );
};

export default ProductDetailContainer;