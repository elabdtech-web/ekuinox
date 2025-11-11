import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiPackage,
  FiGlobe,
  FiMap,
  FiSettings,
  FiLogOut,
  FiBell,
  FiSearch,
  FiShoppingBag
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      icon: FiHome, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    { 
      icon: FiShoppingBag, 
      label: 'Orders', 
      path: '/admin/orders',
      active: location.pathname === '/admin/orders'
    },
    { 
      icon: FiUsers, 
      label: 'Users', 
      path: '/admin/users',
      active: location.pathname === '/admin/users'
    },
    { 
      icon: FiPackage, 
      label: 'Products', 
      path: '/admin/products',
      active: location.pathname === '/admin/products'
    },
    { 
      icon: FiMap, 
      label: 'Cities', 
      path: '/admin/cities',
      active: location.pathname === '/admin/cities'
    },
    { 
      icon: FiSettings, 
      label: 'Settings', 
      path: '/admin/settings',
      active: location.pathname === '/admin/settings'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B13] to-[#23375a]">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/30 backdrop-blur-md border-r border-white/20 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold text-white">EKUINOX</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-white/70"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                      item.active
                        ? 'bg-[#5695F5] text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-white/70"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              
              {/* Search */}
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative text-white/70 hover:text-white transition">
                <FiBell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#5695F5] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-white/60 text-xs">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;