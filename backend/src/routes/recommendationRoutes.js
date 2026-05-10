import express from 'express';
import {
  getAIRecommendations,
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from '../controllers/recommendationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/ai-match', protect, getAIRecommendations);
router.post('/wishlist', protect, addToWishlist);
router.get('/wishlist', protect, getWishlist);
router.delete('/wishlist/:bookId', protect, removeFromWishlist);

export default router;
