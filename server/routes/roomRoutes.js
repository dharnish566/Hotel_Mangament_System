import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';
import { createRoom, getOwnerRooms, toogleRoomAvailability } from '../controllers/roomControllers';


const roomRouter = express.Router();

roomRouter.post('/' , upload.array("images"  , 4) , protect , createRoom)
roomRouter.get('/' , getRooms)
roomRouter.get('/owner' , protect , getOwnerRooms)
roomRouter.post('/toogle-availability' , protect , toogleRoomAvailability)



export default roomRouter;