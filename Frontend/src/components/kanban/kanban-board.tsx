import { useState } from "react";
import {
    type KanbanColumn,
    type KanbanColumnKey,
    type Task,
} from "@/types/project";
import KanbanColumnView from "@/components/kanban/kanban-column";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import TaskCard from "@/components/kanban/task";
import { useStore } from "../contexts/store-provider";
import { useParams } from "react-router";
import type { AxiosResponse } from "axios";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import axios from "axios";
import { toast } from "sonner";

const columnsData: KanbanColumn[] = [
    { title: "Todo", key: "todo" },
    { title: "In Progress", key: "in_progress" },
    { title: "Done", key: "done" },
];

export default function KanbanBoard() {
    const sensors = useSensors(useSensor(PointerSensor));
    const { projectId } = useParams<{ projectId: string }>();
    const { store, setStore } = useStore();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const task = event.active.data?.current?.task as Task | undefined;
        if (task) {
            setActiveTask(task);
        } else {
            setActiveTask(null);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { over, active } = event;

        //Do nothing if dropped outside
        if (!over) return;

        //Do nothing if already in the same column
        if (over.id === active.data.current?.status) return;

        setActiveTask(null);

        setStore((prev) => {
            const fromBoardKey = active.data.current?.task
                ?.status as KanbanColumnKey;
            const toBoardKey = over.id as KanbanColumnKey;

            const taskId = active.id as string;

            const fromTasks = prev.projectTasks[projectId!][
                fromBoardKey
            ].filter((task) => task._id !== taskId);

            const existingToTasks = prev.projectTasks[projectId!][toBoardKey];

            const alreadyExists = existingToTasks.find(
                (task) => task._id === taskId,
            );

            const updatedTask = {
                ...activeTask!,
                status: toBoardKey,
            };

            const toTasks = alreadyExists
                ? existingToTasks.map((task) =>
                      task._id === taskId ? updatedTask : task,
                  )
                : [...existingToTasks, updatedTask];

            return {
                ...prev,
                projectTasks: {
                    ...prev.projectTasks,
                    [projectId!]: {
                        ...prev.projectTasks[projectId!], // 🔁 create new object
                        [fromBoardKey]: fromTasks,
                        [toBoardKey]: toTasks,
                    },
                },
            };
        });

        //get old state
        const oldState = store.projectTasks[projectId!];

        //update the server
        try {
            const response: AxiosResponse | undefined =
                await API_PROJECT_ENDPOINTS.updateTaskStatusOrPriority({
                    projectId: projectId!,
                    taskId: activeTask!._id,
                    status: over.id as KanbanColumnKey,
                    priority: activeTask!.priority,
                });

            if (response?.status === 200) {
                toast.success("Task updated successfully");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
                // restore the Store state to previous
                setStore((prev) => {
                    return {
                        ...prev,
                        projectTasks: {
                            ...prev.projectTasks,
                            [projectId!]: { ...oldState },
                        },
                    };
                });
            }
        }
    };

    const onDragCancel = () => setActiveTask(null);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={onDragCancel}
        >
            <ScrollArea className="flex flex-1 flex-col md:flex-row gap-4 min-h-0 min-w-0">
                {columnsData.map((col) => (
                    <KanbanColumnView
                        key={col.key}
                        column={col}
                        tasks={store.projectTasks[projectId!]}
                    />
                ))}
            </ScrollArea>
            {/* ✅ Global overlay OUTSIDE columns */}
            <DragOverlay>
                {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>
        </DndContext>
    );
}
