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
    taskIdValidator,
    taskStatusAndPriorityValidator,
    taskValidator,
} from "../validators/index.js";
import { UserRolesEnum, AvailableUserRoles } from "../utils/constants.js";
import {
    addMemberToProject,
    getProjectMembers,
    removeMemberFromProject,
    updateMemberRole,
} from "../controllers/projectMember.controller.js";
import {
    createTask,
    deleteTask,
    getTaskById,
    getTasksOfProject,
    updateTask,
    updateTaskAttachments,
    updateTaskStatusOrPriority,
} from "../controllers/task.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

// task routes

router
    .route("/:projectId/tasks")
    .get(
        projectIdValidator(),
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
            UserRolesEnum.MEMBER,
        ]),
        getTasksOfProject,
    )
    .post(
        upload.fields([{ name: "attachments", maxCount: 5 }]),
        [projectIdValidator(), taskValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        createTask,
    );

router
    .route("/:projectId/tasks/:taskId")
    .get(
        [projectIdValidator(), taskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
            UserRolesEnum.MEMBER,
        ]),
        getTaskById,
    )
    .patch(
        upload.fields([{ name: "attachments", maxCount: 5 }]),
        [
            projectIdValidator(),
            taskIdValidator(),
            taskStatusAndPriorityValidator(),
        ],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        updateTask,
    )
    .delete(
        [projectIdValidator(), taskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        deleteTask,
    );

router.patch(
    "/:projectId/tasks/:taskId/status-or-priority",
    [projectIdValidator(), taskIdValidator(), taskStatusAndPriorityValidator()],
    validate,
    verifyToken,
    hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    updateTaskStatusOrPriority,
);

router.patch(
    "/:projectId/tasks/:taskId/attachments",
    upload.fields([{ name: "attachments" }]),
    [projectIdValidator(), taskIdValidator()],
    validate,
    verifyToken,
    hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    updateTaskAttachments,
);

export default router;
