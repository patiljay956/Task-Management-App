import type { LoginFormInputs } from "@/schemas/login-form.schema";
import { loginFormSchema } from "@/schemas/login-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { API_USER_ENDPOINTS } from "@/api/endpoints";
import { toast } from "sonner";
import { type LoginResponse } from "@/types/auth";
import axios from "axios";
import { LoaderCircle, LogIn, Mail, Lock } from "lucide-react";

type Props = {};

function LoginForm({}: Props) {
    const { setLocalTokens, setLocalUser } = useAuth();
    const [isLoginDisabled, setIsLoginDisabled] = useState<boolean>(false);

    const navigate = useNavigate();

    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    //submit handler
    async function onSubmit(values: LoginFormInputs) {
        setIsLoginDisabled(true);

        let response = undefined;

        try {
            response = await API_USER_ENDPOINTS.login({
                userNameOrEmail: values.identifier,
                password: values.password,
            });

            let data: LoginResponse = response?.data.data;

            setLocalTokens({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            });
            setLocalUser({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                username: data.user.username,
                avatar: data.user.avatar,
                role: data.user.role,
                isAuthenticated: true,
                createdAt: data.user.createdAt,
                updatedAt: data.user.updatedAt,
            });

            toast.success("Login Successful, Welcome " + data.user.name + "!");

            navigate("/app", { replace: false });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            } else {
                toast.error("Something went wrong, Please try again later.");
            }
        } finally {
            setIsLoginDisabled(false);
        }
    }
    return (
        <>
            <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-slate-800/80 border border-slate-700">
                            <LogIn className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>{" "}
                    <CardDescription className="text-slate-300">
                        Sign in to access your dashboard and projects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">
                                            Username or Email
                                        </FormLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <FormControl>
                                                <Input
                                                    placeholder='"joe" or "joe@example.com"'
                                                    className="pl-10 bg-slate-800/50 border-slate-700 focus-visible:ring-blue-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />{" "}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">
                                            Password
                                        </FormLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    className="pl-10 bg-slate-800/50 border-slate-700 focus-visible:ring-blue-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={
                                    form.formState.isSubmitting ||
                                    isLoginDisabled
                                }
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 mt-2"
                            >
                                {form.formState.isSubmitting ||
                                isLoginDisabled ? (
                                    <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <LogIn className="w-4 h-4 mr-2" />
                                )}
                                Sign In
                            </Button>
                        </form>
                    </Form>{" "}
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
                            Don't have an account?
                            <Link to="/register">
                                <Button
                                    className="underline font-semibold text-blue-400 hover:text-blue-300"
                                    variant={"link"}
                                >
                                    Sign up
                                </Button>
                            </Link>
                        </span>
                        <span className="text-sm text-slate-400">
                            <Link to="/forgot-password">
                                <Button
                                    className="underline text-slate-400 hover:text-slate-300"
                                    variant={"link"}
                                >
                                    Forgot your password?
                                </Button>
                            </Link>
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

export default LoginForm;
