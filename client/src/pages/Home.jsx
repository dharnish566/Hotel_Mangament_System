import React, { useState } from 'react'
import Hero from '../components/Hero'
import FeatureDestination from '../components/FeatureDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import RecommendedRooms from '../components/RecommendedRooms'

const Home = () => {
  const [recommendedRooms, setRecommendedRooms] = useState([]);

  return (
    <>
      <Hero setRecommendedRooms={setRecommendedRooms} />
      
      {/* Render only if recommended rooms exist */}
      {recommendedRooms.length > 0 && (
        <RecommendedRooms recommendedRooms={recommendedRooms} />
      )}

      <FeatureDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default Home;
