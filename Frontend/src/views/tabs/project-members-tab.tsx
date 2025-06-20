import { useStore } from "@/components/contexts/store-provider";
import ProjectMembersTable from "@/components/projectmember/member-table";

type Props = {
    projectId: string | undefined;
};

export default function ProjectMembersTab({ projectId }: Props) {
    const { store } = useStore();
    return (
        <>
            <ProjectMembersTable
                data={projectId ? store.projectMembers[projectId] || [] : []}
                onAddMember={() => {}}
            ></ProjectMembersTable>
        </>
    );
}
