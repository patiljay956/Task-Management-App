import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { type Project } from "@/types/project"; // Adjust import
import { AddProjectDialog } from "../dialogs/add-project-dialog";

interface Props {
    data: Project[];
    onAddProject: () => void;
}

export default function ProjectTable({ data, onAddProject }: Props) {
    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl">Cohorts</CardTitle>
                <AddProjectDialog>
                    <Button onClick={onAddProject} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Project
                    </Button>
                </AddProjectDialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={data} />
            </CardContent>
        </Card>
    );
}
