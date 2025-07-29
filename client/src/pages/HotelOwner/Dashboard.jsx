import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import RecentBooking from '../../components/hotelOwner/RecentBooking';
import { assets } from '../../assets/assets';
import axios from 'axios';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        bookings: [],
        totalPages: 0,
        currentPage: 1,
    });

    const fetchDashboardData = async (page = 1) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/admin?page=${page}&limit=5`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { bookings, totalBookings, totalRevenue, totalPages, currentPage } = res.data;

            const formattedBookings = bookings.map((b) => ({
                user: {
                    username: b.userId?.name || 'N/A',
                },
                room: {
                    roomname: b.roomId?.name || 'N/A',
                    roomlocation: b.roomId?.location || 'N/A',
                    roomType: b.roomId?.type || b.roomId?.name || 'N/A',
                },
                totalPrice: b.totalPrice,
                isPaid: b.paymentStatus === 'paid',
            }));

            setDashboardData({
                totalBookings,
                totalRevenue,
                bookings: formattedBookings,
                totalPages,
                currentPage,
            });

        } catch (err) {
            console.error('Error fetching dashboard data:', err?.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handlePageChange = (event, value) => {
        fetchDashboardData(value);
    };

    return (
        <div>
            <Title
                align='left'
                font='outfit'
                title='DashBoard'
                subTitle='Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations.'
            />

            {/* Summary Cards */}
            <div className='flex gap-4 my-8'>
                {/* Total Bookings */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalBookingIcon} alt='booking-icon' className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Bookings</p>
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalRevenueIcon} alt='revenue-icon' className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Revenue</p>
                        <p className='text-neutral-400 text-base'>₹{dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <RecentBooking
                bookings={dashboardData.bookings}
                page={dashboardData.currentPage}
                count={dashboardData.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Dashboard;
