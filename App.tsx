import React, { useState, useMemo, useEffect } from 'react';
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
  Phone,
  Package,
  Save,
  Calendar,
  Building2,
  Stethoscope,
  Loader2,
  CheckCircle
} from 'lucide-react';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import { PRODUCTS } from './constants';
import { Product, ProductCategory, CartItem, User, Order } from './types';

// -- Loading Component --
const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="relative">
       <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl animate-pulse"></div>
       <Loader2 size={48} className="text-brand animate-spin relative z-10" />
    </div>
    <p className="text-gray-500 font-medium animate-pulse text-sm mt-4 tracking-wide">Processing...</p>
  </div>
);

// -- Sub-Components for User Profile Views --

const OrderConfirmationView = ({ 
  user, 
  cart, 
  total, 
  onBack, 
  onPayNow 
}: { 
  user: User, 
  cart: CartItem[], 
  total: number, 
  onBack: () => void, 
  onPayNow: (details: any) => void 
}) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zip: user.zip || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayNow(formData);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Order Confirmation</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
            <form id="order-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">Shipping Details</h3>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Email ID</label>
                        <input name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                        <input name="zip" value={formData.zip} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                        <input name="city" value={formData.city} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                        <input name="state" value={formData.state} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                </div>
            </form>
        </div>

        <div className="md:col-span-2">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600 flex-1 truncate mr-4">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                            <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Total to Pay</span>
                    <span className="font-bold text-xl text-brand">₹{total}</span>
                </div>
                
                <button 
                    form="order-form"
                    type="submit"
                    className="w-full bg-brand text-white font-bold py-4 rounded-xl mt-6 hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95"
                >
                    Pay Now
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const PaymentView = ({ total, onBack, onComplete }: { total: number, onBack: () => void, onComplete: () => void }) => (
    <div className="px-4 py-12 max-w-lg mx-auto text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand">
            <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Gateway</h2>
        <p className="text-gray-600 mb-8">
            You are about to pay <span className="font-bold text-gray-900">₹{total}</span>
        </p>
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-8">
            <p className="text-yellow-800 text-sm font-medium">Payment integration pending...</p>
        </div>
        <button onClick={onComplete} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all mb-4">
             Complete Payment (Demo)
        </button>
        <button onClick={onBack} className="text-brand font-bold hover:underline text-sm">
            Cancel & Go Back
        </button>
    </div>
);

