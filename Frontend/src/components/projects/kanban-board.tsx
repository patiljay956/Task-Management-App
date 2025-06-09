import { useState } from "react";
import {
    type KanbanColumn,
    type KanbanColumnKey,
    type Task,
} from "@/types/project";
import KanbanColumnView from "./kanban-column";
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
//REMOVE LATER
import { tasksByCategory } from "./dummy";
import TaskCard from "./task";

const columnsData: KanbanColumn[] = [
    { title: "Todo", key: "todo" },
    { title: "In Progress", key: "inprogress" },
    { title: "Done", key: "done" },
];

export default function KanbanBoard() {
    const sensors = useSensors(useSensor(PointerSensor));
    const [tasks, setTasks] = useState(tasksByCategory);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const task = event.active.data.current as Task;
        const taskKey = task.status as KanbanColumnKey;
        const found = tasks[taskKey].find((t) => t._id === task._id);
        if (found) setActiveTask(found);
        else setActiveTask(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;

        //Do nothing if dropped outside
        if (!over) return;

        //Do nothing if already in the same column
        if (over.id === active.data.current?.status) return;

        setTasks((prev) => {
            const taskKey = active.data.current?.status as KanbanColumnKey;
            const task = prev[taskKey].find((t) => t._id === active.id);

            if (task) {
                task.status = over.id as KanbanColumnKey;
                prev[taskKey].splice(prev[taskKey].indexOf(task), 1);
                prev[over.id as KanbanColumnKey].push(task);
            }
            return prev;
        });

        setActiveTask(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <ScrollArea className="flex flex-1 flex-col md:flex-row gap-4 min-h-0 min-w-0">
                {columnsData.map((col) => (
                    <KanbanColumnView
                        key={col.key}
                        column={col}
                        tasks={tasks}
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
