import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, GripVertical } from "lucide-react";

const columnsData = [
    { id: 1, title: "Todo" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
];

type TasksType = {
    [key: string]: string[];
};

const tasksData: TasksType = {
    1: ["Create wireframe", "Setup database"],
    2: ["Build Kanban UI"],
    3: ["Project planning"],
};

export default function KanbanBoard() {
    const [tasks, setTasks] = useState(tasksData);

    const addTask = (columnId: number) => {
        const newTask = prompt("Enter task name:");
        if (newTask) {
            setTasks((prev) => ({
                ...prev,
                [columnId.toString()]: [...prev[columnId.toString()], newTask],
            }));
            setTasks((prev) => ({
                ...prev,
                [columnId]: [...prev[columnId], newTask],
            }));
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl overflow-auto min-h-screen bg-accent justify-evenly">
            {columnsData.map((col) => (
                <div
                    key={col.id}
                    className="flex-1  min-w-[300px] rounded-xl shadow-md p-3 bg-black/40"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">{col.title}</h2>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => addTask(col.id)}
                        >
                            <Plus size={18} />
                        </Button>
                    </div>
                    <ScrollArea className="h-[300px] pr-2">
                        <div className="space-y-2">
                            {tasks[col.id]?.map((task, index) => (
                                <Card
                                    key={index}
                                    className="p-2 flex items-center gap-2 bg-card hover:shadow-sm cursor-pointer"
                                >
                                    <GripVertical className="text-muted-foreground size-4" />
                                    <CardContent className="p-0 text-sm">
                                        {task}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            ))}
        </div>
    );
}
