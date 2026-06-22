import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/role.js";

import {
    getAllBooks,
    createBook,
    getBookById,
    updateBook,
    deleteBook,
    approveBook,
} from '../controllers/bookController.js';

const bookRoutes = express.Router();

bookRoutes.get(
    "/",
    getAllBooks
);

bookRoutes.get(
    "/:id",
    getBookById
);

// librarian
bookRoutes.post(
    "/",
    verifyToken,
    role("librarian"),
    createBook
);

bookRoutes.patch(
    "/:id",
    verifyToken,
    role("librarian"),
    updateBook
);

bookRoutes.delete(
    "/:id",
    verifyToken,
    role("librarian"),
    deleteBook
);

bookRoutes.patch(
    "/approve/:id",
    verifyToken,
    role("admin"),
    approveBook
);

export default bookRoutes;