import { Sparkles, ThumbsUp, X } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useState, useEffect } from 'react';
import { recommendationService, AIRecommendation } from '../../services/recommendationService';
import { toast } from 'sonner';

export function AIMatch() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [visibleBooks, setVisibleBooks] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await recommendationService.getAIRecommendations();
      console.log('Loaded recommendations:', data);
      setRecommendations(data);
      setVisibleBooks(data);
      if (data.length === 0) {
        toast.info('Нет доступных рекомендаций. Добавьте больше книг в систему!');
      }
    } catch (error: any) {
      console.error('Error loading recommendations:', error);
      toast.error('Ошибка загрузки рекомендаций');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = (id: string) => {
    setVisibleBooks(visibleBooks.filter(book => book.id !== id));
  };

  const handleInterested = async (id: string) => {
    try {
      await recommendationService.addToWishlist(id);
      toast.success('Добавлено в список желаний');
      setVisibleBooks(visibleBooks.filter(book => book.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка добавления в wishlist');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-gray-900">
              Топ-10 книг для вас сегодня
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Подобрано на основе ваших интересов, локации и истории обменов
          </p>
        </div>

        {/* AI Info Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Как работает AI-подбор
              </h3>
              <p className="text-gray-700">
                Наш алгоритм анализирует ваши предпочтения, жанры которые вы читаете,
                и находит книги рядом с вами. Каждая рекомендация персонализирована
                специально для вас.
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77]"></div>
          </div>
        ) : visibleBooks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleBooks.map((book) => (
              <div key={book.id} className="relative">
                <BookCard
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  cover={book.cover}
                  condition={book.condition}
                  location={book.owner?.location || ''}
                  ownerRating={book.owner?.rating || 0}
                  aiRecommendation={book.aiRecommendation}
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleSkip(book.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Пропустить
                  </button>
                  <button
                    onClick={() => handleInterested(book.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Интересно
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
              Вы просмотрели все рекомендации!
            </h3>
            <p className="text-gray-600 mb-6">
              Обновите список, чтобы увидеть новые книги
            </p>
            <button
              onClick={loadRecommendations}
              className="px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors"
            >
              Показать снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
