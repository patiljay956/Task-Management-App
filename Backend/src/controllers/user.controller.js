import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { UserRolesEnum } from "../utils/constants.js";
import { uploadOnCloudinary } from "../utils/fileUpload.cloudinary.js";

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

const updateUserAvatar = asyncHandler(async (req, res) => {
    const user = req.user; // Get the authenticated user from the request

    if (!user) throw new ApiError(401, "User not authenticated");

    // check if request has a file
    if (!req.file ) {
        throw new ApiError(400, "No file uploaded");
    }
    // check if already has an avatar
    if (user.avatar && user.avatar.public_id) {
        // Delete the old avatar from Cloudinary
        const deleted = await deleteFromCloudinary(user.avatar.public_id);

        if (!deleted) {
            throw new ApiError(500, "Failed to delete old avatar");
        }
    }

    // Upload avatar to Cloudinary
    const uploaded = await uploadOnCloudinary(req.file.path, "avatars");
    if (!uploaded) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    // Update user's avatar in the database
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            avatar: {
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
                mimeType: req.file.mimetype,
                size: req.file.size,
            },
        },
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
                "User avatar updated successfully",
            ),
        );
});

export { getUserById, updateUserDetails, updateUserAvatar };
