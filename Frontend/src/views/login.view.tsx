import LoginForm from "@/components/forms/login-form";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type Props = {};

function Login({}: Props) {
    return (
        <div className="min-h-svh w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <div className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                TaskFlow
                            </span>
                        </div>
                    </Link>
                    <Link to="/">
                        <Button
                            variant="ghost"
                            className="text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </header>
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
                {/* Left side with illustration and text */}
                <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-10">
                    <div className="max-w-md">
                        <div className="w-32 h-32 mb-6 mx-auto animate-pulse">
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Zap className="w-16 h-16 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            Welcome Back!
                        </h1>
                        <p className="text-slate-300 text-center mb-6">
                            Log in to your TaskFlow account to continue managing
                            your projects, tasks, and team collaboration all in
                            one place.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                <p className="text-2xl font-bold text-blue-400">
                                    10K+
                                </p>
                                <p className="text-xs text-slate-400">
                                    Active Users
                                </p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                <p className="text-2xl font-bold text-purple-400">
                                    50K+
                                </p>
                                <p className="text-xs text-slate-400">
                                    Projects
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side with form */}
                <div className="flex w-full md:w-1/2 justify-center items-center p-6 md:p-10">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;
