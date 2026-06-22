import { WishList } from "../models/wishListModel.js";
import { Book } from "../models/bookModel.js";

// Add book to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        // Check book exists
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Check duplicate wishlist
        const existingWishlist = await WishList.findOne({
            userId,
            bookId
        });

        if (existingWishlist) {
            return res.status(400).json({
                success: false,
                message: "Book already in wishlist"
            });
        }

        const wishlist = await WishList.create({
            userId,
            bookId
        });

        res.status(201).json({
            success: true,
            message: "Book added to wishlist",
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's wishlist
export const getMyWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await WishList.find({ userId })
            .populate({
                path: "bookId",
                populate: {
                    path: "librarianId",
                    select: "name email photoURL"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user._id;

        const wishlist = await WishList.findOneAndDelete({
            userId,
            bookId
        });

        if (!wishlist) {
            return res.status(404).json({
                success:false,
                message:"Wishlist item not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"Removed from wishlist"
        });
    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

// Check wishlist status
export const checkWishlist = async(req,res)=>{
    try{
        const {bookId}=req.params;
        const userId=req.user._id;

        const exists = await WishList.exists({
            userId,
            bookId
        });

        res.status(200).json({
            success:true,
            isWishlisted: !!exists
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};