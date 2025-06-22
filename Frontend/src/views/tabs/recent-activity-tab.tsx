import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/types/project";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
    return (
        <>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-muted">
                Recent Activity
            </h2>
            <div className="space-y-6 py-2">
                {activities.map((item) => (
                    <div
                        key={`${item.type}-${item.data._id}`}
                        className="group"
                    >
                        <ActivityCard activity={item} />
                        <Separator className="mt-6 opacity-70 group-last:hidden" />
                    </div>
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
            <div
                className={cn(
                    "flex gap-4 items-start py-1 px-2 rounded-md transition-all",
                    "hover:bg-slate-50 dark:hover:bg-slate-900",
                )}
            >
                <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-indigo-100 dark:ring-indigo-900 ring-offset-2 ring-offset-background">
                        <AvatarImage src={assignedTo?.user.avatar.url} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            {assignedTo?.user.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                        T
                    </span>
                </div>
                <div className="flex-1">
                    <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {assignedTo?.user.name}
                        </span>{" "}
                        was assigned a task{" "}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {title}
                        </span>{" "}
                        in{" "}
                        <span className="italic text-slate-700 dark:text-slate-300">
                            {project?.name}
                        </span>
                    </p>
                    <div className="flex items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                        <p className="text-xs text-muted-foreground">
                            {timeAgo}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    if (activity.type === "note") {
        const { content, project } = activity.data;
        return (
            <div
                className={cn(
                    "flex gap-4 items-start py-1 px-2 rounded-md transition-all",
                    "hover:bg-amber-50/40 dark:hover:bg-amber-900/20",
                )}
            >
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white flex items-center justify-center font-bold text-sm ring-2 ring-amber-100 dark:ring-amber-900 ring-offset-2 ring-offset-background shadow-sm">
                        N
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                        📝
                    </span>
                </div>
                <div className="flex-1">
                    <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                            Note
                        </span>{" "}
                        added in{" "}
                        <span className="italic text-slate-700 dark:text-slate-300">
                            {project.name}
                        </span>
                        :
                    </p>
                    <p className="text-sm bg-amber-50 dark:bg-amber-900/30 p-2 rounded-md mt-1 border-l-2 border-amber-300 dark:border-amber-700 italic text-slate-600 dark:text-slate-300">
                        "{content.slice(0, 60)}
                        {content.length > 60 ? "..." : ""}"
                    </p>
                    <div className="flex items-center mt-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <p className="text-xs text-muted-foreground">
                            {timeAgo}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    if (activity.type === "member") {
        const { user, project, role } = activity.data;
        return (
            <div
                className={cn(
                    "flex gap-4 items-start py-1 px-2 rounded-md transition-all",
                    "hover:bg-green-50/40 dark:hover:bg-green-900/20",
                )}
            >
                <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-green-100 dark:ring-green-900 ring-offset-2 ring-offset-background">
                        <AvatarImage src={user.avatar.url} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                            {user.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                        👤
                    </span>
                </div>
                <div className="flex-1">
                    <div className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full inline-block mb-1">
                        <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            New Member
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {user.name}
                        </span>{" "}
                        joined{" "}
                        <span className="italic text-slate-700 dark:text-slate-300">
                            {project?.name}
                        </span>{" "}
                        as{" "}
                        <span className="font-medium px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded">
                            {role.replace("_", " ")}
                        </span>
                    </p>
                    <div className="flex items-center mt-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-xs text-muted-foreground">
                            {timeAgo}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto flex items-center justify-center mb-3">
                    <span className="text-slate-400 dark:text-slate-600 text-lg">
                        ?
                    </span>
                </div>
                <p className="text-muted-foreground">Unknown activity type</p>
            </div>
        </div>
    );
}
