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
import {
    projectIdValidator,
    projectValidator,
    roleValidator,
} from "../validators/index.js";
import { UserRolesEnum, AvailableUserRoles } from "../utils/constants.js";
import {
    addMemberToProject,
    getProjectMembers,
    removeMemberFromProject,
    updateMemberRole,
} from "../controllers/projectMember.controller.js";

router
    .route("/")
    .get(verifyToken, getProjects)
    .post(projectValidator(), validate, verifyToken, createProject);

router
    .route("/:projectId")
    .get(verifyToken, getProjectById)
    .patch(
        projectValidator(),
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        updateProject,
    )
    .delete(verifyToken, hasProjectRole([UserRolesEnum.ADMIN]), deleteProject);

// TODO: delete project testing pending

// project member controllers

router
    .route("/:projectId/member")
    .get(
        projectIdValidator(),
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
            UserRolesEnum.MEMBER,
        ]),
        getProjectMembers,
    )
    .post(
        [projectIdValidator(), roleValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), // only allow admin/manager to add
        addMemberToProject, // controller function
    )
    .delete(
        projectIdValidator(),
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN]),
        removeMemberFromProject,
    )
    .patch(
        [projectIdValidator(), roleValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN]),
        updateMemberRole,
    );

export default router;
