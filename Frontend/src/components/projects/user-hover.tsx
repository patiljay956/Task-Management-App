import type { User } from "@/types/auth";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Mail, User as UserIcon, Calendar } from "lucide-react";

type Props = {
    user: User;
};

export default function UserHover({ user }: Props) {
    if (!user) return null;

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="inline-flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors group">
                    <Avatar className="h-8 w-8 border-2 border-blue-500/20 ring-2 ring-blue-500/10 group-hover:border-blue-500/40 transition-all">
                        <AvatarImage src={user.avatar.url} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
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
            <HoverCardContent className="w-72 p-0 border-blue-500/20 shadow-lg bg-gradient-to-b from-background to-blue-500/5 backdrop-blur-sm">
                <div className="p-4 border-b border-blue-500/10">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14 border-2 border-blue-500/30 ring-4 ring-blue-500/10 shadow-md">
                            <AvatarImage src={user.avatar.url} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-lg">
                                {user?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-base">
                                {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                Active Team Member
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="text-blue-500 h-4 w-4" />
                        <span className="text-muted-foreground">
                            {user.email}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <UserIcon className="text-blue-500 h-4 w-4" />
                        <span className="text-muted-foreground">
                            @
                            {user.username ||
                                user.name.toLowerCase().replace(/\s+/g, "")}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="text-blue-500 h-4 w-4" />
                        <span className="text-muted-foreground">
                            Joined {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
