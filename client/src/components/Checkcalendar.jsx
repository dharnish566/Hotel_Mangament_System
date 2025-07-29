import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkcalendar = ({ roomId }) => {
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const [guests, setGuests] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);
    const [disabledDates, setDisabledDates] = useState([]);


    const [dateError, setDateError] = useState(null);
    const [maxGuests, setMaxGuests] = useState(null);
    const [guestError, setGuestError] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/room/${roomId}/booked-dates`);
                setDisabledDates(res.data.map(date => new Date(date)));
                setMaxGuests(res.data.maxGuests);


                const roomRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/${roomId}`);
                setMaxGuests(roomRes.data.maxGuests);

            } catch (error) {
                console.error("Failed to fetch booked dates", error);
            }
        };

        if (roomId) fetchBookedDates();
    }, [roomId]);

    // Hide calendar on outside click
    console.log(disabledDates);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateChange = (ranges) => {
        setSelectionRange(ranges.selection);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!maxGuests) {
            setGuestError('Room guest limit not available. Try again.');
            return;
        }

        if (guests === 0 || guests < 0) {
            setGuestError(`Please set guest limit.`);
            return;
        }

        if (guests > maxGuests) {
            setGuestError(`Only ${maxGuests} guests allowed in this room.`);
            return;
        }

        if (selectionRange.startDate.toDateString() === selectionRange.endDate.toDateString()) {
            setDateError('Check-in and Check-out dates cannot be the same.');
            return;
        }
        setGuestError(null);
        setDateError(null);

        navigate(`/rooms/${roomId}/booking-summary`, {
            state: {
                roomId,
                guests,
                checkIn: selectionRange.startDate.toISOString(),
                checkOut: selectionRange.endDate.toISOString()
            }
        });

    };


    return (
        <div className="relative">
            <form onSubmit={handleSubmit}
                className="flex flex-col md:flex-row md:items-center justify-between bg-gray-100 shadow-md p-6 rounded-xl mx-auto mt-14 max-w-6xl">

                <div className="flex flex-col flex-wrap md:flex-row items-start gap-4 md:gap-10 text-gray-500">


                    {/* Check-In Input */}
                    <div className="flex flex-col relative">
                        <label htmlFor="checkInDate" className="font-medium">Check-In</label>
                        <input
                            type="text"
                            id="checkInDate"
                            value={selectionRange.startDate.toISOString().split('T')[0]}
                            onClick={() => setShowCalendar(!showCalendar)}
                            readOnly
                            className="w-full rounded border px-3 py-2 mt-1.5 outline-none cursor-pointer bg-white"
                            required
                        />

                        {/* Calendar with animation */}
                        <div
                            ref={calendarRef}
                            className={`absolute top-full z-50 mt-8 ml-23 transition-all duration-300 origin-top-left bg-white shadow-md rounded ${showCalendar ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                                }`}
                        >
                            <DateRange
                                ranges={[selectionRange]}
                                onChange={handleDateChange}
                                minDate={new Date()}
                                disabledDates={disabledDates}
                                moveRangeOnFirstSelection={false}
                                rangeColors={["#FF5A5F"]}
                            />
                        </div>
                    </div>

                    {/* Check-Out Input */}
                    <div className="flex flex-col">
                        <label htmlFor="checkOutDate" className="font-medium">Check-Out</label>
                        <input
                            type="text"
                            id="checkOutDate"
                            value={selectionRange.endDate.toISOString().split('T')[0]}
                            onClick={() => setShowCalendar(true)}
                            readOnly
                            className="w-full rounded border px-3 py-2 mt-1.5 outline-none bg-white cursor-pointer"
                            required
                        />

                    {dateError && (
                        <p className="text-sm text-red-600 mt-2">{dateError}</p>
                    )}  
                    </div>

                    {/* Guests */}
                    <div className="flex flex-col">
                        <label htmlFor="guests" className="font-medium">Guests</label>
                        <input
                            type="number"
                            id="guests"
                            value={guests}
                            onChange={(e) => {
                                setGuests(e.target.value);
                                setGuestError(null);
                            }}
                            className={`max-w-20 rounded border px-3 py-2 mt-1.5 outline-none ${guestError ? 'border-red-500' : ''}`}
                            required
                        />
                        {guestError && (
                            <p className="text-sm text-red-600 mt-1">{guestError}</p>
                        )}
                    </div>
                </div>

                <button type="submit" className="bg-primary text-white rounded-md py-3 px-6 mt-4 md:mt-0 hover:bg-primary-dull transition-all cursor-pointer">
                    Book Now
                </button>
            </form>
        </div>
    );
};

export default Checkcalendar;
