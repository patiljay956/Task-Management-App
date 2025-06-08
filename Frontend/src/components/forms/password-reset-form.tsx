import React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/schemas/reset-password-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { API_USER_ENDPOINTS } from "@/api/endpoints";
import { useNavigate } from "react-router";
import axios from "axios";

type Props = {
    token: string;
    successRedirect: string;
    setStatus: React.Dispatch<
        React.SetStateAction<"idle" | "loading" | "success" | "error">
    >;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    buttonText?: string;
};

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function PasswordResetForm({
    token,
    successRedirect,
    setStatus,
    setMessage,
    buttonText,
}: Props) {
    const navigate = useNavigate();

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordValues) => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing token.");
            return;
        }

        setStatus("loading");

        try {
            const res = await API_USER_ENDPOINTS.forgotPasswordReset({
                token,
                password: data.password,
            });
            if (res?.data?.statusCode === 200) {
                setStatus("success");
                setMessage(res.data.message);
                setTimeout(
                    () => navigate(successRedirect, { replace: true }),
                    2000,
                );
            } else {
                throw new Error("Unexpected response");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(
                    error.response?.data?.message ?? "Something went wrong.",
                );
            } else {
                setMessage("Unexpected error. Try again.");
            }
            setStatus("error");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
            >
                <p className="text-lg font-semibold">Enter your new password</p>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="New password"
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
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full bg-green-600" type="submit">
                    {buttonText ?? "Reset Password"}
                </Button>
            </form>
        </Form>
    );
}
