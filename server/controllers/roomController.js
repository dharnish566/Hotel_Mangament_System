import Room from '../models/Room.js';
import Booking from "../models/Booking.js";
import mongoose from 'mongoose';

export const createRoom = async (req, res) => {
  try {
    const roomData = {
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      price: Number(req.body.price),
      ac: req.body.ac === 'true' || req.body.ac === true,
      maxGuests: Number(req.body.maxGuests),
      location: req.body.location,
      amenities: JSON.parse(req.body.amenities),
      image: req.file ? req.file.path : null
    };
    console.log(req.file.path);

    const newRoom = new Room(roomData);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Room creation error:', err.message);
    res.status(500).json({ error: err.message });
  }
};


export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
    console.log("rooms: ", rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVisibleRooms = async (req, res) => {
  try {
    const visibleRooms = await Room.find({ isVisible: true });
    res.status(200).json(visibleRooms);
  } catch (err) {    
    res.status(500).json({ error: err.message });
  }
}


export const getRoomById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid room ID' });
  }

  try {
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (err) {
    console.error('Error fetching room by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// export const toggleRoomVisibility = async (req, res) => {
//   try {
//     const room = await Room.findById(req.params.id);
//     room.isVisible = !room.isVisible;
//     await room.save();
//     res.status(200).json(room);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(id);
    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully', room: deletedRoom });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    // Optional: Validate MongoDB ObjectId
    if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, {
      new: true,             // return the updated document
      runValidators: true,   // run schema validators
    });

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    console.error('Room update failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAvailableRooms = async (req, res) => {

  try {
    const { destination, checkIn, checkOut } = req.query;
    console.log(destination , checkIn , checkOut );

    // Validate input
    if (!destination || !checkIn || !checkOut ) {
      return res.status(400).json({ message: 'All search parameters are required' });
    }
    

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Find rooms in location with sufficient capacity
    const rooms = await Room.find({
            location: { $regex: destination, $options: 'i' },
        });
        
    const availableRooms = await Promise.all(
      rooms.map(async (room) => {
        const overlappingBookings = await Booking.countDocuments({
          roomId: room._id,
          $or: [
            {
              checkIn: { $lt: checkOutDate },
              checkOut: { $gt: checkInDate }
            }
          ],
          status: { $ne: 'cancelled' }
        });

        return overlappingBookings === 0 ? room : null;
      })
    );

    // Filter out null values (unavailable rooms)
    const filteredRooms = availableRooms.filter(room => room !== null);

    res.json(filteredRooms);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};


