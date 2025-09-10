import React,{useState} from 'react';
import axios from 'axios';
import {Product} from '../types';

interface ProductFormProps {
  product?:Product;
  onSubmit:(data:Product)=>void;
  onCancel:()=>void;
}

const ProductForm: React.FC<ProductFormProps>=({product,onSubmit,onCancel})=>{
  const [name,setName]=useState(product?.name || '');
  const [price,setPrice]=useState(product?.price.toString() || '');
  const [description,setDescription]=useState(product?.description || '');
  const [category,setCategory]=useState(product?.category || '');
  const [image,setImage]=useState<File | null>(null);
  const [imagePreview,setImagePreview]=useState(product?.imageUrl || '');
  const [errors,setErrors]=useState<{[key:string]:string}>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Price must be a positive number';
    if (!description) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData=new FormData();
    formData.append('name',name);
    formData.append('price',price); 
    formData.append('description',description);
    formData.append('category',category);
    if (image){
      formData.append('image',image); 
    } else if(product?.imageUrl) {
      formData.append('imageUrl',product.imageUrl); 
    }

    try {
      const url=product?._id?`/api/products/${product._id}`:'/api/products';
      const method=product?._id?axios.put:axios.post;
      const response=await method(url,formData,{
        headers:{'Content-Type':'multipart/form-data'},
      });
      onSubmit({...product,...response.data}); 
    } catch(err:any){
      console.error('Form submission error:',err);
      setErrors({submit:err.response?.data?.message || 'Failed to save product'});
    }
  };

  const handleImageChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files && e.target.files[0]){
      const file=e.target.files[0];
      if (!file.type.startsWith('image/')){
        setErrors({image:'Only image files are allowed'});
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={e=>setName(e.target.value)}
          />
          {errors.name && <div className="error">{errors.name}</div>}
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e=>setPrice(e.target.value)}
            step="0.01"
          />
          {errors.price && <div className="error">{errors.price}</div>}
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {errors.description&&<div className="error">{errors.description}</div>}
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e=>setCategory(e.target.value)}
          />
          {errors.category && <div className="error">{errors.category}</div>}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '1rem' }}
          />
          {errors.image && <div className="error">{errors.image}</div>}
          {imagePreview &&(
            <img
              src={imagePreview}
              alt="Product Preview"
              className="product-preview-image"
            />
          )}
          {errors.submit &&<div className="error">{errors.submit}</div>}
          <div>
            <button type="submit">{product ? 'Update' : 'Add'}Product</button>
            <button type="button" className="cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;