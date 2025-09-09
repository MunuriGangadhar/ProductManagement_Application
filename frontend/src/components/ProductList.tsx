import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const addOrUpdateProduct = async (data: Product) => {
    try {
      if (data._id) {
        await axios.put(`/api/products/${data._id}`, data);
      } else {
        await axios.post('/api/products', data);
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(undefined);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAsc ? a.price - b.price : b.price - a.price);

  return (
    <div>
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort by Price {sortAsc ? '▲' : '▼'}
        </button>
      </div>
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onDelete={deleteProduct}
            onEdit={(p) => {
              setEditingProduct(p);
              setShowForm(true);
            }}
          />
        ))}
      </div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={addOrUpdateProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
        />
      )}
      <div className="fab" onClick={() => setShowForm(true)}>+</div>
    </div>
  );
};

export default ProductList;