import React from 'react';
import { Product } from '../types';

interface Props {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onDelete, onEdit }) => {
  const categoryClass = product.category.toLowerCase().replace(/\s/g, '');

  return (
    <div className={`product-card ${categoryClass}`}>
      <div className="category-avatar">{product.category[0].toUpperCase()}</div>
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <button onClick={() => onEdit(product)}>Edit</button>
      <button className="delete" onClick={() => {
        if (window.confirm('Are you sure you want to delete this product?')) {
          onDelete(product._id!);
        }
      }}>Delete</button>
    </div>
  );
};

export default ProductCard;