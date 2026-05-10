import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пожалуйста, укажите имя' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Пожалуйста, укажите корректный email' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Пароль должен быть не менее 6 символов'
      }
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пожалуйста, укажите город' }
    }
  },
  bio: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Биография не должна превышать 500 символов'
      }
    }
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalExchanges: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      genres: [],
      authors: []
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;
