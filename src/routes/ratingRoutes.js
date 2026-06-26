import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";
import {role} from "../middleware/role.js";

import { 
    createRating,
    getBookRatings,
    updateRating,
    deleteRating,
    getRatingsByUser
} from '../controllers/ratingController.js';

const ratingRoutes = express.Router();

ratingRoutes.post(
    "/",
    verifyToken,
    role('reader'),
    createRating
);

ratingRoutes.get(
    "/book/:bookId",
    getBookRatings
);

ratingRoutes.get(
    "/my-rating",
    verifyToken,
    role('reader'),
    getRatingsByUser
);

ratingRoutes.patch(
    "/:id",
    verifyToken,
    role('reader'),
    updateRating
);

ratingRoutes.delete(
    "/:id",
    verifyToken,
    role('reader'),
    deleteRating
);

export default ratingRoutes;