import mongoose from 'mongoose';
import { Comment } from '../models/commentModel.js';
import { Book } from '../models/bookModel.js';
import { ReadingList } from '../models/readingListModel.js';

export const createComment = async (req, res) => {
    try {
        const { bookId, commentText} = req.body;

        const userId = req.user.id;

        const book =
            await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // librarian cannot comment own book
        if (
            book.librarianId.toString() ===
            userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot comment on your own book",
            });
        }

        const readingBook = await ReadingList.findOne({
            userId,
            bookId,
        });

        if (!readingBook) {
            return res.status(403).json({
                success: false,
                message: "You can only review books in your reading list.",
            });
        }

        const existingComment = await Comment.findOne({
            userId,
            bookId,
        });

        if (existingComment) {
            return res.status(400).json({
                success: false,
                message: "You already reviewed this book.",
            });
        }

        const comment =
            await Comment.create({
                userId,
                bookId,
                commentText,
            });

        res.status(201).json({
            success: true,
            message:
                "Comment added successfully",
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Comments
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate("userId", "name photoURL")
            .populate("bookId", "title");

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Comments By Book
export const getCommentsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Book ID",
            });
        }

        const comments = await Comment.find({ bookId })
            .populate("userId", "name photoURL")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyComment = async (req, res) => {
    const comment = await Comment.findOne({
        userId: req.user.id,
        bookId: req.params.bookId,
    });

    res.json({
        success: true,
        data: comment,
    });
};

// Get Comments By User
export const getCommentsByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const comments = await Comment.find({ userId })
            .populate("bookId", "title coverImage")
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Comment
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { commentText } = req.body;

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { commentText },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: updatedComment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Comment
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};