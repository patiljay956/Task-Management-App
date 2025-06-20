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

type Props = {
    children: JSX.Element;
    initialData?: Project | null;
};

export function AddOrUpdateProjectDialog({ children, initialData }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit" : "Create New"} Project
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update project details"
                            : "Create a new project and add team members"}
                    </DialogDescription>
                </DialogHeader>
                <AddOrUpdateProjectForm
                    initialData={initialData ? initialData : null}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
