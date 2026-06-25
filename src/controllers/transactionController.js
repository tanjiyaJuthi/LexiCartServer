import Stripe from "stripe";

import { Book } from "../models/bookModel.js";
import { Transaction } from "../models/transactionModel.js";
import { Delivery } from "../models/deliveryModel.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

export const createCheckoutSession = async (req, res) => {
    try {
      // console.log("CHECKOUT HIT");
      // console.log(req.body);
      // console.log(req.user);

      const { bookId } = req.body;

      const userId = req.user.id;

      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      const session =
        await stripe.checkout.sessions.create({
          payment_method_types: [
            "card",
          ],

          mode: "payment",

          customer_email:
            req.user.email,

          line_items: [
            {
              price_data: {
                currency: "usd",

                product_data: {
                  name: `${book.title} Delivery`,
                },

                unit_amount:
                  book.deliveryFee * 100,
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

      await Transaction.create({
        userId,
        bookId,

        stripeSessionId:
          session.id,

        amount:
          book.deliveryFee,

        paymentStatus:
          "Pending",
      });

      res.json({
        success: true,
        url: session.url,
      });
    } catch (error) {
      console.error("STRIPE ERROR:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const stripeWebhook = async (req, res) => {
    let event;

    try {
      const sig =
        req.headers["stripe-signature"];

      event =
        stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
      return res.status(400).send(
        error.message
      );
    }

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object;

      const {
        userId,
        bookId,
      } = session.metadata;

      const transaction =
        await Transaction.findOne({
          stripeSessionId:
            session.id,
        });

      if (transaction) {
        transaction.paymentStatus =
          "Paid";

        transaction.stripePaymentIntentId =
          session.payment_intent;

        await transaction.save();
      }

      const book =
        await Book.findById(bookId);

      await Delivery.create({
        bookId,
        userId,

        librarianId:
          book.librarianId,

        transactionId:
          transaction._id,

        deliveryFee:
          transaction.amount,

        paymentStatus:
          "Paid",

        deliveryStatus:
          "Pending",
      });

      await Book.findByIdAndUpdate(
        bookId,
        {
          status:
            "Pending Delivery",
        }
      );
    }

    res.json({
      received: true,
    });
  };