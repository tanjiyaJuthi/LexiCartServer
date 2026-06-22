import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";

import { 
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
    checkWishlist 
} from '../controllers/wishListController.js';

const wishListRoutes = express.Router();

wishListRoutes.post(
    "/",
    verifyToken,
    addToWishlist
);

wishListRoutes.get(
    "/my",
    verifyToken,
    getMyWishlist
);

wishListRoutes.delete(
    "/:bookId",
    verifyToken,
    removeFromWishlist
);

wishListRoutes.get(
    "/check/:bookId",
    verifyToken,
    checkWishlist
);

export default wishListRoutes;