import {Delivery} from "../models/deliveryModel.js";
import {Book} from "../models/bookModel.js";
import {ReadingList} from "../models/readingListModel.js";

// Get User Delivery History
export const getUserDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({
            userId: req.user.id,
        })
            .populate("bookId", "title coverImage author")
            .sort({
                createdAt: -1,
            });
        // console.log(deliveries);

        res.json({
            success: true,
            deliveries,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Librarian Delivery Requests
export const getLibrarianDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({
            librarianId: req.user.id,
        })
            .populate("bookId", "title coverImage")
            .populate("userId", "name email photoURL")
            .sort({
                createdAt: -1,
            });

        res.json({
            success: true,
            deliveries,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Delivery Status
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found",
            });
        }

        // Only the assigned librarian can update this delivery
        if (delivery.librarianId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        const allowedStatus = [
            "Pending",
            "Dispatched",
            "Delivered",
            "Returned"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid delivery status",
            });
        }

        delivery.deliveryStatus = status;

        if(status === "Dispatched"){
            delivery.dispatchedDate = new Date();
        }

        if(status === "Delivered"){
            delivery.deliveredDate = new Date();

            const exists = await ReadingList.findOne({
                userId: delivery.userId,
                bookId: delivery.bookId,
            });

            if (!exists) {
                await ReadingList.create({
                    userId: delivery.userId,
                    bookId: delivery.bookId,
                    deliveryId: delivery._id,
                });
            }

            // make book available again
            await Book.findByIdAndUpdate(
                delivery.bookId,
                {
                    status: "Checked Out",
                    isAvailable: false,
                }
            );
        }

        if (status === "Returned") {
            delivery.returnedDate = new Date();

            await Book.findByIdAndUpdate(
                delivery.bookId,
                {
                    status: "Available",
                    isAvailable: true,
                }
            );
        }

        await delivery.save();

        res.json({
            success:true,
            message:"Delivery status updated",
            delivery,
        });
    } catch(error){

        res.status(500).json({
            message:error.message,
        });
    }
};

// Admin: Get All Deliveries
export const getAllDeliveries = async(req,res)=>{
    try{
        const deliveries = await Delivery.find()
            .populate("bookId","title")
            .populate("userId","name email")
            .populate("librarianId","name email")
            .sort({
                createdAt:-1
            });

        res.json({
            success:true,
            deliveries
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// Cancel Pending Delivery
export const cancelDelivery = async(req,res)=>{
    try{
        const delivery = await Delivery.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if(!delivery){
            return res.status(404).json({
                message:"Delivery not found"
            });
        }

        if(delivery.deliveryStatus !== "Pending"){
            return res.status(400).json({
                message:"Cannot cancel dispatched delivery"
            });
        }

        await delivery.deleteOne();

        res.json({
            success:true,
            message:"Delivery cancelled"
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};