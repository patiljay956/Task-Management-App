import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
    emailVerificationMailGenerator,
    forgotPasswordMailGenContent,
    sendMail,
} from "../utils/mail.js";
import crypto from "crypto";

import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    }).lean();

    if (existingUser)
        throw new ApiError(
            400,
            "email or username is already exists please login",
        );

    const user = await User.create({
        name,
        email,
        username,
        password,
    });

    if (!user) throw new ApiError(500, "Unable to create user");

    // 2. Generate token (this also sets it inside user object)
    const { unHashedToken } = user.generateTemporaryToken("email");

    // 3. Save user
    const savedUser = await user.save();

    if (!savedUser) throw new ApiError(500, "unable to save user");

    // 4. sand email Create verification URL (frontend route)

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${unHashedToken}`;

    const emailContent = emailVerificationMailGenerator(
        user.username,
        verificationUrl,
    );

    await sendMail({
        email: user.email,
        subject: "Verify your account - Project Management Tool",
        mailGenContent: emailContent,
    });

    // clear sensitive data before sending response
    savedUser.password = undefined;
    savedUser.refreshToken = undefined;
    savedUser.isEmailVerified = undefined;
    savedUser.emailVerificationToken = undefined;
    savedUser.emailVerificationExpiry = undefined;
    savedUser.forgotPasswordToken = undefined;
    savedUser.forgotPasswordExpiry = undefined;
    savedUser.__v = undefined;

    return res.status(201).json(
        new ApiResponse(201, {
            user: savedUser,
            unHashedToken,
            verificationUrl,
        }),
        "user registered Successfully",
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    // check user is logged in
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) throw new ApiError(401, "User does not exists please login");

    // check password is valid
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiError(401, "Password is incorrect");

    // check if user is verified
    if (!user.isEmailVerified) throw new ApiError(400, "Email not verified");

    // generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // store refresh token in db
    user.refreshToken = refreshToken;

    // update user in db
    await user.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true,
    };

    // success status to user, save accessToken and refreshToken into cookies
    user.password = undefined;
    user.refreshToken = undefined;
    user.isEmailVerified = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.__v = undefined;

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: user,
                    accessToken,
                    refreshToken,
                },
                "User Logged In Successfully",
            ),
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) throw new ApiError(400, "user is already logged out");

    const existingUser = await User.findByIdAndUpdate(
        userId,
        {
            $unset: { refreshToken: 1 },
        },
        {
            new: true,
        },
    );

    if (!existingUser) {
        throw new ApiError(500, "Unable to clear the token");
    }

    existingUser.password = undefined;

    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, existingUser, "Successfully Logout"));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const unHashedToken = req.query?.token;

    if (!unHashedToken) throw new ApiError(401, "Token is missing or expired");

    const hashedToken = await crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const existingTokenUser = await User.findOne({
        emailVerificationToken: hashedToken,
    });

    if (!existingTokenUser) throw new ApiError(401, "Token does not exists ");

    if (existingTokenUser.emailVerificationExpiry < Date.now()) {
        throw new ApiError(401, "Email link has expired");
    }

    existingTokenUser.isEmailVerified = true;
    existingTokenUser.emailVerificationToken = undefined;
    existingTokenUser.emailVerificationExpiry = undefined;

    const updateUser = await existingTokenUser.save(
        { validateBeforeSave: false },
        { new: true },
    );

    if (!updateUser) throw new ApiError(500, "unable to update the user");

    updateUser.password = undefined;

    return res
        .status(200)
        .json(new ApiResponse(200, updateUser, "Email is verified"));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email }).select(
        "-password -refreshToken ",
    );

    if (!existingUser)
        throw new ApiError(400, "Email is not valid please register ");

    // check if email is already verified
    if (existingUser.isEmailVerified) {
        throw new ApiError(400, "Email is already verified");
    }

    // generate new token
    const { unHashedToken } =
        await existingUser.generateTemporaryToken("email");

    // save to database
    await existingUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email/${unHashedToken}`;

    // send mail
    const emailContent = emailVerificationMailGenerator(
        existingUser.username,
        verifyEmailUrl,
    );

    await sendMail({
        email: existingUser.email,
        subject: "Verify your account - Project Management Tool",
        mailGenContent: emailContent,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existingUser,
                "New Email Verification link is sent ",
            ),
        );
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email }).select("-password");

    if (!existingUser)
        throw new ApiError(400, "Email is not valid please register ");

    // generate new password reset token
    const { unHashedToken } =
        await existingUser.generateTemporaryToken("password");

    const forgetPasswordLink = `${process.env.FRONTEND_URL}/reset-password/${unHashedToken} `;

    await existingUser.save();

    const emailContent = forgotPasswordMailGenContent(
        existingUser.username,
        forgetPasswordLink,
    );

    await sendMail({
        email: existingUser.email,
        subject: " Forgot your password - Project Management Tool",
        mailGenContent: emailContent,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, existingUser, "Password reset link is sent "),
        );
});

const resetForgottenPassword = asyncHandler(async (req, res) => {
    const unHashedToken = req.query?.token;
    const { password } = req.body;

    if (!unHashedToken) throw new ApiError(401, "Token is missing or expired");

    const hashedToken = await crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const existingTokenUser = await User.findOne({
        forgotPasswordToken: hashedToken,
    });

    if (!existingTokenUser) throw new ApiError(401, "Token does not exists ");

    if (existingTokenUser.forgotPasswordExpiry < Date.now()) {
        throw new ApiError(401, "Email link has expired");
    }

    existingTokenUser.password = password;
    existingTokenUser.forgotPasswordToken = undefined;
    existingTokenUser.forgotPasswordExpiry = undefined;
    existingTokenUser.refreshToken = undefined;

    const updateUser = await existingTokenUser.save({ new: true });

    if (!updateUser) throw new ApiError(500, "unable to update the user");

    existingTokenUser.password = undefined;

    // clear cookies
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updateUser,
                "Password has been reset successfully",
            ),
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) throw new ApiError(400, "Unauthorized access");

    // decode refresh token
    const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
    );

    // check if user exists
    const existingUser = await User.findById(decodedToken?._id).select(
        "-password",
    );

    if (!existingUser) throw new ApiError(400, "Invalid Refresh Token");

    // generate tokens
    const accessToken = existingUser.generateAccessToken();
    const newRefreshToken = existingUser.generateRefreshToken();

    // store refresh token in db
    existingUser.refreshToken = newRefreshToken;

    // update user in db
    await existingUser.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, "Access Token refreshed successfully", {
                existingUser,
                accessToken,
                newRefreshToken,
            }),
        );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { newPassword, password } = req.body;

    const userId = req.user?._id;

    if (!userId) throw new ApiError(401, "Unauthorized access");

    const existingUser = await User.findById(userId);

    if (!existingUser) throw new ApiError(404, "User not found");

    // Check if the current password is correct
    const isPasswordValid = await existingUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }
    // Update the password

    existingUser.password = newPassword;
    existingUser.refreshToken = undefined;

    const updatedUser = await existingUser.save({ validateBeforeSave: false });

    if (!updatedUser) throw new ApiError(500, "Unable to update password");

    // Clear cookies
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });

    updatedUser.password = undefined; // Exclude password from response

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Password changed successfully"),
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    // Fetch the current user
    const currentUser = await User.findById(userId).select("-password");
    if (!currentUser) throw new ApiError(404, "User not found");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                currentUser,
                "Current user fetched successfully",
            ),
        );
});

export {
    changeCurrentPassword,
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    verifyEmail,
};
