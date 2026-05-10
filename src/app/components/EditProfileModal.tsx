import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProfileModal({ isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    preferences: {
      genres: [] as string[],
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        bio: user.bio || '',
        preferences: {
          genres: user.preferences?.genres || [],
        },
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      onSuccess();
      onClose();
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        genres: prev.preferences.genres.includes(genre)
          ? prev.preferences.genres.filter((g) => g !== genre)
          : [...prev.preferences.genres, genre],
      },
    }));
  };

  const availableGenres = [
    'Психология',
    'Научпоп',
    'Классика',
    'Фантастика',
    'Бизнес',
    'Детектив',
    'Роман',
    'История',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Редактировать профиль
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Имя и Фамилия *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Город *
            </label>
            <select
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent disabled:opacity-50"
            >
              <option value="">Выберите город</option>
              <option value="Алматы">Алматы</option>
              <option value="Астана">Астана</option>
              <option value="Шымкент">Шымкент</option>
              <option value="Караганда">Караганда</option>
              <option value="Актобе">Актобе</option>
              <option value="Тараз">Тараз</option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              О себе
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              disabled={loading}
              placeholder="Расскажите о своих читательских предпочтениях..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent disabled:opacity-50 resize-none"
            />
          </div>

          {/* Preferred Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Любимые жанры
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableGenres.map((genre) => (
                <label
                  key={genre}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.preferences.genres.includes(genre)
                      ? 'bg-[#E8F4F5] border-[#006D77] text-[#006D77]'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.preferences.genres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    disabled={loading}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
