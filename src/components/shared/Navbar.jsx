import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Menu, X, ChevronDown, MapPin, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { searchMovies, city, changeCity } = useBooking();
    const { user, logout } = useAuth();
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

    const CITIES = ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Kochi', 'Ahmedabad'];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen || isMobileSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen, isMobileSearchOpen]);

    return (
        <>
            <motion.header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled ? "bg-[#333545] shadow-lg py-2" : "bg-[#333545]/95 backdrop-blur-md py-3"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4">

                        {/* Left: Logo & Search */}
                        <div className="flex items-center gap-8 flex-1">
                            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
                                <motion.div
                                    whileHover={{ rotate: -10, scale: 1.1 }}
                                    className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/30"
                                >
                                    BM
                                </motion.div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-xl font-bold text-white tracking-tight">book<span className="text-red-500">my</span>show</span>
                                </div>
                            </Link>

                            <div className={cn(
                                "hidden lg:flex items-center flex-1 max-w-xl transition-all duration-300 bg-white rounded-[4px] px-3 py-2",
                                isSearchFocused ? "ring-2 ring-red-500 shadow-lg" : "opacity-90"
                            )}>
                                <Search className="text-gray-400 w-4 h-4 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-500"
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    onChange={(e) => searchMovies(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-6">
                            {/* City Selector Dropdown */}
                            <div className="relative">
                                <div
                                    className="hidden md:flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer transition-colors text-sm font-medium"
                                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                >
                                    <span>{city}</span>
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", isCityDropdownOpen ? "rotate-180" : "")} />
                                </div>
                                <AnimatePresence>
                                    {isCityDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsCityDropdownOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#222539] rounded shadow-xl border border-gray-200 dark:border-white/10 z-50 py-1"
                                            >
                                                {CITIES.map((c) => (
                                                    <button
                                                        key={c}
                                                        className={cn(
                                                            "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors",
                                                            city === c ? "text-red-500 font-bold" : "text-gray-700 dark:text-gray-300"
                                                        )}
                                                        onClick={() => {
                                                            changeCity(c);
                                                            setIsCityDropdownOpen(false);
                                                        }}
                                                    >
                                                        {c}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>


                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-white text-sm font-medium hidden md:block">Hi, {user.name || 'User'}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                        className="text-gray-400 hover:text-white hover:bg-white/10"
                                    >
                                        <LogOut size={18} />
                                    </Button>
                                </div>
                            ) : (
                                <Link to="/login">
                                    <Button variant="brand" size="sm" className="hidden md:inline-flex px-6">
                                        Sign In
                                    </Button>
                                </Link>
                            )}

                            <div className="flex items-center gap-4 lg:hidden">
                                <button
                                    className="text-white"
                                    onClick={() => setIsMobileSearchOpen(true)}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-white"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {isMenuOpen ? <X /> : <Menu />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Overlay */}
                    <AnimatePresence>
                        {isMobileSearchOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute inset-0 bg-[#333545] z-50 flex items-center px-4 gap-2 lg:hidden"
                            >
                                <div className="flex-1 flex items-center bg-white rounded-[4px] px-3 py-2">
                                    <Search className="text-gray-400 w-4 h-4 mr-3" />
                                    <input
                                        type="text"
                                        placeholder="Search for Movies, Events, Plays..."
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-500"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    className="text-white p-2"
                                    onClick={() => setIsMobileSearchOpen(false)}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Secondary Navigation (Desktop) */}
                <div className="hidden lg:block border-t border-white/10 mt-2 bg-[#222539]">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-10 text-xs font-medium text-gray-300">
                            <div className="flex gap-6">
                                {['Movies', 'Stream', 'Events', 'Plays', 'Sports', 'Activities', 'Buzz'].map((item) => (
                                    <Link key={item} to="#" className="hover:text-white transition-colors hover:underline decoration-red-500 underline-offset-4">{item}</Link>
                                ))}
                            </div>
                            <div className="flex gap-6">
                                {['ListYourShow', 'Corporates', 'Offers', 'Gift Cards'].map((item) => (
                                    <Link key={item} to="#" className="hover:text-white transition-colors">{item}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 bg-[#222539] pt-20 px-6"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
                                <span className="text-xl font-bold">Hey!</span>
                                <div className="flex items-center gap-2 text-red-500">
                                    <LogIn size={20} />
                                    <span className="font-medium">Log In / Register</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="text-gray-300 border border-white/10 rounded-lg overflow-hidden">
                                    <div className="p-3 bg-white/5 text-sm font-bold text-gray-400 uppercase">Select City</div>
                                    <div className="max-h-40 overflow-y-auto">
                                        {CITIES.map(c => (
                                            <div
                                                key={c}
                                                onClick={() => { changeCity(c); setIsMenuOpen(false); }}
                                                className={cn(
                                                    "p-3 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center",
                                                    city === c ? "text-red-500 font-bold" : "text-gray-300"
                                                )}
                                            >
                                                {c}
                                                {city === c && <ChevronDown className="rotate-[-90deg] w-4 h-4" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-gray-400 text-sm uppercase tracking-wider font-bold">Navigation</div>
                                    {['Movies', 'Stream', 'Events', 'Plays', 'Sports', 'Activities', 'Buzz', 'ListYourShow', 'Corporates', 'Offers', 'Gift Cards'].map((item) => (
                                        <Link key={item} to="#" className="block text-white text-lg font-medium hover:text-red-500 transition-colors">
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
