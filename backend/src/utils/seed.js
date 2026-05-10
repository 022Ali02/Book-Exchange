import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import { User, Book } from '../models/index.js';

dotenv.config();

const users = [
  {
    name: 'Айдана Нурланова',
    email: 'aidana@example.com',
    password: 'password123',
    location: 'Алматы',
    bio: 'Люблю классику, психологию и научпоп. Всегда рада обмену и обсуждению прочитанного!',
    rating: 4.8,
    totalExchanges: 12,
    preferences: {
      genres: ['Психология', 'Научпоп', 'Классика'],
      authors: ['Джеймс Клир', 'Юваль Харари']
    }
  },
  {
    name: 'Асхат Бекенов',
    email: 'askhat@example.com',
    password: 'password123',
    location: 'Астана',
    bio: 'Фанат фантастики и бизнес-литературы',
    rating: 5.0,
    totalExchanges: 8,
    preferences: {
      genres: ['Фантастика', 'Бизнес'],
      authors: ['Айзек Азимов']
    }
  },
  {
    name: 'Айгуль Касымова',
    email: 'aigul@example.com',
    password: 'password123',
    location: 'Алматы',
    bio: 'Читаю все подряд, особенно люблю детективы',
    rating: 4.9,
    totalExchanges: 15,
    preferences: {
      genres: ['Детектив', 'Триллер'],
      authors: ['Агата Кристи']
    }
  }
];

const books = [
  {
    title: 'Атомные привычки',
    author: 'Джеймс Клир',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    condition: 'Хорошее',
    genre: 'Психология',
    description: 'Как приобрести хорошие привычки и избавиться от плохих',
    deliveryMethods: ['Личная встреча', 'Курьер']
  },
  {
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    condition: 'Новая',
    genre: 'Классика',
    description: 'Культовый роман русской литературы',
    deliveryMethods: ['Личная встреча', 'Почта']
  },
  {
    title: 'Sapiens',
    author: 'Юваль Харари',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    condition: 'Хорошее',
    genre: 'Научпоп',
    description: 'Краткая история человечества',
    deliveryMethods: ['Личная встреча']
  },
  {
    title: 'Психология влияния',
    author: 'Роберт Чалдини',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    condition: 'Потертая',
    genre: 'Психология',
    description: 'Как научиться убеждать и противостоять убеждению',
    deliveryMethods: ['Личная встреча', 'Курьер', 'Почта']
  },
  {
    title: 'Думай медленно... решай быстро',
    author: 'Даниэль Канеман',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    condition: 'Хорошее',
    genre: 'Психология',
    description: 'О двух системах мышления',
    deliveryMethods: ['Личная встреча']
  },
  {
    title: 'Краткая история времени',
    author: 'Стивен Хокинг',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    condition: 'Новая',
    genre: 'Научпоп',
    description: 'От Большого взрыва до черных дыр',
    deliveryMethods: ['Личная встреча', 'Курьер']
  },
  {
    title: 'Поток',
    author: 'Михай Чиксентмихайи',
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    condition: 'Хорошее',
    genre: 'Психология',
    description: 'Психология оптимального переживания',
    deliveryMethods: ['Личная встреча']
  },
  {
    title: '1984',
    author: 'Джордж Оруэлл',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    condition: 'Потертая',
    genre: 'Классика',
    description: 'Антиутопия о тоталитарном обществе',
    deliveryMethods: ['Личная встреча', 'Почта']
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.destroy({ where: {}, truncate: true, cascade: true });
    await Book.destroy({ where: {}, truncate: true, cascade: true });

    console.log('База данных очищена');

    const createdUsers = await User.bulkCreate(users);
    console.log(`Создано ${createdUsers.length} пользователей`);

    const booksWithOwners = books.map((book, index) => ({
      ...book,
      ownerId: createdUsers[index % createdUsers.length].id
    }));

    const createdBooks = await Book.bulkCreate(booksWithOwners);
    console.log(`Создано ${createdBooks.length} книг`);

    console.log('База данных успешно заполнена!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
};

seedDatabase();
