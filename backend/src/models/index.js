import User from './User.js';
import Book from './Book.js';
import Exchange from './Exchange.js';
import Message from './Message.js';
import Wishlist from './Wishlist.js';

// User - Book (one-to-many)
User.hasMany(Book, { foreignKey: 'ownerId', as: 'books' });
Book.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Exchange - User (many-to-one)
Exchange.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Exchange.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Exchange - Book (many-to-one)
Exchange.belongsTo(Book, { foreignKey: 'requesterBookId', as: 'requesterBook' });
Exchange.belongsTo(Book, { foreignKey: 'ownerBookId', as: 'ownerBook' });

// Message - Exchange (many-to-one)
Message.belongsTo(Exchange, { foreignKey: 'exchangeId', as: 'exchange' });
Exchange.hasMany(Message, { foreignKey: 'exchangeId', as: 'messages' });

// Message - User (many-to-one)
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Wishlist - User and Book (many-to-many through)
User.belongsToMany(Book, { through: Wishlist, foreignKey: 'userId', as: 'wishlistBooks' });
Book.belongsToMany(User, { through: Wishlist, foreignKey: 'bookId', as: 'wishlistedBy' });

Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wishlist.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

export { User, Book, Exchange, Message, Wishlist };
