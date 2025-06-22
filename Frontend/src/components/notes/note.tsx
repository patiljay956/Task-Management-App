import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Check, Trash, Edit } from "lucide-react";
import { useState } from "react";
import type { Note } from "@/types/project";
import { useStore } from "../contexts/store-provider";
import ConfirmDialog from "../dialogs/confirm-dialog";
import axios from "axios";
import { toast } from "sonner";
import { API_NOTE_ENDPOINTS } from "@/api/endpoints";

type Props = {
    note: Note;
    disableActions?: boolean;
};

export const NoteCard = ({ note, disableActions = false }: Props) => {
    const { setStore } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(note.content);

    const timeAgo = formatDistanceToNow(new Date(note.createdAt), {
        addSuffix: true,
    });

    const handleSave = async () => {
        if (editedContent.trim() && editedContent !== note.content) {
            try {
                const response = await API_NOTE_ENDPOINTS.updateProjectNote({
                    noteId: note._id,
                    projectId: note.project?._id,
                    memberId: note.createdBy._id,
                    content: editedContent,
                });

                if (response.data.statusCode === 200) {
                    setStore((prev) => ({
                        ...prev,
                        projectNotes: {
                            ...prev.projectNotes,
                            [note.project?._id]: prev.projectNotes[
                                note.project?._id
                            ].map((n) => {
                                if (n._id === note._id) {
                                    return {
                                        ...n,
                                        content: editedContent,
                                    };
                                }
                                return n;
                            }),
                        },
                    }));
                    toast.success("Note updated successfully!");
                }
            } catch (error) {
                if (axios.isAxiosError(error))
                    return toast.error(error.response?.data?.message);
                return toast.error("Something went wrong.");
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(note.content);
        setIsEditing(false);
    };

    const deleteNote = async () => {
        if (!note._id) return;

        try {
            const response = await API_NOTE_ENDPOINTS.deleteProjectNote({
                noteId: note._id,
                projectId: note.project?._id,
                memberId: note.createdBy._id,
            });

            if (response.data.statusCode === 200) {
                toast.success("Note deleted successfully!");
                setStore((prev) => ({
                    ...prev,
                    projectNotes: {
                        ...prev.projectNotes,
                        [note.project?._id]: prev.projectNotes[
                            note.project?._id
                        ].filter((n) => n._id !== note._id),
                    },
                }));
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                return toast.error(error.response?.data?.message);
            return toast.error("Something went wrong.");
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-b from-amber-400/5 to-yellow-500/5 border-amber-400/20 hover:border-amber-400/30 hover:translate-y-[-2px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-md font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                        {note.project?.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400/70"></span>
                        {timeAgo}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2 border-amber-400/30 ring-2 ring-amber-400/10">
                        <AvatarImage src={note.createdBy?.user.avatar?.url} />
                    </Avatar>
                    {!disableActions && !isEditing && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="border-amber-500/20"
                            >
                                <DropdownMenuItem
                                    onClick={() => setIsEditing(true)}
                                    className="hover:bg-amber-500/10 hover:text-amber-600"
                                >
                                    <Edit className="mr-2 h-4 w-4 text-amber-500" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20">
                                    <ConfirmDialog
                                        onAction={deleteNote}
                                        actionText="Delete"
                                    >
                                        <span
                                            className="flex gap-2 items-center"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash className="text-destructive" />
                                            Delete
                                        </span>
                                    </ConfirmDialog>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}{" "}
                    {isEditing && (
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSave}
                                className="hover:bg-green-500/10"
                            >
                                <Check className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="hover:bg-red-500/10"
                            >
                                <X className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-2">
                {isEditing ? (
                    <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="text-sm bg-amber-500/5 border-amber-500/20 focus:border-amber-500/50 focus:ring-amber-500/20"
                        autoFocus
                    />
                ) : (
                    <p className="text-sm text-muted-foreground bg-amber-500/5 p-3 rounded-md border border-amber-500/10">
                        {note.content}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};
