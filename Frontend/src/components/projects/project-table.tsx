import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "../table/data-table";
import { type Project } from "@/types/project"; // Adjust import
import { AddOrUpdateProjectDialog } from "../dialogs/add-or-update-project-dialog";

interface Props {
    data: Project[];
    onAddProject: () => void;
}

export default function ProjectTable({ data, onAddProject }: Props) {
    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl">Projects</CardTitle>
                <AddOrUpdateProjectDialog>
                    <Button onClick={onAddProject} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Project
                    </Button>
                </AddOrUpdateProjectDialog>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={data} />
            </CardContent>
        </Card>
    );
}
