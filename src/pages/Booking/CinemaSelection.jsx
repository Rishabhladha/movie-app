
import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/button';
import { ChevronLeft, Info, Smartphone, Coffee, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getNext7Days, getShowtimesForCinema } from '../../services/mockData';

const CinemaSelection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMovieById, cinemas } = useBooking();
    const movie = getMovieById(id);
    const [selectedDate, setSelectedDate] = useState(0);

    if (!movie) return <div>Loading...</div>;

    // Dynamic Data
    const dates = useMemo(() => getNext7Days(), []);

    // Only generate showtimes once per cinema/movie to avoid re-render randomization
    const getShowtimes = useCallback((cinemaId) => {
        return getShowtimesForCinema(cinemaId, id);
    }, [id]);

    return (
        <div className="bg-[#f5f5f5] dark:bg-[#1a1d29] min-h-screen pb-20">
            {/* Movie Header */}
            <div className="bg-[#333545] text-white py-8 pt-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl lg:text-4xl font-normal mb-2">
                        {movie.title} - <span className="text-gray-400 text-xl lg:text-2xl">{movie.language}</span>
                    </h1>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="border border-white/50 px-1 rounded text-[10px] font-bold">UA</span>
                        {movie.genre?.map(g => (
                            <span key={g} className="bg-white/10 px-2 rounded-full border border-white/20 text-xs">{g}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Date Selector */}
            <div className="bg-white dark:bg-[#1a1d29] shadow-sm sticky top-[72px] lg:top-[120px] z-30 py-2">
                <div className="container mx-auto px-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
                    {dates.map((d, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDate(index)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[60px] h-16 rounded-lg transition-colors border",
                                selectedDate === index
                                    ? "bg-red-500 text-white border-red-500"
                                    : "bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-white/5"
                            )}
                        >
                            <span className="text-[10px] font-bold">{d.day}</span>
                            <span className="text-lg font-bold leading-none">{d.date}</span>
                            <span className="text-[10px]">{d.month}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cinema List */}
            <div className="container mx-auto px-4 py-6 space-y-4">
                {cinemas.map(cinema => (
                    <div key={cinema.id} className="bg-white dark:bg-[#222539] p-6 rounded-sm shadow-sm border-b dark:border-white/5 flex flex-col md:flex-row gap-6">
                        {/* Cinema Info */}
                        <div className="md:w-1/4">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="text-red-500">♡</span> {cinema.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-4 text-xs text-green-500">
                                <div className="flex items-center gap-1"><Smartphone size={14} /> M-Ticket</div>
                                <div className="flex items-center gap-1 text-orange-400"><Coffee size={14} /> F&B</div>
                            </div>
                        </div>

                        {/* Showtimes */}
                        <div className="flex-1 flex flex-wrap gap-4 items-center">
                            {getShowtimes(cinema.id).map((time, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(`/book/${id}/seat-selection?cinema=${cinema.id}&time=${time}&date=${dates[selectedDate].fullDate}`)}
                                    className="border border-gray-300 dark:border-gray-600 px-6 py-2 rounded text-sm text-green-600 dark:text-green-500 font-medium hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors relative group"
                                >
                                    {time}
                                    <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100" title="Filling Fast"></div>
                                    <div className="text-[10px] text-gray-400 font-normal text-center mt-1">4K DOLBY</div>
                                </button>
                            ))}
                        </div >
                    </div >
                ))}
            </div >
        </div >
    );
};

export default CinemaSelection;
