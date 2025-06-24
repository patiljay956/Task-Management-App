import { API_NOTE_ENDPOINTS } from "@/api/endpoints";
import { useStore } from "@/components/contexts/store-provider";
import Loading from "@/components/loading/loading";
import { NotesGrid } from "@/components/notes/notes-grid";
import { useAuth } from "@/hooks/use-auth";
import { useLoadingController } from "@/hooks/use-loading-controller";
import type { Note } from "@/types/project";
import axios from "axios";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

type Props = {};

export default function UserNotesView({}: Props) {
    const { store, setStore } = useStore();
    const { user } = useAuth();
    const { loading, withLoading } = useLoadingController();

    useEffect(() => {
        const getUserNotes = async () => {
            try {
                const response = await API_NOTE_ENDPOINTS.getUserNotes();

                if (response.data.statusCode === 200) {
                    const notes = response.data.data as Note[];

                    const projectNotes: Record<string, Note[]> =
                        store.projectNotes ? { ...store.projectNotes } : {};

                    notes.forEach((note) => {
                        const projectId = note.project?._id;
                        if (!projectId) return;

                        if (!projectNotes[projectId]) {
                            projectNotes[projectId] = [note];
                            return;
                        }

                        const index = projectNotes[projectId].findIndex(
                            (n) => n._id === note._id,
                        );

                        if (index === -1) {
                            projectNotes[projectId] = [
                                ...projectNotes[projectId],
                                note,
                            ];
                        } else {
                            projectNotes[projectId][index] = {
                                ...projectNotes[projectId][index],
                                content: note.content,
                            };
                        }
                    });

                    setStore((prev) => ({
                        ...prev,
                        projectNotes,
                    }));
                }
            } catch (error) {
                if (axios.isAxiosError(error))
                    return toast.error(error.response?.data?.message);
                return toast.error(
                    "Something went wrong. Please try again later.",
                );
            }
        };

        withLoading(async () => getUserNotes());
    }, []);

    const userNotes = useMemo(() => {
        const notes = [] as Note[];

        Object.values(store.projectNotes).forEach((projectNotes) => {
            projectNotes
                .filter((note) => note.createdBy.user._id === user._id)
                .forEach((note) => notes.push(note));
        });

        return notes;
    }, [store.projectNotes]);

    return (
        <>
            {loading ? (
                <Loading
                    skeleton={true}
                    skeletonCount={9}
                    skeletonType="card"
                />
            ) : (
                <NotesGrid notes={userNotes} />
            )}
        </>
    );
}
