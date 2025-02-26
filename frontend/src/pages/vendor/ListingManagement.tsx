import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { ListingType } from '@/enums/listing-type.enum';

interface ListingFormData {
  name: string;
  type: ListingType;
  description: string;
  address: string;
  images: string[];
}

export default function ListingManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ListingFormData>({
    name: '',
    type: ListingType.HOTEL,
    description: '',
    address: '',
    images: [''],
  });

  const queryClient = useQueryClient();

  const { data: listings } = useQuery(['vendorListings'], async () => {
    const { data } = await api.get('/listings');
    return data;
  });

  const createMutation = useMutation(
    (newListing: ListingFormData) => api.post('/listings', newListing),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendorListings']);
        setIsCreating(false);
        resetForm();
        toast.success('Listing created successfully');
      },
      onError: () => {
        toast.error('Failed to create listing');
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: ListingFormData }) =>
      api.put(`/listings/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendorListings']);
        setEditingId(null);
        resetForm();
        toast.success('Listing updated successfully');
      },
      onError: () => {
        toast.error('Failed to update listing');
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/listings/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendorListings']);
        toast.success('Listing deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete listing');
      },
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      type: ListingType.HOTEL,
      description: '',
      address: '',
      images: [''],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (listing: any) => {
    setEditingId(listing.id);
    setFormData({
      name: listing.name,
      type: listing.type,
      description: listing.description,
      address: listing.address,
      images: listing.images,
    });
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manage Listings</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {isCreating ? 'Cancel' : 'Add New Listing'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ListingType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={ListingType.HOTEL}>Hotel</option>
                <option value={ListingType.RESTAURANT}>Restaurant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={formData.images[0]}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {editingId ? 'Update' : 'Create'} Listing
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y">
          {listings?.map((listing: any) => (
            <div key={listing.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {listing.images?.[0] && (
                    <img
                      src={listing.images[0]}
                      alt={listing.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium">{listing.name}</h3>
                    <p className="text-sm text-gray-500">{listing.type}</p>
                    <p className="text-sm text-gray-600 mt-1">{listing.address}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(listing)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!listings || listings.length === 0) && (
            <p className="p-6 text-center text-gray-500">No listings found</p>
          )}
        </div>
      </div>
    </div>
  );
}