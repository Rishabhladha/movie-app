const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
};

export const fetchNowPlaying = async (page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/now_playing?language=en-US&page=${page}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch now playing movies');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching now playing movies:", error);
        throw error;
    }
};

export const fetchPopularMovies = async (page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=${page}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch popular movies');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        throw error;
    }
};

export const fetchTopRatedMovies = async (page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?language=en-US&page=${page}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch top rated movies');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching top rated movies:", error);
        throw error;
    }
};

export const fetchMovieDetails = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}?language=en-US&append_to_response=credits,videos,similar`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching movie details for ID ${id}:`, error);
        throw error;
    }
};

export const searchMovies = async (query, page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to search movies');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error searching movies for query "${query}":`, error);
        throw error;
    }
};

export const fetchGenres = async () => {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch genres');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching genres:", error);
        throw error;
    }
};

export const getImageUrl = (path, size = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
