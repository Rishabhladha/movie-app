import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="group block h-full relative">
            <div className="aspect-[2/3] rounded-lg overflow-hidden relative mb-3 bg-slate-800 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Rating Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-10 flex items-center justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-white text-xs font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                        <Star size={12} className="text-red-500 fill-red-500" />
                        {movie.rating}/10
                        <span className="font-normal text-gray-400 ml-1 hidden sm:inline">{movie.voteCount || '20.5K'} votes</span>
                    </div>
                </div>

                {/* Like Button (Visual) */}
                <button className="absolute top-2 right-2 p-2 rounded-full bg-black/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white text-white">
                    <Heart size={16} />
                </button>
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 leading-tight group-hover:text-red-500 transition-colors">
                    {movie.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {movie.genre?.slice(0, 2).join('/')}
                </p>
            </div>
        </Link>
    );
};

export default MovieCard;
