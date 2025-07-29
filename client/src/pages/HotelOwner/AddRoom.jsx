import React, { useState } from 'react';
import { Upload, Home, MapPin, FileText, DollarSign, Users, Wind, Wifi, Coffee, Bell, Mountain, Waves } from 'lucide-react';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock Title component
const Title = ({ align, font, title, subTitle }) => (
  <div className={`text-${align} font-${font} mb-8`}>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600">{subTitle}</p>
  </div>
);

// Mock assets
// const assets = {
//   uploadArea: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2IiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSA1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZHk9IjAuNGVtIj5DbGljayB0byB1cGxvYWQ8L3RleHQ+Cjwvc3ZnPg=='
// };
// const useAuth = () => ({ token: 'token' });

const AddRoom = () => {
  const { token } = useAuth();

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [inputs, setInputs] = useState({
    name: '',
    location: '',
    description: '',
    roomType: '',
    pricePerNight: 0,
    maxGuests: 0,
    ac: false,
    amenities: {
      'Free WiFi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!inputs.name.trim()) newErrors.name = "Room name is required.";
    if (!inputs.location.trim()) newErrors.location = "Location is required.";
    if (!inputs.description.trim()) newErrors.description = "Description is required.";
    if (!inputs.roomType) newErrors.roomType = "Select a room type.";
    if (!inputs.pricePerNight || inputs.pricePerNight <= 0) newErrors.pricePerNight = "Enter valid price.";
    if (!inputs.maxGuests || inputs.maxGuests <= 0) newErrors.maxGuests = "Enter valid guest count.";


    const selectedAmenities = Object.values(inputs.amenities).filter(Boolean);
    if (selectedAmenities.length === 0) newErrors.amenities = "Select at least one amenity.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear old errors
    const formData = new FormData();
    formData.append('name', inputs.name);
    formData.append('location', inputs.location);
    formData.append('description', inputs.description);
    formData.append('type', inputs.roomType);
    formData.append('price', inputs.pricePerNight);
    formData.append('ac', inputs.ac);
    formData.append('maxGuests', inputs.maxGuests);
    formData.append('amenities', JSON.stringify(inputs.amenities));
    if (image) formData.append('image', image);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    const data = await response.json();
    toast.success('Room added successfully!');
    console.log('Room added successfully:', data);

      // Reset state
      setInputs({
        name: '',
        location: '',
        description: '',
        roomType: '',
        pricePerNight: 0,
        maxGuests: 0,
        ac: false,
        amenities: {
          'Free WiFi': false,
          'Free Breakfast': false,
          'Room Service': false,
          'Mountain View': false,
          'Pool Access': false,
        },
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add room!');
      alert('Failed to add room');
    }
  };


  const amenityIcons = {
    'Free WiFi': <Wifi className="w-4 h-4" />,
    'Free Breakfast': <Coffee className="w-4 h-4" />,
    'Room Service': <Bell className="w-4 h-4" />,
    'Mountain View': <Mountain className="w-4 h-4" />,
    'Pool Access': <Waves className="w-4 h-4" />
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <Title
        align='left'
        font='outfit'
        title='Add New Room'
        subTitle='Create a compelling room listing with photos, details, and amenities to attract guests.'
      />

      <div className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Room Image</h3>
          </div>
          <label htmlFor='roomImage' className="block">
            <div className="relative group cursor-pointer">
              <img
                className='h-48 w-full rounded-lg border-2 border-dashed border-gray-300 object-cover transition-all duration-200 group-hover:border-blue-400 group-hover:bg-blue-50'
                src={image ? URL.createObjectURL(image) : assets.uploadArea}
                alt='upload'
              />
              <div className="absolute inset-0 flex items-center justify-center  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-600" />
                  <p className="text-sm text-gray-500 group-hover:text-blue-600">
                    {image ? 'Change image' : 'Click to upload room image'}
                  </p>
                </div>
              </div>
            </div>
            <input
              type='file'
              id='roomImage'
              accept='image/*'
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4 mr-2" />
                Room Name
              </label>
              <input
                type='text'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                value={inputs.name}
                placeholder='e.g. Premium Suite with Ocean View'
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </label>
              <textarea
                rows={3}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none'
                value={inputs.location}
                placeholder='Describe the location and nearby attractions...'
                onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Room Description
            </label>
            <textarea
              rows={8}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none'
              value={inputs.description}
              placeholder='Describe the room features, ambiance, and what makes it special...'
              onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Details</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={inputs.roomType}
                onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              >
                <option value=''>Select Room Type</option>
                <option value='Single Bed'>Single Bed</option>
                <option value='Double Bed'>Double Bed</option>
                <option value='Luxury Room'>Luxury Room</option>
                <option value='Family Suite'>Family Suite</option>
              </select>
              {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-1" />
                Price per Night
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type='number'
                  className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  value={inputs.pricePerNight}
                  placeholder='0'
                  onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })}
                  />
                  {errors.pricePerNight && <p className="text-red-500 text-sm mt-1">{errors.pricePerNight}</p>}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-1" />
                Maximum Guests
              </label>
              <input
                type='number'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                value={inputs.maxGuests}
                placeholder='0'
                onChange={(e) => setInputs({ ...inputs, maxGuests: e.target.value })}
              />
              {errors.maxGuests && <p className="text-red-500 text-sm mt-1">{errors.maxGuests}</p>}
            </div>
          </div>

          {/* AC Option */}
          <div className="mt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type='checkbox'
                checked={inputs.ac}
                onChange={() => setInputs({ ...inputs, ac: !inputs.ac })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Wind className="w-4 h-4 ml-3 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Air Conditioning Available</span>
            </label>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(inputs.amenities).map((amenity, index) => (
              <label key={index} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                <input
                  type='checkbox'
                  checked={inputs.amenities[amenity]}
                  onChange={() =>
                    setInputs({
                      ...inputs,
                      amenities: {
                        ...inputs.amenities,
                        [amenity]: !inputs.amenities[amenity],
                      },
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3 flex items-center">
                  {amenityIcons[amenity]}
                  <span className="ml-2 text-sm font-medium text-gray-700">{amenity}</span>
                </div>
              </label>
            ))}
            {errors.amenities && <p className="text-red-500 text-sm mt-1">{errors.amenities}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            onClick={handleSubmit}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Add Room to Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;