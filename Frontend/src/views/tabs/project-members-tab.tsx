import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useStore } from "@/components/contexts/store-provider";
import ProjectMembersTable from "@/components/projectmember/member-table";
import type { User } from "@/types/auth";
import type { ProjectMember, ProjectRole } from "@/types/project";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
    projectId: string | undefined;
};

export default function ProjectMembersTab({ projectId }: Props) {
    const { store, setStore } = useStore();

    useEffect(() => {
        const getProjectMembers = async () => {
            if (projectId) {
                try {
                    const response: AxiosResponse | undefined =
                        await API_PROJECT_ENDPOINTS.getProjectMembers(
                            projectId,
                        );

                    console.log(response);

                    if (response?.status === 200) {
                        const members = response.data.data as ProjectMember[];
                        setStore((prev) => ({
                            ...prev,
                            projectMembers: {
                                ...prev.projectMembers,
                                [projectId]: members,
                            },
                        }));
                    }
                } catch (error) {
                    if (axios.isAxiosError(error))
                        toast.error(error.response?.data?.message);
                    else toast.error("Something went wrong.");
                }
            }
        };

        getProjectMembers();
    }, []);

    return (
        <>
            <ProjectMembersTable
                data={projectId ? store.projectMembers[projectId] || [] : []}
                onAddMember={() => {}}
            ></ProjectMembersTable>
        </>
    );
}
