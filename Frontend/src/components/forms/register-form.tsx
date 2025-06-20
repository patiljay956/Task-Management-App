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
import { Info, LoaderCircle } from "lucide-react";
import axios from "axios";

type Props = {};

const RESEND_EMAIL_INTERVAL = 59;

function SignupForm({}: Props) {
    const [info, setInfo] = useState<string | null>(null);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
    const [timeLeft, setTimeLeft] = useState<number>(RESEND_EMAIL_INTERVAL);

    //creating a form
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

    // Effect to close the Alert after 5 seconds
    useEffect(() => {
        if (info) {
            let timeLeft = RESEND_EMAIL_INTERVAL;
            timerRef.current = setInterval(() => {
                timeLeft--;
                setTimeLeft((prev) => prev - 1);
                if (timeLeft === 0) {
                    if (timerRef.current != null) {
                        setIsResendDisabled(false);
                        console.log("here");
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

    //resend email handler
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

    //submit handler
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
                    "Registered Successfully Please verify your email.",
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong. Please try again later.");
        }
    }

    return (
        <>
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        Register Your Account
                    </CardTitle>
                    <CardDescription>
                        Register Yourself To Get Started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {info && (
                                <Alert
                                    variant="default"
                                    className="bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500 text-blue-500 "
                                >
                                    <Info />
                                    <AlertTitle>
                                        Verification Email Sent !!
                                    </AlertTitle>
                                    <AlertDescription>
                                        {info}
                                        <Button
                                            className=""
                                            variant={"outline"}
                                            onClick={() => resendEmail()}
                                            disabled={isResendDisabled}
                                        >
                                            {isResendDisabled
                                                ? `Resend in ${timeLeft} seconds`
                                                : "Resend"}
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            )}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your unique username"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your full name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
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
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="w-full"
                            >
                                {form.formState.isSubmitting && (
                                    <LoaderCircle className="animate-spin" />
                                )}
                                Register
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex-col gap-1">
                    <span className="text-center">
                        Or, if you already have an account{""}
                        <Link to={"/login"}>
                            <Button
                                className="underline hover:scale-105"
                                variant={"link"}
                            >
                                Login
                            </Button>
                        </Link>
                    </span>
                </CardFooter>
            </Card>
        </>
    );
}

export default SignupForm;
