import { User } from '../models/index.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, location, bio } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const user = await User.create({
      name,
      email,
      password,
      location,
      bio
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location,
      bio: user.bio,
      rating: user.rating,
      totalExchanges: user.totalExchanges,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: { include: ['password'] }
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        rating: user.rating,
        totalExchanges: user.totalExchanges,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Неверный email или пароль' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.location = req.body.location || user.location;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.preferences) {
        user.preferences = req.body.preferences;
      }

      await user.save();

      res.json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
