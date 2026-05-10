import { Exchange, Book, User } from '../models/index.js';
import { Op } from 'sequelize';

export const createExchange = async (req, res) => {
  try {
    const { ownerBookId, requesterBookId } = req.body;

    const ownerBook = await Book.findByPk(ownerBookId, {
      include: [{ model: User, as: 'owner' }]
    });
    const requesterBook = await Book.findByPk(requesterBookId);

    if (!ownerBook || !requesterBook) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    if (!ownerBook.available || !requesterBook.available) {
      return res.status(400).json({ message: 'Одна из книг недоступна для обмена' });
    }

    if (requesterBook.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Вы можете предложить только свои книги' });
    }

    if (ownerBook.ownerId === req.user.id) {
      return res.status(400).json({ message: 'Вы не можете обменяться с самим собой' });
    }

    const exchange = await Exchange.create({
      requesterId: req.user.id,
      ownerId: ownerBook.ownerId,
      requesterBookId,
      ownerBookId
    });

    const populatedExchange = await Exchange.findByPk(exchange.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'location', 'rating'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'location', 'rating'] },
        { model: Book, as: 'requesterBook' },
        { model: Book, as: 'ownerBook' }
      ]
    });

    res.status(201).json(populatedExchange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyExchanges = async (req, res) => {
  try {
    const { type } = req.query;

    let where = {};

    if (type === 'incoming') {
      where.ownerId = req.user.id;
    } else if (type === 'outgoing') {
      where.requesterId = req.user.id;
    } else {
      where[Op.or] = [
        { requesterId: req.user.id },
        { ownerId: req.user.id }
      ];
    }

    const exchanges = await Exchange.findAll({
      where,
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'location', 'rating'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'location', 'rating'] },
        { model: Book, as: 'requesterBook' },
        { model: Book, as: 'ownerBook' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(exchanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExchangeById = async (req, res) => {
  try {
    const exchange = await Exchange.findByPk(req.params.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'location', 'rating', 'bio'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'location', 'rating', 'bio'] },
        { model: Book, as: 'requesterBook' },
        { model: Book, as: 'ownerBook' }
      ]
    });

    if (!exchange) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }

    if (exchange.requesterId !== req.user.id && exchange.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json(exchange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExchangeStatus = async (req, res) => {
  try {
    const { status, meetingDetails } = req.body;
    const exchange = await Exchange.findByPk(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }

    if (exchange.ownerId !== req.user.id && status === 'confirmed') {
      return res.status(403).json({ message: 'Только владелец книги может подтвердить обмен' });
    }

    if (exchange.requesterId !== req.user.id && exchange.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    exchange.status = status;

    if (meetingDetails) {
      exchange.meetingDetails = meetingDetails;
    }

    if (status === 'confirmed') {
      await Book.update({ available: false }, { where: { id: exchange.requesterBookId } });
      await Book.update({ available: false }, { where: { id: exchange.ownerBookId } });
    }

    if (status === 'rejected' || status === 'cancelled') {
      await Book.update({ available: true }, { where: { id: exchange.requesterBookId } });
      await Book.update({ available: true }, { where: { id: exchange.ownerBookId } });
    }

    if (status === 'completed') {
      await User.increment('totalExchanges', { where: { id: exchange.requesterId } });
      await User.increment('totalExchanges', { where: { id: exchange.ownerId } });
    }

    await exchange.save();

    const populatedExchange = await Exchange.findByPk(exchange.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'location', 'rating'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'location', 'rating'] },
        { model: Book, as: 'requesterBook' },
        { model: Book, as: 'ownerBook' }
      ]
    });

    res.json(populatedExchange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rateExchange = async (req, res) => {
  try {
    const { rating } = req.body;
    const exchange = await Exchange.findByPk(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }

    if (exchange.status !== 'completed') {
      return res.status(400).json({ message: 'Можно оценить только завершенный обмен' });
    }

    const currentRating = exchange.rating || {};

    if (exchange.requesterId === req.user.id) {
      if (currentRating.requesterRating) {
        return res.status(400).json({ message: 'Вы уже оценили этот обмен' });
      }
      currentRating.requesterRating = rating;

      const allExchanges = await Exchange.findAll({
        where: {
          ownerId: exchange.ownerId,
          status: 'completed'
        }
      });

      const ratings = allExchanges
        .map(ex => ex.rating?.requesterRating)
        .filter(r => r !== undefined && r !== null);

      if (ratings.length > 0) {
        const avgRating = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
        await User.update({ rating: avgRating }, { where: { id: exchange.ownerId } });
      }
    } else if (exchange.ownerId === req.user.id) {
      if (currentRating.ownerRating) {
        return res.status(400).json({ message: 'Вы уже оценили этот обмен' });
      }
      currentRating.ownerRating = rating;

      const allExchanges = await Exchange.findAll({
        where: {
          requesterId: exchange.requesterId,
          status: 'completed'
        }
      });

      const ratings = allExchanges
        .map(ex => ex.rating?.ownerRating)
        .filter(r => r !== undefined && r !== null);

      if (ratings.length > 0) {
        const avgRating = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
        await User.update({ rating: avgRating }, { where: { id: exchange.requesterId } });
      }
    } else {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    exchange.rating = currentRating;
    await exchange.save();

    res.json({ message: 'Оценка добавлена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
