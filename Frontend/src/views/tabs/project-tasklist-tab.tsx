import { useMemo } from "react";
import type { Task } from "@/types/project";
import TaskTable from "@/components/tasklist/task-table";
import { useStore } from "@/components/contexts/store-provider";
import { useParams } from "react-router";

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
        <>
            <TaskTable data={tasks}></TaskTable>
        </>
    );
}
