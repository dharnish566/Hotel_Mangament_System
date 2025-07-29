import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import {
  createRoom,
  getVisibleRooms,
  getRoomById,
  deleteRoom,
  updateRoom,
  getAllRooms,
  getAvailableRooms,
} from '../controllers/roomController.js';

import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Default upload folder
const uploadDir = 'uploads';

// Auto-create folder if missing
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Saves in /uploads/
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// 🔥 Routes
router.post('/', verifyAdmin, upload.single('image'), createRoom);

router.get('/all' , getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/', getVisibleRooms);
router.get('/:id', getRoomById);

// router.put('/:id/toggle', verifyAdmin, toggleRoomVisibility);
router.delete('/:id', verifyAdmin, deleteRoom);
router.put('/:id', verifyAdmin, updateRoom);

export default router;
