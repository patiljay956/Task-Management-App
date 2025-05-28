import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async (req, res, next) => {
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
