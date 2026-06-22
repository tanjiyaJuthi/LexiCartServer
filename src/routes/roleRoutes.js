import express from "express";

import {verifyToken} from "../middleware/verifyToken.js";

import { 
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
} from '../controllers/roleController.js';

const roleRoutes = express.Router();

roleRoutes.get(
    "/",
    verifyToken,
    getAllRoles
);

roleRoutes.get(
    "/:id",
    verifyToken,
    getRoleById
);

roleRoutes.post(
    "/",
    verifyToken,
    createRole
);

roleRoutes.patch(
    "/:id",
    verifyToken,
    updateRole
);

roleRoutes.delete(
    "/:id",
    verifyToken,
    deleteRole
);

export default roleRoutes;