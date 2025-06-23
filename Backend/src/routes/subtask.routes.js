import { Router } from "express";
import {
    createSubtask,
    getSubtasksByTaskId,
    updateSubtask,
    deleteSubtask,
} from "../controllers/subtask.controller.js";
import { verifyToken, hasProjectRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    taskIdValidator,
    subtaskIdValidator,
    subtaskValidator,
} from "../validators/index.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const router = Router();
// router.use(); // Apply token verification middleware to all routes

router
    .route("/p/:projectId/t/:taskId")
    .get(
        taskIdValidator(),
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        getSubtasksByTaskId, // Fetch all subtasks for a task
    )
    .post(
        [taskIdValidator(), subtaskValidator()],
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        createSubtask, // Create a new subtask for a task
    );

router
    .route("/p/:projectId/t/:taskId/st/:subtaskId")
    .patch(
        [taskIdValidator(), subtaskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        updateSubtask, // Update a specific subtask by ID
    )
    .delete(
        [taskIdValidator(), subtaskIdValidator()],
        validate,
        verifyToken,
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.MANAGER]),
        deleteSubtask, // Delete a specific subtask by ID
    );

export default router;
