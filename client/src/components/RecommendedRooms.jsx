import React, { useState } from 'react';
import Hotelcard from './Hotelcard';
import Title from './Title';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendedRooms = ({ recommendedRooms, navigate }) => {
  const [showAll, setShowAll] = useState(false);

  if (!recommendedRooms || recommendedRooms.length === 0) return null;

  const handleToggle = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  // Split data
  const firstFour = recommendedRooms.slice(0, 4);
  const remainingRooms = recommendedRooms.slice(4);

  return (
    <div id="recommended"
      className="flex flex-col items-center px-6 md:px-16 lg:px-24 w-full py-15">
      <Title
        title='Recommended Rooms'
        subTitle='Based on your search, here are our top picks tailored for your comfort and style — offering great value and availability.'
      />

      {/* First 4 (always visible) */}
      <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
        {firstFour.map((room) => (
          <Hotelcard
            key={room._id}
            room={room}
            onClick={() => navigate(`/room/${room._id}`)}
          />
        ))}
      </div>

      {/* Animate remaining rooms */}
      <AnimatePresence>
        {showAll && remainingRooms.length > 0 && (
          <motion.div
            className="flex items-center justify-center gap-6 mt-6 flex-wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {remainingRooms.map((room) => (
              <Hotelcard
                key={room._id}
                room={room}
                onClick={() => navigate(`/room/${room._id}`)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {recommendedRooms.length > 4 && (
        <button
          onClick={handleToggle}
          className="mt-6 px-4 py-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
        >
          {showAll ? 'View Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default RecommendedRooms;
