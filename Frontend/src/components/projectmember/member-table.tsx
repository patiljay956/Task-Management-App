import type { ProjectMember } from "@/types/project";
import { DataTable } from "../table/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AddProjectDialog } from "../dialogs/add-project-dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface Props {
    data: ProjectMember[];
    onAddMember: () => void;
}

export default function ProjectMembersTable({ data, onAddMember }: Props) {
    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl">Members</CardTitle>
                <AddProjectDialog>
                    <Button onClick={onAddMember} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Member
                    </Button>
                </AddProjectDialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={data} />
            </CardContent>
        </Card>
    );
}
