import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        
        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500,
        },

        image: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        strict: "throw",
    }
);