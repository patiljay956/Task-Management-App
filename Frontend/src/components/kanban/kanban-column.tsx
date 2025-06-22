import { Plus, ListChecks, ClipboardCheck, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import type { KanbanColumn, KanbanColumnKey, Task } from "@/types/project";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./kanban-task-card";
import AddOrUpdateTaskDialog from "../dialogs/add-or-update-task-dialog";
import { Badge } from "../ui/badge";

type Props = {
    column: KanbanColumn;
    tasks: Record<KanbanColumnKey, Task[]>;
};

export default function KanbanColumnView({
    column,
    tasks = {
        todo: [],
        in_progress: [],
        done: [],
    },
}: Props) {
    const { setNodeRef } = useDroppable({
        id: column.key,
    }); // Column style based on status
    const getColumnStyle = (columnKey: KanbanColumnKey) => {
        switch (columnKey) {
            case "todo":
                return {
                    borderTop: "border-t-3 border-t-slate-300",
                    icon: <ListChecks className="h-4 w-4 text-slate-500" />,
                    bgClass: "bg-slate-50/50 dark:bg-slate-900/20",
                };
            case "in_progress":
                return {
                    borderTop: "border-t-3 border-t-orange-400",
                    icon: (
                        <ClipboardCheck className="h-4 w-4 text-orange-500" />
                    ),
                    bgClass: "bg-orange-50/50 dark:bg-orange-900/10",
                };
            case "done":
                return {
                    borderTop: "border-t-3 border-t-emerald-400",
                    icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
                    bgClass: "bg-emerald-50/50 dark:bg-emerald-900/10",
                };
            default:
                return {
                    borderTop: "",
                    icon: null,
                    bgClass: "",
                };
        }
    };

    const columnStyle = getColumnStyle(column.key);
    const taskCount = tasks[column.key]?.length || 0;
    return (
        <Card
            ref={setNodeRef}
            key={column.key}
            className={`flex-1 p-0 min-w-[260px] md:min-w-[320px] ${columnStyle.borderTop} shadow-sm overflow-hidden flex flex-col ${columnStyle.bgClass}`}
        >
            <div className="flex justify-between items-center p-3 border-b bg-gradient-to-br from-background via-background to-transparent">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-cyan-500/20">
                        {columnStyle.icon}
                    </div>
                    <h2 className="text-lg font-medium">{column.title}</h2>
                    <Badge
                        variant="outline"
                        className="ml-1 bg-background/70 border border-cyan-200/50 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-300 font-medium px-1.5"
                    >
                        {taskCount}
                    </Badge>
                </div>
                <AddOrUpdateTaskDialog initialData={null} status={column.key}>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-cyan-100 hover:text-cyan-600 dark:hover:bg-cyan-900/20 rounded-full transition-colors"
                    >
                        <Plus size={18} />
                    </Button>
                </AddOrUpdateTaskDialog>
            </div>
            <ScrollArea className="h-[68vh] px-2 py-3 flex-grow overflow-auto">
                <div className="space-y-3 min-h-[200px]">
                    {tasks[column.key]?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 h-32 border border-dashed rounded-lg bg-background/50 text-muted-foreground p-4">
                            {columnStyle.icon}
                            <p className="text-sm text-center">
                                No tasks in this column
                            </p>
                            <p className="text-xs text-center text-muted-foreground">
                                Drag tasks here or add a new one
                            </p>
                        </div>
                    ) : (
                        tasks[column.key]?.map((task) => (
                            <TaskCard task={task} key={task._id} />
                        ))
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
}
