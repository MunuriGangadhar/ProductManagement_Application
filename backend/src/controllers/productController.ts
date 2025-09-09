import { Request,Response} from "express";
import ProductModel from "../models/productModel";
import {z} from "zod";
import { Product} from "../types";

const productSchema=z.object({
    name:z.string().min(1,'Name is required'),
    price:z.number().positive('Price must be positive'),
    description:z.string().min(1,'Description is required'),
    category:z.string().min(1,'Category is required'),
});

export const getProducts=async(req:Request,res:Response)=>{
    try{
        const products=await ProductModel.find();
        res.json(products);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}

export const addProduct=async(req:Request,res:Response)=>{
    try{
       const parsed=productSchema.parse(req.body);
       const newProduct=new ProductModel(parsed);
       await newProduct.save();
       res.status(201).json(newProduct);
    }catch(err){
        if(err instanceof z.ZodError){
      return res.status(400).json({message:err.errors.map(e => e.message).join(',')});
    }
    res.status(500).json({message:"Server error"});
    }
}

export const deleteProduct=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params;
        const product=await ProductModel.findByIdAndDelete(id);
        if(!product){
             return res.status(404).json({message:"Product not found"});
        }
        res.json({message:"Product deleted"});
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}

export const updateProduct=async(req:Request,res:Response)=>{
    try{
      const {id}=req.params;
      const parsed=productSchema.parse(req.body);
      const updated=await ProductModel.findByIdAndUpdate(id,parsed,{new:true});
      if(!updated){
          return res.status(400).json({message:"Product not found"});
      }
      res.json(updated);
    }catch(err){
         if(err instanceof z.ZodError){
      return res.status(400).json({message:err.errors.map(e => e.message).join(',')});
    }
    res.status(500).json({message:"Server error"});
    }
}