import { Router } from "express";
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/note.controller.js";
import { hasProjectRole, verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    noteValidator,
    projectIdValidator,
    noteIdValidator,
} from "../validators/index.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyToken); // Apply token verification middleware to all routes

// Routes for notes
router
    .route("/:projectId")
    .get(
        projectIdValidator(),
        validate,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        getNotes, // Fetch all notes for a project
    )
    .post(
        [projectIdValidator(), noteValidator()],
        validate,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        createNote, // Create a new note for a project
    );

router
    .route("/:projectId/:noteId")
    .get(
        [projectIdValidator(), noteIdValidator()],
        validate,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        getNoteById,
    )
    .patch(
        [projectIdValidator(), noteIdValidator(), noteValidator()],
        validate,
        hasProjectRole([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_MANAGER,
            UserRolesEnum.MEMBER,
        ]),
        updateNote,
    )
    .delete(
        noteIdValidator(),
        hasProjectRole([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_MANAGER]),
        validate,
        deleteNote,
    );

export default router;
