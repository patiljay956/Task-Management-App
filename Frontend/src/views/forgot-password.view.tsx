import ForgotPasswordForm from "@/components/forms/forgot-password-form";

type Props = {};

function ForgotPassword({}: Props) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <ForgotPasswordForm />
        </div>
    );
}

export default ForgotPassword;
