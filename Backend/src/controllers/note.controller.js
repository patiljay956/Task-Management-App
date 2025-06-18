import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProjectNote } from "../models/notes.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";

const createNote = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { projectId } = req.params;

    // check if project is exists and user is part of the project
    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    const existingProject = await Project.findById(projectId).lean();

    // get the member id of the user in the project
    const existingMember = await ProjectMember.findOne({
        project: projectId,
        user: req.user?._id,
    });

    if (!existingMember) {
        throw new ApiError(403, "You are not a member of this project");
    }

    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }

    const newNote = await ProjectNote.create({
        project: projectId,
        content,
        createdBy: existingMember._id,
    });

    if (!newNote) {
        throw new ApiError(500, "Failed to create note");
    }

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
        .populate({
            path: "createdBy",
            select: "user",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        })
        .lean();

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    // get the member id of the user in the project
    const existingMember = await ProjectMember.findOne({
        user: req.user?._id,
    });

    if (!existingMember) {
        throw new ApiError(403, "You are not authorized to view this note");
    }

    const note = await ProjectNote.findOne({
        _id: noteId,
    })
        .select("-__v")
        .populate("project", "name")
        .populate({
            path: "createdBy",
            select: "user",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        })
        .lean();

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId, memberId } = req.params;
    const { content } = req.body;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const existingMember = await ProjectMember.findOne({
        _id: memberId,
        user: req.user?._id,
    });

    if (!existingMember) {
        throw new ApiError(403, "You are not authorized to update this note");
    }

    const updatedNote = await ProjectNote.findOneAndUpdate(
        { _id: noteId, createdBy: existingMember._id },
        { content },
        { new: true, runValidators: true },
    )
        .select("-__v")
        .populate("project", "name")
        .populate({
            path: "createdBy",
            select: "user",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        })
        .lean();

    if (!updatedNote) {
        throw new ApiError(404, "Note not found or not authorized to update");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId, memberId } = req.params;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const deletedNote = await ProjectNote.findOneAndDelete({
        _id: noteId,
        createdBy: memberId,
    });
    
    if (!deletedNote) {
        throw new ApiError(404, "Note not found or not authorized to delete");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Note deleted successfully"));
});

const getNotesOfMember = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // get all member ids of the user in all projects
    const projectMembers = await ProjectMember.find({ user: userId })
        .select("_id project")
        .lean();

    if (projectMembers?.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No projects found for this user"));
    }

    // get all member ids
    const projectMemberIds = projectMembers.map((member) => member._id);

    // get all notes of the user in all projects
    const notes = await ProjectNote.find({
        createdBy: { $in: projectMemberIds },
    })
        .select("-__v")
        .populate("project", "name description ")
        .populate({
            path: "createdBy",
            select: "user",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        })
        .lean();

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

export {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getNotesOfMember,
};
