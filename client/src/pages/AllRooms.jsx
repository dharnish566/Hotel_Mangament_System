import React, { useState, useEffect } from 'react';
import { assets, facilityIcons } from '../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import NoRoomsMessage from '../components/NoRoomMessage';
import Spinner from '../components/Spinner';

// CheckBox component
const CheckBox = ({ label, selected = false, onChange = () => { } }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
    <span className="font-light select-none">{label}</span>
  </label>
);

// RadioButton component
const RadioButton = ({ label, selected = false, onChange = () => { } }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="radio" name="sortOption" checked={selected} onChange={() => onChange(label)} />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];
  const priceRanges = ['0 to 1000', '1000 to 3000', '3000 to 5000', '5000 to 7500', '7500 to 10000'];
  const sortOptions = ['Price Low to High', 'Price High to Low', 'Newest First'];

  // Fetch all rooms
  useEffect(() => {
    setLoading(true); // Start spinner
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/rooms`)
      .then((res) => {
        setRooms(res.data);
        setFilteredRooms(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch rooms:', err);
      })
      .finally(() => {
        setLoading(false); // Stop spinner
      });
  }, []);

  // Apply filters whenever selection changes
  useEffect(() => {
    let result = [...rooms];

    // Filter by room type
    if (selectedRoomTypes.length > 0) {
      result = result.filter((room) => selectedRoomTypes.includes(room.type));
    }


    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      result = result.filter((room) =>
        selectedPriceRanges.some((range) => {
          const [min, max] = range.split(' to ').map(Number);
          return room.price >= min && room.price <= max;
        })
      );
    }

    // Sort
    if (selectedSortOption === 'Price Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSortOption === 'Price High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSortOption === 'Newest First') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredRooms(result);
  }, [selectedRoomTypes, selectedPriceRanges, selectedSortOption, rooms]);

  // Handlers
  const handleRoomTypeChange = (checked, type) => {
    if (checked) setSelectedRoomTypes([...selectedRoomTypes, type]);
    else setSelectedRoomTypes(selectedRoomTypes.filter((t) => t !== type));
  };

  const handlePriceRangeChange = (checked, range) => {
    if (checked) setSelectedPriceRanges([...selectedPriceRanges, range]);
    else setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range));
  };

  const handleSortChange = (option) => {
    setSelectedSortOption(option);
  };

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
  };


  const handleRefresh = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/rooms`)
      .then((res) => {
        setRooms(res.data);
        setFilteredRooms(res.data);
      })
      .catch((err) => console.error('Failed to fetch rooms:', err))
      .finally(() => setLoading(false));
  };

  const handleClearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24">

      {/* Main Content */}
      <div className="flex-1">
        {/* If rooms exist */}
        {loading ? (
          <Spinner />
        ) : rooms.length > 0 ? (
          filteredRooms.length > 0 ? (
            <>
              {/* Title and description */}
              <div className="flex flex-col items-start text-left">
                <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
                <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
                  Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
                </p>
              </div>

              {/* Room Cards */}
              {filteredRooms.map((room) => (
                <div key={room._id} className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30">
                  <img
                    onClick={() => {
                      navigate(`/rooms/${room._id}`);
                      scrollTo(0, 0);
                    }}
                    src={room.image}
                    alt="hotel-img"
                    className="max-h-65 md:w-1/2 rounded-xl-l shadow-lg object-cover cursor-pointer"
                  />
                  <div className="md:w-1/2 flex flex-col gap-2">
                    <p className="text-gray-800 text-3xl font-playfair cursor-pointer">{room.name}</p>
                    <div className="flex items-center">
                      <StarRating />
                      <p className="ml-2">200+ reviews</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                      <img src={assets.locationIcon} alt="location-icon" />
                      <span>{room.location}</span>
                    </div>
                    <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                      {room.amenities &&
                        Object.entries(room.amenities).map(
                          ([item, value], index) =>
                            value && (
                              <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70">
                                <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                                <p className="text-xs">{item}</p>
                              </div>
                            )
                        )}
                    </div>
                    <p className="text-xl font-medium text-gray-700">₹{room.price} /night</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <NoRoomsMessage
              title="No rooms match your search"
              subtitle="We couldn't find any rooms that match your current filters. Try adjusting your criteria to see more options."
              hasFilters={true}
              onClearFilters={handleClearFilters}
              onRefresh={handleRefresh}
              showSuggestions={true}
            />
          )
        ) : (
          <NoRoomsMessage
            title="No rooms available right now"
            subtitle="We're currently updating our room inventory. Please check back in a few minutes for the latest availability."
            hasFilters={false}
            onRefresh={handleRefresh}
            showSuggestions={false}
          />
        )}

      </div>

      {/* Filters Sidebar - Show only if there are any rooms from backend */}
      {rooms.length > 0 && (
        <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
          <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>
            <p className="text-base font-medium text-gray-800">FILTERS</p>
            <div className="text-xs cursor-pointer">
              <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden">
                {openFilters ? 'HIDE' : 'SHOW'}
              </span>
              <span onClick={clearFilters} className="hidden lg:block hover:underline">
                CLEAR
              </span>
            </div>
          </div>

          <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Popular filters</p>
              {roomTypes.map((room, index) => (
                <CheckBox key={index} label={room} selected={selectedRoomTypes.includes(room)} onChange={handleRoomTypeChange} />
              ))}
            </div>
            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Price Range</p>
              {priceRanges.map((range, index) => (
                <CheckBox key={index} label={range} selected={selectedPriceRanges.includes(range)} onChange={handlePriceRangeChange} />
              ))}
            </div>
            <div className="px-5 pt-5 pb-10">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>
              {sortOptions.map((option, index) => (
                <RadioButton key={index} label={option} selected={selectedSortOption === option} onChange={handleSortChange} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );


};

export default AllRooms;
