import { Router } from "express";

const router = Router();
import {
    getUserById,
    updateUserDetails,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validator.middleware.js";
import {
    userIdValidator,
    nameAndUsernameValidator,
} from "../validators/index.js";

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
