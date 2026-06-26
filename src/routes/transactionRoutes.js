import express from "express";

import {
  createTransaction,
  getLibrarianTransactions,
  getAdminTransactions,
} from "../controllers/transactionController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/role.js";

const transactionRoutes = express.Router();

transactionRoutes.get(
  "/librarian",
  verifyToken,
  role("librarian"),
  getLibrarianTransactions
);

transactionRoutes.get(
  "/admin",
  verifyToken,
  role("admin"),
  getAdminTransactions
);

transactionRoutes.post(
  "/checkout",
  verifyToken,
  role("reader"),
  createTransaction,
);

export default transactionRoutes;