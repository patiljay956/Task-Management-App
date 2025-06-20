import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Trash } from "lucide-react";
import { useState } from "react";
import type { SubTask } from "@/types/project";
import ConfirmDialog from "../dialogs/confirm-dialog";

type Props = {
    subtask: SubTask;
    onToggle: (subtask: SubTask, checked: boolean) => void;
    onUpdate: (subtask: SubTask, newTitle: string) => void;
    onDelete: (subtask: SubTask) => void;
};

export const SubtaskItem = ({
    subtask,
    onToggle,
    onUpdate,
    onDelete,
}: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(subtask.title);

    return (
        <li className="flex items-center justify-between px-2 py-1 bg-muted/20 rounded-md">
            <div className="flex items-center gap-2 flex-1">
                <Checkbox
                    checked={subtask.isCompleted}
                    onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") {
                            onToggle(subtask, checked);
                        }
                    }}
                />

                {isEditing ? (
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-8"
                    />
                ) : (
                    <span
                        className={`text-sm ${
                            subtask.isCompleted
                                ? "line-through text-muted-foreground"
                                : ""
                        }`}
                    >
                        {subtask.title}
                    </span>
                )}
            </div>

            {isEditing ? (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            onUpdate(subtask, editTitle);
                            setIsEditing(false);
                        }}
                    >
                        <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setIsEditing(false);
                            setEditTitle(subtask.title); // reset
                        }}
                    >
                        <X className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            ) : (
                <div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setIsEditing(true);
                            setEditTitle(subtask.title);
                        }}
                    >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <ConfirmDialog onAction={() => onDelete(subtask)}>
                        <Button variant="ghost" size="icon">
                            <Trash className="w-4 h-4 text-destructive" />
                        </Button>
                    </ConfirmDialog>
                </div>
            )}
        </li>
    );
};
