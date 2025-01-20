import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services/productsApi';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import ProductDetailContent from './ProductDetailContent';
import { Product } from '@/types/product';
import { calculateFinalPrice } from '@/utils/priceCalculations';

const ProductDetailContainer = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [personalizationText, setPersonalizationText] = useState('');

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) return <div>Error loading product</div>;

  const hasDiscount = product.discount_product !== "" && 
                     !isNaN(parseFloat(product.discount_product)) && 
                     parseFloat(product.discount_product) > 0;

  const finalPrice = calculateFinalPrice(
    product.price,
    product.discount_product,
    product.itemgroup_product,
    isPersonalized
  );

  const totalPrice = finalPrice * selectedQuantity;

  const handleQuantityChange = (newQuantity: number) => {
    setSelectedQuantity(newQuantity);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handlePersonalizationChange = (isChecked: boolean) => {
    setIsPersonalized(isChecked);
    if (!isChecked) {
      setPersonalizationText('');
    }
  };

  const handlePersonalizationTextChange = (text: string) => {
    setPersonalizationText(text);
  };

  return (
    <ProductDetailContent
      product={product}
      selectedSize={selectedSize}
      selectedQuantity={selectedQuantity}
      isPersonalized={isPersonalized}
      personalizationText={personalizationText}
      hasDiscount={hasDiscount}
      totalPrice={totalPrice}
      onQuantityChange={handleQuantityChange}
      onSizeChange={handleSizeChange}
      onPersonalizationChange={handlePersonalizationChange}
      onPersonalizationTextChange={handlePersonalizationTextChange}
    />
  );
};

export default ProductDetailContainer;