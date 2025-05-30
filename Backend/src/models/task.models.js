import mongoose from "mongoose";
import {
    TaskStatusEnum,
    AvailableTaskStatuses,
    AvailableTaskPriority,
    TaskPriorityEnum,
} from "../utils/constants.js";
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: AvailableTaskStatuses,
            default: TaskStatusEnum.TODO,
        },
        priority: {
            type: String,
            enum: AvailableTaskPriority,
            default: TaskPriorityEnum.LOW,
        },

        attachments: {
            type: [
                {
                    url: String,
                    mimeType: String,
                    size: Number,
                    public_id: String,
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
