import mongoose from "mongoose";

export const deliverySchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        librarianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },

        deliveryFee: {
            type: Number,
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        deliveryStatus: {
            type: String,
            enum: [
                "Pending",
                "Dispatched",
                "Delivered",
                "Returned",
            ],
            default: "Pending",
        },

        requestDate: {
            type: Date,
            default: Date.now,
        },

        dispatchedDate: Date,
        deliveredDate: Date,
        returnedDate: Date,
    },
    {
        timestamps: true,
        strict: "throw",
    }
);

deliverySchema.index({
    userId: 1,
});

deliverySchema.index({
    librarianId: 1,
});