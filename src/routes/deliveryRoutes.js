import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";

import { 
    createDelivery,
    getUserDeliveries,
    getLibrarianDeliveries,
    updateDeliveryStatus,
    getAllDeliveries,
    cancelDelivery
} from '../controllers/deliveryController.js';

const deliveryRoutes = express.Router();

deliveryRoutes.post(
    "/",
    verifyToken,
    createDelivery
);

deliveryRoutes.get(
    "/user",
    verifyToken,
    getUserDeliveries
);

deliveryRoutes.get(
    "/librarian",
    verifyToken,
    getLibrarianDeliveries
);

deliveryRoutes.patch(
    "/:id/status",
    verifyToken,
    updateDeliveryStatus
);

deliveryRoutes.get(
    "/admin",
    verifyToken,
    getAllDeliveries
);

deliveryRoutes.delete(
    "/:id",
    verifyToken,
    cancelDelivery
);

export default deliveryRoutes;