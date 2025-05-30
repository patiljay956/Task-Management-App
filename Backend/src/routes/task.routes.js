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
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();
// router.use(); // Apply token verification middleware to all routes

// INFO: Routes for subtasks

router
    .route("/:taskId")
    .get(
        taskIdValidator(),
        validate,
        verifyToken,
        getSubtasksByTaskId, // Fetch all subtasks for a task
    )
    .post(
        [taskIdValidator(), subtaskValidator()],
        validate,
        verifyToken,
        createSubtask, // Create a new subtask for a task
    );

router
    .route("/:taskId/:subtaskId")
    .patch(
        [taskIdValidator(), subtaskIdValidator()],
        validate,
        updateSubtask, // Update a specific subtask by ID
    )
    .delete(
        [taskIdValidator(), subtaskIdValidator()],
        validate,
        deleteSubtask, // Delete a specific subtask by ID
    );

export default router;
