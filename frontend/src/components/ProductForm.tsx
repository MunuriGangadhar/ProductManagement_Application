import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface Props {
  product?: Product;  // Optional for edit mode
  onSubmit: (data: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<Props> = ({ product, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setDescription(product.description);
      setCategory(product.category);
    }
  }, [product]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Valid positive price is required';
    if (!description) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        _id: product?._id,
        name,
        price: Number(price),
        description,
        category,
      });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <span className="error">{errors.name}</span>}
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          {errors.price && <span className="error">{errors.price}</span>}
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {errors.description && <span className="error">{errors.description}</span>}
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          {errors.category && <span className="error">{errors.category}</span>}
          <button type="submit">Save</button>
          <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;