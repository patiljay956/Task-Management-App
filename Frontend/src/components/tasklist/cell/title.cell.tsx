import { BASE_URL} from "@/constants/app-routes";
import type { Task } from "@/types/project";
import { Link, useParams } from "react-router";

export function TitleCell({ task }: { task: Task }) {
    const { projectId } = useParams<{ projectId: string }>();
    return (
        <Link to={`${BASE_URL}/project/${projectId}/task/${task._id}`}>
            <div className="flex flex-col">
                <span className="font-medium line-clamp-1">{task.title}</span>
                <span className="text-muted-foreground text-xs line-clamp-1">
                    {task.description}
                </span>
            </div>
        </Link>
    );
}
