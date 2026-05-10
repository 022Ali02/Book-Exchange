import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  exchangeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Exchanges',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Сообщение не может быть пустым' }
    }
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default Message;
