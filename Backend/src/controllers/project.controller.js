import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtasks.models.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/fileUpload.cloudinary.js";

const getProjects = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized access, please login");

    // Find all project IDs where the user is a member
    const memberProjects = await ProjectMember.find({ user: userId })
        .select("project")
        .lean();
    const projectIds = memberProjects.map((pm) => pm.project);

    // Fetch only those projects
    const allProjects = await Project.aggregate([
        { $match: { _id: { $in: projectIds } } },
        {
            $lookup: {
                localField: "createdBy",
                from: "users",
                foreignField: "_id",
                as: "createdByUser",
            },
        },
        {
            $unwind: {
                path: "$createdByUser",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                createdByUser: {
                    _id: 1,
                    email: 1,
                    name: 1,
                    avatar: {
                        _id: 1,
                        url: 1,
                        publicId: 1,
                    },
                },
            },
        },
    ]);

    if (allProjects.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No projects found"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allProjects,
                "All projects fetched successfully",
            ),
        );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) throw new ApiError(400, "project id not provided ");

    const project = await Project.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
        {
            $lookup: {
                localField: "createdBy",
                from: "users",
                foreignField: "_id",
                as: "createdByUser",
            },
        },
        {
            $unwind: {
                path: "$createdByUser",
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                createdByUser: {
                    _id: 1,
                    email: 1,
                    name: 1,
                    avatar: {
                        _id: 1,
                        url: 1,
                        publicId: 1,
                    },
                },
            },
        },
    ]);

    if (!project)
        throw new ApiError(
            400,
            "project id is invalid or project is not available",
        );

    // Check if the user is a member of the project
    const userId = req.user?._id;

    if (!userId) throw new ApiError(401, "Unauthorized access, please login");

    const isMember = await ProjectMember.exists({
        user: userId,
        project: projectId,
    });

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this project");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "project fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { name, description } = req.body;

    if (!userId) throw new ApiError(401, "Unauthorized access, please login");

    const existingProject = await Project.findOne({
        name: name.trim(),
    }).lean();

    if (existingProject)
        throw new ApiError(409, "Project with this name already exists");

    const newProject = await Project.create({
        name,
        description,
        createdBy: userId,
    });

    if (!newProject) throw new ApiError(500, "Failed to create project");

    // create a default Project member

    const projectMember = await ProjectMember.create({
        user: userId,
        project: newProject._id,
        role: UserRolesEnum.ADMIN,
    });

    if (!projectMember)
        throw new ApiError(500, "Failed to create project member");

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                newProject,
                projectMember,
            },
            "Project is created successfully",
        ),
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    // Check if project ID is provided
    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    // Check if new name already exists , but for a different project
    const existProjectWithName = await Project.findOne({
        name: name.trim(),
        _id: { $ne: projectId }, // Exclude current project
    });

    if (existProjectWithName) {
        throw new ApiError(
            409,
            "Another project with this name already exists",
        );
    }

    // Find the project to update
    const existingProject = await Project.findById(projectId).populate({
        path: "createdBy",
        select: "name email avatar",
    });
    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }

    // Update fields
    existingProject.name = name.trim();
    existingProject.description = description.trim();

    // Save the updated project
    const updatedProject = await existingProject.save();
    if (!updatedProject) {
        throw new ApiError(500, "Failed to update project");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedProject,
                "Project updated successfully",
            ),
        );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user?._id;

    if (!projectId) throw new ApiError(400, "Project ID is required");
    if (!userId) throw new ApiError(401, "Unauthorized access, please login");

    // Check if the project exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) throw new ApiError(404, "Project not found");

    // Check if the user is a member of the project
    const isMember = await ProjectMember.exists({
        user: userId,
        project: projectId,
    });

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this project");
    }
    // Delete the project
    const deletedProject = await Project.findByIdAndDelete(projectId);

    // before deleting tasks get all attachments of all tasks delete all the task attachments from cloudinary
    const allTasks = await Task.find({ project: projectId });
    const allAttachments = allTasks.flatMap((task) => task.attachments);
    if (allAttachments.length > 0) {
        await deleteFromCloudinary(
            allAttachments.map((attachment) => attachment.public_id),
        );
    }

    // Delete all tasks and subtasks associated with the project
    const deletedTasks = await Task.deleteMany({ project: projectId });
    const deletedSubtasks = await SubTask.deleteMany({ project: projectId });

    // Delete all project members
    const deletedMembers = await ProjectMember.deleteMany({
        project: projectId,
    });

    // Optionally, you can send an acknowledgement or log the deletions here if needed

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                deletedProject,
                deletedTasks: deletedTasks.deletedCount,
                deletedSubtasks: deletedSubtasks.deletedCount,
                deletedMembers: deletedMembers.deletedCount,
            },
            "Project deleted successfully",
        ),
    );
});

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
