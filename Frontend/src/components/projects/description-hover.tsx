import type { Project } from "@/types/project";
import type { Row } from "@tanstack/react-table";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import { FileText } from "lucide-react";

type Props = {
    row: Row<Project>;
};

export default function DescriptionHover({ row }: Props) {
    const description = row.original.description;
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer group">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                    <p className="line-clamp-1 text-sm text-muted-foreground max-w-[200px] group-hover:text-indigo-500 transition-colors">
                        {description || "No description provided"}
                    </p>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="max-w-sm p-4 text-sm leading-relaxed border-indigo-500/20 bg-gradient-to-b from-background to-indigo-500/5">
                <div className="font-medium text-indigo-600 mb-1.5">
                    Project Description
                </div>
                <p className="text-foreground/80">
                    {description ||
                        "No description has been provided for this project."}
                </p>
            </HoverCardContent>
        </HoverCard>
    );
}
