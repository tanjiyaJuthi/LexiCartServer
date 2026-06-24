import mongoose from 'mongoose';
import { Book } from '../models/bookModel.js';
import {sanitizeText} from '../lib/helper.js';

export const createBook = async(req,res)=>{
    try{
        const {
            title,
            author,
            description,
            category,
            coverImage,
            deliveryFee,
        } = req.body;

        // Validate category ObjectId
        if(!mongoose.Types.ObjectId.isValid(category)){
            return res.status(400).json({
                success:false,
                message:"Invalid category"
            });
        }

        const book = await Book.create({
            title: sanitizeText(title),
            author: sanitizeText(author),
            description: sanitizeText(description),
            category,
            coverImage,
            deliveryFee,
            librarianId:req.user.id,
            // always pending, librarian cannot publish
            approvalStatus:"Pending",

        });

        res.status(201).json({
            success:true,
            message:
            "Book submitted for approval",
            data:book
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export const getBookById = async (req,res)=>{
    try {
        const book = await Book.findOne({
                _id:req.params.id,
                approvalStatus:"Published"
            })
            .populate("category","name")
            .populate("librarianId","name image email");

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        res.json({
            success:true,
            data:book,
        });
    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export const getBookByIdDashboard = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate("category", "name")
            .populate("librarianId", "name image email");

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({
            success: true,
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllBooks = async (req, res) => {
    try {
        const {
            search = "",
            category,
            status,
            page = 1,
            limit = 12,
            sort = "newest",
        } = req.query;


        const query = {
            approvalStatus: "Published",
        };

        // Search
        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    author: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Availability filter
        if (status) {
            query.status = status;
        }

        let sortQuery = {};

        if (sort === "oldest") {
            sortQuery.createdAt = 1;
        } else if (sort === "fee-low") {
            sortQuery.deliveryFee = 1;
        } else if (sort === "fee-high") {
            sortQuery.deliveryFee = -1;
        } else {
            sortQuery.createdAt = -1;
        }

        const skip =
            (Number(page) - 1) * Number(limit);

        const books = await Book.find(query)
            .populate(
                "category",
                "name"
            )
            .populate(
                "librarianId",
                "name image"
            )
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit))
            .select("-__v");

        const total =
            await Book.countDocuments(query);

        res.status(200).json({
            success: true,
            data: books,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(
                    total / limit
                ),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getBookForEdit = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      librarianId: req.user.id,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBooksDashboard = async (req, res) => {
    try {
        const books = await Book.find({})
            .populate("category", "name")
            .populate("librarianId", "name image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateBook = async(req,res)=>{
    try{
        const book =
        await Book.findOne({
            _id:req.params.id,
            librarianId:req.user.id
        });

        if(!book){
            return res.status(404).json({
                message:
                "Book not found or unauthorized"
            });
        }

        const allowedFields=[
            "title",
            "author",
            "description",
            "category",
            "coverImage",
            "deliveryFee",
        ];

        allowedFields.forEach(field=>{
            if(req.body[field] !== undefined){
                book[field]=req.body[field];
            }
        });

        book.approvalStatus = "Pending";

        await book.save();

        res.json({
            success:true,
            message:"Book updated",
            data:book
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export const deleteBook = async (req, res) => {
    try {

        let book;

        if (req.user.role === "admin") {
            book = await Book.findByIdAndDelete(
                req.params.id
            );
        } else {
            book = await Book.findOneAndDelete({
                _id: req.params.id,
                librarianId: req.user.id,
            });
        }

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.json({
            success: true,
            message: "Book deleted",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const approveBook = async(req,res)=>{
    try{
        const book = await Book.findOneAndUpdate(
            {
                _id:req.params.id,
                approvalStatus:"Pending"
            },
            {
                approvalStatus:"Published"
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        res.json({
            success:true,
            message:
            "Book published successfully",
            data:book
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export const getPendingBooks = async (req, res) => {
    try {
        const books = await Book.find({
            approvalStatus: "Pending",
        })
            .populate("category", "name")
            .populate("librarianId", "name image email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const unpublishBook = async (req, res) => {
    try {
        const book =
            await Book.findByIdAndUpdate(
                req.params.id,
                { approvalStatus: "Unpublished", },
                { new: true, }
            );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.json({
            success: true,
            message: "Book unpublished",
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const publishBook = async (req, res) => {
    try {
        const book =
            await Book.findByIdAndUpdate(
                req.params.id,
                { approvalStatus: "Published", },
                { new: true, }
            );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.json({
            success: true,
            message: "Book published",
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};