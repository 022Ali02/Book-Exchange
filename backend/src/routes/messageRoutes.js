import express from 'express';
import { sendMessage, getExchangeMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/exchange/:exchangeId', protect, getExchangeMessages);

export default router;
