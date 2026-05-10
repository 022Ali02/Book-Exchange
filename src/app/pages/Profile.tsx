import { Star, MapPin, BookPlus, Heart, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard';
import { AddBookModal } from '../components/AddBookModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { bookService, Book } from '../../services/bookService';
import { exchangeService, Exchange } from '../../services/exchangeService';
import { recommendationService, WishlistItem } from '../../services/recommendationService';
import { toast } from 'sonner';

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'shelf' | 'wishlist' | 'history'>('shelf');
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<WishlistItem[]>([]);
  const [exchangeHistory, setExchangeHistory] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'shelf') {
        const books = await bookService.getMyBooks();
        setMyBooks(books);
      } else if (activeTab === 'wishlist') {
        const wishlist = await recommendationService.getWishlist();
        setWishlistBooks(wishlist);
      } else if (activeTab === 'history') {
        const exchanges = await exchangeService.getExchanges();
        const completed = exchanges.filter((ex) => ex.status === 'completed');
        setExchangeHistory(completed);
      }
    } catch (error: any) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAdded = () => {
    loadData();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#006D77] to-[#83C5BE] rounded-full flex items-center justify-center text-white text-3xl font-serif font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{Number(user.rating || 0).toFixed(1)}</span>
                  <span className="text-gray-500">({user.totalExchanges || 0} обменов)</span>
                </div>
              </div>
              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="px-6 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors font-medium"
                >
                  Редактировать профиль
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            {[
              { id: 'shelf' as const, label: 'Моя полка', icon: BookPlus },
              { id: 'wishlist' as const, label: 'Хотелки', icon: Heart },
              { id: 'history' as const, label: 'История обменов', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#006D77] text-[#006D77]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77]"></div>
          </div>
        ) : (
          <>
            {activeTab === 'shelf' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-bold text-gray-900">
                    Книги на обмен ({myBooks.length})
                  </h2>
                  <button
                    onClick={() => setIsAddBookModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#006D77] to-[#83C5BE] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    <BookPlus className="w-5 h-5" />
                    Добавить книгу
                  </button>
                </div>
                {myBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">У вас пока нет книг на обмен</p>
                    <button
                      onClick={() => setIsAddBookModalOpen(true)}
                      className="px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors"
                    >
                      Добавить первую книгу
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {myBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        cover={book.cover}
                        condition={book.condition}
                        location={user.location}
                        ownerRating={user.rating}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-bold text-gray-900">
                    Хочу прочитать ({wishlistBooks.length})
                  </h2>
                </div>
                {wishlistBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Ваш список желаний пуст</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistBooks.map((item) => (
                      <BookCard
                        key={item.book.id}
                        id={item.book.id}
                        title={item.book.title}
                        author={item.book.author}
                        cover={item.book.cover}
                        condition={item.book.condition}
                        location={item.book.owner?.location || ''}
                        ownerRating={item.book.owner?.rating || 0}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                  История обменов ({exchangeHistory.length})
                </h2>
                {exchangeHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">У вас пока нет завершенных обменов</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {exchangeHistory.map((exchange) => {
                      const isRequester = exchange.requesterId === user.id;
                      const partner = isRequester ? exchange.owner : exchange.requester;
                      const myBook = isRequester ? exchange.requesterBook : exchange.ownerBook;
                      const theirBook = isRequester ? exchange.ownerBook : exchange.requesterBook;
                      const myRating = isRequester
                        ? exchange.rating?.requesterRating
                        : exchange.rating?.ownerRating;

                      return (
                        <div
                          key={exchange.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <span className="text-gray-700">{myBook.title}</span>
                                <span className="text-gray-400">↔</span>
                                <span className="text-gray-700">{theirBook.title}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>С: {partner.name}</span>
                                <span>•</span>
                                <span>{new Date(exchange.createdAt).toLocaleDateString('ru-RU')}</span>
                              </div>
                            </div>
                            {myRating && (
                              <div className="flex items-center gap-1">
                                {[...Array(myRating)].map((_, i) => (
                                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onSuccess={handleBookAdded}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSuccess={() => {
          toast.success('Профиль обновлен');
        }}
      />
    </div>
  );
}
