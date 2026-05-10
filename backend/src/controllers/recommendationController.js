import { Book, Exchange, Wishlist, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getAIRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userLocation = req.user.location;
    const userPreferences = req.user.preferences || { genres: [], authors: [] };

    // Получаем историю обменов пользователя
    const userExchanges = await Exchange.findAll({
      where: {
        [Op.or]: [{ requesterId: userId }, { ownerId: userId }],
        status: 'completed'
      },
      include: [
        { model: Book, as: 'requesterBook' },
        { model: Book, as: 'ownerBook' }
      ]
    });

    const readGenres = new Set();
    const readAuthors = new Set();

    userExchanges.forEach(exchange => {
      const book = exchange.requesterId === userId
        ? exchange.ownerBook
        : exchange.requesterBook;

      if (book) {
        readGenres.add(book.genre);
        readAuthors.add(book.author);
      }
    });

    // Добавляем предпочтения из профиля
    userPreferences.genres?.forEach(genre => readGenres.add(genre));
    userPreferences.authors?.forEach(author => readAuthors.add(author));

    // Исключаем свои книги и wishlist
    const myBooks = await Book.findAll({
      where: { ownerId: userId },
      attributes: ['id']
    });
    const myBookIds = myBooks.map(book => book.id);

    const wishlist = await Wishlist.findAll({
      where: { userId },
      attributes: ['bookId']
    });
    const wishlistBookIds = wishlist.map(item => item.bookId);

    const excludeIds = [...myBookIds, ...wishlistBookIds];

    let recommendations = [];

    // 1. Книги по любимым жанрам (приоритет)
    if (readGenres.size > 0) {
      const genreBooks = await Book.findAll({
        where: {
          genre: { [Op.in]: Array.from(readGenres) },
          available: true,
          id: excludeIds.length > 0 ? { [Op.notIn]: excludeIds } : { [Op.ne]: null }
        },
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'location', 'rating', 'totalExchanges']
        }],
        limit: 30,
        order: [['createdAt', 'DESC']]
      });

      recommendations.push(...genreBooks.map(book => ({
        ...book.toJSON(),
        aiRecommendation: `Рекомендуем: жанр "${book.genre}" в ваших предпочтениях`,
        score: book.owner.location === userLocation ? 15 : 10
      })));
    }

    // 2. Книги любимых авторов
    if (readAuthors.size > 0) {
      const authorBooks = await Book.findAll({
        where: {
          author: { [Op.in]: Array.from(readAuthors) },
          available: true,
          id: excludeIds.length > 0 ? { [Op.notIn]: excludeIds } : { [Op.ne]: null }
        },
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'location', 'rating', 'totalExchanges']
        }],
        limit: 15
      });

      recommendations.push(...authorBooks.map(book => ({
        ...book.toJSON(),
        aiRecommendation: `Автор ${book.author} в вашей истории чтения`,
        score: book.owner.location === userLocation ? 14 : 9
      })));
    }

    // 3. Популярные книги в вашем городе
    const nearbyBooks = await Book.findAll({
      where: {
        available: true,
        id: excludeIds.length > 0 ? { [Op.notIn]: excludeIds } : { [Op.ne]: null }
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'location', 'rating', 'totalExchanges'],
        where: { location: userLocation }
      }],
      limit: 20,
      order: [[{ model: User, as: 'owner' }, 'rating', 'DESC']]
    });

    recommendations.push(...nearbyBooks.map(book => ({
      ...book.toJSON(),
      aiRecommendation: `Популярно в ${userLocation}`,
      score: parseFloat(book.owner.rating) >= 4.5 ? 12 : 8
    })));

    // 4. Книги от владельцев с высоким рейтингом
    const highRatedBooks = await Book.findAll({
      where: {
        available: true,
        id: excludeIds.length > 0 ? { [Op.notIn]: excludeIds } : { [Op.ne]: null }
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'location', 'rating', 'totalExchanges'],
        where: {
          rating: { [Op.gte]: 4.5 }
        }
      }],
      limit: 20,
      order: [[{ model: User, as: 'owner' }, 'totalExchanges', 'DESC']]
    });

    recommendations.push(...highRatedBooks.map(book => ({
      ...book.toJSON(),
      aiRecommendation: `От опытного читателя (${book.owner.totalExchanges} обменов)`,
      score: 7
    })));

    // 5. Новые поступления (разнообразие)
    const newBooks = await Book.findAll({
      where: {
        available: true,
        id: excludeIds.length > 0 ? { [Op.notIn]: excludeIds } : { [Op.ne]: null }
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'location', 'rating', 'totalExchanges']
      }],
      order: [['createdAt', 'DESC']],
      limit: 15
    });

    recommendations.push(...newBooks.map(book => ({
      ...book.toJSON(),
      aiRecommendation: 'Новое поступление',
      score: 5
    })));

    // 6. Случайные книги для разнообразия
    const randomBooks = await Book.findAll({
      where: {
        available: true,
        id: excludeIds.length > 0 ? { [Op.notIn]: excludeIds } : { [Op.ne]: null }
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'location', 'rating', 'totalExchanges']
      }],
      order: [['id', 'DESC']],
      limit: 20
    });

    recommendations.push(...randomBooks.map(book => ({
      ...book.toJSON(),
      aiRecommendation: 'Откройте для себя что-то новое',
      score: 3
    })));

    // Убираем дубликаты
    const uniqueRecommendations = Array.from(
      new Map(recommendations.map(item => [item.id, item])).values()
    );

    // Сортируем по score
    uniqueRecommendations.sort((a, b) => b.score - a.score);

    // Возвращаем топ-10
    const topRecommendations = uniqueRecommendations.slice(0, 10);

    res.json(topRecommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    const existingWishlist = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        bookId
      }
    });

    if (existingWishlist) {
      return res.status(400).json({ message: 'Книга уже в списке желаемого' });
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      bookId
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Book,
        as: 'book',
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'location', 'rating']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const deleted = await Wishlist.destroy({
      where: {
        userId: req.user.id,
        bookId
      }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Книга не найдена в списке желаемого' });
    }

    res.json({ message: 'Книга удалена из списка желаемого' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
