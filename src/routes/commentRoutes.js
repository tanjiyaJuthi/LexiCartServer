import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";
import {role} from "../middleware/role.js";

import { 
    createComment,
    getAllComments,
    getCommentsByBook,
    updateComment,
    deleteComment,
} from '../controllers/commentController.js';

const commentRoutes = express.Router();

commentRoutes.post(
    "/",
    verifyToken,
    role("reader"),
    createComment
);

commentRoutes.get(
    "/",
    verifyToken,
    getAllComments
);

commentRoutes.get(
    "/book/:bookId",
    getCommentsByBook
);

commentRoutes.patch(
    "/:id",
    verifyToken,
    updateComment
);

commentRoutes.delete(
    "/:id",
    verifyToken,
    deleteComment
);

export default commentRoutes;