
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, KeyRound, ChevronLeft } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'otp-signup' | 'otp-reset' | 'new-password';

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  // Logic States
  const [showPassword, setShowPassword] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [tempUserData, setTempUserData] = useState<Partial<User>>({});

  // Reset error when view changes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setOtpInput('');
  }, [view]);

  // Helper: Generate 4 digit OTP
  const generateAndSendOTP = (targetEmail: string) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    // SIMULATION: In a real app, this goes to backend -> SMTP.
    setTimeout(() => {
      alert(`[DEMO] Your OTP for Green Leaf Herbals is: ${otp}`);
    }, 500);
    return otp;
  };

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@greenleaf.com' && password === 'admin123') {
      onLogin({ id: 'admin-1', name: 'Admin User', email, role: 'admin' });
    } else if (email === 'user@greenleaf.com' && password === 'user123') {
      onLogin({
        id: 'user-1', name: 'Jane Doe', email, role: 'user',
        phone: '+91 98765 43210', address: '42, Green Valley', city: 'Kannur', state: 'Kerala', zip: '670001'
      });
    } else {
      // Allow any mock login for demo if valid format
      if (email.includes('@') && password.length >= 4) {
         onLogin({ id: `user-${Date.now()}`, name: 'Demo User', email, role: 'user' });
      } else {
         setError('Invalid credentials. Try user@greenleaf.com / user123');
      }
    }
  };

  const initiateSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Store data temporarily
    setTempUserData({ name, email, role: 'user' });
    // Send OTP
    generateAndSendOTP(email);
    setView('otp-signup');
  };

  const verifySignupOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      // Success: Create User
      onLogin({
        id: `user-${Date.now()}`,
        name: tempUserData.name || '',
        email: tempUserData.email || '',
        role: 'user',
        phone: '', address: '', city: '', state: '', zip: ''
      });
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const initiateForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    generateAndSendOTP(email);
    setView('otp-reset');
  };

  const verifyResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      setView('new-password');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Logic to update password in backend would go here
    setSuccessMsg('Password reset successfully! Please login.');
    setTimeout(() => {
      setView('login');
      setPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  // --- Render Helpers ---

  const renderInput = (
    icon: React.ReactNode, 
    type: string, 
    placeholder: string, 
    value: string, 
    setter: (val: string) => void,
    isPassword = false
  ) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
        required
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );

  // --- Views ---

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
        
        {/* Navigation / Header */}
        <div className="mb-8 relative">
          {view === 'login' ? (
            <button 
              onClick={onBack}
              className="absolute -top-2 -left-2 text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button 
              onClick={() => {
                if (view === 'signup' || view === 'forgot-password') setView('login');
                else if (view === 'otp-signup') setView('signup');
                else if (view === 'otp-reset') setView('forgot-password');
                else if (view === 'new-password') setView('login');
              }}
              className="absolute -top-2 -left-2 text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          
          <div className="text-center pt-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {view === 'login' && 'Welcome Back'}
              {view === 'signup' && 'Create Account'}
              {view === 'forgot-password' && 'Reset Password'}
              {(view === 'otp-signup' || view === 'otp-reset') && 'Verify Email'}
              {view === 'new-password' && 'New Password'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {view === 'login' && 'Login to access your account'}
              {view === 'signup' && 'Sign up to start your journey'}
              {view === 'forgot-password' && 'Enter your email to receive an OTP'}
              {(view === 'otp-signup' || view === 'otp-reset') && `Enter the OTP sent to ${email}`}
              {view === 'new-password' && 'Create a strong password'}
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-6 text-center animate-pulse">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-600 text-xs p-3 rounded-lg mb-6 text-center">
            {successMsg}
          </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {renderInput(<Mail size={18}/>, "email", "Email Address", email, setEmail)}
            {renderInput(<Lock size={18}/>, "password", "Password", password, setPassword, true)}

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setView('forgot-password')}
                className="text-xs text-gray-500 hover:text-brand font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 mt-2">
              Login
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? 
              <button onClick={() => setView('signup')} className="text-brand font-bold hover:underline ml-1">
                Sign Up
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-2">Demo Credentials</p>
              <p className="text-xs text-gray-500">user@greenleaf.com / user123</p>
            </div>
          </form>
        )}

        {/* --- VIEW: SIGNUP --- */}
        {view === 'signup' && (
          <form onSubmit={initiateSignup} className="space-y-4">
            {renderInput(<UserIcon size={18}/>, "text", "Full Name", name, setName)}
            {renderInput(<Mail size={18}/>, "email", "Email Address", email, setEmail)}
            {renderInput(<Lock size={18}/>, "password", "Create Password", password, setPassword, true)}

            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 mt-2">
              Sign Up
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account? 
              <button onClick={() => setView('login')} className="text-brand font-bold hover:underline ml-1">
                Login
              </button>
            </div>
          </form>
        )}

        {/* --- VIEW: FORGOT PASSWORD --- */}
        {view === 'forgot-password' && (
          <form onSubmit={initiateForgotPassword} className="space-y-4">
            {renderInput(<Mail size={18}/>, "email", "Enter your registered email", email, setEmail)}

            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 mt-2">
              Send OTP
            </button>

            <button type="button" onClick={() => setView('login')} className="w-full text-gray-500 text-sm py-2 hover:text-gray-800">
              Cancel
            </button>
          </form>
        )}

        {/* --- VIEW: OTP VERIFICATION (Shared for Signup & Reset) --- */}
        {(view === 'otp-signup' || view === 'otp-reset') && (
          <form onSubmit={view === 'otp-signup' ? verifySignupOtp : verifyResetOtp} className="space-y-6">
            <div className="flex justify-center">
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-32 text-center text-3xl tracking-widest py-3 border-b-2 border-brand focus:border-green-600 outline-none font-mono bg-transparent"
                placeholder="XXXX"
                autoFocus
              />
            </div>
            
            <p className="text-xs text-center text-gray-500">
              Didn't receive code? 
              <button 
                type="button" 
                onClick={() => generateAndSendOTP(email)}
                className="text-brand font-bold ml-1 hover:underline"
              >
                Resend
              </button>
            </p>

            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95">
              Verify OTP
            </button>
          </form>
        )}

        {/* --- VIEW: NEW PASSWORD --- */}
        {view === 'new-password' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            {renderInput(<Lock size={18}/>, "password", "New Password", password, setPassword, true)}
            {renderInput(<KeyRound size={18}/>, "password", "Confirm Password", confirmPassword, setConfirmPassword, true)}

            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 mt-2">
              Update Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Auth;
