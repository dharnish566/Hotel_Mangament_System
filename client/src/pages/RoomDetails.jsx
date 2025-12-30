import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../components/StarRating';
import Checkcalendar from '../components/Checkcalendar';
import axios from 'axios';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [availabilityMsg, setAvailabilityMsg] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/${id}`);
        const roomData = res.data;

        const amenities = Object.keys(roomData.amenities || {}).filter(key => roomData.amenities[key]);

        setRoom({ ...roomData, amenities });
        if (roomData.image) setMainImage(`${roomData.image}`);
      } catch (err) {
        console.error('Error fetching room:', err);
      }
    };

    fetchRoom();
  }, [id]);

  // const handleCheckAvailability = async (e) => {
  //   e.preventDefault();

  //   if (!checkIn || !checkOut || new Date(checkIn) >= new Date(checkOut)) {
  //     return alert("Please select valid Check-In and Check-Out dates");
  //   }

  //   try {
  //     const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/check-availability/${id}`, {
  //       checkIn,
  //       checkOut,
  //     });

  //     if (res.data.available) {
  //       setAvailabilityMsg("Room is available!");
  //     } else {
  //       setAvailabilityMsg("Room is already booked for the selected dates.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setAvailabilityMsg("Something went wrong.");
  //   }
  // };

  if (!room) {
    return <div className="py-28 text-center text-xl">Loading room details...</div>;
  }

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 x1:px-32'>
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>{room.name}
          <span className='font-inter text-sm'> ({room.type})</span>
        </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
      </div>

      <div className='flex items-center gap-1 mt-2'>
        <StarRating />
        <p className='ml-2'>200+ reviews</p>
      </div>

      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.location || 'Unknown Location'}</span>
      </div>

      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img src={mainImage} alt="room" className='w-full rounded-xl shadow-lg object-cover' />
        </div>
        <div className='grid grid-cols-2 gap-4  lg:w-1/2 w-full'>
          {room.images?.length > 1 && room.images.map((img, index) => {
            const imgPath = `${img}`;
            return (
              <img key={index}
                onClick={() => setMainImage(imgPath)}
                src={imgPath}
                alt="room"
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === imgPath && 'outline-3 outline-orange-500'}`} 
                />
            );
          })}
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
          <p className='text-2xl lg:w-3/4 md:text    font-playfair font-light text-gray-700'>{room.description}</p>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {room.amenities?.map((item, index) => (
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                <p className='text-xs'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className='text-2xl font-medium'>${room.price}/Night</p>
      </div>


      {/* <form onSubmit={handleCheckAvailability} className='flex flex-col md:flex-row items-start justify-between bg-white shadow-md p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
        <div className='flex flex-col flex-wrap md:flex-row items-start gap-4 md:gap-10 text-gray-500'>
          <div className='flex flex-col'>
            <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
            <input type='date' id='checkInDate' value={checkIn} onChange={e => setCheckIn(e.target.value)} className='w-full rounded border px-3 py-2 mt-1.5 outline-none' required />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
            <input type='date' id='checkOutDate' value={checkOut} onChange={e => setCheckOut(e.target.value)} className='w-full rounded border px-3 py-2 mt-1.5 outline-none' required />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="guests" className='font-medium'>Guests</label>
            <input type='number' id='guests' value={guests} onChange={e => setGuests(e.target.value)} className='max-w-20 rounded border px-3 py-2 mt-1.5 outline-none' required />
          </div>
        </div>
        <button type='submit' className='bg-primary text-white rounded-md py-3 px-6 mt-4 md:mt-0 hover:bg-primary-dull transition-all'>
          Check Availability
        </button>
      </form> */}

      <Checkcalendar  roomId={id} />

      {availabilityMsg && (
        <p className='mt-4 text-sm font-medium text-center text-gray-700'>
          {availabilityMsg}
        </p>
      )}

      <div className='mt-25 space-y-4'>
        {roomCommonData.map((spec, index) => (
          <div key={index} className='flex items-start gap-2'>
            <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
            <div>
              <p className='text-base'>{spec.title}</p>
              <p className='text-gray-500'>{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {room.host && (
        <div className='flex flex-col items-start gap-4'>
          <div className='flex gap-4'>
            <img src={`${room.host.image}`} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
            <div>
              <p className='text-lg md:text-xl'>Hosted By {room.host.name}</p>
              <div className='flex items-center mt-1'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
              </div>
            </div>
          </div>
          <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
