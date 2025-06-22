import type { Task } from "@/types/project";
import { Card } from "../ui/card";
import {
    GripVertical,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Calendar,
    Link as LinkIcon,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

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
    }; // Priority configuration
    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case "high":
                return {
                    className:
                        "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30",
                    icon: <ArrowUp className="h-3 w-3 mr-1" />,
                    label: "High",
                    borderClass: "border-l-rose-400",
                };
            case "medium":
                return {
                    className:
                        "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30",
                    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
                    label: "Medium",
                    borderClass: "border-l-orange-400",
                };
            case "low":
                return {
                    className:
                        "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30",
                    icon: <ArrowDown className="h-3 w-3 mr-1" />,
                    label: "Low",
                    borderClass: "border-l-emerald-400",
                };
            default:
                return {
                    className:
                        "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/30",
                    icon: null,
                    label: priority,
                    borderClass: "border-l-slate-300",
                };
        }
    };

    const priorityConfig = getPriorityConfig(task.priority);
    const hasAttachments = task.attachments && task.attachments.length > 0;
    const createdDate = new Date(task.createdAt);
    return (
        <Card
            ref={setNodeRef}
            key={task._id}
            className={cn(
                "p-3 flex flex-col gap-2 bg-background hover:shadow-sm transition-all cursor-move border-l-3 hover:bg-gradient-to-br hover:from-cyan-50/30 hover:to-blue-50/30 dark:hover:from-cyan-900/5 dark:hover:to-blue-900/5",
                priorityConfig.borderClass || "border-l-slate-300",
            )}
            style={style}
        >
            <div className="flex justify-between items-start gap-2">
                {" "}
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-base font-medium line-clamp-1 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400">
                        {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 break-words mt-1">
                        {task.description || "No description provided"}
                    </p>
                </div>
                <div
                    ref={setActivatorNodeRef}
                    {...listeners}
                    {...attributes}
                    className="cursor-grab p-1 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 rounded-full"
                >
                    <GripVertical
                        size={16}
                        className="text-cyan-500 dark:text-cyan-400"
                    />
                </div>
            </div>{" "}
            <div className="flex items-center gap-2 text-xs pt-2 border-t border-dashed border-cyan-100 dark:border-cyan-900/50 mt-1">
                <Badge
                    className={cn(
                        "flex items-center px-2 border",
                        priorityConfig.className,
                    )}
                >
                    {priorityConfig.icon}
                    {priorityConfig.label}
                </Badge>

                {hasAttachments && (
                    <Badge
                        variant="outline"
                        className="bg-cyan-50/50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800/50"
                    >
                        <LinkIcon className="h-3 w-3 mr-1" />
                        {task.attachments.length}
                    </Badge>
                )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1 bg-cyan-50/50 dark:bg-cyan-900/10 px-1.5 py-0.5 rounded-full">
                    <Calendar className="h-3 w-3 text-cyan-500 dark:text-cyan-400" />
                    <span>
                        {createdDate.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>{" "}
                {task.assignedTo?.user && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-900/10 dark:to-blue-900/10 px-1.5 py-0.5 rounded-full">
                        <Avatar className="h-6 w-6 border border-cyan-100/50 dark:border-cyan-900/30">
                            <AvatarImage
                                src={task.assignedTo?.user?.avatar?.url}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600 dark:from-cyan-900/30 dark:to-blue-900/30 dark:text-cyan-400">
                                {task.assignedTo?.user?.name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline truncate max-w-[100px]">
                            {task.assignedTo?.user?.name}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
