import { Router } from "express";
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/note.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    noteValidator,
    projectIdValidator,
    noteIdValidator,
} from "../validators/index.js";

const router = Router();
router.use(verifyToken); // Apply token verification middleware to all routes

// Routes for notes
router
    .route("/:projectId")
    .get(
        projectIdValidator(),
        validate,
        getNotes, // Fetch all notes for a project
    )
    .post(
        [projectIdValidator(), noteValidator()],
        validate,
        createNote, // Create a new note for a project
    );

router
    .route("/:projectId/:noteId")
    .get(noteIdValidator(), validate, getNoteById)
    .patch(noteIdValidator(), validate, updateNote)
    .delete(noteIdValidator(), validate, deleteNote);

export default router;
