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
    RotateCcwKey,
    ImageUp,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Switch } from "../ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { type User } from "@/types/auth";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import { API_USER_ENDPOINTS } from "@/api/endpoints";
import type { AxiosResponse } from "axios";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import axios from "axios";
import UserAvatar from "../profile/user-avatar";
import ChangePasswordDialog from "@/components/dialogs/change-password-dialog";
import ProfilePictureDialog from "../dialogs/profile-picture-dialog";

export function NavUser({ user }: { user: User }) {
    const { isMobile } = useSidebar();
    const { setTheme, theme } = useTheme();
    const navigate = useNavigate();
    const { resetAuthData } = useAuth();

    const logoutHandler = async () => {
        try {
            const response: AxiosResponse | undefined =
                await API_USER_ENDPOINTS.logout();

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
                            className={`
                                !p-2 rounded-lg transition-all
                                bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200
                                dark:from-blue-950 dark:to-purple-950 dark:border-blue-900
                                hover:shadow-md
                                data-[state=open]:bg-blue-200 dark:data-[state=open]:bg-blue-950
                                data-[state=open]:text-blue-700 dark:data-[state=open]:text-blue-200
                            `}
                        >
                            <Avatar className="h-8 w-8 rounded-lg border-2 border-blue-400/30 bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow">
                                <AvatarImage src={user.avatar.url} />
                                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                    {user.name
                                        .split(" ")
                                        .map((name) => name.charAt(0))
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    {user.name}
                                </span>
                                <span className="text-xs text-blue-500 dark:text-blue-300 truncate">
                                    {user.email}
                                </span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4 text-blue-400 dark:text-blue-300" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={`
                            w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg
                            border border-blue-200 dark:border-blue-900
                            bg-white dark:bg-slate-900
                            shadow-xl
                        `}
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <UserAvatar user={user} />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <ChangePasswordDialog>
                                    <span
                                        className="flex w-full items-center gap-2 text-sm px-2 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <RotateCcwKey className="h-4 w-4 text-blue-400" />
                                        Change password
                                    </span>
                                </ChangePasswordDialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <ProfilePictureDialog>
                                    <span
                                        className="flex w-full items-center gap-2 text-sm px-2 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <ImageUp className="h-4 w-4 text-purple-400" />
                                        Edit profile picture
                                    </span>
                                </ProfilePictureDialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <span>
                                    <MoonStar className="text-indigo-400" />
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
                        <div className="px-2 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer rounded-md">
                            <ConfirmDialog
                                title="Are you sure?"
                                actionText="Yes, Log out"
                                description="This will log you out of your account"
                                onAction={logoutHandler}
                            >
                                <span
                                    className="flex w-full items-center gap-2 text-sm text-red-600 dark:text-red-400"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <LogOut className="h-4 w-4" />
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
