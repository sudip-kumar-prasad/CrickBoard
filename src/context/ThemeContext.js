import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightTheme = {
    // Backgrounds
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundCard: '#ffffff',

    // Text
    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#64748b',

    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',

    // Accent
    primary: '#3b82f6',
    primaryDark: '#2563eb',

    // Status colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',

    // Special
    overlay: 'rgba(0, 0, 0, 0.5)',
    cardShadow: '#cbd5e1',
};

export const darkTheme = {
    // Backgrounds
    background: '#0f172a',
    backgroundSecondary: '#0b1223',
    backgroundCard: '#0b1223',

    // Text
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',

    // Borders
    border: '#1e293b',
    borderLight: '#334155',

    // Accent
    primary: '#3b82f6',
    primaryDark: '#2563eb',

    // Status colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',

    // Special
    overlay: 'rgba(0, 0, 0, 0.5)',
    cardShadow: '#000000',
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = !isDark;
            setIsDark(newTheme);
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
