// ProjectForm.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { projectSchema } from "@/schemas/add-or-update-project-form.schema";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import type { AxiosResponse } from "axios";
import type { Project } from "@/types/project";
import axios from "axios";
import { toast } from "sonner";
import { useStore } from "../contexts/store-provider";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type ProjectFormData = z.infer<typeof projectSchema>;

type Props = {
    onSuccess: () => void;
    initialData: Project | null;
};

export default function AddOrUpdateProjectForm({
    onSuccess,
    initialData,
}: Props) {
    const { setStore } = useStore();
    const { user } = useAuth();

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
        },
    });

    async function onSubmit(data: ProjectFormData) {
        if (initialData) {
            try {
                const response: AxiosResponse | undefined =
                    await API_PROJECT_ENDPOINTS.updateProject({
                        projectId: initialData._id,
                        name: data.name,
                        description: data.description,
                    });

                if (response.status === 200) {
                    console.log(response.data.data);
                    const updatedProject = response.data?.data as Project;

                    toast.success("Project updated successfully");
                    form.reset();

                    updatedProject.createdByUser = user;

                    setStore((prev) => {
                        return {
                            ...prev,
                            projects: prev.projects.map((project) => {
                                if (project._id === updatedProject._id) {
                                    return updatedProject;
                                }
                                return project;
                            }),
                        };
                    });

                    onSuccess();
                }
            } catch (error) {
                if (axios.isAxiosError(error))
                    toast.error(error.response?.data?.message);
                else
                    toast.error(
                        "Something went wrong. Please try again later.",
                    );
            }
        } else {
            try {
                const response: AxiosResponse | undefined =
                    await API_PROJECT_ENDPOINTS.addProject(data);

                if (response.status === 201) {
                    const newProject = response.data?.data
                        ?.newProject as Project;

                    toast.success("Project created successfully");
                    form.reset();

                    newProject.createdByUser = user;

                    setStore((prev) => {
                        return {
                            ...prev,
                            projects: [...prev.projects, newProject],
                        };
                    });

                    onSuccess();
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {" "}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-indigo-700 dark:text-indigo-400">
                                Project Name
                            </FormLabel>

                            <Input
                                placeholder="Enter a descriptive name for your project"
                                {...field}
                                className="border-indigo-500/30 focus:ring-indigo-500/20 focus:border-indigo-500 bg-indigo-500/5"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-indigo-700 dark:text-indigo-400">
                                Project Description
                            </FormLabel>

                            <Textarea
                                placeholder="Provide details about the project's purpose and goals"
                                {...field}
                                rows={4}
                                className="border-indigo-500/30 focus:ring-indigo-500/20 focus:border-indigo-500 bg-indigo-500/5"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none shadow-md"
                >
                    {form.formState.isSubmitting && (
                        <LoaderCircle className="animate-spin h-4 w-4" />
                    )}
                    {initialData ? "Update Project" : "Create Project"}
                </Button>
            </form>
        </Form>
    );
}
