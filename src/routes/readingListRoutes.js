import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";

import { 
    addToReadingList,
    getMyReadingList,
    removeFromReadingList
} from '../controllers/readingListController.js';

const readingListRoutes = express.Router();

readingListRoutes.post(
    "/",
    verifyToken,
    addToReadingList
);

readingListRoutes.get(
    "/my-list",
    verifyToken,
    getMyReadingList
);

readingListRoutes.delete(
    "/:id",
    verifyToken,
    removeFromReadingList
);


export default readingListRoutes;