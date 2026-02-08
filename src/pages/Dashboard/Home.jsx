import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import MovieCard from '../../components/shared/MovieCard';
import { ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/button';

// Constants for filters
const LANGUAGES = [
    { code: 'hi', name: 'Hindi' },
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' }
];
const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Science Fiction', 'Thriller', 'Horror', 'Romance', 'Fantasy', 'Crime', 'Family'];

const Home = () => {
    const { movies, loading, error, refreshMovies } = useBooking();
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    // Mock "Recommended" vs "Premiere" logic or just use same list
    const recommendedMovies = movies.slice(0, 5);
    // const premiereMovies = movies.slice(5, 10);
    const allMovies = movies;

    // Filter logic
    const filteredMovies = useMemo(() => {
        return allMovies.filter(movie => {
            const matchesLang = selectedLanguage.length === 0 || (movie.language && selectedLanguage.includes(movie.language));
            const matchesGenre = selectedGenre.length === 0 || movie.genre?.some(g => selectedGenre.includes(g));
            return matchesLang && matchesGenre;
        });
    }, [allMovies, selectedLanguage, selectedGenre]);

    const toggleFilter = (state, setState, item) => {
        if (state.includes(item)) {
            setState(state.filter(i => i !== item));
        } else {
            setState([...state, item]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1d29] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1d29] flex flex-col items-center justify-center text-gray-800 dark:text-white gap-4">
                <p className="text-xl">{error}</p>
                <Button onClick={refreshMovies} className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
                    <RefreshCw size={16} /> Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="transition-colors pb-20">

            {/* Hero Carousel (Dynamic from first movie) */}
            <div className="w-full h-48 md:h-96 bg-gray-900 relative overflow-hidden mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10"></div>
                {movies.length > 0 ? (
                    <>
                        <img
                            src={movies[0].backdrop || movies[0].image}
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                            alt="Banner"
                        />
                        <div className="absolute bottom-10 left-4 md:left-20 z-20 text-white max-w-2xl">
                            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">PREMIERE</div>
                            <h1 className="text-2xl md:text-5xl font-bold mb-4 drop-shadow-2xl">{movies[0].title}</h1>
                            <p className="hidden md:block text-lg text-gray-200 drop-shadow-md mb-6 line-clamp-2">{movies[0].overview}</p>
                            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-none">Book Now</Button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Loading...</p>
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <div className="hidden md:block w-72 flex-shrink-0 animate-fade-in">
                    <div className="bg-white dark:bg-[#222539] rounded-lg shadow-sm overflow-hidden sticky top-24">
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer border-b border-gray-200 dark:border-white/10"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <h3 className="font-bold text-gray-800 dark:text-white">Filters</h3>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isFilterOpen ? "rotate-180" : "")} />
                        </div>

                        {isFilterOpen && (
                            <div className="p-4 space-y-6">
                                {/* Language Filter */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-red-400 mb-3 flex items-center gap-2">
                                        Languages
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {LANGUAGES.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => toggleFilter(selectedLanguage, setSelectedLanguage, lang.code)}
                                                className={cn(
                                                    "text-xs px-3 py-1.5 border rounded-full transition-all",
                                                    selectedLanguage.includes(lang.code)
                                                        ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20"
                                                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-400 hover:text-red-400 bg-transparent"
                                                )}
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Genre Filter */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-red-400 mb-3">Genres</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {GENRES.map(genre => (
                                            <button
                                                key={genre}
                                                onClick={() => toggleFilter(selectedGenre, setSelectedGenre, genre)}
                                                className={cn(
                                                    "text-xs px-3 py-1.5 border rounded-full transition-all",
                                                    selectedGenre.includes(genre)
                                                        ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20"
                                                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-400 hover:text-red-400 bg-transparent"
                                                )}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                                    Browse by Cinema
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">

                    {/* Recommended Movies Section */}
                    <SectionHeader title="Recommended Movies" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-12">
                        {recommendedMovies.map((movie, idx) => (
                            <div key={`rec-${movie.id}`} className={idx > 3 ? "hidden xl:block" : ""}>
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>

                    {/* Banner Ad Space */}
                    <div className="w-full h-24 bg-gradient-to-r from-[#2b3148] to-[#222539] rounded-xl flex items-center justify-between px-8 mb-12 overflow-hidden relative border border-white/5 shadow-lg group cursor-pointer">
                        <div className="z-10 text-white">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded">NEW</span>
                                <h3 className="text-xl font-bold">Endless Entertainment</h3>
                            </div>
                            <p className="text-sm text-gray-400 group-hover:text-white transition-colors">Join the club and get exclusive rewards every month.</p>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-10 group-hover:translate-x-5 transition-transform duration-500"></div>
                        <img src="https://assets-in.bmscdn.com/promotions/cms/creatives/1691136737554_reward.png" className="absolute right-4 bottom-0 h-20 object-contain" alt="" />
                    </div>

                    {/* All Movies Grid */}
                    <SectionHeader title="Now Showing" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 gap-y-10">
                        {filteredMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>

                    {filteredMovies.length === 0 && (
                        <div className="py-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#222539] rounded-lg border border-dashed border-gray-600">
                            <p className="text-xl font-bold">No movies found</p>
                            <p className="text-sm mt-2">Try adjusting your filters</p>
                            <Button
                                variant="link"
                                className="text-red-500 mt-2"
                                onClick={() => { setSelectedLanguage([]); setSelectedGenre([]); }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ title }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white relative pl-4 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-red-500 after:rounded-full">
            {title}
        </h2>
        <button className="text-red-500 text-sm font-medium flex items-center hover:underline group">
            See All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
    </div>
);

export default Home;
