import { useParams } from "react-router";
import { useStore } from "../contexts/store-provider";
import { useState } from "react";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import type { Row } from "@tanstack/react-table";
import type { ProjectMember, ProjectRole } from "@/types/project";
import { toast } from "sonner";
import axios, { type AxiosResponse } from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash, UserCog } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import ConfirmDialog from "../dialogs/confirm-dialog";

type Props = {
    row: Row<ProjectMember>;
};

export default function MemberTableAction({ row }: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { setStore } = useStore();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleDelete = async () => {
        try {
            const response = await API_PROJECT_ENDPOINTS.removeMember({
                memberId: row.original._id,
                projectId: projectId!,
            });

            if (response.data.statusCode === 200) {
                setStore((prev) => ({
                    ...prev,
                    projectMembers: {
                        ...prev.projectMembers,
                        [projectId!]: prev.projectMembers[projectId!].filter(
                            (member) => member._id !== row.original._id,
                        ),
                    },
                }));
                toast.success("Member removed successfully!");
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong. Please try again.");
        }
    };

    const handleRoleChange = async (role: ProjectRole) => {
        try {
            const response: AxiosResponse | undefined =
                await API_PROJECT_ENDPOINTS.updateMemberRole({
                    projectId: projectId!,
                    memberId: row.original.user._id,
                    role: role,
                });

            if (response?.data.statusCode === 200) {
                toast.success("Role updated successfully!");
                setStore((prev) => ({
                    ...prev,
                    projectMembers: {
                        ...prev.projectMembers,
                        [projectId!]: prev.projectMembers[projectId!].map(
                            (member) => {
                                if (member.user._id === row.original.user._id) {
                                    return {
                                        ...member,
                                        role: role,
                                    };
                                }
                                return member;
                            },
                        ),
                    },
                }));
                setIsSubmitting(false);
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong. Please try again.");

            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-500"
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="border-blue-500/20 bg-background/95 backdrop-blur-sm"
                >
                    <DropdownMenuLabel className="text-blue-500">
                        Member Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-blue-500/20" />
                    <DropdownMenuLabel className="text-sm text-muted-foreground">
                        Change Permission
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="focus:bg-blue-500/10 focus:text-blue-600">
                        <Select
                            onValueChange={(value) => {
                                handleRoleChange(value as ProjectRole);
                            }}
                            value={row.original.role}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className="w-full border-blue-500/20 focus:ring-blue-500/20">
                                <div className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4 text-blue-500" />
                                    <SelectValue placeholder="Select role" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="border-blue-500/20 bg-background/95 backdrop-blur-sm">
                                <SelectItem
                                    value="project_admin"
                                    className="focus:bg-blue-500/10"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-red-500"></span>
                                        Project Admin
                                    </div>
                                </SelectItem>
                                <SelectItem
                                    value="project_manager"
                                    className="focus:bg-blue-500/10"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-amber-500"></span>
                                        Project Manager
                                    </div>
                                </SelectItem>
                                <SelectItem
                                    value="member"
                                    className="focus:bg-blue-500/10"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-blue-500"></span>
                                        Member
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-blue-500/20" />
                    <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-500">
                        <ConfirmDialog
                            onAction={handleDelete}
                            actionText="Remove"
                        >
                            <span
                                className="flex items-center gap-2 text-destructive"
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                <Trash className="h-4 w-4" />
                                Remove from Project
                            </span>
                        </ConfirmDialog>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
