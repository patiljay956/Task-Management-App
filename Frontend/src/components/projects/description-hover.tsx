import type { Project } from "@/types/project";
import type { Row } from "@tanstack/react-table";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";

type Props = {
    row: Row<Project>;
};

export default function DescriptionHover({ row }: Props) {
    const description = row.original.description;
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <p className="line-clamp-1 cursor-pointer text-sm text-muted-foreground max-w-[200px] hover:underline">
                    {description || "No description"}
                </p>
            </HoverCardTrigger>
            <HoverCardContent className="max-w-sm p-3 text-sm leading-relaxed">
                {description || "No description"}
            </HoverCardContent>
        </HoverCard>
    );
}
