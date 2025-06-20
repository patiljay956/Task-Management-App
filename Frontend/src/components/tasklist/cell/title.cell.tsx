import { BASE_URL } from "@/constants/app-routes";
import type { Task } from "@/types/project";
import { Link } from "react-router";

export function TitleCell({ task }: { task: Task | null }) {
    if (!task) return null;

    return (
        <Link to={`${BASE_URL}/project/${task.project?._id}/task/${task._id}`}>
            <div className="flex flex-col">
                <span className="font-medium line-clamp-1">{task.title}</span>
                <span className="text-muted-foreground text-xs line-clamp-1">
                    {task.description}
                </span>
            </div>
        </Link>
    );
}
