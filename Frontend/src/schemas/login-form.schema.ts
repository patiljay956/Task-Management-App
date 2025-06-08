// schemas/loginSchema.ts
import { z } from "zod";

// Regex for password criteria (reusing from your register schema)
const passwordCriteriaRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    symbol: /[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]/,
};

export const loginFormSchema = z.object({
    // Field for either email or username, with clear validation
    identifier: z
        .string()
        .nonempty("Email or Username is required.")
        .min(3, "Email or Username must be at least 3 characters long.")
        .trim()
        .superRefine((val, ctx) => {
            // Basic check for email format, if it contains '@' and '.'
            const mightBeEmail = val.includes("@") && val.includes(".");

            if (mightBeEmail) {
                // Attempt to validate as an email if it looks like one
                const emailValidation = z.string().email().safeParse(val);
                if (!emailValidation.success) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Invalid email address.",
                        path: ["identifier"],
                    });
                }
            }
            // If it doesn't look like an email, or if email validation passed,
            // we can assume it's a valid username if it passed the min(3) check.
            // No further specific username validation needed here beyond the min length
            // unless you have unique character rules for usernames during login.
        }),

    // Password field with the same strong rules as registration (for consistency)
    password: z
        .string()
        .nonempty("Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .trim()
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
});

// Infer the TypeScript type for convenience
export type LoginFormInputs = z.infer<typeof loginFormSchema>;
