import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { PageRoute } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'امکانات', path: PageRoute.FEATURES },
  { label: 'قیمت‌گذاری', path: PageRoute.PRICING },
  { label: 'درباره ما', path: PageRoute.ABOUT },
  { label: 'تماس', path: PageRoute.CONTACT },
];

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to={PageRoute.HOME} className="flex items-center gap-3 group">
              <img 
                src="https://upload-file-droplinked.s3.amazonaws.com/292f7d549e4eccaf99a7c2b79fe1d6d1bf9d6fe4529720730387b84cc62d7af0.png" 
                alt="Peiksa Logo" 
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                پیکسا
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 relative py-1 ${
                    location.pathname === item.path ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                <Link to={PageRoute.AUTH}>
                  <Button variant="ghost" size="sm">ورود</Button>
                </Link>
                <Link to={PageRoute.AUTH}>
                  <Button variant="primary" size="sm">شروع رایگان</Button>
                </Link>
              </div>
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-lg font-medium text-slate-800 py-3 border-b border-slate-100"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Link to={PageRoute.AUTH}>
                  <Button fullWidth variant="outline">ورود</Button>
                </Link>
                <Link to={PageRoute.AUTH}>
                  <Button fullWidth variant="primary">شروع رایگان</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://upload-file-droplinked.s3.amazonaws.com/292f7d549e4eccaf99a7c2b79fe1d6d1bf9d6fe4529720730387b84cc62d7af0.png" 
                  alt="Peiksa Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-white">پیکسا</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                پلتفرم جامع بازاریابی و مدیریت مشتری برای کسب‌وکارهای ایرانی. رشد خود را با داده‌های هوشمند تضمین کنید.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">محصول</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={PageRoute.FEATURES} className="hover:text-blue-400 transition-colors">امکانات</Link></li>
                <li><Link to={PageRoute.PRICING} className="hover:text-blue-400 transition-colors">قیمت‌گذاری</Link></li>
                <li><Link to={PageRoute.CUSTOMERS} className="hover:text-blue-400 transition-colors">مشتریان</Link></li>
                <li><Link to={PageRoute.SECURITY} className="hover:text-blue-400 transition-colors">امنیت</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">شرکت</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={PageRoute.ABOUT} className="hover:text-blue-400 transition-colors">درباره ما</Link></li>
                <li><Link to={PageRoute.CAREERS} className="hover:text-blue-400 transition-colors">فرصت‌های شغلی</Link></li>
                <li><Link to={PageRoute.ABOUT} className="hover:text-blue-400 transition-colors">تیم</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">پشتیبانی</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={PageRoute.CONTACT} className="hover:text-blue-400 transition-colors">تماس با ما</Link></li>
                <li><Link to={PageRoute.SUPPORT} className="hover:text-blue-400 transition-colors">سوالات متداول</Link></li>
                <li><Link to={PageRoute.SUPPORT} className="hover:text-blue-400 transition-colors">آموزش</Link></li>
                <li><Link to={PageRoute.STATUS} className="hover:text-blue-400 transition-colors">وضعیت سیستم</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© ۱۴۰۴ پیکسا. تمامی حقوق محفوظ است.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">حریم خصوصی</a>
              <a href="#" className="hover:text-white transition-colors">شرایط استفاده</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};