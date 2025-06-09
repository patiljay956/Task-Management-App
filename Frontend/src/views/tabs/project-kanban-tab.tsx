import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useStore } from "@/components/contexts/store-provider";
import KanbanBoard from "@/components/kanban/kanban-board";
import type { ProjectTasks, Task } from "@/types/project";
import axios, { type AxiosResponse } from "axios";
import { useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

type Props = {};

export default function ProjectKanbanTab({}: Props) {
    return (
        <>
            <KanbanBoard />
        </>
    );
}
