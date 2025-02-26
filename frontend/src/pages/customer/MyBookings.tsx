import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function MyBookings() {
  const { data: bookings } = useQuery(['myBookings'], async () => {
    const { data } = await api.get('/bookings/my-bookings');
    return data;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>

      <div className="space-y-4">
        {bookings?.map((booking: any) => (
          <div key={booking.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{booking.listing.name}</h2>
                <p className="text-gray-600">{booking.unit.name}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    Check-in: {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Check-out: {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium">
                    Total: ${booking.totalPrice}
                  </p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
        ))}

        {bookings?.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            You don't have any bookings yet
          </p>
        )}
      </div>
    </div>
  );
}