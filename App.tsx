import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Search, 
  Menu, 
  Home, 
  Store, 
  Truck,
  Headphones,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  X,
  LogOut,
  LayoutDashboard,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import { PRODUCTS } from './constants';
import { Product, ProductCategory, CartItem, User, Order } from './types';

function App() {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['All', 'Skincare', 'Pain Relief', 'Haircare', 'Weightloss', 'Other']);
  const [bannerImage, setBannerImage] = useState('https://res.cloudinary.com/dufnwlqeq/image/upload/v1764963752/01-01-2026_20251206_010808_0000_g5nf03.png');
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-001', customerName: 'John Smith', total: 4999, status: 'Delivered', date: '2023-10-01', items: [] },
    { id: 'ORD-002', customerName: 'Sarah Johnson', total: 1299, status: 'Processing', date: '2023-10-05', items: [] },
  ]);

  // Shopping State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product-detail' | 'cart' | 'auth' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // --- Auth Handlers ---
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      setCurrentView('admin');
    } else {
      // If was trying to buy something, go back to it
      if (selectedProduct && currentView === 'auth') {
        setCurrentView('product-detail');
      } else {
        setCurrentView('home');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setShowProfileMenu(false);
  };

  // --- Admin Handlers ---
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };
  const handleUpdateBanner = (url: string) => setBannerImage(url);
  const handleAddCategory = (cat: string) => setCategories(prev => [...prev, cat]);
  const handleDeleteCategory = (cat: string) => setCategories(prev => prev.filter(c => c !== cat));

  // --- User Handlers ---
  const addToCart = (product: Product) => {
    if (user && user.role === 'admin') {
      alert("Admins cannot shop!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, image: product.images[0] }];
    });
  };

  const handleBuyNow = (product: Product) => {
    if (!user) {
      alert("Please login to purchase products.");
      setCurrentView('auth');
      // We keep the selectedProduct set so we can return to it or auto-add later
      setSelectedProduct(product);
      return;
    }
    if (user.role === 'admin') {
      alert("Admins cannot shop!");
      return;
    }
    
    // Logic for Buy Now: Add to cart and go to cart (or direct checkout)
    addToCart(product);
    setCurrentView('cart');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleAddReview = (productId: string, rating: number) => {
     if (!user) {
       alert("Please login to add a review.");
       setCurrentView('auth');
       return;
     }
     setProducts(prev => prev.map(p => {
       if (p.id === productId) {
         const newCount = p.reviews + 1;
         const newRating = ((p.rating * p.reviews) + rating) / newCount;
         return { ...p, rating: parseFloat(newRating.toFixed(1)), reviews: newCount };
       }
       return p;
     }));
     alert("Thanks for your review!");
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo(0,0);
  };

  // --- Derived State ---
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery, products]);

  // --- Render Views ---

  if (currentView === 'auth') {
    return <Auth onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin' && user?.role === 'admin') {
    return (
      <AdminDashboard 
        products={products}
        orders={orders}
        bannerImage={bannerImage}
        categories={categories}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateBanner={handleUpdateBanner}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'product-detail' && selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct}
        user={user}
        onBack={() => setCurrentView('shop')}
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
        onAddReview={handleAddReview}
      />
    );
  }

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <div className="px-4 py-4">
        <div 
          className="rounded-2xl shadow-sm overflow-hidden cursor-pointer group relative"
          onClick={() => setCurrentView('shop')}
        >
          <img 
            src={bannerImage} 
            alt="Hero Banner" 
            className="w-full h-32 sm:h-40 md:h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-8">
        <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-50">
          <div className="bg-green-50 p-2 rounded-full mb-1 text-green-600">
            <Truck size={20} />
          </div>
          <h3 className="font-bold text-xs text-gray-800">Free Delivery</h3>
          <p className="text-[10px] text-gray-500">On orders above ₹1999</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-50">
          <div className="bg-green-50 p-2 rounded-full mb-1 text-green-600">
            <Headphones size={20} />
          </div>
          <h3 className="font-bold text-xs text-gray-800">Top Support</h3>
          <p className="text-[10px] text-gray-500">Expert herbalists 24/7</p>
        </div>
      </div>

      {/* Popular Products */}
      <div className="px-4 mb-12">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-gray-800">Popular Now</h2>
           <button onClick={() => setCurrentView('shop')} className="text-brand text-sm font-semibold">View All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              user={user}
              onAddToCart={addToCart} 
              onAddReview={handleAddReview}
              onClick={handleProductClick}
            />
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <section className="px-4 py-8 bg-white my-8 mx-4 rounded-2xl shadow-sm border border-gray-50">
        <div className="flex flex-col items-start gap-4">
           <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">About Us</h2>
              <div className="w-12 h-1 bg-brand mb-4"></div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Founded with a passion for holistic wellness, Green Leaf Herbals bridges the gap between ancient wisdom and modern lifestyle. We promise 100% organic, ethically sourced ingredients in every jar.
              </p>
              <button className="text-brand font-bold text-sm hover:underline flex items-center">
                Read Our Story <ArrowRight size={16} className="ml-1" />
              </button>
           </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="px-4 py-8 bg-white my-8 mx-4 rounded-2xl shadow-sm border border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-green-50 p-3 rounded-full text-brand shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Visit Us</h3>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                46/A1, PKP Complex, Mannur,<br/>
                Mattannur, Kannur, Kerala - 670702
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-full text-brand shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Email Us</h3>
              <a href="mailto:support@greenleaf.com" className="text-gray-600 text-sm mt-1 hover:text-brand transition-colors block break-all">
                support@greenleaf.com
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-full text-brand shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Call Us</h3>
              <a href="tel:+917829585677" className="text-gray-600 text-sm mt-1 hover:text-brand transition-colors">
                +91 7829585677
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col items-center">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="#" className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-brand hover:text-white transition-all">
                <Instagram size={24} />
              </a>
              <a href="#" className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition-all">
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="px-4 mb-12 pt-8">
         <h3 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted By Wellness Leaders</h3>
         <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="https://placehold.co/120x40/white/525252?text=VOGUE&font=playfair-display" alt="Vogue" />
            <img src="https://placehold.co/120x40/white/525252?text=FORBES&font=playfair-display" alt="Forbes" />
            <img src="https://placehold.co/120x40/white/525252?text=SHAPE&font=lora" alt="Shape" />
            <img src="https://placehold.co/120x40/white/525252?text=HEALTH&font=roboto" alt="Health" />
         </div>
      </section>
    </>
  );

  const renderShop = () => (
    <div className="px-4 py-6 mb-24">
      {/* Categories Scroller */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-brand text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            user={user}
            onAddToCart={addToCart} 
            onAddReview={handleAddReview}
            onClick={handleProductClick}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="px-4 py-6 mb-24 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bag</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your bag is empty.</p>
          <button 
            onClick={() => setCurrentView('shop')}
            className="text-brand font-semibold hover:underline"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                <div className="ml-4 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, 1)}
                         className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky bottom-24">
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between mb-6">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="font-bold text-lg text-brand">₹{cartTotal}</span>
            </div>
            {/* Mock Checkout - Book Product */}
            <button 
              onClick={() => {
                if (!user) {
                  alert("Please login to book products.");
                  setCurrentView('auth');
                } else {
                  alert("Order placed successfully! (Demo)");
                  setCart([]);
                  // Add to orders list for admin
                  const newOrder: Order = {
                    id: `ORD-${Math.floor(Math.random() * 10000)}`,
                    customerName: user.name,
                    total: cartTotal,
                    items: [...cart],
                    status: 'Pending',
                    date: new Date().toISOString().split('T')[0]
                  };
                  setOrders(prev => [newOrder, ...prev]);
                }
              }}
              className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-100"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16 md:pb-0 relative">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
               {/* Image Logo Only */}
               <div className="h-8 md:h-10">
                 <img 
                   src="https://placehold.co/200x50/ffffff/15803d?text=GREEN+LEAF&font=playfair-display" 
                   alt="Green Leaf Herbals" 
                   className="h-full object-contain"
                 />
               </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    if (user) {
                      setShowProfileMenu(!showProfileMenu);
                    } else {
                      setCurrentView('auth');
                    }
                  }}
                  className={`flex items-center space-x-1 ${user ? 'text-brand' : 'text-gray-600 hover:text-brand'}`}
                >
                  <UserIcon size={24} />
                  {user && <span className="text-xs font-bold hidden md:inline">{user.name}</span>}
                </button>

                {/* Dropdown Menu */}
                {user && showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 z-20 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {user.role === 'admin' && (
                        <button
                          onClick={() => { setCurrentView('admin'); setShowProfileMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <LayoutDashboard size={16} className="mr-2"/> Dashboard
                        </button>
                      )}
                      
                      <button
                        onClick={() => { handleLogout(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut size={16} className="mr-2"/> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button onClick={() => setCurrentView('cart')} className="text-gray-600 hover:text-brand relative">
                <ShoppingBag size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="relative">
             <input
               type="text"
               placeholder="Search for herbs, teas..."
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value);
                 if (e.target.value && currentView !== 'shop') setCurrentView('shop');
               }}
               className="w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand focus:bg-white transition-all"
             />
             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto min-h-[calc(100vh-300px)]">
        {currentView === 'home' && renderHome()}
        {currentView === 'shop' && renderShop()}
        {currentView === 'cart' && renderCart()}
      </main>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/917736122139" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-8 right-4 z-40 bg-[#25D366] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#20bd5a] transition-all hover:-translate-y-1 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        <span className="font-bold text-sm">Chat on WhatsApp</span>
      </a>

      {/* Footer */}
      {currentView !== 'product-detail' && (
      <footer className="bg-gray-800 text-gray-300 py-12 px-4 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Green Leaf Herbals</h4>
            <p className="text-sm leading-relaxed mb-4">
              Premium organic herbs and supplements for a healthier, happier you. Ethically sourced and nature-approved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-brand transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-brand transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => { setActiveCategory('All'); setCurrentView('shop'); }} className="hover:text-brand">All Products</button></li>
              <li><button onClick={() => { setActiveCategory('Skincare'); setCurrentView('shop'); }} className="hover:text-brand">Skincare</button></li>
              <li><button onClick={() => { setActiveCategory('Pain Relief'); setCurrentView('shop'); }} className="hover:text-brand">Pain Relief</button></li>
              <li><button onClick={() => { setActiveCategory('Weightloss'); setCurrentView('shop'); }} className="hover:text-brand">Weightloss</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand">Return Policy</a></li>
              <li><a href="#" className="hover:text-brand">Refund Policy</a></li>
              <li><a href="#" className="hover:text-brand">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-brand">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>support@greenleaf.com</li>
              <li>+91 7829585677</li>
              <li>46/A1, PKP Complex, Mannur, Mattannur, Kannur</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Green Leaf Herbals. All rights reserved.</p>
        </div>
      </footer>
      )}

      {/* Mobile Bottom Navigation */}
      {currentView !== 'product-detail' && (
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'home' ? 'text-brand' : 'text-gray-400'}`}
          >
            <Home size={22} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('shop')}
            className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'shop' ? 'text-brand' : 'text-gray-400'}`}
          >
            <Store size={22} />
            <span className="text-[10px] mt-1 font-medium">Shop</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('cart')}
            className={`flex flex-col items-center justify-center w-full h-full relative ${currentView === 'cart' ? 'text-brand' : 'text-gray-400'}`}
          >
            <div className="relative">
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">Bag</span>
          </button>
          
          <button 
             onClick={() => {
               if (user) {
                  const confirmLogout = window.confirm(`Logout ${user.name}?`);
                  if (confirmLogout) handleLogout();
               } else {
                 setCurrentView('auth');
               }
             }}
             className={`flex flex-col items-center justify-center w-full h-full ${user ? 'text-brand' : 'text-gray-400'}`}
          >
            <UserIcon size={22} />
            <span className="text-[10px] mt-1 font-medium">{user ? 'Profile' : 'Login'}</span>
          </button>
        </div>
      </nav>
      )}
    </div>
  );
}

export default App;