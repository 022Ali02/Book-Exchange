import express from 'express';
import {
  createExchange,
  getMyExchanges,
  getExchangeById,
  updateExchangeStatus,
  rateExchange
} from '../controllers/exchangeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createExchange)
  .get(protect, getMyExchanges);

router.get('/:id', protect, getExchangeById);
router.put('/:id/status', protect, updateExchangeStatus);
router.post('/:id/rate', protect, rateExchange);

export default router;
