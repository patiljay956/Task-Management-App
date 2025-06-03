import { Router } from "express";

import {
    getUserById,
    updateUserAvatar,
    updateUserDetails,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validator.middleware.js";
import {
    userIdValidator,
    nameAndUsernameValidator,
} from "../validators/index.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route("/update-avatar")
    .patch(verifyToken, upload.single("avatar"), updateUserAvatar);

//get user by id
router
    .route("/:userId")
    .get(userIdValidator(), validate, getUserById)
    .patch(
        [userIdValidator(), nameAndUsernameValidator()],
        verifyToken,
        validate,
        updateUserDetails,
    );

export default router;
