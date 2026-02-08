import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { fetchMovieDetails, getImageUrl, BACKDROP_BASE_URL } from '../../services/tmdb';
import { Button } from '../../components/ui/button';
import { Star, Clock, Calendar, Globe, Share2, PlayCircle, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMovieById } = useBooking();

    // Initial state from context if available (for instant load), else null
    const [movie, setMovie] = useState(getMovieById(id));
    const [loading, setLoading] = useState(!movie);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchMovieDetails(id);
                // Merge with existing data if any, but trust API details more
                setMovie(prev => ({
                    ...prev,
                    ...data,
                    image: getImageUrl(data.poster_path),
                    backdrop: data.backdrop_path ? `${BACKDROP_BASE_URL}${data.backdrop_path}` : null,
                    rating: data.vote_average.toFixed(1),
                    voteCount: `${(data.vote_count / 1000).toFixed(1)}K`,
                    genre: data.genres?.map(g => g.name) || [],
                    runtime: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : 'N/A',
                    year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
                    cast: data.credits?.cast?.slice(0, 8) || [],
                    crew: data.credits?.crew?.slice(0, 4) || [], // Just a few crew members
                    overview: data.overview
                }));
            } catch (err) {
                console.error("Failed to fetch movie details:", err);
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadDetails();
        }
    }, [id]);

    if (loading && !movie) {
        return (
            <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error && !movie) {
        return (
            <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center text-white flex-col gap-4">
                <p>{error}</p>
                <Button onClick={() => navigate('/')} variant="outline" className="text-white border-white/20">Go Home</Button>
            </div>
        );
    }

    if (!movie) return null;

    return (
        <div className="min-h-screen bg-[#1a1d29] text-white space-y-8 pb-32">
            {/* Hero Section with Backdrop */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d29] via-[#1a1d29]/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d29] via-[#1a1d29]/40 to-transparent z-10" />

                {/* Backdrop Image */}
                <img
                    src={movie.backdrop || movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-60 blur-sm scale-105"
                />

                <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-8 flex flex-col md:flex-row gap-8 items-end">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hidden md:block w-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0"
                    >
                        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded border border-white/20">
                                {movie.status || 'Released'}
                            </span>
                            {movie.adult && <span className="bg-red-600/80 text-white text-xs font-bold px-2 py-1 rounded">18+</span>}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">{movie.title}</h1>
                        {movie.tagline && <p className="text-gray-400 italic text-lg">{movie.tagline}</p>}

                        <div className="flex items-center gap-6 text-gray-300 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2 text-white">
                                <Star className="text-red-500 fill-red-500" size={20} />
                                <span className="text-xl font-bold">{movie.rating}/10</span>
                                <span className="text-xs text-gray-400 font-normal">({movie.voteCount} Votes)</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-gray-300 text-sm">
                            <span className="px-3 py-1 bg-white/10 rounded-full">{movie.language?.toUpperCase()}</span>
                            <span className="px-3 py-1 bg-white/10 rounded-full flex items-center gap-1"><Clock size={14} /> {movie.runtime}</span>
                            <span className="px-3 py-1 bg-white/10 rounded-full flex items-center gap-1"><Calendar size={14} /> {movie.year}</span>
                            {movie.genre?.slice(0, 3).map(g => (
                                <span key={g} className="px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer">{g}</span>
                            ))}
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10 text-lg h-12 rounded-lg" onClick={() => navigate(`/book/${id}`)}>
                                Book Tickets
                            </Button>
                            {/* Trailer logic would go here, maybe opening a modal */}
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 gap-2 h-12 rounded-lg"
                                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`, '_blank')}
                            >
                                <PlayCircle size={20} /> Trailer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About the Movie</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {movie.overview}
                        </p>
                    </section>

                    <hr className="border-white/10" />

                    {/* Cast */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Cast</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {movie.cast?.map((actor, idx) => (
                                <div key={idx} className="text-center group cursor-pointer">
                                    <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 mb-3 overflow-hidden border-2 border-white/5 group-hover:border-red-500 transition-colors">
                                        {actor.profile_path ? (
                                            <img src={getImageUrl(actor.profile_path, 'w185')} alt={actor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                                <User size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-white group-hover:text-red-500 transition-colors line-clamp-1">{actor.name}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-1">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="border-white/10" />

                    {/* Crew (Director only for now as per previous design) */}
                    {movie.crew?.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Crew</h2>
                            </div>
                            <div className="flex flex-wrap gap-8">
                                {movie.crew.filter(c => c.job === 'Director').map((crewMember, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                                            {crewMember.profile_path ? (
                                                <img src={getImageUrl(crewMember.profile_path, 'w185')} alt={crewMember.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{crewMember.name}</h4>
                                            <p className="text-sm text-gray-400">{crewMember.job}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Ads / Offers */}
                <div className="hidden lg:block space-y-6">
                    {/* Ad 1 */}
                    <div className="bg-[#222539] p-4 rounded-lg border border-white/5">
                        <h3 className="font-bold text-red-500 mb-2">Applicable Offers</h3>
                        <div className="bg-red-500/10 border border-dashed border-red-500/30 p-3 rounded text-sm text-gray-300">
                            Get 50% off up to ₹150 on your first booking. Use code <span className="font-bold text-white">NEW50</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#222539] border-t border-white/10 z-50">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-6" onClick={() => navigate(`/book/${id}`)}>
                    Book Tickets
                </Button>
            </div>
        </div>
    );
};

export default MovieDetails;
