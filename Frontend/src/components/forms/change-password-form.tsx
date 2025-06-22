import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API_USER_ENDPOINTS } from "@/api/endpoints";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";

type Props = {};

// Zod schema
const passwordSchema = z
    .object({
        oldPassword: z.string().min(6, "Old password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ChangePasswordForm({}: Props) {
    const navigate = useNavigate();
    const { resetAuthData } = useAuth();

    const form = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: PasswordForm) => {
        try {
            const response = await API_USER_ENDPOINTS.changePassword({
                newPassword: values.newPassword,
                password: values.oldPassword,
            });

            if (response.data.statusCode == 200) {
                toast.success("Password updated successfully!");
                form.reset();
                resetAuthData();
                navigate("/login", { replace: true });
                return;
            }
        } catch (err) {
            if (axios.isAxiosError(err))
                toast.error(err.response?.data?.message);
            else toast.error("Something went wrong. Please try again later.");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
            >
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-200">
                                Current Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Current password"
                                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-blue-400/30 focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-200">
                                New Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="New password"
                                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-blue-400/30 focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-200">
                                Confirm Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-blue-400/30 focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md transition-colors"
                    type="submit"
                >
                    {form.formState.isSubmitting
                        ? "Updating..."
                        : "Update Password"}
                </Button>
            </form>
        </Form>
    );
}
