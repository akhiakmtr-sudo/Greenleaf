import React, { useState } from 'react';
import { Plus, Star, MessageSquare } from 'lucide-react';
import { Product, User } from '../types';

interface ProductCardProps {
  product: Product;
  user: User | null;
  onAddToCart: (product: Product) => void;
  onAddReview?: (productId: string, rating: number) => void;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, user, onAddToCart, onAddReview, onClick }) => {
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [userRating, setUserRating] = useState(5);

  const handleReviewSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddReview) {
      onAddReview(product.id, userRating);
      setShowReviewInput(false);
    }
  };

  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center">
          <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
          {product.rating} <span className="text-gray-400 font-normal ml-1">({product.reviews})</span>
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="text-xs text-green-600 font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </div>
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Review Input for Logged In Users - Inline */}
        {showReviewInput && user?.role === 'user' ? (
          <div className="mb-3 bg-gray-50 p-2 rounded-lg" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-medium">Rate:</span>
               <div className="flex space-x-1">
                 {[1,2,3,4,5].map(star => (
                   <button key={star} onClick={() => setUserRating(star)}>
                     <Star size={12} className={star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                   </button>
                 ))}
               </div>
             </div>
             <button onClick={handleReviewSubmit} className="w-full bg-brand text-white text-xs py-1 rounded">Submit</button>
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
          <div className="flex space-x-2">
             <button 
               onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
               className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center hover:bg-green-600 active:scale-95 transition-all shadow-green-100 shadow-md"
               aria-label="Add to cart"
             >
               <Plus size={18} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;