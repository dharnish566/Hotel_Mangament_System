import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DialogConfirm from '../components/DIalogConfirm';
import { Blinds } from 'lucide-react';
import { toast } from 'react-toastify';

const BookingSummary = () => {
  const { state } = useLocation();
  const { roomId, guests, checkIn, checkOut } = state || {};

  const [room, setRoom] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const [checkInDate, setCheckInDate] = useState(new Date(checkIn));
  const [checkOutDate, setCheckOutDate] = useState(new Date(checkOut));

  const [tempCheckIn, setTempCheckIn] = useState(new Date(checkIn));
  const [tempCheckOut, setTempCheckOut] = useState(new Date(checkOut));
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [dateError, setDateError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (roomId) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/${roomId}`)
        .then(res => setRoom(res.data))
        .catch(err => console.error("Failed to fetch room data", err));
    }
  }, [roomId]);

  if (!room) return <p className="text-center mt-20">Loading room details...</p>;

  // Use updated or edited dates
  const selectedCheckIn = isEditingDates ? tempCheckIn : checkInDate;
  const selectedCheckOut = isEditingDates ? tempCheckOut : checkOutDate;

  const nights = Math.max(
    1,
    Math.ceil((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24))
  );

  const totalPrice = nights * room.price;
  const taxes = Math.round(totalPrice * 0.18);
  const finalTotal = totalPrice + taxes;

  const normalizeKey = (key) =>
    key.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");

  const amenityIcons = {
    free_wifi: "📶",
    free_breakfast: "🍽️",
    room_service: "🛎️",
    mountain_view: "🏔️",
    pool_access: "🏊",
  };

  const imageUrl = room.image
    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${room.image}`
    : '/fallback.jpg';

  const handleConfirmBooking = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
        {
          roomId,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          guests,
          totalPrice: finalTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/my-bookings');
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Room Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 relative overflow-hidden rounded-t-lg shadow">
                <img
                  src={imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white z-10">
                  <h1 className="text-3xl font-bold">{room.name}</h1>
                  <p className="text-sm">{room.location || "Beautiful Location"}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">4.5</span>
                    <span className="text-gray-500 text-sm">(324 reviews)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-semibold text-green-600">₹{room.price.toLocaleString()}</span>
                    <span className="text-gray-500">/night</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Blinds className="h-5 w-5 mb-4" />
                  <span>{room.description}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {room.amenities &&
                    Object.entries(room.amenities).map(([key, value]) =>
                      value ? (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-lg">
                            {amenityIcons[normalizeKey(key)] || "✔️"}
                          </span>
                          <span>{key}</span>
                        </div>
                      ) : null
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{guests} Adults</span>
                </div>

                {/* Check-in / Check-out */}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Check-in</span>
                    {isEditingDates ? (
                      <input
                        type="date"
                        value={tempCheckIn.toISOString().split('T')[0]}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTempCheckIn(new Date(e.target.value))}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      <span className="font-medium">{checkInDate.toDateString()}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Check-out</span>
                    {isEditingDates ? (
                      <input
                        type="date"
                        value={tempCheckOut.toISOString().split('T')[0]}
                        min={tempCheckIn.toISOString().split('T')[0]}
                        onChange={(e) => setTempCheckOut(new Date(e.target.value))}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      <span className="font-medium">{checkOutDate.toDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Stay</span>
                    <span className="font-semibold text-lg">{nights} nights</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-gray-800 mb-3">Price Breakdown</h3>

                <div className="flex justify-between">
                  <span className="text-gray-600">₹{room.price.toLocaleString()} × {nights} nights</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">₹{taxes.toLocaleString()}</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => setShowDialog(true)}
                >
                  Confirm Booking
                </button>

                {isEditingDates ? (
                  <div className="space-y-2">
                    <button
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                      onClick={() => {

                        if (tempCheckIn.toDateString() === tempCheckOut.toDateString()) {
                          setDateError("Check-in and Check-out dates cannot be the same.");
                          toast.error(dateError);
                          return;
                        }
                        
                        if (tempCheckIn > tempCheckOut) {
                          setDateError("Check-in date must be earlier than Check-out date.");
                          toast.error(dateError);
                          return;
                        }


                        setDateError(null);
                        setCheckInDate(tempCheckIn);
                        setCheckOutDate(tempCheckOut);
                        setIsEditingDates(false);
                      }}


                    >
                      Save Changes
                    </button>
                    <button
                      className="w-full border border-gray-300 py-2 rounded-lg"
                      onClick={() => {
                        setTempCheckIn(checkInDate);
                        setTempCheckOut(checkOutDate);
                        setIsEditingDates(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                    onClick={() => setIsEditingDates(true)}
                  >
                    Modify Booking
                  </button>
                )}
              </div>

              {/* Confirm Dialog */}
              {showDialog && (
                <DialogConfirm
                  open={showDialog}
                  onClose={() => setShowDialog(false)}
                  onConfirm={handleConfirmBooking}
                  message="Are you sure you want to confirm this booking?"
                />
              )}

              {/* Cancellation Info */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Free cancellation</strong> until 48 hours before check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
