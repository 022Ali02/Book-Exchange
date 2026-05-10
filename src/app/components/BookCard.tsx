import { Star, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  cover: string;
  condition: 'Новая' | 'Хорошее' | 'Потертая';
  location: string;
  ownerRating: number;
  aiRecommendation?: string;
}

export function BookCard({
  id,
  title,
  author,
  cover,
  condition,
  location,
  ownerRating,
  aiRecommendation
}: BookCardProps) {
  const conditionColors = {
    'Новая': 'bg-green-100 text-green-800',
    'Хорошее': 'bg-blue-100 text-blue-800',
    'Потертая': 'bg-amber-100 text-amber-800',
  };

  return (
    <Link to={`/book/${id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
        {/* Book Cover */}
        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {aiRecommendation && (
            <div className="absolute top-2 left-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>AI</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[condition]}`}>
              {condition}
            </span>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="font-serif font-semibold text-gray-900 line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{author}</p>

          {aiRecommendation && (
            <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-900">
                <Sparkles className="w-3 h-3 inline mr-1" />
                {aiRecommendation}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{Number(ownerRating || 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
