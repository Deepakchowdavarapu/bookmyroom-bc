import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function SystemOverview() {
  const { data: bookings } = useQuery(['bookings'], async () => {
    const { data } = await api.get('/bookings');
    return data;
  });

  const { data: listings } = useQuery(['listings'], async () => {
    const { data } = await api.get('/listings');
    return data;
  });

  // Calculate some basic metrics
  const metrics = {
    totalBookings: bookings?.length || 0,
    confirmedBookings: bookings?.filter((b: any) => b.status === 'confirmed').length || 0,
    pendingBookings: bookings?.filter((b: any) => b.status === 'pending').length || 0,
    cancelledBookings: bookings?.filter((b: any) => b.status === 'cancelled').length || 0,
    totalListings: listings?.length || 0,
    hotelListings: listings?.filter((l: any) => l.type === 'hotel').length || 0,
    restaurantListings: listings?.filter((l: any) => l.type === 'restaurant').length || 0,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">System Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Booking Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bookings</span>
              <span className="font-semibold">{metrics.totalBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confirmed Bookings</span>
              <span className="font-semibold text-green-600">{metrics.confirmedBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Bookings</span>
              <span className="font-semibold text-yellow-600">{metrics.pendingBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelled Bookings</span>
              <span className="font-semibold text-red-600">{metrics.cancelledBookings}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Listing Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Listings</span>
              <span className="font-semibold">{metrics.totalListings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hotel Listings</span>
              <span className="font-semibold">{metrics.hotelListings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Restaurant Listings</span>
              <span className="font-semibold">{metrics.restaurantListings}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent System Activity</h2>
        <div className="space-y-4">
          {bookings?.slice(0, 10).map((booking: any) => (
            <div key={booking.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{booking.listing.name}</p>
                <p className="text-sm text-gray-500">
                  Booked by {booking.customer.name} on{' '}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-sm rounded-full ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}