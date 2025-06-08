import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import ProjectForm from "@/components/forms/add-project-form";
import { useState, type JSX } from "react";

type Props = {
    children: JSX.Element;
};

export function AddProjectDialog({ children }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Add a new project to your dashboard.
                    </DialogDescription>
                </DialogHeader>
                <ProjectForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
