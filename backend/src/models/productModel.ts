import mongoose,{Schema,Document} from "mongoose";
import {Product} from "../types";

const productSchema:Schema=new Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    imageUrl:{type:String},
});

export default mongoose.model<Product & Document>('Product',productSchema);