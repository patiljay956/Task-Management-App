import {
    forgotPasswordFormSchema,
    type ForgotPasswordFormInputs,
} from "@/schemas/ForgotPasswordForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    CardDescription,
    CardHeader,
    CardTitle,
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useRef, useState } from "react";

type Props = {};

// Define the initial delay in seconds before the resend button becomes active
const RESEND_DELAY_SECONDS = 59;

export default function ForgotPasswordForm({}: Props) {
    //state for timeLeft
    const [timeLeft, setTimeLeft] = useState<number>(RESEND_DELAY_SECONDS);

    //state for is resend disabled
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);

    //state for is sent
    const [isSent, setIsSent] = useState<boolean>(false);

    //state for message
    const [message, setMessage] = useState<string>("");

    //ref for timer
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    //creating a form
    const form = useForm<ForgotPasswordFormInputs>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    });

    //handle submit
    function onSubmit(values: ForgotPasswordFormInputs) {
        //todo
        console.log(values);
        setIsSent(true);
        setMessage(
            "A reset link has been sent to your email. Please check your inbox.",
        );
        startTimer();
    }

    //function to start the interval
    function startTimer() {
        setTimeLeft(RESEND_DELAY_SECONDS);
        setIsResendDisabled(true);
        let timeLeft: number = RESEND_DELAY_SECONDS;
        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
            timeLeft--;
            if (timeLeft === 0) {
                setIsResendDisabled(false);
                if (timerRef.current != null) {
                    clearInterval(timerRef.current);
                    setIsResendDisabled(false);
                    setMessage("");
                }
            }
        }, 1000);
    }

    return (
        <>
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email to recover your password
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="joe@doe.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isResendDisabled}
                                className="w-full"
                            >
                                {isSent ? "Resend" : "Send"} Reset Link{" "}
                                {timeLeft > 0 && `(${timeLeft}s)`}
                            </Button>
                        </form>
                    </Form>
                    {isSent && (
                        <p className="text-muted-foreground text-sm">
                            {message}
                        </p>
                    )}

                    <CardFooter>
                        <span className="text-center w-full">
                            {" "}
                            Go back to
                            <Link to="/login">
                                <Button
                                    className="underline hover:scale-105"
                                    variant={"link"}
                                >
                                    Login
                                </Button>
                            </Link>
                        </span>
                    </CardFooter>
                </CardContent>
            </Card>
        </>
    );
}
