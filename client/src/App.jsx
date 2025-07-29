import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from './pages/HotelOwner/Layout'
import Dashboard from './pages/HotelOwner/Dashboard'
import AddRoom from './pages/HotelOwner/AddRoom'
import ListRoom from './pages/HotelOwner/ListRoom'
import Login from './components/SignOption/Login'
import Register from './components/Register'
import BookingSummary from './pages/BookingSummary'
import NotFound from './pages/NotFound'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {

  const isOwner = useLocation().pathname.includes("owner");
  const hideLayout = isOwner || location.pathname === '*' || location.pathname === '/404' || location.pathname === '/login' || location.pathname === '/register' 
  || location.pathname === '/forgot-password' || location.pathname === '/reset-password';

  return (
    <div>
      {!hideLayout && <Navbar />}
      {/* {false && <HotelReg />} */}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path="/rooms/:roomId/booking-summary" element={<BookingSummary />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          
          
          <Route path='/owner' element={
            <ProtectedAdminRoute>
              <Layout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
          </Route>

          {/* 404 Fallback */}
          <Route path='*' element={<NotFound />} />

        </Routes>
      </div>
      {!hideLayout && <Footer />}

      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}
