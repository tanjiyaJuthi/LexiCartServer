import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";

import { 
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';

const categoryRoutes = express.Router();

categoryRoutes.get(
    "/", 
    getCategories
);
categoryRoutes.get(
    "/:id", 
    getCategoryById
);

categoryRoutes.post(
    "/", 
    createCategory
);

categoryRoutes.patch(
    "/:id", 
    updateCategory
);

categoryRoutes.delete(
    "/:id", 
    deleteCategory
);


export default categoryRoutes;