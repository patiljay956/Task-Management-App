import { z } from "zod";

export const taskFormSchema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().min(5, "Description is too short"),
    status: z.enum(["todo", "in_progress", "done"]),
    priority: z.enum(["high", "medium", "low"]),
    assignedTo: z.string().optional(),
    files: z
        .any()
        .transform((val) => (val instanceof FileList ? Array.from(val) : []))
        .optional()
        .refine((files = []) => files.length <= 5, {
            message: "You can upload up to 5 files only.",
        }),
});
