import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import {
    Cog,
    FolderKanban,
    LayoutDashboard,
    ListTodo,
    NotebookTabs,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { NavUser } from "./app-profile-menu";
import { useAuth } from "@/hooks/use-auth";
import { DASHBOARD, NOTES, PROJECTS, TASKS } from "@/constants/app-routes";
import { cn } from "@/lib/utils";

type Props = {};

const sidebarMenu = [
    {
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                to: DASHBOARD,
            },
            {
                label: "Project",
                icon: FolderKanban,
                to: PROJECTS,
            },
            {
                label: "Tasks",
                icon: ListTodo,
                to: TASKS,
            },
            {
                label: "Notes",
                icon: NotebookTabs,
                to: NOTES,
            },
        ],
    },
];

export default function AppSidebar({}: Props) {
    const { user } = useAuth();

    return (
        <Sidebar
            className="
                bg-white text-slate-900 border-r border-slate-200 shadow-xl
                dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-800
                backdrop-blur-md
            "
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="!p-2">
                            <Link to="#" className="flex items-center gap-2">
                                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Cog className="w-5 h-5 text-white" />
                                </span>
                                <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    TaskFlow
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="bg-slate-200 dark:bg-slate-800" />
            <SidebarContent>
                {sidebarMenu.map((group, groupIndex) => (
                    <SidebarGroup key={groupIndex}>
                        <SidebarMenu>
                            {group.items.map(
                                ({ label, icon: Icon, to }, itemIndex) => (
                                    <SidebarMenuItem key={itemIndex}>
                                        <SidebarMenuButton
                                            asChild
                                            className="
                                                !p-2 rounded-lg transition-colors
                                                hover:bg-blue-50 hover:text-blue-700
                                                dark:hover:bg-gradient-to-r dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 dark:hover:text-white
                                                focus:bg-blue-100 dark:focus:bg-gradient-to-r dark:focus:from-blue-800/60 dark:focus:to-purple-800/60
                                            "
                                        >
                                            <Link
                                                to={to}
                                                className="flex items-center gap-2"
                                            >
                                                <Icon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                                <span className="text-base font-semibold">
                                                    {label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <Separator className="bg-slate-200 dark:bg-slate-800" />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <NavUser user={user} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
