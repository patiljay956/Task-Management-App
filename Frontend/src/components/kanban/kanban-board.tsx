import { useState, useEffect } from "react";
import {
    type KanbanColumn,
    type KanbanColumnKey,
    type Task,
} from "@/types/project";
import KanbanColumnView from "@/components/kanban/kanban-column";
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
import TaskCard from "@/components/kanban/kanban-task-card";
import { useStore } from "../contexts/store-provider";
import { useParams } from "react-router";
import type { AxiosResponse } from "axios";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

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
    const [isLoading, setIsLoading] = useState(true);

    const handleDragStart = (event: DragStartEvent) => {
        const task = event.active.data?.current?.task as Task | undefined;
        if (task) {
            setActiveTask(task);
        } else {
            setActiveTask(null);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { over } = event;

        if (!over || !activeTask) {
            setActiveTask(null);
            return;
        }

        const fromBoardKey = activeTask.status as KanbanColumnKey;
        const toBoardKey = over.id as KanbanColumnKey;

        if (toBoardKey === fromBoardKey) {
            setActiveTask(null);
            return;
        }

        // move logic using `activeTask`
        const taskId = activeTask._id;

        // Update UI immediately
        setStore((prev) => {
            const fromTasks = prev.projectTasks[projectId!][
                fromBoardKey
            ].filter((task) => task._id !== taskId);

            const existingToTasks = prev.projectTasks[projectId!][toBoardKey];

            const updatedTask = {
                ...activeTask,
                status: toBoardKey,
            };

            const toTasks = existingToTasks.find((task) => task._id === taskId)
                ? existingToTasks.map((task) =>
                      task._id === taskId ? updatedTask : task,
                  )
                : [...existingToTasks, updatedTask];

            return {
                ...prev,
                projectTasks: {
                    ...prev.projectTasks,
                    [projectId!]: {
                        ...prev.projectTasks[projectId!],
                        [fromBoardKey]: fromTasks,
                        [toBoardKey]: toTasks,
                    },
                },
            };
        });

        // ✅ Now it's safe to reset the drag state
        setActiveTask(null);

        // Save old state for rollback
        const oldState = store.projectTasks[projectId!];

        // Server update
        try {
            const response: AxiosResponse | undefined =
                await API_PROJECT_ENDPOINTS.updateTaskStatusOrPriority({
                    projectId: projectId!,
                    taskId: activeTask._id,
                    status: toBoardKey,
                    priority: activeTask.priority,
                });

            if (response?.status === 200) {
                toast.success("Task updated successfully");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
                // Restore old state
                setStore((prev) => ({
                    ...prev,
                    projectTasks: {
                        ...prev.projectTasks,
                        [projectId!]: { ...oldState },
                    },
                }));
            }
        }
    };

    const onDragCancel = () => setActiveTask(null);

    useEffect(() => {
        // Set loading false after a short delay to simulate data loading
        // In a real app, this would be based on API response timing
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Loading skeleton UI for kanban columns
    const renderSkeletonColumns = () => (
        <div className="flex flex-1 flex-col md:flex-row gap-4 min-h-0 min-w-0 overflow-x-auto pb-6">
            {columnsData.map((col) => (
                <div
                    key={col.key}
                    className="flex-1 min-w-[260px] md:min-w-[320px]"
                >
                    <Skeleton className="h-14 w-full mb-4 rounded-t-md" />
                    <div className="space-y-3 px-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-32 w-full rounded-md"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-1 flex-col gap-4 min-h-0 min-w-0">
            {isLoading ? (
                renderSkeletonColumns()
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={onDragCancel}
                >
                    <div className="flex flex-1 flex-col md:flex-row gap-4 min-h-0 min-w-0 overflow-x-auto pb-6">
                        {columnsData.map((col) => (
                            <KanbanColumnView
                                key={col.key}
                                column={col}
                                tasks={store.projectTasks[projectId!]}
                                activeTask={activeTask}
                            />
                        ))}
                    </div>{" "}
                    <DragOverlay dropAnimation={null}>
                        {activeTask && (
                            <div className="opacity-80">
                                <TaskCard task={activeTask} />
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
}
