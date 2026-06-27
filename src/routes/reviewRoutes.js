import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { reviewPermission } from "../controllers/reviewController.js";

const reviewRoutes = express.Router();

reviewRoutes.get(
    "/permission/:bookId",
    verifyToken,
    reviewPermission
);

export default reviewRoutes;