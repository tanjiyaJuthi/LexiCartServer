import Stripe from "stripe";

import { Book } from "../models/bookModel.js";
import { Delivery } from "../models/deliveryModel.js";
import { Transaction } from "../models/transactionModel.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

export const createTransaction = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.status === "Checked Out") {
      return res.status(400).json({
          success: false,
          message: "This book is currently unavailable for delivery.",
      });
    }

    const existingDelivery = await Delivery.findOne({
      bookId,
      deliveryStatus: {
          $in: ["Pending", "Dispatched", "Delivered"]
      }
  });

  if (existingDelivery) {
      return res.status(400).json({
          success: false,
          message: "Book already has an active delivery."
      });
  }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: [ "card", ],
        mode: "payment",
        customer_email: req.user.email,

        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `${book.title} Delivery`, },
              unit_amount:book.deliveryFee * 100,
            },

            quantity: 1,
          },
        ],

        success_url: `${process.env.BETTER_AUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BETTER_AUTH_URL}/book/${bookId}`,

        metadata: {
          userId: userId.toString(),
          bookId: bookId.toString(),
        },
      });

      const existingTransaction = await Transaction.findOne({
        userId,
        bookId,
        paymentStatus: "Pending"
    });

    if (existingTransaction) {
        return res.status(400).json({
            success: false,
            message: "You already have a pending payment."
        });
    }

    await Transaction.create({
      userId,
      bookId,
      librarianId: book.librarianId,
      stripeSessionId: session.id,
      amount: book.deliveryFee,
      paymentStatus: "Pending",
      status: "Pending"
    });

    await Book.findByIdAndUpdate(bookId, {
      isAvailable: false
  });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    // console.error("STRIPE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// use in app.js before express json parse
export const stripeWebhook = async (req, res) => {
  // console.log("Webhook received");
  // console.log(Buffer.isBuffer(req.body));
  // console.log("Secret:", process.env.STRIPE_WEBHOOK_SECRET);
  
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
  } catch (error) {
    // console.error("Webhook Error:", error);
    return res.status(400).send(error.message);
  }

  if ( event.type === "checkout.session.completed" ) {
    const session = event.data.object;

    const {
      userId,
      bookId,
    } = session.metadata;

    // console.log("Session:", session.id);

    const transaction = await Transaction.findOne({
      stripeSessionId: session.id,
    });

    // console.log("Transaction:", transaction);

    if (!transaction) {
      // console.log("Transaction not found for session:", session.id);
      return res.json({ received: true });
    }

    transaction.paymentStatus = "Paid";
    transaction.stripePaymentIntentId = session.payment_intent;
    await transaction.save();

    const book = await Book.findById(bookId);

    // console.log("Book:", book);

    const existing = await Delivery.findOne({
      transactionId: transaction._id,
    });

    if(!existing){
      await Delivery.create({
        bookId,
        userId,
        librarianId: book.librarianId,
        transactionId: transaction._id,
        deliveryFee: transaction.amount,
        paymentStatus: "Paid",
        deliveryStatus: "Pending",
      });
      // console.log("Delivery created:", delivery);
    }

    await Book.findByIdAndUpdate(
      bookId,
      {
        $inc: { totalSold: 1, },
        status: "Checked Out"
      }
    );
  }

  res.json({ received: true, });
};

export const getLibrarianTransactions = async (req, res) => {
  try {
      const transactions = await Transaction.find({
          librarianId: req.user._id,
      })
          .populate("userId", "email")
          .populate("bookId", "title")
          .sort({ createdAt: -1 });

      res.json({
          success: true,
          transactions,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message,
      });
  }
};

export const getAdminTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("userId", "email")
            .populate({
                path: "bookId",
                select: "title librarianId",
                populate: {
                    path: "librarianId",
                    select: "email",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};