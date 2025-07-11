import { API_DASHBOARD_ENDPOINTS } from "@/api/endpoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
    ActivityItem,
    ProjectDetails,
    ProjectSummary,
} from "@/types/project";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProjectSummaryTab from "../tabs/project-summary-tab";
import { RecentActivity } from "../tabs/recent-activity-tab";
import { useLoadingController } from "@/hooks/use-loading-controller";
import Loading from "@/components/loading/loading";

type Props = {};

export default function DashboardView({}: Props) {
    const [projectSummary, setProjectSummary] = useState<ProjectSummary>();
    const [projectDetails, setProjectDetails] = useState<ProjectDetails[]>();
    const [activities, setActivities] = useState<ActivityItem[]>();
    const { loading, withLoading } = useLoadingController(true);

    // effect to get user projects summary and details
    useEffect(() => {
        const getProjects = async () => {
            try {
                const response: AxiosResponse =
                    await API_DASHBOARD_ENDPOINTS.getProjectsSummary();
                if (response.status === 200) {
                    setProjectSummary(response.data.data);
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

        const getProjectsDetails = async () => {
            try {
                const response: AxiosResponse =
                    await API_DASHBOARD_ENDPOINTS.getProjectDetails();
                if (response.status === 200) {
                    setProjectDetails(response.data.data);
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

        const getRecentActivities = async () => {
            try {
                const response: AxiosResponse =
                    await API_DASHBOARD_ENDPOINTS.getRecentActivity();
                if (response.status === 200) {
                    setActivities(response.data.data);
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

        withLoading(async () => {
            await getProjects();
            await getProjectsDetails();
            await getRecentActivities();
        });
    }, []);

    return (
        <>
            {loading ? (
                <Loading
                    skeleton={true}
                    skeletonType="card"
                    skeletonCount={9}
                />
            ) : (
                <Tabs defaultValue="projects">
                    <TabsList>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="recent-activity">
                            Recent
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="projects">
                        <ProjectSummaryTab
                            summary={projectSummary!}
                            projects={projectDetails!}
                        ></ProjectSummaryTab>
                    </TabsContent>
                    <TabsContent value="recent-activity">
                        <RecentActivity
                            activities={activities!}
                        ></RecentActivity>
                    </TabsContent>
                </Tabs>
            )}
        </>
    );
}
