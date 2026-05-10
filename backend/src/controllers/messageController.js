import { Message, Exchange } from '../models/index.js';

export const sendMessage = async (req, res) => {
  try {
    const { exchangeId, receiverId, content } = req.body;

    const exchange = await Exchange.findByPk(exchangeId);

    if (!exchange) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }

    if (exchange.requesterId !== req.user.id && exchange.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const message = await Message.create({
      exchangeId,
      senderId: req.user.id,
      receiverId,
      content
    });

    const populatedMessage = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] }
      ]
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExchangeMessages = async (req, res) => {
  try {
    const { exchangeId } = req.params;

    const exchange = await Exchange.findByPk(exchangeId);

    if (!exchange) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }

    if (exchange.requesterId !== req.user.id && exchange.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const messages = await Message.findAll({
      where: { exchangeId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    await Message.update(
      { read: true },
      {
        where: {
          exchangeId,
          receiverId: req.user.id,
          read: false
        }
      }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
