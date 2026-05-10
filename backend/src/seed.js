import { User, Book } from './models/index.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('Начинаем заполнение базы данных...');

    // Создаем тестовых пользователей
    const users = [];
    const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз'];
    const names = [
      'Айгерим Нурланова',
      'Данияр Сейтов',
      'Асель Жумабаева',
      'Ерлан Касымов',
      'Динара Абдуллаева',
      'Тимур Оспанов',
      'Жанна Мухамедова',
      'Арман Бекетов'
    ];

    for (let i = 0; i < names.length; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        name: names[i],
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        location: cities[i % cities.length],
        bio: 'Люблю читать и обмениваться книгами!',
        rating: (4.0 + Math.random() * 1.0).toFixed(2),
        totalExchanges: Math.floor(Math.random() * 20),
        preferences: {
          genres: ['Психология', 'Научпоп', 'Классика'].slice(0, Math.floor(Math.random() * 3) + 1),
          authors: []
        }
      });
      users.push(user);
      console.log(`Создан пользователь: ${user.name}`);
    }

    // Создаем книги
    const books = [
      {
        title: 'Атомные привычки',
        author: 'Джеймс Клир',
        genre: 'Психология',
        condition: 'Хорошее',
        description: 'Как приобрести хорошие привычки и избавиться от плохих',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        isbn: '978-5-00146-726-3',
        deliveryMethods: ['Личная встреча', 'Курьер']
      },
      {
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        genre: 'Классика',
        condition: 'Новая',
        description: 'Культовый роман о дьяволе в Москве',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        isbn: '978-5-17-983456-7',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Sapiens',
        author: 'Юваль Харари',
        genre: 'Научпоп',
        condition: 'Хорошее',
        description: 'Краткая история человечества',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        isbn: '978-5-00117-492-9',
        deliveryMethods: ['Личная встреча', 'Почта']
      },
      {
        title: 'Психология влияния',
        author: 'Роберт Чалдини',
        genre: 'Психология',
        condition: 'Потертая',
        description: 'Как научиться убеждать и противостоять убеждению',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        isbn: '978-5-496-00264-6',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: '1984',
        author: 'Джордж Оруэлл',
        genre: 'Классика',
        condition: 'Хорошее',
        description: 'Антиутопия о тоталитарном обществе',
        cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
        isbn: '978-5-17-100569-3',
        deliveryMethods: ['Личная встреча', 'Курьер']
      },
      {
        title: 'Думай медленно... решай быстро',
        author: 'Даниэль Канеман',
        genre: 'Психология',
        condition: 'Новая',
        description: 'О двух системах мышления',
        cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
        isbn: '978-5-17-080053-7',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Преступление и наказание',
        author: 'Федор Достоевский',
        genre: 'Классика',
        condition: 'Хорошее',
        description: 'Классический роман о морали и наказании',
        cover: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400',
        isbn: '978-5-17-982345-6',
        deliveryMethods: ['Личная встреча', 'Почта']
      },
      {
        title: 'Краткая история времени',
        author: 'Стивен Хокинг',
        genre: 'Научпоп',
        condition: 'Хорошее',
        description: 'От Большого взрыва до черных дыр',
        cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
        isbn: '978-5-17-982456-9',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Гарри Поттер и философский камень',
        author: 'Джоан Роулинг',
        genre: 'Фантастика',
        condition: 'Потертая',
        description: 'Первая книга о юном волшебнике',
        cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
        isbn: '978-5-389-07435-4',
        deliveryMethods: ['Личная встреча', 'Курьер']
      },
      {
        title: 'Тонкое искусство пофигизма',
        author: 'Марк Мэнсон',
        genre: 'Психология',
        condition: 'Новая',
        description: 'Парадоксальный способ жить счастливо',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        isbn: '978-5-389-12441-7',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Анна Каренина',
        author: 'Лев Толстой',
        genre: 'Классика',
        condition: 'Хорошее',
        description: 'Роман о любви и трагедии',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        isbn: '978-5-17-982567-2',
        deliveryMethods: ['Личная встреча', 'Почта']
      },
      {
        title: 'Homo Deus',
        author: 'Юваль Харари',
        genre: 'Научпоп',
        condition: 'Новая',
        description: 'Краткая история будущего',
        cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
        isbn: '978-5-906837-70-0',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Маленький принц',
        author: 'Антуан де Сент-Экзюпери',
        genre: 'Классика',
        condition: 'Хорошее',
        description: 'Философская сказка о дружбе и любви',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        isbn: '978-5-17-982678-5',
        deliveryMethods: ['Личная встреча', 'Курьер']
      },
      {
        title: 'Краткие ответы на большие вопросы',
        author: 'Стивен Хокинг',
        genre: 'Научпоп',
        condition: 'Новая',
        description: 'Последняя книга великого физика',
        cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400',
        isbn: '978-5-17-109503-8',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Война и мир',
        author: 'Лев Толстой',
        genre: 'Классика',
        condition: 'Потертая',
        description: 'Эпический роман о войне 1812 года',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        isbn: '978-5-17-982789-8',
        deliveryMethods: ['Личная встреча', 'Почта']
      },
      {
        title: 'Гордость и предубеждение',
        author: 'Джейн Остин',
        genre: 'Роман',
        condition: 'Хорошее',
        description: 'Классический роман о любви',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        isbn: '978-5-17-982890-1',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Убийство в Восточном экспрессе',
        author: 'Агата Кристи',
        genre: 'Детектив',
        condition: 'Новая',
        description: 'Знаменитый детектив с Эркюлем Пуаро',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        isbn: '978-5-17-982901-4',
        deliveryMethods: ['Личная встреча', 'Курьер']
      },
      {
        title: 'Шерлок Холмс',
        author: 'Артур Конан Дойл',
        genre: 'Детектив',
        condition: 'Хорошее',
        description: 'Сборник рассказов о великом сыщике',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        isbn: '978-5-17-983012-6',
        deliveryMethods: ['Личная встреча']
      },
      {
        title: 'Алхимик',
        author: 'Пауло Коэльо',
        genre: 'Роман',
        condition: 'Новая',
        description: 'Философская притча о поиске своего пути',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        isbn: '978-5-17-983123-9',
        deliveryMethods: ['Личная встреча', 'Почта']
      },
      {
        title: 'Дюна',
        author: 'Фрэнк Герберт',
        genre: 'Фантастика',
        condition: 'Хорошее',
        description: 'Эпическая научная фантастика',
        cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
        isbn: '978-5-17-983234-2',
        deliveryMethods: ['Личная встреча']
      }
    ];

    // Распределяем книги между пользователями
    for (let i = 0; i < books.length; i++) {
      const owner = users[i % users.length];
      const book = await Book.create({
        ...books[i],
        ownerId: owner.id,
        available: true
      });
      console.log(`Создана книга: ${book.title} (владелец: ${owner.name})`);
    }

    console.log('\n✅ База данных успешно заполнена!');
    console.log(`Создано пользователей: ${users.length}`);
    console.log(`Создано книг: ${books.length}`);
    console.log('\nТеперь вы можете:');
    console.log('1. Зарегистрироваться на сайте');
    console.log('2. Или войти с тестовым аккаунтом:');
    console.log('   Email: user1@example.com');
    console.log('   Пароль: password123');

    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
};

seedDatabase();
