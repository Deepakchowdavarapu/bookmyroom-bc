import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: listing } = useQuery(['listing', id], async () => {
    const { data } = await api.get(`/listings/${id}`);
    return data;
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUnit || !startDate || !endDate) {
      toast.error('Please fill in all booking details');
      return;
    }

    try {
      const selectedUnitData = listing.units.find((unit: any) => unit.id === selectedUnit);
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      await api.post('/bookings', {
        listingId: id,
        unitId: selectedUnit,
        startDate,
        endDate,
        totalPrice: selectedUnitData.price * days
      });

      toast.success('Booking created successfully!');
      setSelectedUnit('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  if (!listing) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          {listing.images?.[0] && (
            <img
              src={listing.images[0]}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{listing.name}</h1>
          <p className="text-gray-600 mb-4">{listing.address}</p>
          <p className="text-lg mb-6">{listing.description}</p>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Available Units</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Unit
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select a unit</option>
                    {listing.units.map((unit: any) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} - ${unit.price}/night
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Book Now
              </button>
            </form>
          </div>

          {listing.reviews?.length > 0 && (
            <div className="border-t mt-8 pt-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {listing.reviews.map((review: any) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium">{review.customer.name}</span>
                      <span className="mx-2">•</span>
                      <span className="text-yellow-500">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}