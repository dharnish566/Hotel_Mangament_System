import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { UseAppContext } from '../../context/AppContext'
import { useEffect } from 'react'

const Layout = () => {

  const { isOwner } = UseAppContext()
  const navigate = useNavigate()

  useEffect(()=>{
    if(!isOwner){
      navigate('/')
    }
  } , [isOwner])

  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex h-full'>
        <Sidebar />
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
