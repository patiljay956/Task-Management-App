import { NoteCard } from "./note";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Note } from "@/types/project";
import { AddNoteDialog } from "../dialogs/add-note-dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

type Props = {
    notes: Note[];
};

export const NotesGrid = ({ notes }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const { user } = useAuth();
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {notes.map((note) => (
                    <NoteCard
                        key={note._id}
                        note={note}
                        disableActions={user?._id !== note.createdBy?.user?._id}
                    />
                ))}
            </div>

            <AddNoteDialog
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                }}
            >
                <Button
                    size="icon"
                    className="fixed bottom-6 right-6 rounded-full p-4 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 ease-out"
                >
                    <Plus className="h-8 w-8" />
                </Button>
            </AddNoteDialog>
        </>
    );
};
