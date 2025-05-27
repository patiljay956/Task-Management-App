import mongoose from "mongoose";
import { TaskStatusEnum, AvailableTaskStatuses } from "../utils/constants.js";
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
            enum: [AvailableTaskStatuses],
            default: TaskStatusEnum.TODO,
        },

        attachments: {
            type: [
                {
                    url: String,
                    mimeType: String,
                    size: Number,
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
