import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { UserRolesEnum } from "../utils/constants.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/fileUpload.cloudinary.js";
import { ProjectMember } from "../models/projectmember.models.js";

const getTasksOfProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    // 1. Validate project ID
    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    // 2. Check if the project exists
    const existingProject = await Project.findById(projectId).lean();
    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }

    // 3. Fetch all tasks for the project
    const allTasksOfProject = await Task.find({ project: projectId })
        .select("-__v")
        .populate("project", "_id name") // Populate project basic info
        .populate({
            path: "assignedTo", // ProjectMember reference
            populate: {
                path: "user", // Actual User inside ProjectMember
                select: "_id name email username avatar",
            },
        })
        .populate({
            path: "assignedBy", // ProjectMember reference
            populate: {
                path: "user", // Actual User inside ProjectMember
                select: "_id name email username avatar",
            },
        });

    // 4. Handle no tasks
    if (!allTasksOfProject || allTasksOfProject.length === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, [], "No tasks found for this project"));
    }

    // 5. Success response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allTasksOfProject,
                "Tasks fetched successfully",
            ),
        );
});

const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) throw new ApiError(400, "Project id is required");

    // Check if project exists
    const existingProject = await Project.findById(projectId).lean();
    if (!existingProject) throw new ApiError(404, "Project not found");

    // check if user is a project member
    const existingProjectMember = await ProjectMember.findOne({
        user: req.user.id,
        project: projectId,
    });

    if (!existingProjectMember) {
        throw new ApiError(403, "User is not a project member");
    }

    const { title, description, assignedTo, status, priority } = req.body;

    // check if title is already exists in the project
    const isTitleExists = await Task.findOne({
        title,
        project: projectId,
    });
    if (isTitleExists)
        throw new ApiError(409, "Task title already exists in the project");

    // Create task (without attachments)
    const newTask = await Task.create({
        title,
        description,
        project: projectId,
        assignedTo,
        assignedBy: existingProjectMember._id, // Use ProjectMember ID
        status: status || "TODO", // Default to TODO if not provided
        priority: priority || "LOW", // Default to LOW if not provided
        attachments: [], // Empty by default
    });

    if (!newTask) throw new ApiError(500, "Failed to create task");

    return res
        .status(201)
        .json(new ApiResponse(201, newTask, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params; // TODO:add validation middleware
    if (!taskId) throw new ApiError(400, "Task id is required");

    // Check if task exists
    const existingTask = await Task.findById(taskId)
        .select("-__v")
        .populate("project", "_id name")
        .populate({
            path: "assignedTo",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        })
        .populate({
            path: "assignedBy",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        });

    if (!existingTask) throw new ApiError(404, "Task not found");

    return res
        .status(200)
        .json(new ApiResponse(200, existingTask, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) throw new ApiError(400, "Task id is required");

    // Check if task exists
    const existingTask = await Task.findById(taskId).lean();
    if (!existingTask) throw new ApiError(404, "Task not found");

    const { title, description, assignedTo, status, priority } = req.body;

    // Update task (no attachments)
    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            title,
            description,
            assignedTo,
            status,
            priority,
        },
        { new: true },
    )
        .select("-__v")
        .populate("project", "_id name")
        .populate({
            path: "assignedTo",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        })
        .populate({
            path: "assignedBy",
            populate: {
                path: "user",
                select: "_id name email username avatar",
            },
        });

    if (!updatedTask) throw new ApiError(500, "Failed to update task");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) throw new ApiError(400, "Task id is required");

    // Check if task exists
    const existingTask = await Task.findById(taskId).lean();
    if (!existingTask) throw new ApiError(404, "Task not found");

    // Delete task
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) throw new ApiError(500, "Failed to delete task");

    // delete all attachments from cloudinary use deleteFromCloudinary()

    if (existingTask.attachments && existingTask.attachments.length > 0) {
        for (const attachment of existingTask.attachments) {
            await deleteFromCloudinary(attachment.public_id, "tasks", "delete");
        }
    }

    // delete all subtasks associated with this task

    const deletedSubtasks = await SubTask.deleteMany({ task: taskId });
    if (!deletedSubtasks) {
        throw new ApiError(
            500,
            "Failed to delete subtasks associated with this task",
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedTask,
                "Task and associated subtasks deleted successfully",
            ),
        );
});

const updateTaskStatusOrPriority = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) throw new ApiError(400, "Task id is required");

    // check if task is available
    const existingTask = await Task.findById(taskId).lean();
    if (!existingTask) throw new ApiError(404, "Task not found");

    // get task data from request body
    const { status, priority } = req.body;
    // one of the status or priority must be provided
    if (!status && !priority) {
        throw new ApiError(400, "Either status or priority must be provided");
    }

    // update task status or priority
    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            ...(status && { status }), // update status if provided
            ...(priority && { priority }), // update priority if provided
        },
        { new: true },
    );
    if (!updatedTask) throw new ApiError(500, "Failed to update task");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const updateTaskAttachments = asyncHandler(async (req, res) => {
    if (!req.files || !req.files.attachments) {
        throw new ApiError(400, "No attachments provided");
    }

    const uploadedAttachments = [];
    for (const file of req.files.attachments) {
        const uploaded = await uploadOnCloudinary(file.path, "tasks");
        if (uploaded) {
            uploadedAttachments.push({
                url: uploaded.secure_url,
                mimeType: file.mimetype,
                size: file.size,
                public_id: uploaded.public_id,
            });
        }
    }

    if (uploadedAttachments.length !== req.files.attachments.length) {
        throw new ApiError(500, "Failed to upload all attachments");
    }

    // if taskId is provided, update the task with the uploaded attachments
    if (req.params.taskId) {
        const { taskId } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $push: { attachments: { $each: uploadedAttachments } } },
            { new: true },
        );
        if (!updatedTask) {
            throw new ApiError(500, "Failed to update task with attachments");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedTask,
                    "Attachments uploaded and task updated successfully",
                ),
            );
    }
    // if taskId is not provided, just return the uploaded attachments

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                uploadedAttachments,
                "Attachments uploaded successfully",
            ),
        );
});

const assignTaskToProjectMember = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
});
export {
    getTasksOfProject,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatusOrPriority,
    updateTaskAttachments,
};
