# API Configuration Guide

## Overview
The API configuration is managed through `/src/config/api.js` to avoid browser environment issues with `process.env`.

## Configuration

### Automatic Environment Detection
The system automatically detects your environment:
- **Development**: `localhost`, `127.0.0.1`, or local IP addresses use `http://localhost:5000/api`
- **Production**: Other domains use the production URL

### Manual Configuration
To manually set the API URL, edit `/src/config/api.js`:

```javascript
export const API_CONFIG = {
  // Update these URLs to match your backend
  DEV_API_URL: 'http://localhost:5000/api',
  PROD_API_URL: 'https://your-backend-domain.com/api',
  
  // Force a specific URL (overrides automatic detection)
  MANUAL_API_URL: null, // Set to 'http://your-api-url.com/api' to override
};
```

## Quick Setup

### For Development
1. Make sure your backend is running on `http://localhost:5000`
2. No changes needed - it should work automatically

### For Production
1. Update `PROD_API_URL` in `/src/config/api.js` to your deployed backend URL
2. Deploy your frontend

### For Custom Setup
1. Set `MANUAL_API_URL` in `/src/config/api.js` to your backend URL
2. This will override automatic detection

## Available Endpoints

The following authentication endpoints are configured:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `PUT /auth/updatedetails` - Update user details
- `PUT /auth/updatepassword` - Update user password
- `GET /auth/logout` - User logout

## Troubleshooting

### "API request failed" errors
- Check that your backend is running
- Verify the API URL in `/src/config/api.js` matches your backend
- Check browser console for network errors

### CORS errors
- Make sure your backend has CORS configured for your frontend domain
- In development, both should typically run on `localhost`

### Authentication issues
- Check that JWT tokens are being sent correctly
- Verify token format matches your backend expectations