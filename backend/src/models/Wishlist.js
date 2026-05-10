import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'bookId']
    }
  ]
});

export default Wishlist;
