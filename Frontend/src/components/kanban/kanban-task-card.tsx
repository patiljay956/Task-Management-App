import type { Task } from "@/types/project";
import { Card } from "../ui/card";
import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";

type Props = {
    task: Task;
};

export default function TaskCard({ task }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
    } = useDraggable({
        id: task._id,
        data: {
            task, // ✅ wrapped inside an object
        },
    });

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-500/20 text-red-500";
            case "medium":
                return "bg-yellow-500/20 text-yellow-600";
            case "low":
                return "bg-green-500/20 text-green-700";
            default:
                return "bg-gray-500/20 text-gray-500 ";
        }
    };

    return (
        <Card
            ref={setNodeRef}
            key={task._id}
            className="p-3 flex flex-col gap-2 bg-card hover:shadow-md transition-shadow cursor-pointer"
            style={style}
        >
            <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-base font-semibold line-clamp-1">
                        {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                        {task.description}
                    </p>
                </div>

                <div
                    ref={setActivatorNodeRef}
                    {...listeners}
                    {...attributes}
                    className="cursor-grab p-1 hover:bg-muted rounded"
                >
                    <GripVertical size={16} className="text-muted-foreground" />
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                </Badge>

                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignedTo?.user.avatar.url} />
                        <AvatarFallback>
                            {task.assignedTo?.user.name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline truncate max-w-[100px]">
                        {task.assignedTo?.user.name}
                    </span>
                </div>
            </div>
        </Card>
    );
}
