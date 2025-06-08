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
import { LoaderCircle } from "lucide-react";

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
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        Login Your Account
                    </CardTitle>
                    <CardDescription>
                        Login Into Your Account Using Your Credentials To Get
                        Started.
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
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='"Joe Doe" or "joe@doe.com"'
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
                            <Button
                                type="submit"
                                disabled={
                                    form.formState.isSubmitting ||
                                    isLoginDisabled
                                }
                                className="w-full"
                            >
                                {form.formState.isSubmitting && (
                                    <LoaderCircle className="animate-spin" />
                                )}
                                Login
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex-col gap-1">
                    <span className="text-center ">
                        Already have an account?
                        <Link to="/register">
                            <Button
                                className="underline hover:scale-105"
                                variant={"link"}
                            >
                                register
                            </Button>
                        </Link>
                    </span>
                    <span className="text-center ">
                        <Link to="/forgot-password">
                            <Button
                                className="underline hover:scale-105"
                                variant={"link"}
                            >
                                forgot password?
                            </Button>
                        </Link>
                    </span>
                </CardFooter>
            </Card>
        </>
    );
}

export default LoginForm;
