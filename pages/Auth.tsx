
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Check, Eye, EyeOff, Mail, User, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageRoute } from '../types';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation State
  const [validations, setValidations] = useState({
    length: false,
    lower: false,
    upper: false,
    special: false
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setError('');

    if (!isLogin && !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      if (isLogin) {
        // Backdoor Logic
        if (email.toLowerCase() === 'admin@peiksa.com' && password === 'admin123') {
          localStorage.setItem('peiksa_auth', 'true');
          localStorage.setItem('peiksa_user', JSON.stringify({ name: 'مدیر سیستم', email: 'admin@peiksa.com' }));
          navigate(PageRoute.DASHBOARD);
        } else {
          setError('نام کاربری یا رمز عبور اشتباه است.');
          setIsLoading(false);
        }
      } else {
        // Registration Logic (Mock)
        localStorage.setItem('peiksa_auth', 'true');
        localStorage.setItem('peiksa_user', JSON.stringify({ name: name || 'کاربر جدید', email }));
        navigate(PageRoute.DASHBOARD);
      }
    }, 1000);
  };

  const inputBaseClasses = "appearance-none rounded-xl block w-full py-3.5 border placeholder-slate-400 text-slate-900 focus:outline-none transition-all duration-200";
  const inputDefaultClasses = "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
  const inputErrorClasses = "border-red-300 bg-red-50 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[450px] w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 relative z-10"
      >
        <div className="text-center">
          <motion.img 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src="https://upload-file-droplinked.s3.amazonaws.com/292f7d549e4eccaf99a7c2b79fe1d6d1bf9d6fe4529720730387b84cc62d7af0.png" 
            alt="Logo" 
            className="mx-auto h-14 w-14 object-contain mb-6"
          />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {isLogin ? 'ورود به حساب کاربری' : 'شروع مسیر موفقیت'}
          </h2>
          <p className="text-slate-500 text-sm">
            {isLogin ? 'برای دسترسی به داشبورد وارد شوید' : 'اطلاعات خود را برای ساخت حساب وارد کنید'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Google Sign In */}
        <button 
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>{isLogin ? 'ورود با گوگل' : 'ثبت‌نام با گوگل'}</span>
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">یا با ایمیل</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-sm font-bold text-slate-700 mb-1.5">نام و نام خانوادگی</label>
                <div className="relative group">
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${inputBaseClasses} ${inputDefaultClasses} pr-12 pl-4`}
                    placeholder="مثال: علی رضایی"
                  />
                  <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center pointer-events-none">
                    <User size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">ایمیل</label>
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputBaseClasses} ${inputDefaultClasses} pr-12 pl-4 text-left`}
                placeholder="name@company.com"
                dir="ltr"
              />
              <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center pointer-events-none">
                <Mail size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">رمز عبور</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBaseClasses} ${
                  !isLogin && isSubmitted && !isPasswordValid ? inputErrorClasses : inputDefaultClasses
                } pl-12 pr-12 text-left`}
                placeholder="••••••••"
                dir="ltr"
              />
              
              <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center pointer-events-none">
                <Lock size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <p className="text-xs font-bold text-slate-500 mb-2">الزامات رمز عبور:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <ValidationItem isValid={validations.length} text="حداقل ۸ کاراکتر" />
                    <ValidationItem isValid={validations.lower} text="یک حرف کوچک انگلیسی (a-z)" />
                    <ValidationItem isValid={validations.upper} text="یک حرف بزرگ انگلیسی (A-Z)" />
                    <ValidationItem isValid={validations.special} text="یک کاراکتر خاص (!@#...)" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md group-hover:border-blue-500 transition-colors flex items-center justify-center bg-white">
                    <Check size={14} className="text-white opacity-0 check-icon" />
                  </div>
                  <style>{`input:checked + div { background-color: #3b82f6; border-color: #3b82f6; } input:checked + div .check-icon { opacity: 1; }`}</style>
                </div>
                <span className="mr-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">مرا به خاطر بسپار</span>
              </label>

              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline decoration-2 underline-offset-4">
                فراموشی رمز؟
              </a>
            </div>
          )}

          <Button 
            fullWidth 
            size="lg" 
            className={`mt-8 font-bold text-lg shadow-blue-600/20 hover:shadow-blue-600/30 ${!isLogin && !isPasswordValid ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={(!isLogin && !isPasswordValid) || isLoading}
          >
            {isLoading ? 'لطفا صبر کنید...' : (isLogin ? 'ورود به حساب' : 'ایجاد حساب کاربری')}
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-slate-600">
            {isLogin ? 'حساب ندارید؟ ' : 'قبلاً ثبت‌نام کرده‌اید؟ '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setIsSubmitted(false);
                setValidations({ length: false, lower: false, upper: false, special: false });
                setError('');
              }}
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors hover:underline decoration-2 underline-offset-4 ml-1"
            >
              {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const ValidationItem: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
  <div className="flex items-center gap-2 transition-colors duration-200">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${isValid ? 'bg-green-50 text-white' : 'bg-slate-200 text-slate-400'}`}>
      {isValid ? <Check size={10} strokeWidth={4} /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
    </div>
    <span className={`text-xs font-medium transition-colors duration-200 ${isValid ? 'text-green-700' : 'text-slate-500'}`}>
      {text}
    </span>
  </div>
);
