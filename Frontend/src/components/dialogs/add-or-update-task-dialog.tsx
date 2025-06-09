import type { KanbanColumnKey, ProjectMember, Task } from "@/types/project";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { DialogHeader } from "../ui/dialog";
import AddOrUpdateTaskForm from "../forms/add-or-update-task-form";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
    initialData?: Task | null;
    children?: React.ReactNode;
    status?: KanbanColumnKey;
};

export default function AddOrUpdateTaskDialog({
    initialData,
    children,
    status,
}: Props) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit Task" : "Create Task"}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] overflow-auto">
                    <AddOrUpdateTaskForm
                        status={status}
                        onSuccess={() => setOpen(false)}
                        initialData={initialData}
                    ></AddOrUpdateTaskForm>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
