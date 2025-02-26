import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

type ListingType = 'hotel' | 'restaurant' | '';

export default function ListingSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<ListingType>('');

  const { data: listings } = useQuery(
    ['listings', searchTerm, type],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (type) params.append('type', type);
      
      const { data } = await api.get(`/listings?${params.toString()}`);
      return data;
    }
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Search Listings</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ListingType)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="hotel">Hotels</option>
            <option value="restaurant">Restaurants</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings?.map((listing: any) => (
          <Link
            key={listing.id}
            to={`/customer/listings/${listing.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
          >
            {listing.images?.[0] && (
              <img
                src={listing.images[0]}
                alt={listing.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{listing.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{listing.type}</p>
              <p className="text-sm text-gray-600">{listing.address}</p>
            </div>
          </Link>
        ))}
        
        {listings?.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-8">
            No listings found matching your criteria
          </p>
        )}
      </div>
    </div>
  );
}