import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchNowPlaying, getImageUrl, fetchGenres, searchMovies as tmdbSearchMovies } from '../services/tmdb';
import { MOCK_CINEMAS } from '../services/mockData';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState({});
    const [city, setCity] = useState('Hyderabad');

    useEffect(() => {
        const storedBookings = localStorage.getItem('movie_app_bookings');
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        }

        const storedCity = localStorage.getItem('movie_app_city');
        if (storedCity) {
            setCity(storedCity);
        }

        loadMovies();
    }, []);

    const changeCity = (newCity) => {
        setCity(newCity);
        localStorage.setItem('movie_app_city', newCity);
        // In a real app, we would reload movies based on city here
        // loadMovies(newCity); 
    };

    const loadMovies = async () => {
        setLoading(true);
        try {
            const [moviesData, genresData] = await Promise.all([
                fetchNowPlaying(),
                fetchGenres()
            ]);

            const genreMap = {};
            if (genresData && genresData.genres) {
                genresData.genres.forEach(g => genreMap[g.id] = g.name);
                setGenres(genreMap);
            }

            if (moviesData && moviesData.results) {
                const transformedMovies = transformMoviesData(moviesData.results, genreMap);
                setMovies(transformedMovies);
            }
        } catch (err) {
            setError("Failed to load movies. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const transformMoviesData = (results, genreMap) => {
        return results.map(movie => ({
            ...movie,
            image: getImageUrl(movie.poster_path),
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            language: movie.original_language,
            genre: movie.genre_ids ? movie.genre_ids.map(id => genreMap[id] || 'Unknown') : [],
            voteCount: `${(movie.vote_count / 1000).toFixed(1)}K`
        }));
    };

    const searchMovies = async (query) => {
        if (!query) {
            loadMovies();
            return;
        }
        setLoading(true);
        try {
            const searchResults = await tmdbSearchMovies(query);
            if (searchResults && searchResults.results) {
                const transformed = transformMoviesData(searchResults.results, genres);
                setMovies(transformed);
            }
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const addBooking = (bookingData) => {
        const newBooking = { ...bookingData, id: Date.now().toString(), dateBooked: new Date().toISOString() };
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem('movie_app_bookings', JSON.stringify(updatedBookings));
    };

    const getMovieById = (id) => movies.find(m => m.id.toString() === id.toString());
    const getCinemaById = (id) => MOCK_CINEMAS.find(c => c.id === id);

    return (
        <BookingContext.Provider value={{
            movies,
            loading,
            error,
            cinemas: MOCK_CINEMAS,
            bookings,
            genres,
            addBooking,
            getMovieById,
            getCinemaById,
            refreshMovies: loadMovies,
            searchMovies,
            city,
            changeCity
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
