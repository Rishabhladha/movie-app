import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Dashboard/Home';
import MovieDetails from './pages/Booking/MovieDetails';
import CinemaSelection from './pages/Booking/CinemaSelection';
import SeatSelection from './pages/Booking/SeatSelection';
import BookingConfirmation from './pages/Booking/BookingConfirmation';

// Layout wrapper to conditionally show Navbar
const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = ['/login', '/register', '/confirmation'].includes(location.pathname);

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1d29] text-gray-900 dark:text-gray-100 font-sans">
            {!isAuthPage && <Navbar />}
            <main className={!isAuthPage ? "pt-32 lg:pt-36 min-h-[100vh]" : ""}>
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <BookingProvider>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/movie/:id" element={<MovieDetails />} />
                            <Route path="/book/:id" element={<CinemaSelection />} />
                            <Route path="/book/:id/seat-selection" element={<SeatSelection />} />
                            <Route path="/confirmation" element={<BookingConfirmation />} />
                        </Routes>
                    </Layout>
                </BookingProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
