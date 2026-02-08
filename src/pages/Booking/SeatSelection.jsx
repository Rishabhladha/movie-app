import React, { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/button';
import { cn } from '../../utils/cn';
import { ChevronLeft } from 'lucide-react';

const SEAT_ROWS = 10;
const SEAT_COLS = 12;
const PRICE_TIERS = {
    PREMIUM: 350,
    GOLD: 250,
    SILVER: 180
};

const SeatSelection = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { getMovieById, getCinemaById, addBooking } = useBooking();

    const movie = getMovieById(id);
    const cinemaId = searchParams.get('cinema');
    const cinema = getCinemaById(cinemaId);
    const time = searchParams.get('time');
    const date = searchParams.get('date');

    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = (row, col, price) => {
        const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
        if (selectedSeats.find(s => s.id === seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
        } else {
            if (selectedSeats.length >= 6) {
                alert("You can only select up to 6 seats"); // Simple alert for now
                return;
            }
            setSelectedSeats([...selectedSeats, { id: seatId, price }]);
        }
    };

    const handleBook = () => {
        const bookingDetails = {
            movieId: movie.id,
            movieTitle: movie.title,
            cinemaName: cinema.name,
            date,
            time,
            seats: selectedSeats.map(s => s.id),
            totalAmount: selectedSeats.reduce((acc, s) => acc + s.price, 0)
        };

        addBooking(bookingDetails);
        navigate('/confirmation', { state: bookingDetails });
    };

    if (!movie || !cinema) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1d29] pb-32">
            {/* Header */}
            <div className="bg-white dark:bg-[#333545] p-4 shadow-sm sticky top-0 z-40">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white"><ChevronLeft /></button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-none">{movie.title}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                                {cinema.name} | {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}, {time}
                            </p>
                        </div>
                    </div>
                    <div className="text-gray-500 text-xs text-right hidden sm:block">
                        <p>{selectedSeats.length} Tickets</p>
                    </div>
                </div>
            </div>

            {/* Seat Map */}
            <div className="container mx-auto px-4 py-8 overflow-auto">
                <div className="min-w-[500px] flex flex-col items-center">

                    {/* Screen */}
                    <div className="w-2/3 h-12 bg-gradient-to-b from-white/20 to-transparent transform perspective-1000 rotate-x-12 mb-12 border-t-4 border-white/30 rounded-t-[50%] flex items-end justify-center">
                        <span className="text-xs text-gray-500 pb-2">All eyes this way please!</span>
                    </div>

                    {/* Seats */}
                    <div className="space-y-8">
                        {/* Premium */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 mb-2">Premium - ₹{PRICE_TIERS.PREMIUM}</p>
                            {[0, 1, 2].map(row => (
                                <SeatRow key={row} row={row} price={PRICE_TIERS.PREMIUM} selectedSeats={selectedSeats} onToggle={toggleSeat} />
                            ))}
                        </div>

                        {/* Gold */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 mb-2 mt-4">Gold - ₹{PRICE_TIERS.GOLD}</p>
                            {[3, 4, 5, 6].map(row => (
                                <SeatRow key={row} row={row} price={PRICE_TIERS.GOLD} selectedSeats={selectedSeats} onToggle={toggleSeat} />
                            ))}
                        </div>

                        {/* Silver */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 mb-2 mt-4">Silver - ₹{PRICE_TIERS.SILVER}</p>
                            {[7, 8, 9].map(row => (
                                <SeatRow key={row} row={row} price={PRICE_TIERS.SILVER} selectedSeats={selectedSeats} onToggle={toggleSeat} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Summary */}
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#222539] border-t border-gray-200 dark:border-white/10 p-4 z-50 animate-slide-up">
                    <div className="container mx-auto max-w-lg flex items-center justify-center">
                        <Button
                            className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                            onClick={handleBook}
                        >
                            Pay ₹{selectedSeats.reduce((acc, s) => acc + s.price, 0)}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SeatRow = ({ row, price, selectedSeats, onToggle }) => (
    <div className="flex gap-2 justify-center">
        {Array.from({ length: SEAT_COLS }).map((_, col) => {
            const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
            const isSelected = selectedSeats.find(s => s.id === seatId);

            // Gaps for aisle
            if (col === 3 || col === 8) return <div key={col} className="w-6"></div>;

            return (
                <button
                    key={col}
                    onClick={() => onToggle(row, col, price)}
                    className={cn(
                        "w-6 h-6 md:w-8 md:h-8 rounded-t-lg text-[8px] md:text-[10px] font-bold transition-all border",
                        isSelected
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white dark:bg-transparent border-green-500/50 text-green-500 dark:text-green-400 hover:bg-green-500 hover:text-white"
                    )}
                >
                    {col + 1}
                </button>
            )
        })}
    </div>
);

export default SeatSelection;
