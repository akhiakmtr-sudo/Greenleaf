import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock Authentication Logic
    if (isLogin) {
      if (email === 'admin@greenleaf.com' && password === 'admin123') {
        onLogin({
          id: 'admin-1',
          name: 'Admin User',
          email,
          role: 'admin'
        });
      } else if (email === 'user@greenleaf.com' && password === 'user123') {
        onLogin({
          id: 'user-1',
          name: 'Jane Doe',
          email,
          role: 'user'
        });
      } else {
        setError('Invalid credentials. Try admin@greenleaf.com / admin123');
      }
    } else {
      // Mock Signup
      if (name && email && password) {
        onLogin({
          id: `user-${Date.now()}`,
          name,
          email,
          role: 'user' // Default to user role on signup
        });
      } else {
        setError('Please fill in all fields');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-8 pt-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Join Green Leaf'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? 'Login to access your account' : 'Create an account to start your journey'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => alert("Reset password link sent!")}
                className="text-xs text-gray-500 hover:text-brand font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 mt-2"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-brand font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>

        {/* Demo Credentials Hint */}
        {isLogin && (
          <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 border border-gray-100">
            <p className="font-bold mb-1">Demo Credentials:</p>
            <p>Admin: admin@greenleaf.com / admin123</p>
            <p>User: user@greenleaf.com / user123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;