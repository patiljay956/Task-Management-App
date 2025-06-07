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
                                <UserAvatar user={user}></UserAvatar>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <ChangePasswordDialog>
                                    <span
                                        className="flex w-full items-center gap-2 text-sm px-2 py-1.5 hover:bg-muted rounded-md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <RotateCcwKey className="h-4 w-4" />
                                        Change password
                                    </span>
                                </ChangePasswordDialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <ProfilePictureDialog>
                                    <span
                                        className="flex w-full items-center gap-2 text-sm px-2 py-1.5 hover:bg-muted  rounded-md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <ImageUp className="h-4 w-4" />
                                        Edit profile picture
                                    </span>
                                </ProfilePictureDialog>
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
                                    className="flex w-full items-center gap-2 text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("clicked logout span");
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
