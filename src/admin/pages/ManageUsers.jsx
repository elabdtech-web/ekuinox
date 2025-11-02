import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Demo data
  const demoUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-01-15',
      avatar: null
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-02-20',
      avatar: null
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'User',
      status: 'Inactive',
      joinDate: '2024-03-10',
      avatar: null
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-04-05',
      avatar: null
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(demoUsers);
      setFilteredUsers(demoUsers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5695F5]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Users</h1>
            <p className="text-white/60 mt-2">View and manage user accounts</p>
          </div>
          <button className="bg-[#5695F5] hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition">
            <FiPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <FiUser className="w-8 h-8 text-[#5695F5]" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-green-400">
                {users.filter(u => u.status === 'Active').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Inactive Users</p>
              <p className="text-2xl font-bold text-red-400">
                {users.filter(u => u.status === 'Inactive').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">New This Month</p>
              <p className="text-2xl font-bold text-blue-400">2</p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition w-full"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-6 text-white font-semibold">User</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Email</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Status</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Join Date</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#5695F5] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-white/60 text-sm">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <FiMail className="w-4 h-4 text-white/60" />
                      <span className="text-white/80">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === 'Active'
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      } transition`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white/80">{formatDate(user.joinDate)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <FiUser className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No users found</h3>
          <p className="text-white/60">
            {searchTerm ? 'No users match your search criteria.' : 'No users have been registered yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;