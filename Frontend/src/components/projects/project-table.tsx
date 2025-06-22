import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { FolderKanban, Briefcase } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "../table/data-table";
import { type Project } from "@/types/project"; // Adjust import

interface Props {
    data: Project[];
}

export default function ProjectTable({ data }: Props) {
    // Calculate statistics
    const recentProjects = data.filter((project) => {
        const creationDate = new Date(project.createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return creationDate > oneWeekAgo;
    }).length;

    return (
        <Card className="w-full border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                <div>
                    {" "}
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-indigo-500" />
                        Project Collection
                        {data.length > 0 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-medium">
                                {data.length}
                            </span>
                        )}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                        {recentProjects > 0 && (
                            <span className="text-indigo-500 font-medium">
                                {recentProjects} new
                            </span>
                        )}{" "}
                        projects added in the last week.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg border-indigo-500/20 bg-indigo-500/5">
                        <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
                            <Briefcase className="h-6 w-6 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">
                            No projects yet
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Create your first project to start collaborating
                            with your team and organize your work.
                        </p>
                    </div>
                ) : (
                    <DataTable columns={columns} data={data} />
                )}
            </CardContent>
        </Card>
    );
}
