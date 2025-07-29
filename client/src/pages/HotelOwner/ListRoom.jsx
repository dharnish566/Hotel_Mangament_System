import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Title from '../../components/Title';
import EditRoomModal from '../../components/EditRoomModel';
import ListRoomsEditing from '../../components/hotelOwner/ListRoomsEditing';
import { assets } from '../../assets/assets';
import { Search, SearchCheck } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleEdit = (roomId) => {
        const room = rooms.find(r => r._id === roomId);
        setSelectedRoom(room);
        setEditModalOpen(true);
    };

    const handleModalClose = () => {
        setSelectedRoom(null);
        setEditModalOpen(false);
    };

    const handleRoomUpdate = (updatedRoom) => {
        const updatedList = rooms.map(r => r._id === updatedRoom._id ? updatedRoom : r);
        setRooms(updatedList);
        setFilteredRooms(applySearchFilter(updatedList, searchQuery));
    };

    const handleDelete = async (roomId) => {
        const confirmed = window.confirm('Are you sure you want to delete this room?');
        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const updatedRooms = rooms.filter(room => room._id !== roomId);
                setRooms(updatedRooms);
                setFilteredRooms(applySearchFilter(updatedRooms, searchQuery));
                toast.success("Room Deleted Successfully")
            } catch (error) {
                console.error('Failed to delete room:', error);
                // alert('Failed to delete room. Please try again.');
                toast.error("Failed to delete")
            }
        }
    };

    const applySearchFilter = (roomsList, query) => {
        const lower = query.toLowerCase();
        return roomsList.filter(room =>
            room.name?.toLowerCase().includes(lower) ||
            room.type?.toLowerCase().includes(lower) ||
            room.price?.toString().includes(lower) ||
            Object.keys(room.amenities || {})
                .filter(key => room.amenities[key])
                .some(a => a.toLowerCase().includes(lower))
        );
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setFilteredRooms(applySearchFilter(rooms, query));
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/all`);
                setRooms(response.data);
                setFilteredRooms(response.data);
            } catch (err) {
                console.error('Failed to fetch rooms:', err);
                setError('Failed to load rooms. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <div className="max-w-7xl mx-auto">
                    <Title
                        align="left"
                        font="outfit"
                        title="Room Listings"
                        subTitle="View all listed rooms pulled directly from the database."
                    />
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white p-6">
                <div className="max-w-7xl mx-auto">
                    <Title
                        align="left"
                        font="outfit"
                        title="Room Listings"
                        subTitle="View all listed rooms pulled directly from the database."
                    />
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto p-6">
                <Title
                    align="left"
                    font="outfit"
                    title="Room Listings"
                    subTitle="View all listed rooms pulled directly from the database."
                />

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            All Rooms ({filteredRooms.length})
                        </h2>
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                            <input
                                type="text"
                                placeholder="Search by name, type, price, amenity..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full"
                            />
                        </div>

                    </div>

                    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Room Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amenities
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Max Guests
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            AC
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <ListRoomsEditing
                                        rooms={filteredRooms}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <EditRoomModal
                open={editModalOpen}
                onClose={handleModalClose}
                roomData={selectedRoom}
                onUpdate={handleRoomUpdate}
            />
        </div>
    );
};

export default ListRoom;
