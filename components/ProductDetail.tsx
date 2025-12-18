import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { Product, User } from '../types';

interface ProductDetailProps {
  product: Product;
  user: User | null;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onAddReview: (productId: string, rating: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  user, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  onAddReview 
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(product.id, userRating);
    setShowReviewForm(false);
    setReviewText('');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header / Back Button */}
      <div className="sticky top-0 z-10 bg-blue-900 border-b border-blue-800 px-4 py-3 flex items-center shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-blue-800 rounded-full transition-colors mr-2 text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white truncate">{product.name}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-xs font-bold text-brand uppercase tracking-wider bg-green-50 px-2 py-1 rounded">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                 <Star size={16} className="fill-current" />
                 <span className="text-gray-900 font-bold ml-1 text-sm">{product.rating}</span>
              </div>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-500 text-sm">{product.reviews} Reviews</span>
            </div>
            
            <div className="flex items-end space-x-2 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-gray-400 text-sm mb-1">(Inclusive of all taxes)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 py-3 px-4 border border-brand text-brand font-bold rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center"
              >
                <ShoppingBag size={20} className="mr-2" />
                Add to Cart
              </button>
              <button 
                onClick={() => onBuyNow(product)}
                className="flex-1 py-3 px-4 bg-brand text-white font-bold rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                Buy Now
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Truck size={18} className="text-brand" />
                <span>Free Delivery above ₹1999</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <ShieldCheck size={18} className="text-brand" />
                <span>100% Organic Certified</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* How to Use */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">How to Use</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.howToUse}</p>
          </div>

          {/* Important Note */}
          <div className="mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <div className="flex items-start">
              <AlertCircle size={18} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-800 text-sm mb-1">Important Note</h3>
                <p className="text-yellow-700 text-xs">{product.note}</p>
              </div>
            </div>
          </div>

          {/* Manufacturer Details */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-3">Manufacturer Details</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2 border border-gray-100">
              <p className="font-semibold text-gray-800">{product.manufacturer.name}</p>
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-gray-400" />
                <span>{product.manufacturer.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-gray-400" />
                <span>{product.manufacturer.contact}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-gray-400" />
                <span>{product.manufacturer.email}</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Reviews Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Customer Reviews</h3>
              {user && user.role === 'user' && !showReviewForm && (
                <button 
                  onClick={() => setShowReviewForm(true)}
                  className="text-brand text-sm font-semibold hover:underline"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          className={star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Tell us what you think..."
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-brand rounded-lg hover:bg-green-600"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Mock Reviews List */}
            <div className="space-y-4">
               {/* Static Mock Reviews for UI demonstration */}
               <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-1">
                     <span className="font-bold text-sm text-gray-800">Priya Sharma</span>
                     <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-current" />)}
                  </div>
                  <p className="text-sm text-gray-600">Amazing product! Really helped with my issue. Will buy again.</p>
               </div>
               <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-1">
                     <span className="font-bold text-sm text-gray-800">Rahul Verma</span>
                     <span className="text-xs text-gray-400">1 week ago</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[1,2,3,4].map(i => <Star key={i} size={12} className="fill-current" />)}
                    <Star size={12} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-600">Good quality packaging and fast delivery.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;