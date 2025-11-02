import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, 
  FiGlobe, 
  FiShoppingCart, 
  FiBarChart, 
  FiSettings,
  FiMap
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Users',
      value: '12,543',
      icon: FiUsers,
      change: '+12%',
      color: 'text-green-400'
    },
    {
      title: 'Products',
      value: '47',
      icon: FiShoppingCart,
      change: '+8%',
      color: 'text-yellow-400'
    },
    {
      title: 'Cities',
      value: '1,247',
      icon: FiMap,
      change: '+5%',
      color: 'text-blue-400'
    },
    {
      title: 'Countries',
      value: '195',
      icon: FiGlobe,
      change: '+2%',
      color: 'text-purple-400'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Product updated', user: 'Admin', time: '15 minutes ago' },
    { id: 3, action: 'City added', user: 'Admin', time: '30 minutes ago' },
    { id: 4, action: 'New product added', user: 'Admin', time: '1 hour ago' },
  ];

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-white/60 mt-2">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className={`text-sm ${stat.color} mt-2`}>{stat.change} from last month</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
            <button className="text-[#5695F5] hover:text-blue-400 text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-white/60 text-xs">by {activity.user}</p>
                </div>
                <span className="text-white/60 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-[#5695F5]/20 hover:bg-[#5695F5]/30 rounded-lg text-left transition">
              <FiUsers className="w-6 h-6 text-[#5695F5] mb-2" />
              <p className="text-white text-sm font-medium">Manage Users</p>
            </button>
            <button className="p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-left transition">
              <FiShoppingCart className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="text-white text-sm font-medium">Manage Products</p>
            </button>
            <button className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-left transition">
              <FiMap className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-white text-sm font-medium">Manage Cities</p>
            </button>
            <button className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-left transition">
              <FiGlobe className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-white text-sm font-medium">Manage Countries</p>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section (Placeholder) */}
      <div className="mt-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Analytics Overview</h2>
          <div className="h-64 flex items-center justify-center text-white/60">
            <div className="text-center">
              <FiBarChart className="w-16 h-16 mx-auto mb-4" />
              <p>Analytics charts will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;