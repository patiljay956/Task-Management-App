import { Router } from "express";
import {
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    verifyEmail,
    changeCurrentPassword,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    passwordValidator,
    emailValidator,
    userLoginValidator,
    userRegistrationValidator,
    changePasswordValidator,
} from "../validators/index.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
import userDetailsRoutes from "./user.routes.js";

router.use("/user-details", userDetailsRoutes);

router
    .route("/register")
    .post(userRegistrationValidator(), validate, registerUser);

router.route("/verify-email").get(verifyEmail);
router
    .route("/resend-verification-email")
    .post(emailValidator(), validate, resendEmailVerification);

router.route("/login").post(userLoginValidator(), validate, loginUser);

router.route("/logout").get(verifyToken, logoutUser);
router
    .route("/forgot-password-request")
    .post(emailValidator(), validate, forgotPasswordRequest);

router
    .route("/reset-password")
    .post(passwordValidator(), validate, resetForgottenPassword);

router.route("/refresh-access-token").post(refreshAccessToken);

router.route("/current-user").get(verifyToken, getCurrentUser);

router
    .route("/change-password")
    .patch(
        changePasswordValidator(),
        validate,
        verifyToken,
        changeCurrentPassword,
    );

export default router;
