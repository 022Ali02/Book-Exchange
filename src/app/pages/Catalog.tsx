import { Search, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard';
import { bookService, Book } from '../../services/bookService';
import { toast } from 'sonner';

export function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: '',
    condition: '',
    location: '',
    delivery: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBooks();
  }, [searchQuery, filters, page]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getBooks({
        search: searchQuery || undefined,
        genre: filters.genre || undefined,
        condition: filters.condition || undefined,
        location: filters.location || undefined,
        delivery: filters.delivery || undefined,
        page,
        limit: 20,
      });
      setBooks(response.books);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      toast.error('Ошибка загрузки книг');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadBooks();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      genre: '',
      condition: '',
      location: '',
      delivery: '',
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-6">
            Каталог книг
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск по названию, автору или жанру..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg border flex items-center gap-2 transition-colors ${
                showFilters
                  ? 'bg-[#006D77] text-white border-[#006D77]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Фильтры
            </button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Фильтры</h3>

                {/* City Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Город
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                  >
                    <option value="">Все города</option>
                    <option value="Алматы">Алматы</option>
                    <option value="Астана">Астана</option>
                    <option value="Шымкент">Шымкент</option>
                    <option value="Караганда">Караганда</option>
                  </select>
                </div>

                {/* Genre Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Жанр
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                  >
                    <option value="">Все жанры</option>
                    <option value="Психология">Психология</option>
                    <option value="Научпоп">Научпоп</option>
                    <option value="Классика">Классика</option>
                    <option value="Фантастика">Фантастика</option>
                    <option value="Бизнес">Бизнес</option>
                    <option value="Детектив">Детектив</option>
                  </select>
                </div>

                {/* Condition Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Состояние
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                  >
                    <option value="">Любое</option>
                    <option value="Новая">Новая</option>
                    <option value="Хорошее">Хорошее</option>
                    <option value="Потертая">Потертая</option>
                  </select>
                </div>

                {/* Delivery Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Способ доставки
                  </label>
                  <select
                    value={filters.delivery}
                    onChange={(e) => handleFilterChange('delivery', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                  >
                    <option value="">Любой</option>
                    <option value="Личная встреча">Личная встреча</option>
                    <option value="Курьер">Курьер</option>
                    <option value="Почта">Почта</option>
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            </aside>
          )}

          {/* Books Grid */}
          <div className="flex-1">
            <div className="mb-4 text-gray-600">
              Найдено: {books.length} книг
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77]"></div>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Книги не найдены</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      cover={book.cover}
                      condition={book.condition}
                      location={book.owner?.location || ''}
                      ownerRating={book.owner?.rating || 0}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Назад
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                      Страница {page} из {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Вперед
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
