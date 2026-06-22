import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";

import { 
    createRating,
    getBookRatings,
    updateRating,
    deleteRating
} from '../controllers/ratingController.js';

const ratingRoutes = express.Router();

ratingRoutes.post(
    "/",
    verifyToken,
    createRating
);

ratingRoutes.get(
    "/",
    verifyToken,
    getBookRatings
);

ratingRoutes.patch(
    "/",
    verifyToken,
    updateRating
);

ratingRoutes.delete(
    "/",
    verifyToken,
    deleteRating
);

export default ratingRoutes;