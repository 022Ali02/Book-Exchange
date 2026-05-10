import { useState } from 'react';
import { X } from 'lucide-react';
import { bookService, CreateBookData } from '../../services/bookService';
import { toast } from 'sonner';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
  const [formData, setFormData] = useState<CreateBookData>({
    title: '',
    author: '',
    genre: '',
    condition: 'Хорошее',
    description: '',
    isbn: '',
    cover: '',
    deliveryMethods: [],
  });
  const [loading, setLoading] = useState(false);

  const genres = ['Психология', 'Научпоп', 'Классика', 'Фантастика', 'Бизнес', 'Детектив'];
  const conditions: Array<'Новая' | 'Хорошее' | 'Потертая'> = ['Новая', 'Хорошее', 'Потертая'];
  const deliveryOptions = ['Личная встреча', 'Курьер', 'Почта'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bookService.createBook(formData);
      toast.success('Книга успешно добавлена!');
      onSuccess();
      onClose();
      setFormData({
        title: '',
        author: '',
        genre: '',
        condition: 'Хорошее',
        description: '',
        isbn: '',
        cover: '',
        deliveryMethods: [],
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при добавлении книги');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryChange = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter((m) => m !== method)
        : [...prev.deliveryMethods, method],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Добавить книгу</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название книги <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              placeholder="Атомные привычки"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Автор <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              placeholder="Джеймс Клир"
            />
          </div>

          {/* Genre and Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Жанр <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              >
                <option value="">Выберите жанр</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Состояние <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value as any })
                }
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              placeholder="Краткое описание книги..."
            />
          </div>

          {/* ISBN and Cover */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                placeholder="978-3-16-148410-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL обложки
              </label>
              <input
                type="url"
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Delivery Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Способы доставки <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {deliveryOptions.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deliveryMethods.includes(option)}
                    onChange={() => handleDeliveryChange(option)}
                    className="mr-2 rounded text-[#006D77] focus:ring-[#006D77]"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || formData.deliveryMethods.length === 0}
              className="flex-1 px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Добавление...' : 'Добавить книгу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
