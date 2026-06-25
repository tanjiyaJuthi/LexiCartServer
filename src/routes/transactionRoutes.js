import express from "express";

import {
  createCheckoutSession,
  stripeWebhook,
} from "../controllers/transactionController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const transactionRoutes = express.Router();

transactionRoutes.post(
  "/checkout",
  verifyToken,
  createCheckoutSession
);

transactionRoutes.post(
  "/webhook",
  express.raw({
    type: "application/json",
  }),
  stripeWebhook
);

export default transactionRoutes;