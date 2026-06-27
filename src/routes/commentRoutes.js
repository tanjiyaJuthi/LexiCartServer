import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";
import {role} from "../middleware/role.js";

import { 
    createComment,
    getAllComments,
    getCommentsByBook,
    getCommentsByUser,
    updateComment,
    deleteComment,
    getMyComment,
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
    role("reader"),
    getAllComments
);

commentRoutes.get(
    "/book/:bookId",
    getCommentsByBook
);

commentRoutes.get(
    "/book/:bookId/me",
    verifyToken,
    role("reader"),
    getMyComment
);

commentRoutes.get(
    "/my-comment",
    verifyToken,
    role("reader"),
    getCommentsByUser
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