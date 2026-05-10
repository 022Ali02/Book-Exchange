import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyBooks
} from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.get('/my-books', protect, getMyBooks);

router.route('/:id')
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;
