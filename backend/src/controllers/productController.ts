import {Request,Response} from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from "../models/productModel";
import {z} from "zod";
import {Product} from "../types";
import multer,{FileFilterCallback} from 'multer';
import {v2 as cloudinaryV2} from 'cloudinary';

dotenv.config();

cloudinaryV2.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

const storage=multer.memoryStorage();
const upload=multer({
  storage,
  fileFilter:(req: Request,file:Express.Multer.File,cb:FileFilterCallback) => {
    if(file.mimetype.startsWith("image/")) {
      cb(null,true);
    } else {
      cb(new Error("Only image files are allowed")); 
    }
  },
  limits:{fileSize:5*1024*1024},
});



const productSchema=z.object({
  name:z.string().min(1,'Name is required'),
  price:z.coerce.number().positive('Price must be positive'),
  description:z.string().min(1,'Description is required'),
  category:z.string().min(1,'Category is required'),
});

export const getProducts=async(req:Request,res:Response)=>{
  try {
    const products=await ProductModel.find();
    res.json(products);
  }catch(error) {
    console.error('Error fetching products:',error);
    res.status(500).json({message:"Server error"});
  }
};

export const addProduct=[
  upload.single('image'),
  async(req:Request,res:Response)=>{
    try {
      console.log('Request body:', req.body);
      console.log('File:', req.file);

      const parsed=productSchema.parse(req.body);
      let imageUrl:string|undefined;

      if (req.file){
        const uploadResult=await new Promise<string>((resolve,reject)=>{
          const stream = cloudinaryV2.uploader.upload_stream(
            {resource_type:'image',folder:'products'}, 
            (error,result)=>{
              if(error){
                return reject(new Error(`Cloudinary upload error: ${error.message}`));
              }
              resolve(result?.secure_url!);
            }
          );
          stream.end(req.file!.buffer);
        });
        imageUrl=uploadResult;
      }

      const newProduct=new ProductModel({
        ...parsed,
        imageUrl,
      });

      await newProduct.save();

      res.status(201).json(newProduct);
    }catch(err){

      if (err instanceof z.ZodError) {
        console.error('Validation error:',err.errors);
        return res.status(400).json({message:err.errors.map(e=>e.message).join(', ')});
      }

      console.error('Error while creating product:',err);
      res.status(500).json({ message: "Server error" });
    }
  }
];

export const updateProduct=[
  upload.single('image'), 
  async(req:Request,res:Response)=>{
    try{
      const {id}=req.params;
      if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid product ID'});
      }

      console.log('Update body:', req.body);
      console.log('File:', req.file);

      const parsed=productSchema.parse(req.body);
      let imageUrl=req.body.imageUrl; 

      if (req.file){
        const existingProduct=await ProductModel.findById(id);

        if (existingProduct?.imageUrl) {
          const publicId=existingProduct.imageUrl.split('/').pop()?.split('.')[0];
          if(publicId){
            await cloudinaryV2.uploader.destroy(`products/${publicId}`);
          }
        }

        const uploadResult=await new Promise<string>((resolve,reject)=>{
          const stream=cloudinaryV2.uploader.upload_stream(
            {resource_type:'image',folder:'products'},
            (error,result)=>{
              if(error){
                return reject(new Error(`Cloudinary upload error: ${error.message}`));
              }
              resolve(result?.secure_url!);
            }
          );
          stream.end(req.file!.buffer);
        });
        imageUrl=uploadResult;
      }

      const updated=await ProductModel.findByIdAndUpdate(
        id,
        {...parsed,imageUrl },
        {new:true}
      );
      if(!updated){
        return res.status(404).json({message:'Product not found'});
      }

      res.json(updated);
    }catch(err){
      if (err instanceof z.ZodError) {
        console.error('Validation error:',err.errors);
        return res.status(400).json({message:err.errors.map(e=>e.message).join(', ')});
      }
      console.error('Error updating product:',err);
      res.status(500).json({message:"Server error" });
    }
  }
];

export const deleteProduct=async(req:Request,res:Response)=>{
  try {
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message: 'Invalid product ID' });
    }

    const product=await ProductModel.findById(id);
    if (!product){
      return res.status(404).json({message:'Product not found'});
    }

    // These mainly deletes the  image from Cloudinary if exists
    if (product.imageUrl) {
      const publicId=product.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinaryV2.uploader.destroy(`products/${publicId}`);
      }
    }

    await ProductModel.findByIdAndDelete(id);
    res.json({ message:'Product deleted' });
    
  } catch (error){

    console.error('Error deleting product:',error);
    res.status(500).json({message:"Server error"});
  }
};