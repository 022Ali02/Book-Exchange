import { Book, User } from '../models/index.js';
import { Op } from 'sequelize';

export const createBook = async (req, res) => {
  try {
    const { title, author, cover, condition, genre, description, isbn, deliveryMethods } = req.body;

    const book = await Book.create({
      title,
      author,
      cover,
      condition,
      genre,
      description,
      isbn,
      deliveryMethods,
      ownerId: req.user.id
    });

    const populatedBook = await Book.findByPk(book.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'location', 'rating'] }]
    });

    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { search, genre, condition, location, delivery, page = 1, limit = 20 } = req.query;

    const where = { available: true };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
        { genre: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (genre) {
      where.genre = genre;
    }

    if (condition) {
      where.condition = condition;
    }

    if (delivery) {
      where.deliveryMethods = { [Op.contains]: [delivery] };
    }

    const offset = (page - 1) * limit;

    const { count, rows: books } = await Book.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'location', 'rating', 'totalExchanges'],
        ...(location && { where: { location } })
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'location', 'rating', 'totalExchanges', 'bio']
      }]
    });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Книга не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      if (book.ownerId !== req.user.id) {
        return res.status(403).json({ message: 'Вы не можете редактировать эту книгу' });
      }

      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.cover = req.body.cover || book.cover;
      book.condition = req.body.condition || book.condition;
      book.genre = req.body.genre || book.genre;
      book.description = req.body.description || book.description;
      book.isbn = req.body.isbn || book.isbn;
      book.deliveryMethods = req.body.deliveryMethods || book.deliveryMethods;
      book.available = req.body.available !== undefined ? req.body.available : book.available;

      await book.save();

      const populatedBook = await Book.findByPk(book.id, {
        include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'location', 'rating'] }]
      });

      res.json(populatedBook);
    } else {
      res.status(404).json({ message: 'Книга не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      if (book.ownerId !== req.user.id) {
        return res.status(403).json({ message: 'Вы не можете удалить эту книгу' });
      }

      await book.destroy();
      res.json({ message: 'Книга удалена' });
    } else {
      res.status(404).json({ message: 'Книга не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
