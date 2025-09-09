import React from 'react';

interface Props {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const DarkModeToggle: React.FC<Props> = ({ darkMode, setDarkMode }) => {
  return (
    <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;