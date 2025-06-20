import { z } from "zod";

export const AddNoteFormSchema = z.object({
    content: z.string().min(1, "Note content is required"),
});
