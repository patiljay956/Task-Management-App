import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useStore } from "@/components/contexts/store-provider";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProjectTable from "@/components/projects/project-table";
import { Briefcase, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddOrUpdateProjectDialog } from "@/components/dialogs/add-or-update-project-dialog";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function UserProjects({}: Props) {
    const { store, setStore } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter projects based on search query
    const filteredProjects =
        store.projects?.filter(
            (project) =>
                project.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                project.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        ) || [];

    useEffect(() => {
        const getProjects = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };
        getProjects();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-400/20 to-purple-500/20 border border-indigo-500/30">
                        <Briefcase className="h-6 w-6 text-indigo-500" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                        My Projects
                    </h1>
                </div>
                <p className="text-muted-foreground ml-12">
                    Manage and organize all your projects in one place.
                </p>
            </div>

            {/* Search and Action Bar */}
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-9 border-indigo-500/30 focus:ring-indigo-500/20 focus:border-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <AddOrUpdateProjectDialog>
                    <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none shadow-md">
                        <PlusCircle className="w-4 h-4" />
                        Create New Project
                    </Button>
                </AddOrUpdateProjectDialog>
            </div>

            {/* Projects Table */}
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            ) : (
                <ProjectTable data={filteredProjects} />
            )}
        </div>
    );
}
