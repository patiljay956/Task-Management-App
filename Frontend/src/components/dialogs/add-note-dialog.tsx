// components/notes/note-dialog.tsx
"use client";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { AddNoteForm } from "../forms/add-note-form";
import { StickyNote } from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
};

export function AddNoteDialog({ children, open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md border-amber-500/20 bg-gradient-to-b from-background to-amber-500/5">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <StickyNote className="h-5 w-5 text-amber-500" />
                        </div>
                        <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                            Add Note
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground">
                        Create a new note for this project. Notes help keep
                        important information and ideas in one place.
                    </DialogDescription>
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
