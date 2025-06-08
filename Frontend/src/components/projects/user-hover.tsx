import type { User } from "@/types/auth";
import type { Project } from "@/types/project";
import { HoverCard } from "@radix-ui/react-hover-card";
import type { Row } from "@tanstack/react-table";
import { HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
    row: Row<Project>;
};

export default function UserHover({ row }: Props) {
    const owner = row.original.createdByUser as User;
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="inline-flex items-center gap-2 cursor-pointer hover:underline">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={owner?.avatar?.url} />
                        <AvatarFallback>
                            {owner.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{owner.name}</span>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-4 space-y-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={owner?.avatar?.url} />
                        <AvatarFallback>
                            {owner.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{owner.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {owner.email}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
