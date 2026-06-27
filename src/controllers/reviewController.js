import { Book } from "../models/bookModel.js";
import { ReadingList } from "../models/readingListModel.js";
import { Comment } from "../models/commentModel.js";
import { Rating } from "../models/ratingModel.js";

export const reviewPermission = async (req, res) => {
    try {
        const { bookId } = req.params;
        const user = req.user;

        if (!user) {
            return res.json({
                success: true,
                canReview: false,
                reason: "login_required"
            });
        }

        if (user.role !== "reader") {
            return res.json({
                success: true,
                canReview: false,
                reason: "not_reader"
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        if (
            book.librarianId.toString() === user.id
        ) {
            return res.json({
                success: true,
                canReview: false,
                reason: "own_book"
            });
        }

        const reading = await ReadingList.findOne({
            userId: user.id,
            bookId
        });

        if (!reading) {
            return res.json({
                success: true,
                canReview: false,
                reason: "not_in_reading_list"
            });
        }

        const comment = await Comment.findOne({
            userId: user.id,
            bookId
        });

        const rating = await Rating.findOne({
            userId: user.id,
            bookId
        });

        if (comment || rating) {
            return res.json({
                success: true,
                canReview: false,
                reason: "already_reviewed"
            });
        }

        res.json({
            success: true,
            canReview: true,
            reason: ""
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};