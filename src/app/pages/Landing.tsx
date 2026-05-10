import { ArrowRight, UserPlus, BookPlus, Sparkles, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookCard } from '../components/BookCard';

const popularBooks = [
  {
    id: '1',
    title: 'Атомные привычки',
    author: 'Джеймс Клир',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    condition: 'Хорошее' as const,
    location: 'Алматы',
    ownerRating: 4.8,
  },
  {
    id: '2',
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    condition: 'Новая' as const,
    location: 'Астана',
    ownerRating: 5.0,
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Юваль Харари',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    condition: 'Хорошее' as const,
    location: 'Алматы',
    ownerRating: 4.9,
  },
  {
    id: '4',
    title: 'Психология влияния',
    author: 'Роберт Чалдини',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    condition: 'Потертая' as const,
    location: 'Шымкент',
    ownerRating: 4.7,
  },
];

export function Landing() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#006D77] to-[#83C5BE] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Меняй книги,<br />а не ценности
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Платформа обмена книгами с умными рекомендациями. Найди свою следующую любимую книгу рядом с домом.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-white text-[#006D77] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Начать обмен
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12 text-gray-900">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: UserPlus,
                title: 'Регистрация',
                description: 'Создайте профиль за 2 минуты',
              },
              {
                icon: BookPlus,
                title: 'Добавление книг',
                description: 'Загрузите свои книги для обмена',
              },
              {
                icon: Sparkles,
                title: 'AI-подбор',
                description: 'Получите персональные рекомендации',
              },
              {
                icon: RefreshCw,
                title: 'Обмен',
                description: 'Договоритесь о встрече и обменяйтесь',
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#E8F4F5] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#006D77]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Books */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-gray-900">
              Популярное сейчас
            </h2>
            <Link to="/catalog" className="text-[#006D77] hover:underline flex items-center gap-2">
              Смотреть все
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4 text-gray-900">
            Готовы найти свою следующую книгу?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Присоединяйтесь к сообществу читателей в вашем городе
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#006D77] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#005962] transition-colors"
          >
            Создать профиль
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
