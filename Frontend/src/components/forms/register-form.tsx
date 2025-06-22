import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerFormSchema } from "@/schemas/register-form.schema";
import type { RegisterFormInputs } from "@/schemas/register-form.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Link } from "react-router";
import { API_USER_ENDPOINTS } from "@/api/endpoints";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
    Info,
    LoaderCircle,
    UserPlus,
    Mail,
    Lock,
    User,
    AtSign,
} from "lucide-react";
import axios from "axios";

type Props = {};

const RESEND_EMAIL_INTERVAL = 59;

function RegisterForm({}: Props) {
    const [info, setInfo] = useState<string | null>(null);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
    const [timeLeft, setTimeLeft] = useState<number>(RESEND_EMAIL_INTERVAL);

    // Creating a form
    const form = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Effect to handle email resend timer
    useEffect(() => {
        if (info) {
            let timeLeft = RESEND_EMAIL_INTERVAL;
            timerRef.current = setInterval(() => {
                timeLeft--;
                setTimeLeft((prev) => prev - 1);
                if (timeLeft === 0) {
                    if (timerRef.current != null) {
                        setIsResendDisabled(false);
                        clearInterval(timerRef.current);
                        setTimeLeft(RESEND_EMAIL_INTERVAL);
                        return;
                    }
                }
            }, 1000);

            return () => {
                if (timerRef.current != null) {
                    clearInterval(timerRef.current);
                    setTimeLeft(RESEND_EMAIL_INTERVAL);
                }
            };
        }
    }, [info]);

    // Resend email handler
    async function resendEmail() {
        try {
            let timeLeft = RESEND_EMAIL_INTERVAL;
            setIsResendDisabled(true);
            toast.success(
                "Email verification link has been re-sent to your email.",
            );

            const response: AxiosResponse | undefined =
                await API_USER_ENDPOINTS.resendVerificationEmail({
                    email: form.getValues("email"),
                });

            if (response.data.statusCode === 200) {
                setInfo(
                    `Email verification link has been sent to your email ${form.getValues(
                        "email",
                    )}. Please check your inbox.`,
                );
            }

            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
                timeLeft--;
                if (timeLeft === 0) {
                    if (timerRef.current != null) {
                        clearInterval(timerRef.current);
                        setTimeLeft(RESEND_EMAIL_INTERVAL);
                    }
                    setIsResendDisabled(false);
                }
            }, 1000);
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong. Please try again later.");
        }
    }

    // Submit handler
    async function onSubmit(values: RegisterFormInputs) {
        try {
            const response: AxiosResponse | undefined =
                await API_USER_ENDPOINTS.register({
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    password: values.password,
                });

            if (response.data.statusCode === 201) {
                setInfo(
                    `Email verification link has been sent to your email ${values.email}. Please check your inbox.`,
                );
                toast.success(
                    "Registered Successfully! Please verify your email.",
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong. Please try again later.");
        }
    }

    return (
        <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 shadow-lg">
                        <UserPlus className="w-6 h-6 text-purple-400" />
                    </div>
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
                    Create Your Account
                </CardTitle>
                <CardDescription className="text-slate-300">
                    Sign up now to start managing your projects
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {info && (
                            <Alert
                                variant="default"
                                className="bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/50 text-blue-500"
                            >
                                <Info className="h-4 w-4" />
                                <AlertTitle className="font-medium">
                                    Verification Email Sent!
                                </AlertTitle>
                                <AlertDescription className="mt-2 text-sm">
                                    {info}
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            type="button"
                                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 border border-blue-500/30"
                                            onClick={resendEmail}
                                            disabled={isResendDisabled}
                                        >
                                            {isResendDisabled
                                                ? `Resend in ${timeLeft}s`
                                                : "Resend Email"}
                                        </Button>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Name field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                            <Input
                                                placeholder="Enter your full name"
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Username field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                            <Input
                                                placeholder="Choose a unique username"
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                            <Input
                                                placeholder="Enter your email address"
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Password field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                            <Input
                                                type="password"
                                                placeholder="Create a secure password"
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                            <Input
                                                type="password"
                                                placeholder="Confirm your password"
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded transition-colors duration-300"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-2">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-slate-900 px-2 text-slate-400">
                            or
                        </span>
                    </div>
                </div>
                <div className="flex flex-col space-y-2 text-center">
                    <span className="text-sm text-slate-300">
                        Already have an account?
                        <Link to={"/login"}>
                            <Button
                                className="ml-1 font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300"
                                variant={"link"}
                                type="button"
                            >
                                Sign in
                            </Button>
                        </Link>
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}

export default RegisterForm;
