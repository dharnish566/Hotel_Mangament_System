import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {

    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins are not allowed to book rooms.' });
    }

    const booking = new Booking({
      ...req.body,
      userId: req.user.id,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('roomId');
    const enrichedBookings = bookings.map(b => ({
      ...b.toObject(),
      room: b.roomId,
    }));
    res.status(200).json(enrichedBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllBookingsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;       // Default to page 1
    const limit = parseInt(req.query.limit) || 5;     // Default to 5 bookings per page
    const skip = (page - 1) * limit;

    // Get total count of bookings for pagination
    const totalBookings = await Booking.countDocuments();
    // const totalPages = Math.ceil(totalBookings / limit);

    // Fetch paginated bookings
    const bookings = await Booking.find()
      .populate('userId roomId')
      .sort({ createdAt: -1 }) // Optional: newest first
      .skip(skip)
      .limit(limit);

    const paidBookings = await Booking.find();
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.status(200).json({
      bookings,
      totalBookings,
      totalRevenue,
      totalPages: Math.ceil(totalBookings / limit),
      currentPage: page,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getBookedDates = async (req, res) => {
  try {
    const { roomId } = req.params;

    const bookings = await Booking.find({ roomId: roomId });

    const bookedDates = [];

    bookings.forEach(booking => {
      const currentDate = new Date(booking.checkIn);
      const endDate = new Date(booking.checkOut);

      // Push each day in the booking range into the array
      while (currentDate <= endDate) {
        bookedDates.push(new Date(currentDate)); // Store a copy
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    res.status(200).json(bookedDates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/bookingController.js
// export const getBookingById = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const bookings = await Booking.find({ userId })
//       .populate('roomId')  // This brings full room data
//       .sort({ createdAt: -1 });

//     // Optional: transform `roomId` into `room` for frontend consistency
//     const enrichedBookings = bookings.map((booking) => ({
//       ...booking.toObject(),
//       room: booking.roomId,
//     }));

//     res.status(200).json(enrichedBookings);
//   } catch (err) {
//     console.error("Error fetching user bookings:", err);
//     res.status(500).json({ error: "Failed to fetch bookings" });
//   }
// };




