import { useStore } from "@/components/contexts/store-provider";
import { NotesGrid } from "@/components/notes/notes-grid";
import { useParams } from "react-router";
import { StickyNote, Info } from "lucide-react";

type Props = {};

export default function ProjectNotesTab({}: Props) {
    const { store } = useStore();
    const { projectId } = useParams<{ projectId: string }>();
    const notes = store.projectNotes[projectId!] || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-500/30">
                        <StickyNote className="h-5 w-5 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                        Project Notes
                    </h2>
                </div>
                <div className="text-sm text-muted-foreground">
                    {notes.length} {notes.length === 1 ? "note" : "notes"} total
                </div>
            </div>

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
                <NotesGrid notes={notes} />
            )}
        </div>
    );
}
