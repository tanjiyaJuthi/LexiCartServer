// import dns from "node:dns";
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

import 'dotenv/config';
import express from "express";
import cors from "cors";

import { connectMongoose } from "./config/db.js";

import profileRoutes from "./routes/profileRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import readingListRoutes from "./routes/readingListRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import wishListRoutes from "./routes/wishListRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { stripeWebhook } from "./controllers/transactionController.js";

const app = express();

app.use(cors({
  origin: process.env.BETTER_AUTH_URL,
  credentials: true,
}));

// for stripe
app.post(
  "/api/transaction/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

await connectMongoose();

// to check if endpoint is working or not
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

// routes
app.use("/api/profile", profileRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/readingList", readingListRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/wishList", wishListRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/review", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

export default app;