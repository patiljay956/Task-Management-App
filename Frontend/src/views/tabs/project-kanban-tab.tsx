import KanbanBoard from "@/components/kanban/kanban-board";
import { Trello, MoveHorizontal } from "lucide-react";

type Props = {};

export default function ProjectKanbanTab({}: Props) {
    return (
        <div className="space-y-6">
            {" "}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-100/50 dark:border-cyan-900/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-cyan-200/50 dark:border-cyan-800/20">
                        <Trello className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                        Kanban Board
                    </h2>
                </div>
                <div className="text-sm bg-cyan-50/50 dark:bg-cyan-900/10 px-3 py-1.5 rounded-full flex items-center gap-2 self-start sm:self-auto">
                    <MoveHorizontal className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                    <span className="text-muted-foreground">
                        Drag tasks between columns to update status
                    </span>
                </div>
            </div>
            <KanbanBoard />
        </div>
    );
}
