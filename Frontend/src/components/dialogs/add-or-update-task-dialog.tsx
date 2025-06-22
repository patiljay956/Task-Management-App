import type { KanbanColumnKey, ProjectMember, Task } from "@/types/project";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "../ui/dialog";
import { DialogHeader } from "../ui/dialog";
import AddOrUpdateTaskForm from "../forms/add-or-update-task-form";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckSquare, PlusSquare } from "lucide-react";

type Props = {
    initialData?: Task | null;
    children?: React.ReactNode;
    status?: KanbanColumnKey;
    projectMembers?: ProjectMember[];
};

export default function AddOrUpdateTaskDialog({
    initialData,
    children,
    status,
    projectMembers,
}: Props) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                className="border-green-500/30 sm:max-w-[550px]"
            >
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 border border-green-500/30">
                            {initialData ? (
                                <CheckSquare className="h-5 w-5 text-green-500" />
                            ) : (
                                <PlusSquare className="h-5 w-5 text-green-500" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {initialData ? "Edit Task" : "Create New Task"}
                            </DialogTitle>
                            <DialogDescription>
                                {initialData
                                    ? "Update the details of this task"
                                    : "Fill in the details to create a new task"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] overflow-auto">
                    <AddOrUpdateTaskForm
                        status={status}
                        onSuccess={() => setOpen(false)}
                        initialData={initialData}
                        projectMembers={projectMembers}
                    ></AddOrUpdateTaskForm>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
