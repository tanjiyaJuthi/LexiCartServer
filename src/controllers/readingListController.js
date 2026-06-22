import {ReadingList} from "../models/readingListModel.js";
import {Delivery} from "../models/deliveryModel.js";

// Add book to reading list
export const addToReadingList = async (req, res) => {
    try {
        const { bookId, deliveryId } = req.body;
        const userId = req.user.id;

        // Verify delivery belongs to user and is completed
        const delivery = await Delivery.findOne({
            _id: deliveryId,
            userId,
            bookId,
            deliveryStatus: "Delivered"
        });

        if (!delivery) {
            return res.status(403).json({
                success: false,
                message: "You can only add delivered books to reading list"
            });
        }

        // Check duplicate
        const exists = await ReadingList.findOne({
            userId,
            bookId
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Book already exists in reading list"
            });
        }

        const readingList = await ReadingList.create({
            userId,
            bookId,
            deliveryId
        });

        res.status(201).json({
            success: true,
            message: "Added to reading list",
            data: readingList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's reading list
export const getMyReadingList = async (req, res) => {
    try {
        const userId = req.user.id;

        const readingList = await ReadingList.find({ userId })
            .populate({
                path: "bookId",
                select: "title author coverImage category"
            })
            .populate({
                path: "deliveryId",
                select: "deliveryStatus deliveredDate"
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            data: readingList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove from reading list
export const removeFromReadingList = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await ReadingList.findOneAndDelete({
            _id: id,
            userId
        });

        if (!deleted) {
            return res.status(404).json({
                success:false,
                message:"Reading list item not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"Removed from reading list"
        });
    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};