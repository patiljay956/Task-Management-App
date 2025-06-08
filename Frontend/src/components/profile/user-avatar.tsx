import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/types/auth";

type Props = {
    user: User;
};

export default function UserAvatar({ user }: Props) {
    return (
        <>
            <Avatar className="h-12 w-12 rounded-lg">
                <AvatarImage src={user.avatar.url} />
                <AvatarFallback className="rounded-lg">
                    {user.name
                        .split(" ")
                        .map((name) => name.charAt(0))
                        .join("")
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                    @{user.username}
                </span>
            </div>
        </>
    );
}
