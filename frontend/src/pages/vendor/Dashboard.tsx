import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
  const { data: recentBookings } = useQuery(['vendorBookings'], async () => {
    const { data } = await api.get('/bookings/my-bookings');
    return data.slice(0, 5);
  });

  const { data: listings } = useQuery(['vendorListings'], async () => {
    const { data } = await api.get('/listings');
    return data;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold">{listings?.length || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending Bookings</p>
              <p className="text-2xl font-bold">
                {recentBookings?.filter(b => b.status === 'pending').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              to="/vendor/listings/new"
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Listing
            </Link>
            <Link
              to="/vendor/bookings"
              className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Booking Requests</h2>
        </div>
        <div className="divide-y">
          {recentBookings?.map((booking: any) => (
            <div key={booking.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{booking.listing.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString()} - 
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Unit: {booking.unit.name}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
          {(!recentBookings || recentBookings.length === 0) && (
            <p className="p-6 text-center text-gray-500">No recent booking requests</p>
          )}
        </div>
      </div>
    </div>
  );
}