import { BookOpen, Mail, Lock, User, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location,
      });
      navigate('/catalog');
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#006D77] to-[#83C5BE]">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-12 h-12 text-white" />
            <span className="text-3xl font-serif font-semibold text-white">BookSwap</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            Создать аккаунт
          </h1>
          <p className="text-gray-100">
            Присоединяйтесь к сообществу читателей
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Имя и Фамилия
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* City Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Город
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent appearance-none disabled:opacity-50"
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
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  disabled={loading}
                  className="mr-2 mt-1 rounded text-[#006D77] focus:ring-[#006D77]"
                />
                <span className="text-sm text-gray-600">
                  Я согласен с{' '}
                  <a href="#" className="text-[#006D77] hover:underline">
                    условиями использования
                  </a>
                  {' '}и{' '}
                  <a href="#" className="text-[#006D77] hover:underline">
                    политикой конфиденциальности
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-[#006D77] hover:underline font-medium">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
