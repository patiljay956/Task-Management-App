import type { User } from "@/types/auth";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
    user: User;
};

export default function UserHover({ user }: Props) {
    if (!user) return null;

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="inline-flex items-center gap-2 cursor-pointer hover:underline">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar.url} />
                        <AvatarFallback>
                            {user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-4 space-y-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar.url} />
                        <AvatarFallback>
                            {user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
