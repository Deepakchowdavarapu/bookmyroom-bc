import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Routes
import CustomerDashboard from './pages/customer/Dashboard';
import ListingSearch from './pages/customer/ListingSearch';
import ListingDetails from './pages/customer/ListingDetails';
import MyBookings from './pages/customer/MyBookings';
import MyReviews from './pages/customer/MyReviews';

// Vendor Routes
import VendorDashboard from './pages/vendor/Dashboard';
import ListingManagement from './pages/vendor/ListingManagement';
import BookingRequests from './pages/vendor/BookingRequests';

// Admin Routes
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import SystemOverview from './pages/admin/SystemOverview';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Routes */}
        <Route path="/customer" element={<PrivateRoute role="customer"><DashboardLayout /></PrivateRoute>}>
          <Route index element={<CustomerDashboard />} />
          <Route path="search" element={<ListingSearch />} />
          <Route path="listings/:id" element={<ListingDetails />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="reviews" element={<MyReviews />} />
        </Route>

        {/* Vendor Routes */}
        <Route path="/vendor" element={<PrivateRoute role="vendor"><DashboardLayout /></PrivateRoute>}>
          <Route index element={<VendorDashboard />} />
          <Route path="listings" element={<ListingManagement />} />
          <Route path="bookings" element={<BookingRequests />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute role="admin"><DashboardLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="overview" element={<SystemOverview />} />
        </Route>

        {/* Redirect root to appropriate dashboard based on role */}
        <Route path="/" element={<Navigate to="/customer" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;