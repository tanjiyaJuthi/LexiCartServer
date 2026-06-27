import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";
import {role} from "../middleware/role.js";

import {
    getUserDeliveries,
    getLibrarianDeliveries,
    updateDeliveryStatus,
    getAllDeliveries,
    cancelDelivery
} from '../controllers/deliveryController.js';

const deliveryRoutes = express.Router();

deliveryRoutes.get(
    "/reader",
    verifyToken,
    role('reader'),
    getUserDeliveries
);

deliveryRoutes.get(
    "/librarian",
    verifyToken,
    role('librarian'),
    getLibrarianDeliveries
);

deliveryRoutes.patch(
    "/:id/status",
    verifyToken,
    role('librarian'),
    updateDeliveryStatus
);

deliveryRoutes.get(
    "/admin",
    verifyToken,
    role('admin'),
    getAllDeliveries
);

deliveryRoutes.delete(
    "/:id",
    verifyToken,
    role("librarian"),
    cancelDelivery
);

export default deliveryRoutes;