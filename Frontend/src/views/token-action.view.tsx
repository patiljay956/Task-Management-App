import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheckBig, CircleX } from "lucide-react";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { API_USER_ENDPOINTS } from "@/api/endpoints";

type ActionType = "verifyEmail" | "resetPassword";
type Status = "idle" | "loading" | "success" | "error";

interface Props {
    action: ActionType;
    successRedirect?: string;
    buttonText?: string;
}

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function TokenAction({
    action,
    successRedirect = "/login",
    buttonText,
}: Props) {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    const form = useForm<ResetPasswordValues>({
        resolver:
            action === "resetPassword"
                ? zodResolver(resetPasswordSchema)
                : undefined,
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const handleVerifyEmail = async () => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing token.");
            return;
        }

        setStatus("loading");

        try {
            const res = await API_USER_ENDPOINTS.verifyEmail(token);
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
        <div className="flex flex-col items-center justify-center gap-4 py-10 w-full max-w-md mx-auto">
            {status === "loading" && <Loading />}
            {status === "success" && (
                <p className="text-green-600 flex items-center gap-2">
                    <CircleCheckBig className="h-5 w-5" />
                    {message}
                </p>
            )}
            {status === "error" && (
                <p className="text-red-600 flex items-center gap-2">
                    <CircleX className="h-5 w-5" />
                    {message}
                </p>
            )}

            {status === "idle" && action === "verifyEmail" && (
                <>
                    <p className="text-lg font-semibold">
                        Click below to verify your email
                    </p>
                    <Button
                        className="bg-green-600"
                        onClick={handleVerifyEmail}
                    >
                        {buttonText ?? "Verify Email"}
                    </Button>
                </>
            )}

            {status === "idle" && action === "resetPassword" && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 w-full"
                    >
                        <p className="text-lg font-semibold">
                            Enter your new password
                        </p>

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
            )}
        </div>
    );
}

export default TokenAction;
