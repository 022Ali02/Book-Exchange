import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Book, bookService } from '../../services/bookService';
import { exchangeService } from '../../services/exchangeService';
import { toast } from 'sonner';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBook: Book;
  onSuccess: () => void;
}

export function ExchangeModal({ isOpen, onClose, targetBook, onSuccess }: ExchangeModalProps) {
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMyBooks();
    }
  }, [isOpen]);

  const loadMyBooks = async () => {
    try {
      const books = await bookService.getMyBooks();
      const availableBooks = books.filter((book) => book.available);
      setMyBooks(availableBooks);
    } catch (error) {
      toast.error('Ошибка загрузки ваших книг');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      toast.error('Выберите книгу для обмена');
      return;
    }

    setLoading(true);
    try {
      await exchangeService.createExchange({
        ownerBookId: targetBook.id,
        requesterBookId: selectedBookId,
      });
      toast.success('Предложение обмена отправлено!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка создания обмена');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Предложить обмен</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Target Book */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Книга для обмена:</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={targetBook.cover}
                alt={targetBook.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">{targetBook.title}</p>
                <p className="text-sm text-gray-600">{targetBook.author}</p>
                <p className="text-sm text-gray-500">
                  Владелец: {targetBook.owner?.name}
                </p>
              </div>
            </div>
          </div>

          {/* My Books Selection */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Выберите свою книгу для обмена:
              </h3>

              {myBooks.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    У вас нет доступных книг для обмена
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors"
                  >
                    Добавить книгу
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {myBooks.map((book) => (
                    <label
                      key={book.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedBookId === book.id
                          ? 'border-[#006D77] bg-[#006D77]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="book"
                        value={book.id}
                        checked={selectedBookId === book.id}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                        className="text-[#006D77] focus:ring-[#006D77]"
                      />
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{book.title}</p>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
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
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            {myBooks.length > 0 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedBookId}
                  className="flex-1 px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Отправка...' : 'Предложить обмен'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
