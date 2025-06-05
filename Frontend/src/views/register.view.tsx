import RegisterForm from "@/components/forms/register-form";

type Props = {};

export default function Register({}: Props) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 dark:bg-slate-900">
            <RegisterForm />
        </div>
    );
}
