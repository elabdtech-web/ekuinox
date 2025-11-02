import React, { useState } from 'react';
import { FiSave, FiSettings, FiUser, FiMail, FiLock, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, updateDetails, updatePassword } = useAuth();
  
  // User Profile States
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const [settings, setSettings] = useState({
    siteName: 'EKUINOX',
    siteDescription: 'Innovation and technology platform',
    contactEmail: 'contact@ekuinox.com',
    supportEmail: 'support@ekuinox.com',
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    maxUploadSize: '10',
    sessionTimeout: '30',
    timezone: 'UTC',
    language: 'en'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');

    try {
      const result = await updateDetails(profileData);
      
      if (result.success) {
        setProfileMessage({ type: 'success', text: result.message });
      } else {
        setProfileMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setProfileMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
    
    setProfileLoading(false);
    // Clear message after 5 seconds
    setTimeout(() => setProfileMessage(''), 5000);
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      setPasswordLoading(false);
      return;
    }

    try {
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.success) {
        setPasswordMessage({ type: 'success', text: result.message });
        // Clear password form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Password update error:', error);
      setPasswordMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
    }
    
    setPasswordLoading(false);
    // Clear message after 5 seconds
    setTimeout(() => setPasswordMessage(''), 5000);
  };

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 
    'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/60 mt-2">Manage your application settings and preferences</p>
      </div>

      {/* Save Success Message */}
      {saved && (
        <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-200 px-4 py-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <FiUser className="w-6 h-6 text-[#5695F5]" />
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            </div>
            
            {profileMessage && (
              <div className={`mb-4 px-4 py-3 rounded-lg ${
                profileMessage.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-200' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-200'
              }`}>
                {profileMessage.text}
              </div>
            )}
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full bg-[#5695F5] hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {profileLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <FiLock className="w-6 h-6 text-[#5695F5]" />
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
            </div>
            
            {passwordMessage && (
              <div className={`mb-4 px-4 py-3 rounded-lg ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-200' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-200'
              }`}>
                {passwordMessage.text}
              </div>
            )}
            
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  minLength="6"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  minLength="6"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Application Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <FiSettings className="w-6 h-6 text-[#5695F5]" />
            <h2 className="text-xl font-semibold text-white">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Site Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition resize-none"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz} className="bg-[#070B13]">{tz}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-[#070B13]">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <FiMail className="w-6 h-6 text-[#5695F5]" />
            <h2 className="text-xl font-semibold text-white">Email Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <FiLock className="w-6 h-6 text-[#5695F5]" />
            <h2 className="text-xl font-semibold text-white">System Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Max Upload Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleChange('maxUploadSize', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm font-medium">
                Allow User Registration
              </label>
              <button
                onClick={() => handleChange('allowRegistration', !settings.allowRegistration)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowRegistration ? 'bg-[#5695F5]' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm font-medium">
                Maintenance Mode
              </label>
              <button
                onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-red-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <FiBell className="w-6 h-6 text-[#5695F5]" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm font-medium">
                Email Notifications
              </label>
              <button
                onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-[#5695F5]' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm font-medium">
                SMS Notifications
              </label>
              <button
                onClick={() => handleChange('smsNotifications', !settings.smsNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.smsNotifications ? 'bg-[#5695F5]' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
                  </div>
          <button
            onClick={handleSave}
            className="bg-[#5695F5] hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;