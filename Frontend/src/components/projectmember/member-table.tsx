import type { ProjectMember } from "@/types/project";
import { DataTable } from "../table/data-table";
import { columns } from "./columns";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { UserPlus, Info } from "lucide-react";
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
        <Card className="w-full border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        {title || "Team Members"}
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 text-xs font-medium">
                            {data.length}
                        </span>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                        Manage your project team and their permissions
                    </CardDescription>
                </div>
                <AddMemberDialog>
                    <Button
                        onClick={onAddMember}
                        className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-none shadow-md"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </Button>
                </AddMemberDialog>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg border-blue-500/20 bg-blue-500/5">
                        <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
                            <Info className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">
                            No team members yet
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md mb-4">
                            Collaborate with others by inviting them to join
                            this project.
                        </p>
                        <AddMemberDialog>
                            <Button
                                onClick={onAddMember}
                                variant="outline"
                                className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite Your First Team Member
                            </Button>
                        </AddMemberDialog>
                    </div>
                ) : (
                    <DataTable columns={columns} data={data} />
                )}
            </CardContent>
        </Card>
    );
}
