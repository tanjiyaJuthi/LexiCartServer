import { Category } from '../models/categoryModel.js';

export const createCategory = async (req, res) => {
    try {
        const {
            name,
            image,
            description
        } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const normalizedName = name.trim().toLowerCase();

        const exists = await Category.findOne({
            name: normalizedName,
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: normalizedName,
            image,
            description
        });

        res.status(201).json({
            success: true,
            data: category,
            message: "Category has created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category
            .find({
                isActive: true,
            })
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
            count: categories.length,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnOriginal: false,
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};