const AddressView = ({ user, onSave, onBack }: { user: User, onSave: (u: User) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState({
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zip: user.zip || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  return (
    <div className="px-4 py-6 max-w-xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800 md:hidden">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">My Address</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            placeholder="+91 9876543210"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
          <textarea 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            rows={3}
            placeholder="House No, Street, Landmark"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
            <input 
              type="text" 
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            />
           </div>
           <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
            <input 
              type="text" 
              value={formData.zip}
              onChange={e => setFormData({...formData, zip: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            />
           </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
          <input 
            type="text" 
            value={formData.state}
            onChange={e => setFormData({...formData, state: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
          />
        </div>
        <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl mt-4 hover:bg-green-600 transition-colors flex items-center justify-center">
          <Save size={18} className="mr-2" /> Save Address
        </button>
      </form>
    </div>
  );
};

const OrdersView = ({ orders, onBack, onStartShopping }: { orders: Order[], onBack: () => void, onStartShopping: () => void }) => {
  return (
    <div className="px-4 py-6 max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800 md:hidden">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
           <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-500">No orders found.</p>
           <button onClick={onStartShopping} className="text-brand font-semibold mt-2 hover:underline">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                 <div>
                   <span className="text-xs font-bold text-gray-500 block">ORDER ID</span>
                   <span className="font-mono text-sm font-semibold">{order.id}</span>
                 </div>
                 <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-400 block mt-1">{order.date}</span>
                 </div>
               </div>
               <div className="space-y-2 mb-4">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                         <span className="font-bold text-xs bg-gray-100 px-1.5 py-0.5 rounded mr-2">{item.quantity}x</span> 
                         {item.name}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                   </div>
                 ))}
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-sm font-bold text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-brand">₹{order.total}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HospitalsView = ({ onBack }: { onBack: () => void }) => {
  const hospitals = [
    { id: 1, name: "Green Leaf Ayurvedic Centre", location: "Kannur, Kerala", phone: "+91 9876543210", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600" },
    { id: 2, name: "Nature's Care Hospital", location: "Kochi, Kerala", phone: "+91 9876543211", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600" },
    { id: 3, name: "Herbal Life Wellness", location: "Bangalore, Karnataka", phone: "+91 9876543212", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Partner Hospitals</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hospitals.map(h => (
          <div key={h.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden">
               <img src={h.image} alt={h.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{h.name}</h3>
              <div className="flex items-center text-gray-600 mt-3 text-sm">
                <MapPin size={16} className="mr-2 text-brand flex-shrink-0"/> <span className="truncate">{h.location}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-2 text-sm">
                <Phone size={16} className="mr-2 text-brand flex-shrink-0"/> <span>{h.phone}</span>
              </div>
              <button className="mt-5 w-full border border-brand text-brand font-bold py-2 rounded-lg hover:bg-brand hover:text-white transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const AppointmentView = ({ onBack, user, setIsLoading }: { onBack: () => void, user: User | null, setIsLoading: (loading: boolean) => void }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    date: '',
    department: 'General Consultation'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Network Request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate Booking ID
    const bookingId = `BK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Prepare Payload
    const bookingDetails = {
      bookingId,
      to: 'info@metricfluxsolutions.com',
      patientName: formData.name,
      phone: formData.phone,
      date: formData.date,
      department: formData.department,
      status: 'Pending Confirmation'
    };

    // Log the "Automatic Send" action to simulate backend process
    console.log('------------------------------------------------');
    console.log(`SENDING APPOINTMENT DATA TO: ${bookingDetails.to}`);
    console.log('PAYLOAD:', bookingDetails);
    console.log('------------------------------------------------');

    setIsLoading(false);

    // UI Confirmation
    alert(`Appointment Request Sent Successfully!\n\nBooking ID: ${bookingId}\n\nYour appointment details have been automatically sent to ${bookingDetails.to}.\n\nOur team will contact you shortly to confirm.`);
    onBack();
  };

  return (
    <div className="px-4 py-6 max-w-xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Patient Name</label>
          <input 
            required
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            placeholder="Enter Full Name"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
          <input 
            required
            type="tel" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            placeholder="+91 9876543210"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
          <input 
            required
            type="date" 
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
          <select 
            value={formData.department}
            onChange={e => setFormData({...formData, department: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
          >
            <option>General Consultation</option>
            <option>Ayurvedic Therapy</option>
            <option>Skin Care Specialist</option>
            <option>Pain Management</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl mt-4 hover:bg-green-600 transition-colors">
          Confirm Booking
        </button>
      </form>
    </div>
  )
}

// -- Main App Component --

function App() {
  // Global State
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['All', 'Skincare', 'Pain Relief', 'Haircare', 'Weightloss', 'Other']);
  const [bannerImage, setBannerImage] = useState('https://res.cloudinary.com/dufnwlqeq/image/upload/v1764963752/01-01-2026_20251206_010808_0000_g5nf03.png');
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-001', customerName: 'Jane Doe', total: 4999, status: 'Delivered', date: '2023-10-01', items: [
       { ...PRODUCTS[0], quantity: 1, image: PRODUCTS[0].images[0] },
       { ...PRODUCTS[3], quantity: 2, image: PRODUCTS[3].images[0] }
    ] },
    { id: 'ORD-002', customerName: 'Sarah Johnson', total: 1299, status: 'Processing', date: '2023-10-05', items: [] },
  ]);

  // View State type definition for safety
  type ViewType = 'home' | 'shop' | 'product-detail' | 'cart' | 'auth' | 'admin' | 'orders' | 'address' | 'appointments' | 'hospitals' | 'order-confirmation' | 'payment';
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Global Loading Wrapper ---
  // This ensures every view transition has a loading state
  const navigate = async (view: ViewType) => {
    if (view === currentView) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate page load
    setCurrentView(view);
    window.scrollTo(0, 0);
    setIsLoading(false);
  };

  // Simulate Initial Load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Wrapped Actions with Loading ---
  
  const handleCategoryChange = async (cat: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate fetch
    setActiveCategory(cat);
    setIsLoading(false);
  };

  const handleAddToCartWithLoad = async (product: Product) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate cart update
    addToCart(product);
    setIsLoading(false);
  };

  const handleAddReviewWithLoad = async (productId: string, rating: number) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate submission
    handleAddReview(productId, rating);
    setIsLoading(false);
  };

  const handleSaveAddressWithLoad = async (updatedUser: User) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    handleSaveAddress(updatedUser);
    setIsLoading(false);
  };

  // --- Auth Handlers ---
  const handleLogin = async (loggedInUser: User) => {
    // Transition loader
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(null);
    setCurrentView('home');
    setShowProfileMenu(false);
    setIsLoading(false);
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

  const handleBuyNow = async (product: Product) => {
    if (!user) {
      alert("Please login to purchase products.");
      navigate('auth');
      // We keep the selectedProduct set so we can return to it or auto-add later
      setSelectedProduct(product);
      return;
    }
    if (user.role === 'admin') {
      alert("Admins cannot shop!");
      return;
    }
    
    // Add to cart first (so we can use the cart state for checkout)
    await handleAddToCartWithLoad(product);
    navigate('order-confirmation');
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
       navigate('auth');
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

  const handleProductClick = async (product: Product) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo(0,0);
    setIsLoading(false);
  };

  const handleSaveAddress = (updatedUser: User) => {
    setUser(updatedUser);
    alert('Address saved successfully!');
    setCurrentView('home'); // or keep on address page
  };

  const handlePaymentComplete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create Order
    if (user) {
        const newOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            customerName: user.name,
            total: cartTotal,
            items: [...cart],
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
    }
    
    setIsLoading(false);
    alert("Payment Successful! Order Placed.");
    navigate('home');
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
    return <Auth onLogin={handleLogin} onBack={() => navigate('home')} />;
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
        onBack={() => navigate('shop')}
        onAddToCart={handleAddToCartWithLoad}
        onBuyNow={handleBuyNow}
        onAddReview={handleAddReviewWithLoad}
      />
    );
  }

  if (currentView === 'order-confirmation' && user) {
    return (
      <OrderConfirmationView 
        user={user} 
        cart={cart} 
        total={cartTotal} 
        onBack={() => navigate('cart')} 
        onPayNow={async (details) => {
            // Can handle detail saving here if needed
            navigate('payment');
        }}
      />
    );
  }

  if (currentView === 'payment') {
    return <PaymentView total={cartTotal} onBack={() => navigate('cart')} onComplete={handlePaymentComplete} />
  }

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <div className="px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div 
          className="rounded-2xl shadow-sm overflow-hidden cursor-pointer group relative"
          onClick={() => navigate('shop')}
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
        <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-50 animate-in zoom-in duration-500 delay-100">
          <div className="bg-green-50 p-2 rounded-full mb-1 text-green-600">
            <Truck size={20} />
          </div>
          <h3 className="font-bold text-xs text-gray-800">Free Delivery</h3>
          <p className="text-[10px] text-gray-500">On orders above ₹1999</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-50 animate-in zoom-in duration-500 delay-200">
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
           <button onClick={() => navigate('shop')} className="text-brand text-sm font-semibold">View All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              user={user}
              onAddToCart={handleAddToCartWithLoad} 
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
              <div className="text-gray-600 text-sm mb-4 leading-relaxed space-y-4 text-justify">
                <p>
                  Green Leaf Herbals is a dedicated herbal products e-commerce platform committed to bringing the purity of nature straight to you. As a new and trusted e-commerce brand under Metric Flux Solutions Pvt. Ltd., we focus on delivering only the highest-quality, 100% verified and trusted herbal products from reputable and certified companies.
                </p>
                <p>
                  Our mission is simple — to make authentic herbal wellness accessible, reliable, and convenient for everyone. In an industry where trust matters the most, we ensure every product listed on our platform undergoes strict verification and quality checks before it reaches our customers.
                </p>
                <p>
                  At Green Leaf Herbals, we believe in transparency, purity, and customer trust. We are continuously working to build a platform where clients can shop with confidence, knowing that every product they choose is genuine, safe, and sourced responsibly.
                </p>
                <p>
                  We aim to create a seamless shopping experience backed by dependable service, timely delivery, and unwavering commitment to customer satisfaction. With Green Leaf Herbals, your journey towards natural wellness is in safe hands.
                </p>
                <p className="font-bold text-brand mt-4">
                  Green Leaf Herbals — Pure. Trusted. Verified.
                </p>
              </div>
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
    <div className="px-4 py-6 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Categories Scroller */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
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
            onAddToCart={handleAddToCartWithLoad} 
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
    <div className="px-4 py-6 mb-24 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bag</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your bag is empty.</p>
          <button 
            onClick={() => navigate('shop')}
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
              onClick={async () => {
                if (!user) {
                  alert("Please login to book products.");
                  navigate('auth');
                } else {
                  navigate('order-confirmation');
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
      
      {isLoading && <LoadingOverlay />}

      {/* Side Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative bg-white w-72 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
               <span className="font-bold text-lg text-brand">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                 <X size={24}/>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
               {user ? (
                 <div className="mx-2 mb-6 p-4 bg-green-50 rounded-xl flex items-center space-x-3 border border-green-100">
                   <div className="bg-white p-2 rounded-full text-brand shadow-sm">
                     <UserIcon size={20} />
                   </div>
                   <div className="overflow-hidden">
                     <p className="font-bold text-gray-800 truncate">{user.name}</p>
                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
                   </div>
                 </div>
               ) : (
                 <div className="mx-2 mb-6">
                    <button 
                      onClick={() => { navigate('auth'); setIsMobileMenuOpen(false); }}
                      className="w-full bg-brand text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-green-100 shadow-lg"
                    >
                      Login / Sign Up
                    </button>
                 </div>
               )}

               <button 
                 onClick={() => { navigate('home'); setIsMobileMenuOpen(false); }} 
                 className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium ${currentView === 'home' ? 'bg-gray-100 text-brand' : 'text-gray-700 hover:bg-gray-50'}`}
               >
                 <Home size={20} className="mr-3 opacity-70"/> Home
               </button>

               <button 
                 onClick={() => { navigate('shop'); setIsMobileMenuOpen(false); }} 
                 className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium ${currentView === 'shop' ? 'bg-gray-100 text-brand' : 'text-gray-700 hover:bg-gray-50'}`}
               >
                 <Store size={20} className="mr-3 opacity-70"/> Shop Products
               </button>

               <button 
                 onClick={() => { navigate('appointments'); setIsMobileMenuOpen(false); }} 
                 className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium ${currentView === 'appointments' ? 'bg-gray-100 text-brand' : 'text-gray-700 hover:bg-gray-50'}`}
               >
                 <Calendar size={20} className="mr-3 opacity-70"/> Book Appointment
               </button>

               <button 
                 onClick={() => { navigate('hospitals'); setIsMobileMenuOpen(false); }} 
                 className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium ${currentView === 'hospitals' ? 'bg-gray-100 text-brand' : 'text-gray-700 hover:bg-gray-50'}`}
               >
                 <Building2 size={20} className="mr-3 opacity-70"/> Hospitals
               </button>
               
               {user && (
                 <>
                   <div className="my-2 border-t border-gray-100 mx-4"></div>
                   <button 
                    onClick={() => { navigate('orders'); setIsMobileMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium ${currentView === 'orders' ? 'bg-gray-100 text-brand' : 'text-gray-700 hover:bg-gray-50'}`}
                   >
                    <Package size={20} className="mr-3 opacity-70"/> My Orders
                   </button>
                   <button 
                    onClick={() => { navigate('address'); setIsMobileMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium ${currentView === 'address' ? 'bg-gray-100 text-brand' : 'text-gray-700 hover:bg-gray-50'}`}
                   >
                    <MapPin size={20} className="mr-3 opacity-70"/> Saved Address
                   </button>
                 </>
               )}
            </div>

            {user && (
              <div className="p-4 border-t border-gray-100">
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                  className="w-full text-left px-4 py-3 rounded-lg flex items-center text-red-600 hover:bg-red-50 font-medium transition-colors"
                >
                  <LogOut size={20} className="mr-3"/> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-blue-900 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="p-1 rounded-lg text-white hover:bg-blue-800 transition-colors"
               >
                 <Menu size={28} />
               </button>

               <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
                  {/* Image Logo Only - Updated to match blue background */}
                  <div className="h-8 md:h-10">
                    <img 
                      src="https://placehold.co/200x50/1e3a8a/ffffff?text=GREEN+LEAF&font=playfair-display" 
                      alt="Green Leaf Herbals" 
                      className="h-full object-contain"
                    />
                  </div>
               </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown (Desktop) */}
              <div className="relative hidden md:block">
                <button 
                  onClick={() => {
                    if (user) {
                      setShowProfileMenu(!showProfileMenu);
                    } else {
                      navigate('auth');
                    }
                  }}
                  className={`flex items-center space-x-1 ${user ? 'text-green-400' : 'text-gray-200 hover:text-white'}`}
                >
                  <UserIcon size={24} />
                  {user && <span className="text-xs font-bold">{user.name}</span>}
                </button>

                {/* Dropdown Menu */}
                {user && showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 border border-gray-100 z-20 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => { navigate('admin'); setShowProfileMenu(false); }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <LayoutDashboard size={16} className="mr-3 text-gray-400"/> Dashboard
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => { navigate('orders'); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-50"
                          >
                            <Package size={16} className="mr-3 text-gray-400"/> My Orders
                          </button>
                          <button
                            onClick={() => { navigate('address'); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-50"
                          >
                            <MapPin size={16} className="mr-3 text-gray-400"/> Saved Address
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => { handleLogout(); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut size={16} className="mr-3"/> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button onClick={() => navigate('cart')} className="text-gray-200 hover:text-white relative">
                <ShoppingBag size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-blue-900">
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
                 if (e.target.value && currentView !== 'shop') navigate('shop');
               }}
               className="peer w-full bg-blue-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-blue-300 focus:ring-2 focus:ring-brand focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 transition-all"
             />
             <Search className="absolute left-3 top-2.5 text-blue-300 peer-focus:text-gray-400 transition-colors" size={18} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto min-h-[calc(100vh-300px)]">
        {currentView === 'home' && renderHome()}
        {currentView === 'shop' && renderShop()}
        {currentView === 'cart' && renderCart()}
        {currentView === 'hospitals' && <HospitalsView onBack={() => navigate('home')}/>}
        {currentView === 'appointments' && <AppointmentView onBack={() => navigate('home')} user={user} setIsLoading={setIsLoading}/>}
        {currentView === 'orders' && user && (
          <OrdersView 
            orders={orders.filter(o => o.customerName === user.name)} 
            onBack={() => navigate('home')} 
            onStartShopping={() => navigate('shop')}
          />
        )}
        {currentView === 'address' && user && (
          <AddressView 
            user={user} 
            onSave={handleSaveAddressWithLoad} 
            onBack={() => navigate('home')} 
          />
        )}
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
              <li><button onClick={() => { setActiveCategory('All'); navigate('shop'); }} className="hover:text-brand">All Products</button></li>
              <li><button onClick={() => { setActiveCategory('Skincare'); navigate('shop'); }} className="hover:text-brand">Skincare</button></li>
              <li><button onClick={() => { setActiveCategory('Pain Relief'); navigate('shop'); }} className="hover:text-brand">Pain Relief</button></li>
              <li><button onClick={() => { setActiveCategory('Weightloss'); navigate('shop'); }} className="hover:text-brand">Weightloss</button></li>
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
            onClick={() => navigate('home')}
            className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'home' ? 'text-brand' : 'text-gray-400'}`}
          >
            <Home size={22} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => navigate('shop')}
            className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'shop' ? 'text-brand' : 'text-gray-400'}`}
          >
            <Store size={22} />
            <span className="text-[10px] mt-1 font-medium">Shop</span>
          </button>
          
          <button 
            onClick={() => navigate('cart')}
            className={`flex flex-col items-center justify-center w-full h-full relative ${currentView === 'cart' ? 'text-brand' : 'text-gray-400'}`}
          >
            <div className="relative">
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
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
                 navigate('auth');
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