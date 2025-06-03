import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { UserRolesEnum } from "../utils/constants.js";

const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId)
        .select(
            "-password -refreshToken -isEmailVerified -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry -__v -role",
        )
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const user = req.user; // Get the authenticated user from the request

    if (!user) throw new ApiError(401, "User not authenticated");

    const { name, username } = req.body;

    // check if the username is already taken by another user
    const existingUser = await User.findOne({
        username,
    });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        throw new ApiError(400, "Username is already taken");
    }

    // Update the user details
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { name, username },
        { new: true, runValidators: true },
    )
        .select(
            "-password -refreshToken -isEmailVerified -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry -__v",
        )
        .lean();

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "User details updated successfully",
            ),
        );
});

export { getUserById, updateUserDetails };
