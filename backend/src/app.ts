import express from 'express';
import cors from 'cors';
import productRoutes from "./routes/productRoutes";

const app=express();
// app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://product-management-application-sigma.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/api',productRoutes);
export default app;