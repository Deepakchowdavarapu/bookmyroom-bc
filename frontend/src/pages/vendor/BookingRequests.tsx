import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { BookingStatus } from '@/enums/booking-status.enum';

export default function BookingRequests() {
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery(['vendorBookings'], async () => {
    const { data } = await api.get('/bookings/my-bookings');
    return data;
  });

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: BookingStatus }) =>
      api.put(`/bookings/${id}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendorBookings']);
        toast.success('Booking status updated successfully');
      },
      onError: () => {
        toast.error('Failed to update booking status');
      },
    }
  );

  const handleStatusUpdate = (id: string, status: BookingStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Booking Requests</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y">
          {bookings?.map((booking: any) => (
            <div key={booking.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{booking.listing.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString()} - 
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Unit:</span> {booking.unit.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Customer:</span> {booking.customer.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total:</span> ${booking.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className={`block px-3 py-1 rounded-full text-sm text-center ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>

                  {booking.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, BookingStatus.CONFIRMED)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, BookingStatus.CANCELLED)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!bookings || bookings.length === 0) && (
            <p className="p-6 text-center text-gray-500">No booking requests found</p>
          )}
        </div>
      </div>
    </div>
  );
}