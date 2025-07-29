import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'],
    required: true,
  },
  ac: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  maxGuests: {
    type: Number,
    required: true
  },
  amenities: {
    type: Map,
    of: Boolean,
    default: {},
  },
  isVisible: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
