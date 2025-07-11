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
    emailValidator,
    projectIdValidator,
    projectValidator,
    roleValidator,
    taskIdValidator,
    taskStatusAndPriorityValidator,
    taskValidator,
} from "../validators/index.js";
import { UserRolesEnum, AvailableUserRoles } from "../utils/constants.js";
import {
    addMemberByEmail,
    addMemberToProject,
    getProjectMembers,
    removeMemberFromProject,
    updateMemberRole,
} from "../controllers/projectMember.controller.js";
import {
    createTask,
    deleteTask,
    deleteTaskAttachment,
    getTaskById,
    getTasksOfProject,
    getUserAssignedTasks,
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
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_MANAGER]),
        updateProject,
    )
    .delete(verifyToken, hasProjectRole([UserRolesEnum.ADMIN]), deleteProject);


// project member controllers

router
    .route("/:projectId/member")
    .get(
        projectIdValidator(),
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        getProjectMembers,
    )
    .post(
        [projectIdValidator(), roleValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_MANAGER]), // only allow admin/manager to add the  member
        addMemberToProject,
    )
    .patch(
        [projectIdValidator(), roleValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN]),
        updateMemberRole,
    );

router
    .route("/:projectId/member/:memberId")
    .delete(
        [projectIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN]),
        removeMemberFromProject,
    );

// add member by email
router
    .route("/:projectId/member/email")
    .post(
        [projectIdValidator(), roleValidator(), emailValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_MANAGER]),
        addMemberByEmail,
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
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        getTasksOfProject,
    )
    .post(
        upload.fields([{ name: "attachments", maxCount: 5 }]),
        [projectIdValidator(), taskValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_MANAGER]),
        createTask,
    );

router.route("/tasks/user-tasks").get(
    verifyToken,
    getUserAssignedTasks, // Assuming this function can handle user-specific tasks
);

router
    .route("/:projectId/tasks/:taskId")
    .get(
        [projectIdValidator(), taskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
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
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        updateTask,
    )
    .delete(
        [projectIdValidator(), taskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN]),
        deleteTask,
    );

router.patch(
    "/:projectId/tasks/:taskId/status-or-priority",
    [projectIdValidator(), taskIdValidator(), taskStatusAndPriorityValidator()],
    validate,
    verifyToken,
    hasProjectRole([
        UserRolesEnum.ADMIN,
        UserRolesEnum.PROJECT_MANAGER,
        UserRolesEnum.MEMBER,
    ]),
    updateTaskStatusOrPriority,
);

router
    .route("/:projectId/tasks/:taskId/attachments")
    .patch(
        upload.fields([{ name: "attachments" }]),
        [projectIdValidator(), taskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_MANAGER]),
        updateTaskAttachments,
    );

router
    .route("/:projectId/tasks/:taskId/attachments/:attachmentId")
    .delete(
        [projectIdValidator(), taskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        deleteTaskAttachment,
    );

export default router;
