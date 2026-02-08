import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('movie_app_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('movie_app_users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const { password, ...userWithoutPass } = foundUser;
            setUser(userWithoutPass);
            localStorage.setItem('movie_app_user', JSON.stringify(userWithoutPass));
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('movie_app_users') || '[]');
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem('movie_app_users', JSON.stringify(users));

        // Auto login
        const { password, ...userWithoutPass } = newUser;
        setUser(userWithoutPass);
        localStorage.setItem('movie_app_user', JSON.stringify(userWithoutPass));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('movie_app_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
