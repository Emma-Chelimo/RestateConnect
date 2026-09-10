import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@restateconnect_dark_mode';

// Your existing brand colors are preserved as the dark-mode base.
const darkColors = {
  background: '#0d1a2c',
  surface: '#152238',
  card: '#1c2b45',
  title: '#8080dd',
  text: '#f2f2f7',
  subtext: '#a9b4c7',
  border: '#2a3a57',
  primary: '#8080dd',
  divider: '#2a3a57',
};

const lightColors = {
  background: '#f4f5f9',
  surface: '#ffffff',
  card: '#ffffff',
  title: '#2C3E8F',
  text: '#1A1A2E',
  subtext: '#666666',
  border: '#e5e5ea',
  primary: '#2C3E8F',
  divider: '#f0f0f0',
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // defaults to your existing dark look
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored !== null) setIsDark(stored === 'true');
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const toggleDarkMode = async (value) => {
    setIsDark(value);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to persist theme preference', e);
    }
  };

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  if (!loaded) return null; // avoid a flash of the wrong theme on launch

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
