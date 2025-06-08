import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required.") // Ensure the field is not empty
        .email("Invalid email address.") // Validate for a proper email format
        .trim(), // Remove leading/trailing whitespace
});

// Infer the TypeScript type for convenience
export type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordFormSchema>;
