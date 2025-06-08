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
import { MoreHorizontal } from "lucide-react";
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
                memberId: row.original.user._id,
                projectId: projectId!,
            });

            if (response.data.statusCode === 200) {
                toast.success("Member removed successfully!");
                setStore((prev) => ({
                    ...prev,
                    projectMembers: prev.projectMembers.filter(
                        (member) => member._id !== row.original._id,
                    ),
                }));
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
                    projectMembers: prev.projectMembers.map((member) => {
                        if (member._id === row.original._id) {
                            return {
                                ...member,
                                role: role,
                            };
                        }
                        return member;
                    }),
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>

                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuItem
                    onClick={() => alert(`Viewing ${row.original.user.name}`)}
                >
                    Edit Role
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Select
                        onValueChange={(value) => {
                            handleRoleChange(value as ProjectRole);
                        }}
                        value={row.original.role}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="project_admin">
                                project_admin
                            </SelectItem>
                            <SelectItem value="project_manager">
                                project_manager
                            </SelectItem>
                            <SelectItem value="member">member</SelectItem>
                        </SelectContent>
                    </Select>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <ConfirmDialog onAction={handleDelete} actionText="Remove">
                        <span
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            Remove
                        </span>
                    </ConfirmDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
