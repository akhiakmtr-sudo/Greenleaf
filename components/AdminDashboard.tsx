import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Image, 
  List, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  XCircle,
  LogOut,
  Loader2
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  bannerImage: string;
  categories: string[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateBanner: (url: string) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  bannerImage,
  categories,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateBanner,
  onAddCategory,
  onDeleteCategory,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'banner' | 'categories'>('products');
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [tempBannerUrl, setTempBannerUrl] = useState(bannerImage);
  const [isLoading, setIsLoading] = useState(false);

  // Form State for Product
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    images: [''],
    description: ''
  });

  const switchTab = async (tab: typeof activeTab) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate data fetch
    setActiveTab(tab);
    setIsLoading(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    if (isEditingProduct) {
      onUpdateProduct({ ...isEditingProduct, ...productForm } as Product);
    } else {
      onAddProduct({
        ...productForm,
        id: Date.now().toString(),
        rating: 0,
        reviews: 0
      } as Product);
    }
    setIsEditingProduct(null);
    setProductForm({ name: '', price: 0, category: categories[0], images: [''], description: '' });
    setIsLoading(false);
  };

  const startEdit = (product: Product) => {
    setIsLoading(true);
    setTimeout(() => {
        setIsEditingProduct(product);
        setProductForm(product);
        setIsLoading(false);
    }, 300);
  };

  const cancelEdit = () => {
    setIsEditingProduct(null);
    setProductForm({ name: '', price: 0, category: categories[0], images: [''], description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-brand">Admin Panel</h2>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => switchTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-green-50 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          <button 
            onClick={() => switchTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-green-50 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </button>
          <button 
            onClick={() => switchTab('banner')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'banner' ? 'bg-green-50 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Image size={20} />
            <span>Ads & Banner</span>
          </button>
          <button 
            onClick={() => switchTab('categories')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'categories' ? 'bg-green-50 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <List size={20} />
            <span>Categories</span>
          </button>
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8 relative min-h-screen">
        
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                <Loader2 size={40} className="text-brand animate-spin" />
            </div>
        )}

        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
              <button 
                 onClick={() => {
                   setIsEditingProduct(null);
                   setProductForm({ name: '', price: 0, category: categories[0] || '', images: [''], description: '' });
                   const formElement = document.getElementById('product-form');
                   if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
                 }}
                 className="bg-brand text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
              >
                <Plus size={18} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Form */}
            <div id="product-form" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-4">{isEditingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Product Name" 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="p-2 border rounded-lg"
                  required
                />
                <input 
                  type="number" 
                  placeholder="Price" 
                  value={productForm.price || ''} 
                  onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                  className="p-2 border rounded-lg"
                  required
                />
                <select 
                  value={productForm.category} 
                  onChange={e => setProductForm({...productForm, category: e.target.value})}
                  className="p-2 border rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Image URL" 
                  value={productForm.images?.[0] || ''} 
                  onChange={e => setProductForm({...productForm, images: [e.target.value]})}
                  className="p-2 border rounded-lg"
                  required
                />
                <textarea 
                  placeholder="Description" 
                  value={productForm.description} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="p-2 border rounded-lg md:col-span-2"
                  required
                />
                <div className="md:col-span-2 flex space-x-2">
                  <button type="submit" className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    {isEditingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  {isEditingProduct && (
                    <button type="button" onClick={cancelEdit} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Product</th>
                    <th className="p-4 font-semibold text-gray-600">Category</th>
                    <th className="p-4 font-semibold text-gray-600">Price</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-4 flex items-center space-x-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </td>
                      <td className="p-4 text-gray-600">{product.category}</td>
                      <td className="p-4 text-gray-600">₹{product.price}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => startEdit(product)} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => onDeleteProduct(product.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
           <div className="space-y-6 animate-in fade-in duration-300">
             <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 font-semibold text-gray-600">Order ID</th>
                      <th className="p-4 font-semibold text-gray-600">Customer</th>
                      <th className="p-4 font-semibold text-gray-600">Total</th>
                      <th className="p-4 font-semibold text-gray-600">Status</th>
                      <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-400">No orders found.</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="p-4 font-mono text-xs">{order.id}</td>
                          <td className="p-4">{order.customerName}</td>
                          <td className="p-4 font-medium">₹{order.total}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right flex justify-end space-x-2">
                             <button onClick={() => onUpdateOrderStatus(order.id, 'Shipped')} className="p-1 text-blue-500" title="Mark Shipped"><Package size={16}/></button>
                             <button onClick={() => onUpdateOrderStatus(order.id, 'Delivered')} className="p-1 text-green-500" title="Mark Delivered"><CheckCircle size={16}/></button>
                             <button onClick={() => onUpdateOrderStatus(order.id, 'Pending')} className="p-1 text-yellow-500" title="Mark Pending"><XCircle size={16}/></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {/* Banner Management */}
        {activeTab === 'banner' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold text-gray-800">Ads & Banner Management</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
               <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Current Banner Preview</label>
                 <div className="h-48 rounded-lg overflow-hidden border">
                   <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                 </div>
               </div>
               <div className="flex space-x-2">
                 <input 
                   type="text" 
                   value={tempBannerUrl} 
                   onChange={(e) => setTempBannerUrl(e.target.value)}
                   className="flex-grow p-2 border rounded-lg"
                   placeholder="Enter new image URL"
                 />
                 <button 
                   onClick={() => onUpdateBanner(tempBannerUrl)}
                   className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-green-600"
                 >
                   Update Banner
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Category Management */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="font-bold mb-4">Add Category</h3>
                 <div className="flex space-x-2">
                   <input 
                     type="text" 
                     value={newCategory} 
                     onChange={(e) => setNewCategory(e.target.value)}
                     className="flex-grow p-2 border rounded-lg"
                     placeholder="New Category Name"
                   />
                   <button 
                     onClick={async () => {
                        if (newCategory) {
                          setIsLoading(true);
                          await new Promise(resolve => setTimeout(resolve, 500));
                          onAddCategory(newCategory);
                          setNewCategory('');
                          setIsLoading(false);
                        }
                     }}
                     className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-green-600"
                   >
                     Add
                   </button>
                 </div>
               </div>
               
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold mb-4">Existing Categories</h3>
                  <ul className="space-y-2">
                    {categories.map(cat => (
                      <li key={cat} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>{cat}</span>
                        <button onClick={() => onDeleteCategory(cat)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;