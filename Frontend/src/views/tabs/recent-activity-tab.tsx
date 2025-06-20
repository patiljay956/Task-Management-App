import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/types/project";
import { Separator } from "@/components/ui/separator";

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
    return (
        <>
            <div className="space-y-4 py-2">
                {activities.map((item) => (
                    <>
                        <ActivityCard
                            key={`${item.type}-${item.data._id}`}
                            activity={item}
                        />
                        <Separator />
                    </>
                ))}
            </div>
        </>
    );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
    const timeAgo = formatDistanceToNow(new Date(activity.date), {
        addSuffix: true,
    });

    if (activity.type === "task") {
        const { title, project, assignedTo } = activity.data;
        return (
            <div className="flex gap-3 items-start">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={assignedTo?.user.avatar.url} />
                    <AvatarFallback>{assignedTo?.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm">
                        <span className="font-medium">
                            {assignedTo?.user.name}
                        </span>{" "}
                        was assigned{" "}
                        <span className="font-semibold">{title}</span> in{" "}
                        <span className="italic">{project?.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
            </div>
        );
    }

    if (activity.type === "note") {
        const { content, project } = activity.data;
        return (
            <div className="flex gap-3 items-start">
                <div className="h-9 w-9 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold text-sm">
                    N
                </div>
                <div>
                    <p className="text-sm">
                        <span className="font-medium">Note</span> added in{" "}
                        <span className="italic">{project.name}</span>:{" "}
                        <span className="text-muted-foreground">
                            "{content.slice(0, 60)}..."
                        </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
            </div>
        );
    }

    if (activity.type === "member") {
        const { user, project, role } = activity.data;
        return (
            <div className="flex gap-3 items-start">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar.url} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm">
                        <span className="font-medium">{user.name}</span> joined{" "}
                        <span className="italic">{project?.name}</span> as{" "}
                        <span className="font-medium">
                            {role.replace("_", " ")}
                        </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
            </div>
        );
    }

    return null;
}
