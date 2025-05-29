import { Router } from "express";

const router = Router();

import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "../controllers/project.controller.js";

import { hasProjectRole, verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { productValidator } from "../validators/index.js";
import { UserRolesEnum } from "../utils/constants.js";

router
    .route("/")
    .get(verifyToken, getProjects)
    .post(productValidator(), validate, verifyToken, createProject);

router
    .route("/:projectId")
    .get(verifyToken, getProjectById)
    .patch(
        productValidator(),
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        updateProject,
    )
    .delete(verifyToken, hasProjectRole([UserRolesEnum.ADMIN]), deleteProject);

// TODO: delete project testing pending

// project member controller

export default router;
