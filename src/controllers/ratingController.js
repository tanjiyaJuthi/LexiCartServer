import { Rating } from "../models/ratingModel.js";
import { Book } from "../models/bookModel.js";

// Create Rating
export const createRating = async (req, res) => {
    try {
        const { bookId, rating } = req.body;
        const userId = req.user.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // librarian cannot rate own book
        if (
            book.librarianId.toString() ===
            userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot rate your own book"
            });
        }

        const existingRating =
            await Rating.findOne({
                userId,
                bookId,
            });

        if (existingRating) {
            return res.status(400).json({
                success: false,
                message:
                    "You already rated this book",
            });
        }

        const newRating = await Rating.create({
            userId,
            bookId,
            rating,
        });

        res.status(201).json({
            success: true,
            message:
                "Rating added successfully",
            data: newRating,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get ratings by book
export const getBookRatings = async (req, res) => {
    try {
        const { bookId } = req.params;

        const ratings = await Rating.find({
            bookId,
        })
        .populate("userId", "name photoURL")
        .sort({ createdAt: -1 });

        const averageRating =
            ratings.length > 0
                ? ratings.reduce(
                    (sum, item) =>
                        sum + item.rating,
                    0
                ) / ratings.length
                : 0;

        res.status(200).json({
            success: true,
            total: ratings.length,
            averageRating:
                averageRating.toFixed(1),
            data: ratings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getRatingsByUser = async (req, res) => {
    try {
        const ratings = await Rating.find({
            userId: req.user.id,
        })
            .populate("bookId", "title coverImage author")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: ratings.length,
            data: ratings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Rating
export const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        const userId = req.user.id;

        const updatedRating = await Rating.findOneAndUpdate(
            {
                _id: id,
                userId
            },
            {
                rating
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!updatedRating) {
            return res.status(404).json({
                success: false,
                message: "Rating not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            data: updatedRating
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Rating
export const deleteRating = async (req, res) => {
    try {
        const { id } = req.params;

        const userId = req.user.id;

        const deletedRating = await Rating.findOneAndDelete({
            _id: id,
            userId
        });

        if (!deletedRating) {
            return res.status(404).json({
                success: false,
                message: "Rating not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Rating deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};