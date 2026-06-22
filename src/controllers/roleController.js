import { Role } from '../models/roleModel.js';

export const createRole = async (req, res) => {
    try {
        const { title, description } = req.body;

        const existingRole = await Role.findOne({
            title: title.trim().toLowerCase(),
        });

        if (existingRole) {
            return res.status(409).json({
                success: false,
                message: "Role already exists",
            });
        }

        const role = await Role.create({
            title: title.trim().toLowerCase(),
            description,
        });

        res.status(201).json({
            success: true,
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: role,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role
            .find({})
            .select({ _id: 0, title: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "roles fetched successfully",
            data: roles,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { title } = req.body;

        if (title) {
            const exists = await Role.findOne({
                title: title.trim().toLowerCase(),
                _id: { $ne: req.params.id },
            });

            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Role already exists",
                });
            }
        }

        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
                context: "query",
            }
        );

        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedRole,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(
            req.params.id
        );

        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};