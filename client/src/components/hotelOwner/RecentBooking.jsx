import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Search } from 'lucide-react';

const RecentBooking = ({ bookings, page, count, onPageChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Convert to lowercase once for efficiency
    const lowerSearch = searchTerm.toLowerCase();

    // Filter bookings based on multiple fields
    const filteredBookings = bookings.filter((item) => {
        const username = item?.user?.username?.toLowerCase() || '';
        const roomname = item?.room?.roomname?.toLowerCase() || '';
        const roomType = item?.room?.roomType?.toLowerCase() || '';
        const location = item?.room?.roomlocation?.toLowerCase() || '';
        const price = item?.totalPrice?.toString() || '';
        const payment = item?.isPaid ? 'completed' : 'pending';

        return (
            username.includes(lowerSearch) ||
            roomname.includes(lowerSearch) ||
            roomType.includes(lowerSearch) ||
            location.includes(lowerSearch) ||
            price.includes(lowerSearch) ||
            payment.includes(lowerSearch)
        );
    });

    return (
        <div>
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

<div className="mb-4 flex justify-end">
  <div className="relative w-full max-w-xs">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

    <input
      type="text"
      placeholder="Search bookings..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  </div>
</div>


            {/* Table */}
            <div className='w-full max-w-9xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Type</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Location</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {item?.user?.username || 'N/A'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {item?.room?.roomname || 'N/A'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {item?.room?.roomType || 'N/A'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {item?.room?.roomlocation || 'N/A'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                        ₹{item?.totalPrice || 0}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 flex'>
                                        <button
                                            className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid
                                                ? 'bg-green-200 text-green-600'
                                                : 'bg-amber-200 text-yellow-600'
                                                }`}
                                        >
                                            {item?.isPaid ? 'Completed' : 'Pending'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-4 text-center text-gray-500">
                                    No bookings match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <Stack spacing={2}>
                    <Pagination
                        page={page}
                        count={count}
                        onChange={onPageChange}
                        renderItem={(item) => (
                            <PaginationItem
                                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                {...item}
                            />
                        )}
                    />
                </Stack>
            </div>
        </div>
    );
};

export default RecentBooking;
