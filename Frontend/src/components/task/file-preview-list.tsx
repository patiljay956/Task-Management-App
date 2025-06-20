import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    files: File[];
    onRemove: (index: number) => void;
};

export const FilePreviewList = ({ files, onRemove }: Props) => {
    return (
        <div className="space-y-2 mt-2">
            {files.length === 0 ? (
                <p className="text-sm italic text-muted-foreground">
                    No files selected
                </p>
            ) : (
                files.map((file, idx) => (
                    <div
                        key={file.name + idx}
                        className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-md"
                    >
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium">
                                {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {file.type || "Unknown type"} •{" "}
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => onRemove(idx)}
                        >
                            <X className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ))
            )}
        </div>
    );
};
