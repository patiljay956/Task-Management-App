import { NoteCard } from "./note";
import { Button } from "@/components/ui/button";
import { Info, Plus } from "lucide-react";
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
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg border-muted-foreground/20 bg-muted/10">
                    <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
                        <Info className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No notes yet</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        Add notes to keep important information, ideas, or
                        updates about this project.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {notes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            disableActions={
                                user?._id !== note.createdBy?.user?._id
                            }
                        />
                    ))}
                </div>
            )}
            {!disableAddOption && (
                <AddNoteDialog
                    open={open}
                    onOpenChange={(value) => {
                        setOpen(value);
                    }}
                >
                    <Button
                        size={"icon"}
                        className="fixed h-15 w-15 bottom-6 right-6 rounded-full p-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out border-none outline-none"
                    >
                        <Plus className="h-12 w-12" />
                    </Button>
                </AddNoteDialog>
            )}
        </>
    );
};
