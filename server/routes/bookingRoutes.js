import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookingsForAdmin,
  getBookedDates,
} from '../controllers/bookingController.js';
import { verifyUser, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyUser, createBooking);
router.get('/my', verifyUser, getUserBookings);
router.get('/admin', verifyAdmin, getAllBookingsForAdmin);
router.get('/room/:roomId/booked-dates', getBookedDates);


export default router;
