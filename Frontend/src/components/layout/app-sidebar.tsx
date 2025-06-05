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
("./app-profile-menu");

type Props = {};

const sidebarMenu = [
    {
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                to: "/dashboard",
            },
            {
                label: "Project",
                icon: FolderKanban,
                to: "/project",
            },
            {
                label: "Tasks",
                icon: ListTodo,
                to: "/tasks",
            },
            {
                label: "Notes",
                icon: NotebookTabs,
                to: "/notes",
            },
        ],
    },
];

export default function AppSidebar({}: Props) {
    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className="data-[slot=sidebar-menu-button]:!p-1.5"
                            >
                                <Link to="#">
                                    <Cog className="!size-5" />
                                    <span className="text-base font-semibold">
                                        Acme Inc.
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <Separator></Separator>
                <SidebarContent>
                    {sidebarMenu.map((group, groupIndex) => (
                        <SidebarGroup key={groupIndex}>
                            <SidebarMenu>
                                {group.items.map(
                                    ({ label, icon: Icon, to }, itemIndex) => (
                                        <SidebarMenuItem key={itemIndex}>
                                            <SidebarMenuButton
                                                asChild
                                                className="data-[slot=sidebar-menu-button]:!p-1.5"
                                            >
                                                <Link to={to}>
                                                    <Icon className="!size-5" />
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
                <Separator />
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <NavUser
                                user={{
                                    name: "John Doe",
                                    email: "jdoe",
                                    avatar: "https://github.com/shadcn.png",
                                }}
                            />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}
