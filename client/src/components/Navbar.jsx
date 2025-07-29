import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";


const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
)

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/#home' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/#experience' },
        { name: 'About', path: '/' },
    ];

    const ref = React.useRef(null)

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [showdropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();

    useEffect(() => {

        if (location.pathname !== '/') {
            setIsScrolled(true);
            return;
        }
        else {
            setIsScrolled(false);
        }
        setIsScrolled(prev => location.pathname !== '/' ? true : prev);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to={'/'}>
                <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <HashLink
                        key={i}
                        smooth
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}
                    >
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </HashLink>
                ))}
                {user?.role === 'admin' && (
                    <button
                        className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}
                        onClick={() => navigate('/owner')}
                    >
                        Dashboard
                    </button>
                )}

                {user?.role === 'user' && (
                    <button
                        className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}
                        onClick={() => navigate('/my-bookings')}
                    >
                        My Bookings
                    </button>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <div className="relative" ref={ref}>
                        <button
                            onClick={() => setShowDropdown(!showdropdown)}
                            className="flex items-center gap-3 px-3 py-1  hover:to-indigo-100  transition-all duration-300  hover:scale-105 group"
                        >
                            {/* Profile Picture */}
                            <img
                                src={user.photo || assets.defaultAvatar}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-blue-200 group-hover:ring-blue-300 transition-all duration-300"
                            />

                        </button>

                        {showdropdown && (
                            <div className="absolute right-0 mt-3 w-55 h-23 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden animate-fadeIn">
                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>

                                {/* Profile Section */}
                                <div className="relative flex items-center gap-4 px-6 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                    {/* <img
                                            src={user.photo || assets.defaultAvatar}
                                            alt="User Profile"
                                            className="w-8 h-8 rounded-full object-cover border-3 border-white shadow-lg ring-2 ring-white/20"
                                        /> */}
                                    <div className="flex-1" >
                                        <div className="font-bold text-sm">{user.name}</div>
                                        <div className="text-xs text-blue-100 opacity-90">{user.email}</div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate("/login");
                                        }}
                                        className="w-full text-left px-5 py-2 text-sm hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-red-600 hover:text-red-700 transition-all duration-300 flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </div>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500 hover:shadow-lg hover:scale-105 font-medium"
                    >
                        Login
                    </button>
                )}
            </div>



            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">

                {user && (
                    <button onClick={() => navigate('/my-bookings')} className="text-sm text-gray-700 hover:underline">
                        <BookIcon /> My Bookings
                    </button>
                )}
                <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="" className={`${isScrolled && "invert"} h-4`} />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="" className="h-6.5" />
                </button>

                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </a>
                ))}

                {user && <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
                    onClick={() => navigate('/owner')}>
                    Dashboard
                </button>}

                {!user && (
                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            navigate("/login");
                        }}
                        className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
                    >
                        Login
                    </button>
                )}

            </div>
        </nav>
    );
}

export default Navbar;