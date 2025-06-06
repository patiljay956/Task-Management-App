import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtasks.models.js";

const getProjects = asyncHandler(async (req, res) => {
    const allProjects = await Project.find({})
        .populate({
            path: "createdBy",
            select: "name email",
        })
        .select("-__v")
        .lean();

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
                "all projects fetched successfully",
            ),
        );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) throw new ApiError(400, "project id not provided ");

    const project = await Project.findById(projectId);

    if (!project)
        throw new ApiError(
            400,
            "project id is invalid or project is not available",
        );

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
    const existingProject = await Project.findById(projectId);
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

// TODO: pending for project member, task, and subtask deletion
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Check if the project exists
    const existingProject = await Project.findById(projectId);

    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }
    // Check if the user is the creator of the project done in middleware

    // delete the project
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
        throw new ApiError(500, "Failed to delete project");
    }
    // delete all project members associated with this Project
    await ProjectMember.deleteMany({ project: projectId });

    // delete all tasks associated with this project

    await Task.deleteMany({ project: projectId });

    // delete  subtasks associated with this project
    await SubTask.deleteMany({ project: projectId });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedProject,
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
