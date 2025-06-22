import RegisterForm from "@/components/forms/register-form";
import { Zap, ArrowLeft, Users, Target, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type Props = {};

export default function Register({}: Props) {
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
                    <div className="flex gap-2">
                        <Link to="/login">
                            <Button
                                variant="outline"
                                className="text-slate-300 border-slate-600 hover:text-white hover:bg-slate-800"
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button
                                variant="ghost"
                                className="text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
                {/* Left side with illustration and text */}
                <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-10">
                    <div className="max-w-md">
                        <div className="mb-10 grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-slate-800/60 rounded-xl flex items-center justify-center p-4 border border-slate-700/50 transform hover:scale-105 transition-all">
                                <Kanban className="w-12 h-12 text-blue-400" />
                            </div>
                            <div className="aspect-square bg-slate-800/60 rounded-xl flex items-center justify-center p-4 border border-slate-700/50 transform hover:scale-105 transition-all">
                                <Target className="w-12 h-12 text-purple-400" />
                            </div>
                            <div className="aspect-square bg-slate-800/60 rounded-xl flex items-center justify-center p-4 border border-slate-700/50 transform hover:scale-105 transition-all">
                                <Users className="w-12 h-12 text-emerald-400" />
                            </div>
                            <div className="aspect-square bg-slate-800/60 rounded-xl flex items-center justify-center p-4 border border-slate-700/50 transform hover:scale-105 transition-all">
                                <Zap className="w-12 h-12 text-amber-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            Join TaskFlow Today
                        </h1>
                        <p className="text-slate-300 text-center mb-6">
                            Create your account and start managing your projects
                            with our powerful collaboration tools. Get started
                            in seconds!
                        </p>
                        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 mb-4">
                            <p className="text-sm text-slate-300 italic">
                                "TaskFlow transformed how our team collaborates.
                                The Kanban boards are intuitive and the
                                real-time updates keep everyone aligned."
                            </p>
                            <div className="flex items-center justify-end mt-2 gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500/50 flex items-center justify-center text-xs font-bold">
                                    SC
                                </div>
                                <p className="text-xs text-slate-400">
                                    Sarah C., Product Manager
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side with form */}
                <div className="flex w-full md:w-1/2 justify-center items-center p-6 md:p-10">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
