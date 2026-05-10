# BookSwap Backend API

Backend API для платформы обмена книгами BookSwap.

## Технологии

- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- bcryptjs для хеширования паролей
- Socket.io для real-time чата (опционально)

## Установка

1. Установите зависимости:
```bash
cd backend
npm install
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. Настройте переменные окружения в `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookswap
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Создайте базу данных PostgreSQL:
```bash
# Войдите в PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE bookswap;

# Выйдите
\q
```

## Запуск

### Режим разработки (с автоперезагрузкой):
```bash
npm run dev
```

### Продакшн режим:
```bash
npm start
```

### Заполнение базы данных тестовыми данными:
```bash
npm run seed
```

## API Endpoints

### Аутентификация

#### Регистрация
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Имя Фамилия",
  "email": "email@example.com",
  "password": "password123",
  "location": "Алматы",
  "bio": "Описание профиля"
}
```

#### Вход
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "email@example.com",
  "password": "password123"
}
```

#### Получить профиль (требуется авторизация)
```
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Обновить профиль (требуется авторизация)
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Новое имя",
  "location": "Астана",
  "bio": "Новое описание",
  "preferences": {
    "genres": ["Психология", "Научпоп"],
    "authors": ["Джеймс Клир"]
  }
}
```

### Книги

#### Получить все книги (с фильтрацией)
```
GET /api/books?search=атомные&genre=Психология&condition=Хорошее&location=Алматы&page=1&limit=20
```

#### Получить книгу по ID
```
GET /api/books/:id
```

#### Создать книгу (требуется авторизация)
```
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Название книги",
  "author": "Автор",
  "cover": "https://example.com/cover.jpg",
  "condition": "Хорошее",
  "genre": "Психология",
  "description": "Описание книги",
  "isbn": "978-3-16-148410-0",
  "deliveryMethods": ["Личная встреча", "Курьер"]
}
```

#### Обновить книгу (требуется авторизация)
```
PUT /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Новое название",
  "available": false
}
```

#### Удалить книгу (требуется авторизация)
```
DELETE /api/books/:id
Authorization: Bearer <token>
```

#### Получить мои книги (требуется авторизация)
```
GET /api/books/my-books
Authorization: Bearer <token>
```

### Обмены

#### Создать запрос на обмен (требуется авторизация)
```
POST /api/exchanges
Authorization: Bearer <token>
Content-Type: application/json

{
  "ownerBookId": "book_id_1",
  "requesterBookId": "book_id_2"
}
```

#### Получить мои обмены (требуется авторизация)
```
GET /api/exchanges?type=incoming
GET /api/exchanges?type=outgoing
GET /api/exchanges
Authorization: Bearer <token>
```

#### Получить обмен по ID (требуется авторизация)
```
GET /api/exchanges/:id
Authorization: Bearer <token>
```

#### Обновить статус обмена (требуется авторизация)
```
PUT /api/exchanges/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",
  "meetingDetails": {
    "time": "2026-05-10T18:00:00Z",
    "location": "Кофейня Книголюб",
    "method": "Личная встреча"
  }
}
```

Возможные статусы: `pending`, `confirmed`, `rejected`, `completed`, `cancelled`

#### Оценить обмен (требуется авторизация)
```
POST /api/exchanges/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}
```

### Сообщения

#### Отправить сообщение (требуется авторизация)
```
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "exchangeId": "exchange_id",
  "receiverId": "user_id",
  "content": "Текст сообщения"
}
```

#### Получить сообщения обмена (требуется авторизация)
```
GET /api/messages/exchange/:exchangeId
Authorization: Bearer <token>
```

### Рекомендации и Wishlist

#### Получить AI рекомендации (требуется авторизация)
```
GET /api/recommendations/ai-match
Authorization: Bearer <token>
```

#### Добавить в wishlist (требуется авторизация)
```
POST /api/recommendations/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book_id"
}
```

#### Получить wishlist (требуется авторизация)
```
GET /api/recommendations/wishlist
Authorization: Bearer <token>
```

#### Удалить из wishlist (требуется авторизация)
```
DELETE /api/recommendations/wishlist/:bookId
Authorization: Bearer <token>
```

## Модели данных

### User
- id: UUID (primary key)
- name: String (обязательно)
- email: String (обязательно, уникальный)
- password: String (обязательно, хешируется)
- location: String (обязательно)
- bio: Text
- avatar: String
- rating: Decimal(3,2) (0-5)
- totalExchanges: Integer
- preferences: JSONB { genres: [String], authors: [String] }
- timestamps: createdAt, updatedAt

### Book
- id: UUID (primary key)
- title: String (обязательно)
- author: String (обязательно)
- cover: String
- condition: Enum ['Новая', 'Хорошее', 'Потертая']
- genre: String (обязательно)
- description: Text
- isbn: String
- ownerId: UUID (foreign key -> User)
- available: Boolean
- deliveryMethods: Array[String]
- timestamps: createdAt, updatedAt

### Exchange
- id: UUID (primary key)
- requesterId: UUID (foreign key -> User)
- ownerId: UUID (foreign key -> User)
- requesterBookId: UUID (foreign key -> Book)
- ownerBookId: UUID (foreign key -> Book)
- status: Enum ['pending', 'confirmed', 'rejected', 'completed', 'cancelled']
- meetingDetails: JSONB { time, location, method }
- rating: JSONB { requesterRating, ownerRating }
- timestamps: createdAt, updatedAt

### Message
- id: UUID (primary key)
- exchangeId: UUID (foreign key -> Exchange)
- senderId: UUID (foreign key -> User)
- receiverId: UUID (foreign key -> User)
- content: Text
- read: Boolean
- timestamps: createdAt, updatedAt

### Wishlist
- id: UUID (primary key)
- userId: UUID (foreign key -> User)
- bookId: UUID (foreign key -> Book)
- timestamps: createdAt, updatedAt
- unique constraint: (userId, bookId)

## Алгоритм AI рекомендаций

Система рекомендаций учитывает:
1. **Жанры из истории обменов** - книги тех же жанров, что пользователь читал
2. **Авторы из истории** - книги любимых авторов
3. **Локация** - приоритет книгам из того же города
4. **Рейтинг владельца** - книги от пользователей с высоким рейтингом
5. **Предпочтения пользователя** - жанры и авторы из профиля

Каждая рекомендация получает score и сортируется по убыванию.

## Безопасность

- Пароли хешируются с помощью bcryptjs
- JWT токены для аутентификации
- Middleware для защиты приватных роутов
- Валидация прав доступа (пользователь может редактировать только свои книги)

## Разработка

Структура проекта:
```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── exchangeController.js
│   │   ├── messageController.js
│   │   └── recommendationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Exchange.js
│   │   ├── Message.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── exchangeRoutes.js
│   │   ├── messageRoutes.js
│   │   └── recommendationRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seed.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Тестовые данные

После запуска `npm run seed` будут созданы:
- 3 тестовых пользователя
- 8 книг различных жанров
- Пароль для всех тестовых пользователей: `password123`

Тестовые email:
- aidana@example.com
- askhat@example.com
- aigul@example.com
