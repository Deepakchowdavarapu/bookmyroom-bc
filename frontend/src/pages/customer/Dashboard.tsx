import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const { data: recentBookings } = useQuery(['recentBookings'], async () => {
    const { data } = await api.get('/bookings/my-bookings');
    return data.slice(0, 5); // Get only the 5 most recent bookings
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/customer/search"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Search Listings</h2>
          <p className="text-gray-600">Find and book hotels and restaurants</p>
        </Link>

        <Link
          to="/customer/bookings"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">My Bookings</h2>
          <p className="text-gray-600">View and manage your bookings</p>
        </Link>

        <Link
          to="/customer/reviews"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">My Reviews</h2>
          <p className="text-gray-600">See your reviews and ratings</p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {recentBookings?.length ? (
            <div className="divide-y">
              {recentBookings.map((booking: any) => (
                <div key={booking.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{booking.listing.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.startDate).toLocaleDateString()} - 
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
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
          ) : (
            <p className="p-4 text-center text-gray-500">No recent bookings found</p>
          )}
        </div>
      </div>
    </div>
  );
}