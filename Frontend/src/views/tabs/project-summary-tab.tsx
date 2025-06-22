import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { ProjectSummary, ProjectDetails } from "@/types/project";

type DashboardProps = {
    summary: ProjectSummary;
    projects: ProjectDetails[];
};

export default function ProjectSummaryTab({
    summary,
    projects,
}: DashboardProps) {
    const taskStatsMap: Record<string, { label: string; color: string }> = {
        todo: {
            label: "To Do",
            color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
        },
        done: {
            label: "Done",
            color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
        },
        in_progress: {
            label: "In Progress",
            color: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100",
        },
    };

    const topProjects: Array<ProjectDetails & { taskCount: number }> =
        summary?.topFiveActiveProjects
            .map((top) => {
                const details = projects?.find((p) => p._id === top._id);
                return details
                    ? { ...details, taskCount: top.taskCount }
                    : null;
            })
            .filter(
                (p): p is ProjectDetails & { taskCount: number } => p !== null,
            );

    if (!summary || !projects) {
        return (
            <div className="space-y-6 p-6">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            {/* Summary Cards */}
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-muted">
                Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle>Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {summary.totalProjects}
                        </div>
                        <div className="h-1 w-12 bg-purple-500 rounded-full mt-2"></div>
                    </CardContent>
                </Card>

                {summary.AllTaskStats.map((stat) => {
                    const borderColor =
                        stat._id === "todo"
                            ? "border-blue-500"
                            : stat._id === "done"
                            ? "border-green-500"
                            : "border-amber-500";

                    return (
                        <Card
                            key={stat._id}
                            className={`border-l-4 ${borderColor} shadow-sm hover:shadow transition-all`}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle>
                                    {taskStatsMap[stat._id].label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div
                                    className={`text-3xl font-bold ${
                                        stat._id === "todo"
                                            ? "text-blue-600 dark:text-blue-400"
                                            : stat._id === "done"
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-amber-600 dark:text-amber-400"
                                    }`}
                                >
                                    {stat.count}
                                </div>
                                <div
                                    className={`h-1 w-12 rounded-full mt-2 ${
                                        stat._id === "todo"
                                            ? "bg-blue-500"
                                            : stat._id === "done"
                                            ? "bg-green-500"
                                            : "bg-amber-500"
                                    }`}
                                ></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Top Projects */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-muted">
                    Top Active Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topProjects.map((project) => (
                        <Card
                            key={project._id}
                            className="shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 pb-2">
                                <CardTitle className="text-lg">
                                    {project.name}
                                </CardTitle>
                                <p className="text-muted-foreground text-sm">
                                    {project.taskCount} Tasks
                                </p>
                            </CardHeader>
                            <CardContent className="text-sm pt-4">
                                <p className="line-clamp-3">
                                    {project.description}
                                </p>
                                <Separator className="my-3" />
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                    >
                                        {project.memberCount} Members
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(
                                            project.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* All Projects */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-muted">
                    All Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <Card
                            key={project._id}
                            className={cn(
                                "shadow-sm hover:shadow-md transition-all border border-muted",
                                project.completionRate > 80
                                    ? "border-l-green-500 border-l-4"
                                    : project.completionRate > 50
                                    ? "border-l-amber-500 border-l-4"
                                    : "border-l-blue-500 border-l-4",
                            )}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {project.name}
                                    </CardTitle>
                                    <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                        <AvatarFallback>
                                            {project.name
                                                .split(" ")
                                                .map((w) => w[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2 pt-2">
                                <p className="text-muted-foreground line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                    Created on{" "}
                                    {new Date(
                                        project.createdAt,
                                    ).toLocaleDateString()}
                                </div>
                                <div className="flex justify-between text-xs font-medium mt-2">
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        {project.memberCount} Members
                                    </span>
                                    <span className="text-purple-600 dark:text-purple-400">
                                        {project.taskCount} Tasks
                                    </span>
                                </div>{" "}
                                <div className="pt-1">
                                    <div className="text-xs mb-1 flex justify-between">
                                        <span>Completion</span>
                                        <span className="font-medium">
                                            {project.completionRate}%
                                        </span>
                                    </div>
                                    <div className="relative h-2 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${project.completionRate}%`,
                                                background:
                                                    project.completionRate < 30
                                                        ? "linear-gradient(90deg, #4f46e5, #6366f1)"
                                                        : project.completionRate <
                                                          70
                                                        ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                                                        : "linear-gradient(90deg, #8b5cf6, #a855f7)",
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
