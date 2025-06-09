import { useState } from "react";
import type { Task } from "@/types/project";
import TaskTable from "@/components/tasklist/task-table";
import { useStore } from "@/components/contexts/store-provider";
import { useParams } from "react-router";

type Props = {};

export default function ProjectTasklistTab({}: Props) {
    const { store } = useStore();
    const { projectId } = useParams<{ projectId: string }>();
    const [tasks] = useState<Task[]>(() => {
        const taskList = [];
        for (const [, value] of Object.entries(
            store.projectTasks[projectId!],
        )) {
            for (const task of value) {
                taskList.push(task);
            }
        }
        return taskList;
    });

    return (
        <>
            <TaskTable data={tasks} onAddTask={() => {}}></TaskTable>
        </>
    );
}
