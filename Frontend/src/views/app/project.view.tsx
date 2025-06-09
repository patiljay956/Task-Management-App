import KanbanBoard from "@/components/projects/kanban-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectMembersTab from "../tabs/project-members-tab";
import { useParams } from "react-router";
import ProjectTasklistTab from "../tabs/project-tasklist-tab";

type Props = {};

export default function ProjectView({}: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    return (
        <Tabs
            defaultValue="kanban-board"
            className="flex-1 flex flex-col min-h-0"
        >
            <TabsList>
                <TabsTrigger value="kanban-board">Kanban Board</TabsTrigger>
                <TabsTrigger value="list-view">List View</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>
            <TabsContent
                value="kanban-board"
                className="flex flex-1 gap-4 min-h-0 min-w-0"
            >
                <KanbanBoard />
            </TabsContent>
            <TabsContent value="list-view">
                <ProjectTasklistTab></ProjectTasklistTab>
            </TabsContent>
            <TabsContent value="members">
                <ProjectMembersTab projectId={projectId}></ProjectMembersTab>
            </TabsContent>
        </Tabs>
    );
}
