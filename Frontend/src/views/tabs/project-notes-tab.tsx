import { useStore } from "@/components/contexts/store-provider";
import { NotesGrid } from "@/components/notes/notes-grid";
import { useParams } from "react-router";

type Props = {};

export default function ProjectNotesTab({}: Props) {
    const { store } = useStore();
    const { projectId } = useParams<{ projectId: string }>();
    return (
        <>
            <NotesGrid notes={store.projectNotes[projectId!] || []}></NotesGrid>
        </>
    );
}
