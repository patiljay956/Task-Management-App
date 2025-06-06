import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    EllipsisVertical,
    LogOut,
    MoonStar,
    SquareUserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Switch } from "../ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { type User } from "@/types/auth";
import ConfirmDialog from "@/dialogs/confirm-dialog";
import { API_USER_ENDPOINTS } from "@/api/endpoints";
import type { AxiosResponse } from "axios";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import axios from "axios";

export function NavUser({ user }: { user: User }) {
    const { isMobile } = useSidebar();
    const { setTheme, theme } = useTheme();
    const navigate = useNavigate();
    const { resetAuthData } = useAuth();

    const logoutHandler = async () => {
        console.log("clicked logout");
        try {
            const response: AxiosResponse | undefined =
                await API_USER_ENDPOINTS.logout();

            console.log(response);

            if (response.status === 200) {
                resetAuthData();
                toast.success("Logout Successful");
                navigate("/login", { replace: true });
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            console.error(error);
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarImage
                                    src={user.avatar.url}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.avatar.url}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.name}
                                    </span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link to="#">
                                    <SquareUserRound />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <span>
                                    <MoonStar />
                                    Dark mode
                                    <Switch
                                        className="ml-auto"
                                        defaultChecked={theme === "dark"}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setTheme(
                                                event.currentTarget.dataset
                                                    ?.state === "checked"
                                                    ? "light"
                                                    : "dark",
                                            );
                                        }}
                                    />
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 hover:bg-muted cursor-pointer rounded-md">
                            <ConfirmDialog
                                title="Are you sure?"
                                actionText="Yes, Log out"
                                description="This will log you out of your account"
                                onAction={logoutHandler}
                            >
                                <span
                                    className="flex w-full items-center gap-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("clicked logout span");
                                    }}
                                >
                                    <LogOut />
                                    Log out
                                </span>
                            </ConfirmDialog>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
