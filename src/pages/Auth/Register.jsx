import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // eslint-disable-next-line
        const { confirmPassword, ...dataToSubmit } = formData;
        const res = register(dataToSubmit);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Right Side - Form (Swapped for variety or keep same side? Let's keep form on right for consistency) */}

            {/* Visual Side */}
            <div className="hidden lg:block relative h-full overflow-hidden order-last lg:order-first">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
                <img
                    src="https://assets-in.bmscdn.com/promotions/cms/creatives/1690628905918_web.jpg"
                    alt="Concert"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-20 left-10 z-20 max-w-lg">
                    <h1 className="text-5xl font-bold text-white mb-4 leading-tight">Experience it <span className="text-red-500">Live</span></h1>
                    <p className="text-xl text-gray-300">Book tickets for movies, concerts, sports and more.</p>
                </div>
            </div>

            {/* Form Side */}
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
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Join us for exclusive offers and rewards</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <div className="pt-2">
                            <Button variant="brand" size="lg" className="w-full text-lg shadow-xl shadow-red-600/20">
                                Sign Up
                            </Button>
                        </div>
                    </form>

                    <p className="text-center text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
