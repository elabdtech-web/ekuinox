# EKUINOX Admin Panel

## Overview
This project now includes a comprehensive admin panel for managing countries, cities, users, and system settings.

## Admin Panel Features

### 🔐 Authentication System
- Secure login with demo credentials
- Protected routes that require authentication
- Session management with localStorage
- Automatic logout functionality

### 📊 Dashboard
- Overview statistics for users, cities, countries, and orders
- Recent activities feed
- Quick action buttons
- Analytics placeholder for future charts

### 👥 User Management
- View all registered users
- User status management (Active/Inactive)
- User statistics and filtering
- Search functionality

### 🌍 Countries Management
- Add, edit, and delete countries
- Region-based organization
- Search and filter capabilities
- Bulk operations support

### 🏙️ Cities Management
- Manage city database
- Grid-based layout for easy browsing
- Auto-generated IDs
- Quick edit and delete actions

### ⚙️ Settings
- General site configuration
- Email settings
- System preferences
- Notification controls
- Timezone and language settings

## How to Access Admin Panel

### 1. Start the Application
```bash
npm run dev
```

### 2. Navigate to Admin Login
Visit: `http://localhost:5173/admin/login`

### 3. Demo Credentials
- **Email**: `admin@ekuinox.com`
- **Password**: `admin123`

### 4. Available Admin Routes
After logging in, you can access:
- **Dashboard**: `/admin/dashboard`
- **Users**: `/admin/users`
- **Countries**: `/admin/countries`
- **Cities**: `/admin/cities`
- **Settings**: `/admin/settings`

## Technical Implementation

### File Structure
```
src/
├── admin/
│   ├── components/          # Admin-specific components
│   ├── layout/
│   │   └── AdminLayout.jsx  # Admin sidebar layout
│   └── pages/
│       ├── AdminLogin.jsx   # Login page
│       ├── AdminDashboard.jsx
│       ├── ManageUsers.jsx
│       ├── ManageCountries.jsx
│       ├── ManageCities.jsx
│       └── Settings.jsx
├── components/
│   └── ProtectedRoute.jsx   # Route protection component
├── context/
│   └── AuthContext.jsx     # Authentication context
└── hooks/
    └── useScrollToTop.js   # Scroll to top hook
```

### Key Features
- **Protected Routes**: All admin routes are protected and require authentication
- **Responsive Design**: Mobile-friendly admin interface
- **State Management**: Context API for authentication state
- **Local Storage**: Persistent login sessions
- **Modern UI**: Glassmorphism design with Tailwind CSS
- **Icon Library**: Feather icons (react-icons/fi) for consistency

### Authentication Flow
1. User visits `/admin/login`
2. Enters credentials (demo: admin@ekuinox.com / admin123)
3. AuthContext validates and stores token + user data
4. ProtectedRoute component checks auth status
5. Redirects to dashboard on success or login on failure

### Data Management
- **Demo Data**: Currently uses static demo data for development
- **API Ready**: Structured to easily connect to real APIs
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Search & Filter**: Built-in search and filtering capabilities

## Future Enhancements

### Planned Features
- [ ] Real API integration
- [ ] Advanced user roles and permissions
- [ ] Analytics charts and reports
- [ ] File upload management
- [ ] Email templates management
- [ ] System logs and monitoring
- [ ] Backup and restore functionality
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Bulk operations for data management

### API Endpoints (To Implement)
```javascript
// Authentication
POST /api/admin/login
POST /api/admin/logout
GET  /api/admin/me

// Users
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

// Countries
GET    /api/admin/countries
POST   /api/admin/countries
PUT    /api/admin/countries/:id
DELETE /api/admin/countries/:id

// Cities
GET    /api/admin/cities
POST   /api/admin/cities
PUT    /api/admin/cities/:id
DELETE /api/admin/cities/:id

// Settings
GET /api/admin/settings
PUT /api/admin/settings
```

## Security Considerations

### Current Implementation
- Client-side authentication (demo purposes)
- localStorage for session management
- Protected routes with redirect

### Production Recommendations
- Implement server-side authentication
- Use secure HTTP-only cookies for tokens
- Add CSRF protection
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS in production
- Implement proper error handling
- Add audit logging

## Development Notes

### Adding New Admin Pages
1. Create component in `src/admin/pages/`
2. Add route to `App.jsx` under protected admin routes
3. Add navigation item to `AdminLayout.jsx`
4. Update permissions if needed

### Styling Guidelines
- Use Tailwind CSS utilities
- Follow existing glassmorphism design
- Maintain dark theme consistency
- Use Feather icons from react-icons/fi
- Responsive design principles

### State Management
- Use AuthContext for authentication state
- Local state for page-specific data
- Consider adding global admin context for shared data

This admin panel provides a solid foundation for managing the EKUINOX platform with room for extensive customization and feature additions.