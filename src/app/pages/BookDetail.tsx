import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowLeft, Sparkles, MessageSquare, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookService, Book } from '../../services/bookService';
import { recommendationService } from '../../services/recommendationService';
import { ExchangeModal } from '../components/ExchangeModal';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await bookService.getBookById(id);
      setBook(data);
    } catch (error: any) {
      toast.error('Ошибка загрузки книги');
    } finally {
      setLoading(false);
    }
  };

  const handleExchangeClick = () => {
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы предложить обмен');
      navigate('/login');
      return;
    }
    setIsExchangeModalOpen(true);
  };

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы добавить в wishlist');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      if (isInWishlist) {
        await recommendationService.removeFromWishlist(id);
        setIsInWishlist(false);
        toast.success('Удалено из списка желаний');
      } else {
        await recommendationService.addToWishlist(id);
        setIsInWishlist(true);
        toast.success('Добавлено в список желаний');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77]"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Книга не найдена</p>
          <Link
            to="/catalog"
            className="px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-[#006D77] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к каталогу
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Cover */}
          <div>
            <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Book Info */}
          <div>
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  book.condition === 'Новая'
                    ? 'bg-green-100 text-green-800'
                    : book.condition === 'Хорошее'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {book.condition}
              </span>
            </div>

            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{book.author}</p>

            {/* Description */}
            {book.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Описание</h3>
                <p className="text-gray-700">{book.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Жанр:</span>
                <span>{book.genre}</span>
              </div>
              {book.isbn && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">ISBN:</span>
                  <span>{book.isbn}</span>
                </div>
              )}
              {book.deliveryMethods && book.deliveryMethods.length > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Доставка:</span>
                  <span>{book.deliveryMethods.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Owner Card */}
            {book.owner && (
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Владелец</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#006D77] to-[#83C5BE] rounded-full flex items-center justify-center text-white font-semibold">
                    {book.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{book.owner.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{book.owner.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{Number(book.owner.rating || 0).toFixed(1)}</span>
                        <span className="text-gray-500">({book.owner.totalExchanges} обменов)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {book.available && (
              <div className="flex gap-3">
                <button
                  onClick={handleExchangeClick}
                  className="flex-1 px-6 py-4 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Предложить обмен
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`px-6 py-4 border rounded-lg transition-colors ${
                    isInWishlist
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}

            {!book.available && (
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-gray-600">Эта книга сейчас недоступна для обмена</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {book && (
        <ExchangeModal
          isOpen={isExchangeModalOpen}
          onClose={() => setIsExchangeModalOpen(false)}
          targetBook={book}
          onSuccess={() => {
            toast.success('Предложение отправлено!');
            navigate('/exchange');
          }}
        />
      )}
    </div>
  );
}
