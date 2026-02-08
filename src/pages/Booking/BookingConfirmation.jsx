import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { CheckCircle, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingConfirmation = () => {
    const { state } = useLocation();

    useEffect(() => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    if (!state) return <div className="text-white">No booking found</div>;

    return (
        <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="bg-red-600 p-6 text-center text-white">
                    <CheckCircle className="mx-auto w-16 h-16 mb-2" />
                    <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
                    <p className="text-red-100 text-sm">Your ticket has been sent to your email.</p>
                </div>

                <div className="p-6 space-y-4 relative">
                    {/* Ticket punch holes css visual */}
                    <div className="absolute -left-3 top-0 bottom-0 w-6 flex flex-col justify-between py-6">
                        {[...Array(6)].map((_, i) => <div key={i} className="w-6 h-6 rounded-full bg-[#1a1d29]" />)}
                    </div>
                    <div className="absolute -right-3 top-0 bottom-0 w-6 flex flex-col justify-between py-6">
                        {[...Array(6)].map((_, i) => <div key={i} className="w-6 h-6 rounded-full bg-[#1a1d29]" />)}
                    </div>

                    <div className="text-center border-b border-dashed border-gray-300 pb-4">
                        <h2 className="text-lg font-bold text-gray-800">{state.movieTitle}</h2>
                        <p className="text-sm text-gray-500">{state.cinemaName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xs text-gray-400">Date</p>
                            <p className="font-bold text-gray-800">{state.date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Time</p>
                            <p className="font-bold text-gray-800">{state.time}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-gray-400">Seats</p>
                            <p className="font-bold text-gray-800 text-lg">{state.seats.join(', ')}</p>
                        </div>
                    </div>

                    <div className="flex justify-center py-4">
                        <QrCode size={96} className="text-gray-800 opacity-80" />
                    </div>

                    <div className="text-center pt-2">
                        <Link to="/">
                            <Button className="w-full bg-red-500 hover:bg-red-600">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
