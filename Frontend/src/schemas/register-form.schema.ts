import { z } from "zod";

const passwordCriteriaRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    symbol: /[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]/, // Ensure '-' is correctly handled
};

export const registerFormSchema = z
    .object({
        username: z
            .string()
            .nonempty("Username is required.") // Use specific messages
            .min(3, "Username must be at least 3 characters.")
            .max(50, "Username cannot exceed 50 characters.")
            .trim(), // Good for cleaning up leading/trailing spaces

        name: z
            .string()
            .nonempty("Name is required.")
            .min(3, "Name must be at least 3 characters.")
            .max(50, "Name cannot exceed 50 characters.")
            .trim(),

        email: z
            .string()
            .nonempty("Email is required.")
            .email("Invalid email address.") // Zod's email validation is comprehensive
            .trim(),

        password: z
            .string()
            .nonempty("Password is required.")
            .min(8, "Password must be at least 8 characters.")
            .trim() // Trim before regex to prevent validation issues with spaces
            .refine((val) => passwordCriteriaRegex.lowercase.test(val), {
                message: "Password must contain at least one lowercase letter.",
            })
            .refine((val) => passwordCriteriaRegex.uppercase.test(val), {
                message: "Password must contain at least one uppercase letter.",
            })
            .refine((val) => passwordCriteriaRegex.number.test(val), {
                message: "Password must contain at least one number.",
            })
            .refine((val) => passwordCriteriaRegex.symbol.test(val), {
                message:
                    "Password must contain at least one special character (!@#$%...).",
            }),

        confirmPassword: z
            .string()
            .nonempty("Confirm password is required.")
            .trim(), // Trim before comparison
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], // This ensures the error is linked to the confirmPassword field
    });

// Define the inferred type for convenience
export type RegisterFormInputs = z.infer<typeof registerFormSchema>;
