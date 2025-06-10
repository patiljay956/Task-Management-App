// components/task/task-file-section.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, UploadCloud } from "lucide-react";
import { useRef } from "react";
import type { TaskFile } from "@/types/project";

type Props = {
    files: TaskFile[];
    onDelete: (fileId: string) => void;
    onUpload: (files: FileList) => void;
};

export const TaskFileSection = ({ files, onDelete, onUpload }: Props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onUpload(e.target.files);
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Files
            </h3>

            <div className="space-y-2">
                {files.length === 0 ? (
                    <p className="text-sm italic text-muted-foreground">
                        No files attached
                    </p>
                ) : (
                    files.map((file) => (
                        <div
                            key={file._id}
                            className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-md"
                        >
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-medium">
                                    {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {file.type ?? "Unknown type"}
                                </span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onDelete(file._id)}
                                title="Delete file"
                            >
                                <Trash className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4">
                <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload File
                </Button>
            </div>
        </div>
    );
};
