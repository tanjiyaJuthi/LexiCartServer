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
    getAllBooksDashboard,
    getBookForEdit,
    getPendingBooks,
    unpublishBook,
    getBookByIdDashboard,
    publishBook,
    getFeaturedBooks,
    getBooksByLibrarian
} from '../controllers/bookController.js';

const bookRoutes = express.Router();

bookRoutes.get(
    "/dashboard",
    verifyToken,
    role("admin"),
    getAllBooksDashboard
);

bookRoutes.get(
    "/my-book",
    verifyToken,
    role("librarian"),
    getBooksByLibrarian
);

bookRoutes.get(
    "/dashboard/:id",
    verifyToken,
    role("admin", "librarian"),
    getBookByIdDashboard
);

bookRoutes.get(
    "/pending",
    verifyToken,
    role("admin"),
    getPendingBooks
);

bookRoutes.get(
    "/edit/:id",
    verifyToken,
    role("librarian"),
    getBookForEdit
);

bookRoutes.get("/featured", getFeaturedBooks);

bookRoutes.get("/", getAllBooks);

bookRoutes.get("/:id", getBookById);

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

bookRoutes.patch(
    "/approve/:id",
    verifyToken,
    role("admin", "librarian"),
    approveBook
);

bookRoutes.patch(
    "/unpublish/:id",
    verifyToken,
    role("admin", "librarian"),
    unpublishBook
);

bookRoutes.patch(
    "/publish/:id",
    verifyToken,
    role("admin", "librarian"),
    publishBook
);

bookRoutes.delete(
    "/:id",
    verifyToken,
    role("librarian", "admin"),
    deleteBook
);

export default bookRoutes;