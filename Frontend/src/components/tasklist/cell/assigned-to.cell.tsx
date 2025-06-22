import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon } from "lucide-react";

export function AssignedToCell({ user }: { user: User }) {
    if (!user) {
        return (
            <Badge
                variant="outline"
                className="gap-1 text-muted-foreground border-dashed"
            >
                <UserIcon size={12} />
                Unassigned
            </Badge>
        );
    }

    return (
        <div className="flex items-center gap-2 group">
            <div className="relative">
                <Avatar className="h-6 w-6 border-2 border-green-500/20 group-hover:border-green-500/50 transition-colors">
                    <AvatarImage src={user.avatar?.url} alt={user.name} />
                    <AvatarFallback className="bg-green-500/10 text-green-600">
                        {user.name?.[0]}
                    </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
            </div>
            <span className="text-sm font-medium group-hover:text-green-600 transition-colors">
                {user.name}
            </span>
        </div>
    );
}
