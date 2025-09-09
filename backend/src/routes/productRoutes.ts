import express from 'express';
import { getProducts,addProduct,deleteProduct,updateProduct } from '../controllers/productController';

const router=express.Router();

router.get("/products",getProducts);
router.post("/products",addProduct);
router.delete("/products/:id",deleteProduct);
router.put("/products/:id",updateProduct);

export default router;