import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import type { KanbanColumn, KanbanColumnKey, Task } from "@/types/project";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./kanban-task-card";
import AddOrUpdateTaskDialog from "../dialogs/add-or-update-task-dialog";

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
    });

    return (
        <Card ref={setNodeRef} key={column.key} className="flex-1 p-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{column.title}</h2>
                <AddOrUpdateTaskDialog initialData={null} status={column.key}>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => {}}
                    >
                        <Plus size={18} />
                    </Button>
                </AddOrUpdateTaskDialog>
            </div>
            <ScrollArea className="h-[65vh] pr-2">
                <div className="space-y-2">
                    {tasks[column.key]?.map((task) => (
                        <TaskCard task={task} key={task._id} />
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}
