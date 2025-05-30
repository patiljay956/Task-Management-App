import { SubTask } from "../models/subtasks.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.models.js";

const createSubtask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) throw new ApiError(400, "Task ID is required");

    // Check if task exists
    const existingTask = await Task.findById(taskId).lean();
    if (!existingTask) throw new ApiError(404, "Task not found");

    // Create subtask
    const subtask = new SubTask({
        ...req.body,
        task: taskId,
        createdBy: req.user?._id,
    });
    await subtask.save();

    return res
        .status(201)
        .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

const getSubtasksByTaskId = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) throw new ApiError(400, "Task ID is required");

    // Check if task exists
    const existingTask = await Task.findById(taskId).lean();
    if (!existingTask) throw new ApiError(404, "Task not found");

    // Fetch subtasks for the task
    const subtasks = await SubTask.find({ task: taskId })
        .populate("task", "title")
        .lean();

    if (!subtasks || subtasks.length === 0) {
        throw new ApiError(404, "No subtasks found for this task");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subtasks, "Subtasks fetched successfully"));
});

const updateSubtask = asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    if (!subtaskId) throw new ApiError(400, "Subtask ID is required");

    // Check if subtask exists
    const existingSubtask = await SubTask.findById(subtaskId).lean();
    if (!existingSubtask) throw new ApiError(404, "Subtask not found");

    // Update subtask
    const updatedSubtask = await SubTask.findByIdAndUpdate(
        subtaskId,
        { ...req.body },
        { new: true },
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedSubtask,
                "Subtask updated successfully",
            ),
        );
});

const deleteSubtask = asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    if (!subtaskId) throw new ApiError(400, "Subtask ID is required");

    // Check if subtask exists
    const existingSubtask = await SubTask.findById(subtaskId).lean();
    if (!existingSubtask) throw new ApiError(404, "Subtask not found");

    await SubTask.findByIdAndDelete(subtaskId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existingSubtask,
                "Subtask deleted successfully",
            ),
        );
});
export { createSubtask, getSubtasksByTaskId, updateSubtask, deleteSubtask };
