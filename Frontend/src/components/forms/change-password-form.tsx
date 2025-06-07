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
import { replace, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { LoaderCircle } from "lucide-react";

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Old Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
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
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
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
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    className="w-fit"
                    type="submit"
                >
                    {form.formState.isSubmitting ? (
                        <LoaderCircle className="animate-spin" />
                    ) : null}
                    Update Password
                </Button>
            </form>
        </Form>
    );
}

// 🔧 Mock API call — replace this with real call to backend
async function fakeChangePassword(oldPass: string, newPass: string) {
    return new Promise((resolve) => setTimeout(resolve, 1000));
}
