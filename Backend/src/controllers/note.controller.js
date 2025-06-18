import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProjectNote } from "../models/notes.models.js";
import { Project } from "../models/project.models.js";

const createNote = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { projectId } = req.params;

    // check if project is exists and user is part of the project
    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    const existingProject = await Project.findById(projectId).lean();

    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }

    const newNote = await ProjectNote.create({
        project: projectId,
        content,
        createdBy: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newNote, "Note created successfully"));
});

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    // check if project is exists and user is part of the project
    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    const existingProject = await Project.findById(projectId).lean();

    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }

    const notes = await ProjectNote.find({
        project: projectId,
    })
        .select("-__v")
        .populate("project", "name")
        .populate("createdBy", "name email avatar")
        .lean();

    if (!notes || notes.length === 0) {
        throw new ApiError(404, "No notes found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const note = await ProjectNote.findOne({
        _id: noteId,
        createdBy: req.user?._id,
    })
        .select("-__v")
        .populate("project", "name")
        .populate("createdBy", "name email")
        .lean();

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const updatedNote = await ProjectNote.findOneAndUpdate(
        { _id: noteId, createdBy: req.user?._id },
        { content },
        { new: true, runValidators: true },
    )
        .select("-__v")
        .populate("project", "name")
        .populate("createdBy", "name email")
        .lean();

    if (!updatedNote) {
        throw new ApiError(404, "Note not found or not authorized to update");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const deletedNote = await ProjectNote.findOneAndDelete({
        _id: noteId,
        createdBy: req.user?._id,
    });

    if (!deletedNote) {
        throw new ApiError(404, "Note not found or not authorized to delete");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Note deleted successfully"));
});

export { createNote, getNotes, getNoteById, updateNote, deleteNote };
