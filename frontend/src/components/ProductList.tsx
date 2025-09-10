import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import Toast from './Toast';
import {Product} from '../types';

interface ToastMessage {
  id:number;
  message:string;
  type:'success'|'error';
}

interface ProductListProps{
  showForm:boolean;
  setShowForm:(value:boolean)=>void;
  editingProduct:Product | undefined;
  setEditingProduct:(product: Product | undefined)=>void;
}

const ProductList: React.FC<ProductListProps>=({showForm,setShowForm,editingProduct,setEditingProduct})=>{
  const [products,setProducts]=useState<Product[]>([]);
  const [search,setSearch]=useState('');
  const [categoryFilter,setCategoryFilter]=useState('');
  const [priceMin,setPriceMin]=useState('');
  const [priceMax,setPriceMax]=useState('');
  const [dateFilter,setDateFilter]=useState('all');
  const [sortAsc,setSortAsc]=useState(true);
  const [toasts,setToasts]=useState<ToastMessage[]>([]);

  useEffect(()=>{
    fetchProducts();
  },[]);

  const fetchProducts=async()=>{
    try {
      const res=await axios.get('/api/products');
      setProducts(res.data);
    }catch(err){
      addToast('Failed to fetch products','error');
    }
  };

  const addToast=(message:string,type:'success'|'error')=>{
    const id=Date.now();
    setToasts(prev=>[...prev,{id,message,type}]);
    setTimeout(()=>{
      setToasts(prev=>prev.filter(toast=>toast.id!==id));
    },3000);
  };

  const addOrUpdateProduct=async(data: Product)=>{
    try {
      if (data._id){
        await axios.put(`/api/products/${data._id}`,data);
        addToast('Product updated successfully', 'success');
      } else {
        await axios.post('/api/products', data);
        addToast('Product added successfully', 'success');
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(undefined);
    } catch (err) {
      addToast('Failed to save product', 'error');
    }
  };

  const deleteProduct=async(id:string)=>{
    try {
      await axios.delete(`/api/products/${id}`);
      addToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const filteredProducts=products
    .filter(p =>{
      const searchLower = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower);
      const matchesCategory = !categoryFilter || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const price = p.price;
      const min = priceMin ? parseFloat(priceMin) : -Infinity;
      const max = priceMax ? parseFloat(priceMax) : Infinity;
      const matchesPrice = price >= min && price <= max;
      const now = new Date();
      const createdAt = new Date(p._id ? p._id.toString().substring(0, 8) : now);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'last7days' && createdAt >= last7Days) ||
        (dateFilter === 'last30days' && createdAt >= last30Days);
      return matchesSearch && matchesCategory && matchesPrice && matchesDate;
    })
    .sort((a, b) => sortAsc ? a.price - b.price : b.price - a.price);

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="product-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={e => setPriceMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
        />
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
          <option value="all">All Dates</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
        </select>
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort Price {sortAsc ? '↑' : '↓'}
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
      <div className="fab" onClick={() => {
        setShowForm(true);
        setEditingProduct(undefined);
      }}>+</div>
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;