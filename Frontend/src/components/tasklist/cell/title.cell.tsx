import { BASE_URL } from "@/constants/app-routes";
import type { Task } from "@/types/project";
import { Link } from "react-router";
import { Lightbulb } from "lucide-react";

export function TitleCell({ task }: { task: Task | null }) {
    if (!task) return null;

    return (
        <Link
            to={`${BASE_URL}/project/${task.project?._id}/task/${task._id}`}
            className="group"
        >
            <div className="flex flex-row gap-3 items-start">
                <div className="p-1.5 rounded-md bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <Lightbulb size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium line-clamp-1 group-hover:text-green-600 transition-colors">
                        {task.title}
                    </span>
                    <span className="text-muted-foreground text-xs line-clamp-1 text-ellipsis mt-0.5 sm:max-w-[20rem] ">
                        {task.description || "No description provided"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
