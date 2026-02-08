import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const res = login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div className="hidden lg:block relative h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
                <img
                    src="https://assets-in.bmscdn.com/promotions/cms/creatives/1693561351496_desk.jpg"
                    alt="Cinema"
                    className="w-full h-full object-cover animate-pulse-slow"
                />
                <div className="absolute bottom-20 left-10 z-20 max-w-lg">
                    <h1 className="text-5xl font-bold text-white mb-4 leading-tight">Unlock the world of <span className="text-red-500">Entertainment</span></h1>
                    <p className="text-xl text-gray-300">Join millions of movie lovers and book your tickets in seconds.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-[#1a1d29] relative">
                <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Please enter your details to sign in</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500" />
                                Remember me
                            </label>
                            <Link to="#" className="text-red-400 hover:text-red-300 transition-colors">Forgot Password?</Link>
                        </div>

                        <Button variant="brand" size="lg" className="w-full text-lg shadow-xl shadow-red-600/20">
                            Sign In
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#1a1d29] px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                            Google
                        </Button>
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                            Apple
                        </Button>
                    </div>

                    <p className="text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">Sign up</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
