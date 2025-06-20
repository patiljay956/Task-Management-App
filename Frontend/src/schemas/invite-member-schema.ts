import { z } from "zod";

export const InviteMemberSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    role: z.enum(["project_admin", "project_manager", "member"]),
});
