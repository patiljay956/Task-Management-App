import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import AddOrUpdateProjectForm from "@/components/forms/add-or-update-project-form";
import { useState, type JSX } from "react";
import type { Project } from "@/types/project";
import { FolderPlus, PencilRuler } from "lucide-react";

type Props = {
    children: JSX.Element;
    initialData?: Project | null;
};

export function AddOrUpdateProjectDialog({ children, initialData }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md border-indigo-500/30">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-400/20 to-purple-500/20 border border-indigo-500/30">
                            {initialData ? (
                                <PencilRuler className="h-5 w-5 text-indigo-500" />
                            ) : (
                                <FolderPlus className="h-5 w-5 text-indigo-500" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {initialData
                                    ? "Edit Project"
                                    : "Create New Project"}
                            </DialogTitle>
                            <DialogDescription>
                                {initialData
                                    ? "Update the details of your existing project"
                                    : "Create a new project to organize your tasks and collaborate with team members"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <AddOrUpdateProjectForm
                    initialData={initialData ? initialData : null}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
