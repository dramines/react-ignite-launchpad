import React from 'react';

const ProductDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 p-4">
        {/* Image skeleton */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-200 rounded-lg h-[500px]"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;