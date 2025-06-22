import { NoteCard } from "./note";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Note } from "@/types/project";
import { AddNoteDialog } from "../dialogs/add-note-dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

type Props = {
    notes: Note[];
    disableAddOption?: boolean;
};

export const NotesGrid = ({ notes, disableAddOption = false }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const { user } = useAuth();

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {notes.map((note) => (
                    <NoteCard
                        key={note._id}
                        note={note}
                        disableActions={user?._id !== note.createdBy?.user?._id}
                    />
                ))}
            </div>

            {!disableAddOption && (
                <AddNoteDialog
                    open={open}
                    onOpenChange={(value) => {
                        setOpen(value);
                    }}
                >
                    <Button
                        size="icon"
                        className="fixed bottom-6 right-6 rounded-full p-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out border-none outline-none"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </AddNoteDialog>
            )}
        </>
    );
};
