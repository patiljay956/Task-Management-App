import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";

import { CircleCheckBig, CircleX } from "lucide-react";

import { API_USER_ENDPOINTS } from "@/api/endpoints";
import PasswordResetForm from "@/components/forms/password-reset-form";

type ActionType = "verifyEmail" | "resetPassword";
type Status = "idle" | "loading" | "success" | "error";

interface Props {
    action: ActionType;
    successRedirect?: string;
    buttonText?: string;
}

function TokenAction({
    action,
    successRedirect = "/login",
    buttonText,
}: Props) {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

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
                <PasswordResetForm
                    setMessage={setMessage}
                    setStatus={setStatus}
                    token={token!}
                    successRedirect={successRedirect}
                    buttonText={buttonText}
                />
            )}
        </div>
    );
}

export default TokenAction;
