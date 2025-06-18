// components/notes/note-dialog.tsx
"use client";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddNoteForm } from "../forms/add-note-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
};

export function AddNoteDialog({ children, open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Note</DialogTitle>
                </DialogHeader>
                <AddNoteForm
                    onSuccess={() => {
                        onOpenChange(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
