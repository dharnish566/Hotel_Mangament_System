import React, { useEffect, useState } from 'react';
import Hotelcard from './Hotelcard';
import Title from './Title';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeatureDestination = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/rooms`)
      .then(res => setRooms(res.data))
      .catch(err => console.error("Failed to fetch rooms:", err));
  }, []);

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-10'>
      <Title
        title='Featured Destination'
        subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'
      />
      {<div className='flex items-center justify-center gap-6 mt-20 flex-wrap'>
        {rooms.slice(0, 3).map((room, index) => (
          <Hotelcard key={room._id} room={room} index={index} />
        ))}
      </div>}

      <button
        onClick={() => {
          navigate('/rooms');
          scrollTo(0, 0);
        }}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        View All Destinations
      </button>
    </div>
  );
};

export default FeatureDestination;
