import { useStore } from "@/components/contexts/store-provider";
import { NotesGrid } from "@/components/notes/notes-grid";
import { useParams } from "react-router";
import { StickyNote} from "lucide-react";

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

            <NotesGrid notes={notes} />
        </div>
    );
}
