import mongoose from "mongoose";
import { transactionSchema } from "../schemas/transactionSchema.js";

export const Transaction = mongoose.model( "Transaction", transactionSchema );