import type { Task } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../table/data-table";
import { columns } from "./columns";
import AddOrUpdateTaskDialog from "../dialogs/add-or-update-task-dialog";
type Props = {
    data: Task[];
    title?: string;
};

export default function TaskTable({ data, title }: Props) {
    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl">
                    {title || data[0]?.project?.name + " : Tasks"}
                </CardTitle>
                <AddOrUpdateTaskDialog initialData={null}>
                    {title ? null : (
                        <Button className="gap-2">
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
