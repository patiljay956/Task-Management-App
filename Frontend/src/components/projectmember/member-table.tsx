import type { ProjectMember } from "@/types/project";
import { DataTable } from "../table/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddMemberDialog from "../dialogs/invite-member-dialog";

interface Props {
    data: ProjectMember[];
    onAddMember: () => void;
    title?: string;
}

export default function ProjectMembersTable({
    data,
    onAddMember,
    title,
}: Props) {
    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl">
                    {data[0]?.project?.name + " : "}
                    {title || "Members"}
                </CardTitle>
                <AddMemberDialog>
                    <Button onClick={onAddMember} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Invite Member
                    </Button>
                </AddMemberDialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={data} />
            </CardContent>
        </Card>
    );
}
