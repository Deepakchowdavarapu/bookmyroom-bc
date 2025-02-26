import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function MyReviews() {
  const { data: reviews } = useQuery(['myReviews'], async () => {
    const { data } = await api.get('/reviews/my-reviews');
    return data;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Reviews</h1>

      <div className="space-y-4">
        {reviews?.map((review: any) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{review.listing.name}</h2>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 text-lg">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}

        {reviews?.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            You haven't written any reviews yet
          </p>
        )}
      </div>
    </div>
  );
}