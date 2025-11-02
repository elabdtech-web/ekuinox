// API Configuration Test
// Run this in browser console to test API configuration

import { API_CONFIG, API_BASE_URL, AUTH_ENDPOINTS } from './config/api';

console.log('=== API Configuration Test ===');
console.log('Environment Detection:');
console.log('- Hostname:', window.location.hostname);
console.log('- API Base URL:', API_BASE_URL);
console.log('- Development URL:', API_CONFIG.DEV_API_URL);
console.log('- Production URL:', API_CONFIG.PROD_API_URL);
console.log('- Manual Override:', API_CONFIG.MANUAL_API_URL);

console.log('\nAuth Endpoints:');
Object.entries(AUTH_ENDPOINTS).forEach(([key, url]) => {
  console.log(`- ${key}:`, url);
});

console.log('\nTo change API URL manually:');
console.log('1. Edit src/config/api.js');
console.log('2. Set MANUAL_API_URL to your backend URL');
console.log('3. Restart your development server');

export default function testApiConfig() {
  return {
    apiUrl: API_BASE_URL,
    endpoints: AUTH_ENDPOINTS,
    config: API_CONFIG
  };
}