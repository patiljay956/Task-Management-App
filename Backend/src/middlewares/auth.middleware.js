import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { UserRolesEnum } from "../utils/constants.js";
import { ProjectMember } from "../models/projectmember.models.js";

export const verifyToken = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized Access ");
        }

        const decodeToken = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        );

        const user = await User.findById(decodeToken?._id).select(
            "-password -refreshToken",
        );
        if (!user) {
            throw new ApiError(
                401,
                "User is not Authorized to access this link ",
            );
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "invalid token ");
    }
});

// Middleware to check if user has required project role
export const hasProjectRole = (allowedRoles = []) => {
    return asyncHandler(async (req, _, next) => {
        const userId = req.user?._id;
        const projectId = req.params.projectId || req.body.projectId;

        if (!userId) {
            throw new ApiError(401, "Unauthorized: User not logged in");
        }

        if (!projectId) {
            throw new ApiError(400, "Project ID is required");
        }

        // Check if the user is a member of the project
        const member = await ProjectMember.findOne({
            user: userId,
            project: projectId,
        });

        if (!member) {
            throw new ApiError(
                403,
                "Forbidden: You are not a member of this project",
            );
        }

        // Check if user has one of the allowed roles
        if (!allowedRoles.includes(member.role)) {
            throw new ApiError(
                403,
                "Forbidden: You do not have permission to perform this action",
            );
        }

        // Attach role info to req if needed later
        req.projectRole = member.role;

        next();
    });
};
