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
        <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-md font-semibold">
                        {note.project?.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>

                <div className="flex items-center gap-2 ">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={note.createdBy.avatar?.url} />
                    </Avatar>

                    {!disableActions && !isEditing && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit />
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
                    )}

                    {isEditing && (
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSave}
                            >
                                <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                            >
                                <X className="w-4 h-4 text-red-600" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {isEditing ? (
                    <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="text-sm"
                        autoFocus
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {note.content}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};
