import mongoose from "mongoose";

export const bookSchema = new mongoose.Schema(
    {
         title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        author: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
            maxlength: 500,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        coverImage: {
            type: String,
            required: true,
        },

        deliveryFee: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["Available", "Checked Out"],
            default: "Available",
        },

        approvalStatus: {
            type: String,
            enum: [
                "Pending",
                "Published",
                "Unpublished",
            ],
            default: "Pending",
        },

        librarianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        strict: "throw",
    }
);

bookSchema.index({
    title: "text",
    author: "text",
    description: "text",
});

bookSchema.index({
    category: 1,
    approvalStatus: 1,
});

bookSchema.index({ createdAt: -1 });