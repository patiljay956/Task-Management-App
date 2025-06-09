import { tasksByCategory } from "@/components/projects/dummy";
import { useState } from "react";
import type { Task } from "@/types/project";
import TaskTable from "@/components/tasklist/task-table";

type Props = {};

export default function ProjectTasklistTab({}: Props) {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const taskList = [];
        for (const [, value] of Object.entries(tasksByCategory)) {
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
