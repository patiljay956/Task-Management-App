import LoginForm from "@/components/forms/login-form";

type Props = {};

function Login({}: Props) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 ">
            <LoginForm />
        </div>
    );
}

export default Login;
