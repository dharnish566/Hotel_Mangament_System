import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Modal, Box, TextField, Button, MenuItem,
    FormControlLabel, Switch, FormGroup, Checkbox
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AMENITY_LIST = ['Free WiFi', 'Free Breakfast', 'Room Service', 'Mountain View', 'Pool Access'];
const ROOM_TYPES = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];

const EditRoomModal = ({ open, onClose, roomData, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        price: 0,
        maxGuests: 1,
        ac: false,
        isVisible: true,
        amenities: {},
    });

    useEffect(() => {
    if (roomData) {
        const typeMap = {
            single: 'Single Bed',
            double: 'Double Bed',
            luxury: 'Luxury Room',
            family: 'Family Suite',
        };

        const normalizedType = typeMap[roomData.type?.toLowerCase()] || roomData.type;

        setFormData({
            name: roomData.name || '',
            type: normalizedType, 
            price: roomData.price || 0,
            maxGuests: roomData.maxGuests || 1,
            ac: roomData.ac || false,
            isVisible: roomData.isVisible ?? true,
            amenities: roomData.amenities || {},
        });
    }
}, [roomData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleAmenityChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [name]: checked
            }
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/rooms/${roomData._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Room Updated Successfully")
            onUpdate(res.data);
            onClose();
        } catch (err) {
            console.error('Failed to update room', err);
            toast.error("Failed to Updated");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
            }}>
                <h2 className="text-lg font-semibold mb-4">Edit Room</h2>

                <TextField
                    fullWidth label="Room Name" name="name"
                    value={formData.name} onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    select fullWidth label="Type" name="type"
                    value={formData.type} onChange={handleChange}
                    margin="normal"
                >
                    {ROOM_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth label="Price" name="price" type="number"
                    value={formData.price} onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth label="Max Guests" name="maxGuests" type="number"
                    value={formData.maxGuests} onChange={handleChange}
                    margin="normal"
                />

                <FormControlLabel
                    control={<Switch name="ac" checked={formData.ac} onChange={handleSwitchChange} />}
                    label="Air Conditioning (AC)"
                    sx={{ mt: 2 }}
                />
                <FormControlLabel
                    control={<Switch name="isVisible" checked={formData.isVisible} onChange={handleSwitchChange} />}
                    label="Visible to Users"
                    sx={{ mt: 2 }}
                />

                <div className="mt-4">
                    <label className="block mb-1 font-medium">Amenities</label>
                    <FormGroup row>
                        {AMENITY_LIST.map((amenity) => (
                            <FormControlLabel
                                key={amenity}
                                control={
                                    <Checkbox
                                        name={amenity}
                                        checked={formData.amenities?.[amenity] || false}
                                        onChange={handleAmenityChange}
                                    />
                                }
                                label={amenity}
                            />
                        ))}
                    </FormGroup>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onClose} variant="outlined">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Update</Button>
                </div>
            </Box>
        </Modal>
    );
};

export default EditRoomModal;
