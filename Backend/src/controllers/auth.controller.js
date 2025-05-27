import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { emailVerificationMailGenerator, sendMail } from "../utils/mail.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    console.log("Existing User from create user controller ", existingUser);

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
    const { unHashedToken } = user.generateTemporaryToken();

    // 3. Save user
    const savedUser = await user.save();
    if (!savedUser) throw new ApiError(500, "unable to save user");
    console.log(unHashedToken);

    // 4. sand email

    // Create verification URL (frontend route)
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${unHashedToken}`;
    const emailContent = emailVerificationMailGenerator(
        user.username,
        verificationUrl,
    );

    await sendMail({
        email: user.email,
        subject: "Verify your account - Project Management Tool",
        mailGenContent: emailContent,
    });

    // 5. send response
    savedUser.password = undefined;
    return res.status(201).json(
        new ApiResponse(201, {
            savedUser,
            unHashedToken,
            verificationUrl,
        }),
        "user registered Successfully",
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const logoutUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});
const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
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
