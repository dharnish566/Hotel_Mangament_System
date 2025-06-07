import express from "express";
import { protect } from "../middleware/authMiddleware";
import { registerHotel } from "../controllers/HotelControllers";

const hotelRouter = express.Router();

hotelRouter.post('/' , protect , registerHotel);

export default hotelRouter;