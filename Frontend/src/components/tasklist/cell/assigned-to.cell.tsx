import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types/auth";

export function AssignedToCell({ user }: { user: User }) {
    if (!user) return null;

    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar.url} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{user.name}</span>
        </div>
    );
}
