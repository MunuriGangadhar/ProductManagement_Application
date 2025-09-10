import React from 'react';
import {Product} from '../types';

interface ProductCardProps{
  product:Product;
  onDelete:(id:string)=>void;
  onEdit:(product:Product)=>void;
}

const ProductCard:React.FC<ProductCardProps>=({product,onDelete,onEdit})=>{
  const categoryClass=product.category.toLowerCase().replace(/\s/g,'');

  return (
    <div
      className={`product-card ${categoryClass}`}
      role="article"
      aria-label={`Product card for ${product.name}`}
    >
      <div className="product-card-header">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        <h3>{product.name}</h3>
      </div>
      <div className="product-card-details">
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <span className={`category-badge ${categoryClass}`}>
          {product.category}
        </span>
      </div>
      <div className="product-card-actions">
        <button
          className="edit-button"
          onClick={() => onEdit(product)}
          aria-label={`Edit ${product.name}`}>
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
              onDelete(product._id!);
            }
          }}
          aria-label={`Delete ${product.name}`}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;