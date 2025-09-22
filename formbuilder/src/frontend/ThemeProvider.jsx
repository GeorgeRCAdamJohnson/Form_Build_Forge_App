import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  modern: {
    name: '✨ Ultra Modern',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      borderGlow: 'rgba(99, 102, 241, 0.2)',
      text: '#1e293b'
    },
    fonts: {
      primary: "'Inter', sans-serif",
      heading: "'Inter', sans-serif"
    }
  },
  scifi: {
    name: '🚀 Sci-Fi Cyber',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff', 
      accent: '#39ff14',
      warning: '#ff6600',
      danger: '#ff0040',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #16213e 100%)',
      cardBg: 'rgba(15, 15, 25, 0.9)',
      borderGlow: 'rgba(0, 255, 255, 0.3)',
      text: '#ffffff'
    },
    fonts: {
      primary: "'Exo 2', sans-serif",
      heading: "'Orbitron', monospace"
    }
  },
  barbie: {
    name: '💖 Barbie Dream',
    colors: {
      primary: '#ff1493',
      secondary: '#ff69b4',
      accent: '#ffc0cb',
      warning: '#ff6347',
      danger: '#dc143c',
      background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #c71585 100%)',
      cardBg: 'rgba(255, 192, 203, 0.9)',
      borderGlow: 'rgba(255, 20, 147, 0.4)',
      text: '#ffffff'
    },
    fonts: {
      primary: "'Poppins', sans-serif",
      heading: "'Fredoka One', cursive"
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('modern');

  useEffect(() => {
    const savedTheme = localStorage.getItem('formBuilderTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('formBuilderTheme', themeName);
    }
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, switchTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};