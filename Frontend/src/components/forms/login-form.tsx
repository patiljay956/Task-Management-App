import type { LoginFormInputs } from "@/schemas/LoginForm.schema";
import { loginFormSchema } from "@/schemas/LoginForm.schema";
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
import { Link } from "react-router";

type Props = {};

function LoginForm({}: Props) {
    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    //submit handler
    function onSubmit(values: LoginFormInputs) {
        //todo
        console.log(values);
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
                                disabled={form.formState.isSubmitting}
                                className="w-full"
                            >
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
