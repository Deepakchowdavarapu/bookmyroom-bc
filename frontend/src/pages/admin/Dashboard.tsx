import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: users } = useQuery(['users'], async () => {
    const { data } = await api.get('/users');
    return data;
  });

  const { data: listings } = useQuery(['listings'], async () => {
    const { data } = await api.get('/listings');
    return data;
  });

  const { data: bookings } = useQuery(['bookings'], async () => {
    const { data } = await api.get('/bookings');
    return data;
  });

  const stats = {
    totalUsers: users?.length || 0,
    totalListings: listings?.length || 0,
    totalBookings: bookings?.length || 0,
    activeBookings: bookings?.filter((b: any) => b.status === 'confirmed').length || 0,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalListings}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalBookings}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.activeBookings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Users</h2>
          </div>
          <div className="divide-y">
            {users?.slice(0, 5).map((user: any) => (
              <div key={user.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <Link
              to="/admin/users"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              View all users →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
          </div>
          <div className="divide-y">
            {bookings?.slice(0, 5).map((booking: any) => (
              <div key={booking.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{booking.listing.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <Link
              to="/admin/overview"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              View system overview →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}