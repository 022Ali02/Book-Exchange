import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Exchange = sequelize.define('Exchange', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  requesterBookId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'id'
    }
  },
  ownerBookId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  meetingDetails: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  rating: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true
});

export default Exchange;
