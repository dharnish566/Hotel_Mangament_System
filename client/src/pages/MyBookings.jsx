import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import axios from 'axios';
import { BookAlert } from 'lucide-react';


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Safely set bookings
        setBookings(
          res.data.map((booking) => ({
            ...booking,
            room: booking.roomId || booking.room || null,
          }))
        );
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Empty state component
  const EmptyBookingsState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="animate-bounce mb-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <BookAlert className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4 animate-fade-in">
          No Bookings Found
        </h3>
        <p className="text-gray-500 mb-8 max-w-md animate-fade-in-delay">
          You haven't made any hotel reservations yet. Start exploring our amazing rooms and make your first booking!
        </p>

        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-2"
          onClick={() => window.location.href = '/rooms'}
        >
          Browse Hotels
        </button>
      </div>

      {/* Floating animation elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float-1 absolute top-20 left-10 w-4 h-4 bg-blue-200 rounded-full opacity-60"></div>
        <div className="animate-float-2 absolute top-40 right-20 w-3 h-3 bg-purple-200 rounded-full opacity-60"></div>
        <div className="animate-float-3 absolute bottom-40 left-20 w-5 h-5 bg-pink-200 rounded-full opacity-60"></div>
        <div className="animate-float-4 absolute bottom-20 right-10 w-3 h-3 bg-yellow-200 rounded-full opacity-60"></div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(15px); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(-12px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s both;
        }
        
        .animate-float-1 {
          animation: float1 6s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float2 8s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float3 7s ease-in-out infinite;
        }
        
        .animate-float-4 {
          animation: float4 9s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
        <Title
          title="MY Bookings"
          subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
          align="left"
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title
        title="MY Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />

      {bookings.length === 0 ? (
        <EmptyBookingsState />
      ) : (
        <div className='max-w-6xl mt-8 w-full text-gray-800'>
          <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
            <div>Hotels</div>
            <div>Date & Timings</div>
            <div>Payment</div>
          </div>

          {bookings.map((booking) => (
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
              {/* Hotel details */}
              <div className='flex flex-col md:flex-row'>
                <img
                  src={
                    booking.room?.image
                      ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${booking.room.image}`
                      : '/fallback.jpg'
                  }
                  alt="hotel-img"
                  className='min-md:w-44 rounded shadow object-cover'
                />
                <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                  <p className='font-playfair text-2xl'>
                    {booking.room?.name || 'Room Name Unavailable'}
                  </p>

                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{booking.room?.description || 'No description available'}</span>
                  </div>

                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <img src={assets.guestsIcon} alt="guests-icon" />
                    <span>Guests: {booking.guests}</span>
                  </div>

                  <p className='text-base'>
                    Total: ₹{booking.totalPrice?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>

              {/* Date & timings */}
              <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                <div>
                  <p className=''>Check-In:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkIn).toDateString()}
                  </p>
                </div>
                <div>
                  <p className=''>Check-Out:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkOut).toDateString()}
                  </p>
                </div>
              </div>

              {/* Payment status */}
              <div className='flex flex-col items-start justify-center pt-3'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-3 w-3 rounded-full ${booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  ></div>
                  <p
                    className={`text-sm ${booking.isPaid ? 'text-green-500' : 'text-red-500'
                      }`}
                  >
                    {booking.isPaid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>

                {!booking.isPaid && (
                  <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;