import React,{useState,useEffect} from 'react';
import ProductList from './components/ProductList';
import {Product} from './types';
import './styles.css';

const App: React.FC=()=>{
  const [darkMode,setDarkMode]=useState<boolean>(()=>{
    return localStorage.getItem('darkMode')==='true';
  });
  const [showForm,setShowForm]=useState(false);
  const [editingProduct,setEditingProduct] = useState<Product|undefined>(undefined);

  useEffect(()=>{
    if (darkMode){
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode',darkMode.toString());
  },[darkMode]);

  return (
    <div className="app">
      <header>
        <h1>PaisaWapas</h1>
        <button
          className="dark-toggle"
          onClick={()=>setDarkMode(!darkMode)}
          aria-label={darkMode?'Switch to light mode':'Switch to dark mode'}>

          {darkMode?'☀️':'🌙'}

        </button>
      </header>
      <section className="hero">
        <h2>Discover Our Products</h2>
        <p>Browse, add, and manage your favorite products with ease.</p>
        <button
          className="cta-button"
          onClick={() => {
            setShowForm(true);
            setEditingProduct(undefined); 
          }}>
          Add a Product
        </button>
      </section>
      <main>
        <ProductList
          showForm={showForm}
          setShowForm={setShowForm}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </main>
      <footer>
        <p>&copy; 2025 PaisaWapas. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;