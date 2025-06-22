import { useMemo } from "react";
import type { Task } from "@/types/project";
import TaskTable from "@/components/tasklist/task-table";
import { useStore } from "@/components/contexts/store-provider";
import { useParams } from "react-router";
import { CheckSquare} from "lucide-react";

type Props = {};

export default function ProjectTasklistTab({}: Props) {
    const { store } = useStore();
    const { projectId } = useParams<{ projectId: string }>();

    const tasks = useMemo(() => {
        const taskList: Task[] = [];
        const projectTasks = store.projectTasks[projectId!];
        if (!projectTasks) return taskList;

        for (const [, value] of Object.entries(projectTasks)) {
            taskList.push(...value);
        }
        return taskList;
    }, [store.projectTasks, projectId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 border border-green-500/30">
                        <CheckSquare className="h-5 w-5 text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        Task List
                    </h2>
                </div>
                <div className="text-sm text-muted-foreground">
                    {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
                </div>
            </div>
            <TaskTable data={tasks} />
        </div>
    );
}
