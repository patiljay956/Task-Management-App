import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { ProjectSummary, ProjectDetails } from "@/types/project";

type DashboardProps = {
    summary: ProjectSummary;
    projects: ProjectDetails[];
};

export default function ProjectSummaryTab({
    summary,
    projects,
}: DashboardProps) {
    const taskStatsMap: Record<string, string> = {
        todo: "To Do",
        done: "Done",
        in_progress: "In Progress",
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
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {summary.totalProjects}
                    </CardContent>
                </Card>

                {summary.AllTaskStats.map((stat) => (
                    <Card key={stat._id}>
                        <CardHeader>
                            <CardTitle>{taskStatsMap[stat._id]}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            {stat.count}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Top Projects */}
            <div>
                <h2 className="text-xl font-semibold mb-2">
                    Top Active Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topProjects.map((project) => (
                        <Card key={project._id}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {project.name}
                                </CardTitle>
                                <p className="text-muted-foreground text-sm">
                                    {project.taskCount} Tasks
                                </p>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <p>{project.description}</p>
                                <Separator className="my-2" />
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline">
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
            <div>
                <h2 className="text-xl font-semibold mb-2">All Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <Card key={project._id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {project.name}
                                    </CardTitle>
                                    <Avatar className="h-6 w-6">
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
                            <CardContent className="text-sm space-y-2">
                                <p>{project.description}</p>
                                <div className="text-xs text-muted-foreground">
                                    Created on{" "}
                                    {new Date(
                                        project.createdAt,
                                    ).toLocaleDateString()}
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span>{project.memberCount} Members</span>
                                    <span>{project.taskCount} Tasks</span>
                                </div>
                                <Progress value={project.completionRate} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
