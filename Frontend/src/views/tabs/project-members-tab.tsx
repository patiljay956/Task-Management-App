import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useStore } from "@/components/contexts/store-provider";
import ProjectMembersTable from "@/components/projectmember/member-table";
import type { ProjectMember } from "@/types/project";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    projectId: string | undefined;
};

export default function ProjectMembersTab({ projectId }: Props) {
    const { store, setStore } = useStore();
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);

    useEffect(() => {
        setProjectMembers(() => {
            return store.projectMembers
                .filter((member) => member.project._id === projectId)
                .reverse();
        });
    }, [store.projectMembers]);

    useEffect(() => {
        const getProjectMembers = async () => {
            // get projects from the store
            if (projectId) {
                if (projectMembers.length === 0) {
                    try {
                        //fetch from backend
                        const response: AxiosResponse | undefined =
                            await API_PROJECT_ENDPOINTS.getProjectMembers(
                                projectId,
                            );

                        if (response.status === 200) {
                            const data = response.data.data as ProjectMember[];
                            setStore((prev) => ({
                                ...prev,
                                projectMembers: data,
                            }));
                        }
                    } catch (error) {
                        if (axios.isAxiosError(error))
                            toast.error(error.response?.data?.message);
                        else
                            toast.error(
                                "Something went wrong. Please try again later.",
                            );
                    }
                }
            }
        };

        getProjectMembers();
    }, []);

    return (
        <>
            {projectMembers.length > 0 && (
                <ProjectMembersTable
                    data={projectMembers}
                    onAddMember={() => {}}
                />
            )}

            {projectMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-semibold">No Members</h1>
                </div>
            )}
        </>
    );
}
