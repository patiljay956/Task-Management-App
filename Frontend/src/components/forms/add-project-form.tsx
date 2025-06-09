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
import { projectSchema } from "@/schemas/add-project-form.schema";
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
};

export default function AddProjectForm({ onSuccess }: Props) {
    const { setStore } = useStore();
    const { user } = useAuth();

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function onSubmit(data: ProjectFormData) {
        try {
            const response: AxiosResponse | undefined =
                await API_PROJECT_ENDPOINTS.addProject(data);

            if (response.status === 201) {
                const newProject = response.data?.data?.newProject as Project;

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
            else toast.error("Something went wrong. Please try again later.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>

                            <Input
                                placeholder="Your Project Title"
                                {...field}
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
                            <FormLabel>Description</FormLabel>

                            <Textarea
                                placeholder="Describe your project"
                                {...field}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                >
                    {form.formState.isSubmitting && (
                        <LoaderCircle className="animate-spin" />
                    )}
                    Create Project
                </Button>
            </form>
        </Form>
    );
}
