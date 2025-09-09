import React, { useState, useEffect } from 'react';
import './styles.css';
import ProductList from './components/ProductList';
import DarkModeToggle from './components/DarkModeToggle';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <div>
      <header>
        <h1>Product Management</h1>
        <div>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>
      <ProductList />
    </div>
  );
};

export default App;