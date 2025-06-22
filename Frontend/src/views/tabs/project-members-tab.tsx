import { useStore } from "@/components/contexts/store-provider";
import ProjectMembersTable from "@/components/projectmember/member-table";
import { Users } from "lucide-react";

type Props = {
    projectId: string | undefined;
};

export default function ProjectMembersTab({ projectId }: Props) {
    const { store } = useStore();
    const members = projectId ? store.projectMembers[projectId] || [] : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400/20 to-indigo-500/20 border border-blue-500/30">
                        <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Team Members
                    </h2>
                </div>
                <div className="text-sm text-muted-foreground">
                    {members.length}{" "}
                    {members.length === 1 ? "member" : "members"} in this
                    project
                </div>
            </div>

            <ProjectMembersTable data={members} onAddMember={() => {}} />
        </div>
    );
}
