import type { Task } from "@/types/project";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Plus, ListChecks } from "lucide-react";
import { DataTable } from "../table/data-table";
import { columns } from "./columns";
import AddOrUpdateTaskDialog from "../dialogs/add-or-update-task-dialog";

type Props = {
    data: Task[];
    title?: string;
};

export default function TaskTable({ data, title }: Props) {
    // Calculate statistics
    const completedTasks = data.filter((task) => task.status === "done").length;
    const completionRate =
        data.length > 0 ? Math.round((completedTasks / data.length) * 100) : 0;

    return (
        <Card className="w-full border-green-500/20 bg-gradient-to-b from-green-500/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-green-500" />
                        {title || "Project Tasks"}
                        {data.length > 0 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                                {data.length}
                            </span>
                        )}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1 flex items-center gap-2">
                        <div className="relative h-1.5 w-28 bg-green-200/30 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                        <span className="text-xs">
                            {completionRate}% complete
                        </span>
                    </CardDescription>
                </div>
                <AddOrUpdateTaskDialog initialData={null}>
                    {title ? null : (
                        <Button className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none shadow-md">
                            <Plus className="w-4 h-4" />
                            Add Task
                        </Button>
                    )}
                </AddOrUpdateTaskDialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={data} />
            </CardContent>
        </Card>
    );
}
