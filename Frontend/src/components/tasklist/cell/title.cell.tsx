import type { Task } from "@/types/project";

export function TitleCell({ task }: { task: Task }) {
    return (
        <div className="flex flex-col">
            <span className="font-medium line-clamp-1">{task.title}</span>
            <span className="text-muted-foreground text-xs line-clamp-1">
                {task.description}
            </span>
        </div>
    );
}
