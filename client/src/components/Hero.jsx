import React from 'react';
import { assets, cities } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const Hero = ({ setRecommendedRooms }) => {
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();

        const destination = document.getElementById("destinationInput").value.trim();
        const checkIn = document.getElementById("checkIn").value;
        const checkOut = document.getElementById("checkOut").value;

        console.log(destination);

        // Clear previous error messages
        document.getElementById("dateError").textContent = "";

        // Basic field validation
        if (!destination || !checkIn || !checkOut) {
            toast.warning("Please fill in all fields.");
            return;
        }

        // Validate date logic
        if (new Date(checkIn) >= new Date(checkOut)) {
            document.getElementById("dateError").textContent = "Check-in must be before check-out.";
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/rooms/available?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}`
            );
            const data = await response.json();

            if (!data || data.length === 0) {
                toast.error("No rooms found for the selected criteria.");
                setRecommendedRooms([]);
                return;
            }

            setRecommendedRooms(data);
            toast.success('Rooms found successfully!');

            setTimeout(() => {
                const section = document.getElementById("recommended");
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);

            document.getElementById("destinationInput").value = "";
            document.getElementById("checkIn").value = "";
            document.getElementById("checkOut").value = "";

        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error('Room not found.');
        }
    };


    return (
        <div id="home"
            className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroimage.webp")] bg-no-repeat bg-cover bg-center h-screen'>
            {/* Header Text */}
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Hotel Experience</p>
            <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] font-bold md:font-extrabold max-w-xl mt-4'>
                Discover Your Perfect Gateway Destination
            </h1>
            <p className='max-w-130 mt-2 text-sm md:text-base text-black'>
                Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
            </p>

            {/* Search Form */}
            <form
                onSubmit={handleSearch}
                className="mt-10 w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-700"
            >

                {/* Destination */}
                <div className="flex flex-col">
                    <label htmlFor="destinationInput" className="mb-1 font-medium">
                        <div className="flex items-center gap-2">
                            <img src={assets.calenderIcon} alt="" className="h-4" />
                            Destination
                        </div>
                    </label>
                    <input
                        list="destinations"
                        id="destinationInput"
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter location"
                        required
                    />
                    <datalist id="destinations">
                        {cities.map((city, index) => (
                            <option value={city} key={index} />
                        ))}
                    </datalist>
                </div>

                {/* Check In */}
                <div className="flex flex-col">
                    <label htmlFor="checkIn" className="mb-1 font-medium">
                        <div className="flex items-center gap-2">
                            <img src={assets.calenderIcon} alt="" className="h-4" />
                            Check In
                        </div>
                    </label>
                    <input
                        id="checkIn"
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Check Out */}
                <div className="flex flex-col">
                    <label htmlFor="checkOut" className="mb-1 font-medium">
                        <div className="flex items-center gap-2">
                            <img src={assets.calenderIcon} alt="" className="h-4" />
                            Check Out
                        </div>
                    </label>
                    <input
                        id="checkOut"
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    <span id="dateError" className="text-red-500 text-xs mt-1 block"></span>
                </div>

                {/* Submit Button */}
                <div className="flex items-end mt-2">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                        <motion.button
                            type="submit"
                            className='flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-400 py-3 px-5 text-white font-semibold max-md:w-full max-md:py-2 transition-all duration-300 hover:from-gray-400 hover:to-gray-500 shadow-lg'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <motion.span
                                initial={{ rotate: 0 }}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <FaSearch className="h-5 w-5" />
                            </motion.span>

                            <motion.span
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                Search
                            </motion.span>
                        </motion.button>

                    </button>
                </div>
            </form>

        </div>
    );
};

export default Hero;
