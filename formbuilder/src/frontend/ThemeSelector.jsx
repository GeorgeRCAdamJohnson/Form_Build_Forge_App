import React from 'react';
import { useTheme } from './ThemeProvider';

const ThemeSelector = () => {
  const { currentTheme, switchTheme, themes } = useTheme();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000,
      display: 'flex',
      gap: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '10px',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)'
    }}>
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => switchTheme(key)}
          style={{
            padding: '8px 16px',
            border: currentTheme === key ? '2px solid #fff' : '2px solid transparent',
            borderRadius: '8px',
            background: key === 'scifi' 
              ? 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)'
              : 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
            transition: 'all 0.3s ease',
            textShadow: '0 0 5px rgba(0,0,0,0.5)'
          }}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;