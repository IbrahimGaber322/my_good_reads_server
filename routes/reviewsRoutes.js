import express from "express";
import { getAllReviews,addReview,getReviewById,editReview,deleteReview } from "../controllers/reviewsController.js";
import user from '../middleware/user.js';

const reviewsRoutes=express.Router();

reviewsRoutes.get('/',getAllReviews ); 
reviewsRoutes.post('/:bookId',user, addReview); 
reviewsRoutes.get('/:id', getReviewById); 
reviewsRoutes.patch('/:id', editReview); 
reviewsRoutes.delete('/:id', deleteReview); 

export default reviewsRoutes;
