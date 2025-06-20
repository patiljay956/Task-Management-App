import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useStore } from "@/components/contexts/store-provider";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";
import ProjectTable from "@/components/projects/project-table";

type Props = {};

export default function UserProjects({}: Props) {
    const { store, setStore } = useStore();

    useEffect(() => {
        const getProjects = async () => {
            try {
                const response: AxiosResponse =
                    await API_PROJECT_ENDPOINTS.getProjects();

                if (response.status === 200) {
                    setStore((prev) => {
                        return {
                            ...prev,
                            projects: [...response.data.data],
                        };
                    });
                }
            } catch (error) {
                if (axios.isAxiosError(error))
                    toast.error(error.response?.data?.message);
                else
                    toast.error(
                        "Something went wrong. Please try again later.",
                    );
            }
        };
        getProjects();
    }, []);

    return (
        <>
            <ProjectTable
                data={store.projects}
                onAddProject={() => {}}
            ></ProjectTable>
        </>
    );
}
