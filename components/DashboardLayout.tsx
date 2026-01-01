
import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, Megaphone, BarChart3, Settings, LogOut, Menu, X, Bell, Search, PenTool } from 'lucide-react';
import { PageRoute } from '../types';

const menuItems = [
  { label: 'پیشخوان', path: PageRoute.DASHBOARD, icon: LayoutGrid },
  { label: 'مشتریان (CRM)', path: PageRoute.DASHBOARD_CRM, icon: Users },
  { label: 'کمپین‌ها', path: PageRoute.DASHBOARD_CAMPAIGNS, icon: Megaphone },
  { label: 'ساخت ایمیل (AI)', path: PageRoute.DASHBOARD_EMAIL_BUILDER, icon: PenTool },
  { label: 'گزارشات', path: PageRoute.DASHBOARD_ANALYTICS, icon: BarChart3 },
  { label: 'تنظیمات', path: PageRoute.DASHBOARD_SETTINGS, icon: Settings },
];

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('peiksa_user') || '{"name": "کاربر", "email": ""}');

  const handleLogout = () => {
    localStorage.removeItem('peiksa_auth');
    localStorage.removeItem('peiksa_user');
    navigate(PageRoute.AUTH);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 w-72 bg-white border-l border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <img 
              src="https://upload-file-droplinked.s3.amazonaws.com/292f7d549e4eccaf99a7c2b79fe1d6d1bf9d6fe4529720730387b84cc62d7af0.png" 
              alt="Peiksa" 
              className="w-8 h-8 object-contain ml-3"
            />
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              پنل مدیریت
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-bold text-slate-900 truncate">{user.name}</h4>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-3 rounded-xl transition-colors text-sm font-bold"
            >
              <LogOut size={18} />
              خروج از حساب
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu size={24} />
            </button>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative w-96">
              <Search size={18} className="absolute right-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="جستجو در مشتریان، کمپین‌ها و..." 
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pr-10 pl-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 left-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
