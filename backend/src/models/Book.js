import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пожалуйста, укажите название книги' }
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пожалуйста, укажите автора' }
    }
  },
  cover: {
    type: DataTypes.STRING,
    defaultValue: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
  },
  condition: {
    type: DataTypes.ENUM('Новая', 'Хорошее', 'Потертая'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пожалуйста, укажите состояние книги' }
    }
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пожалуйста, укажите жанр' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Описание не должно превышать 1000 символов'
      }
    }
  },
  isbn: {
    type: DataTypes.STRING
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  deliveryMethods: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    {
      type: 'FULLTEXT',
      fields: ['title', 'author', 'genre']
    }
  ]
});

export default Book;
