import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/contexts/store-provider";
import { useParams } from "react-router";
import { AddNoteFormSchema } from "@/schemas/add-note-form.schema";
import { LoaderCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { API_NOTE_ENDPOINTS } from "@/api/endpoints";
import axios from "axios";
import { toast } from "sonner";
import type { Note, Project, ProjectMember } from "@/types/project";
import type { User } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth";

type Props = {
    onSuccess: () => void;
};

export function AddNoteForm({ onSuccess }: Props) {
    const { store, setStore } = useStore();
    const { projectId } = useParams<{ projectId: string }>();
    const { user } = useAuth();

    const form = useForm<z.infer<typeof AddNoteFormSchema>>({
        resolver: zodResolver(AddNoteFormSchema),
        defaultValues: {
            content: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof AddNoteFormSchema>) => {
        if (!projectId) return;

        try {
            const response = await API_NOTE_ENDPOINTS.addProjectNote({
                projectId: projectId,
                content: values.content,
            });

            if (response.data.statusCode === 201) {
                console.log(response.data.data);
                const note = response.data.data as Note;

                note.project = store.projects.find(
                    (project) => project._id === projectId,
                ) as Project;

                note.createdBy = {
                    _id: response.data.data.createdBy,
                } as ProjectMember;

                note.createdBy.user = user as User;

                setStore((prev) => ({
                    ...prev,
                    projectNotes: {
                        ...prev.projectNotes,
                        [projectId]: [...prev.projectNotes[projectId], note],
                    },
                }));

                toast.success("Note added successfully!");
            }

            form.reset();
            onSuccess();
        } catch (error) {
            if (axios.isAxiosError(error))
                return toast.error(error.response?.data?.message);
            else return toast.error("Something went wrong. Please try again.");
            form.reset();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {" "}
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter your note content here..."
                                    className="min-h-[120px] bg-amber-500/5 border-amber-500/20 focus:border-amber-500 focus:ring-amber-500/20 resize-none placeholder:text-muted-foreground/70"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white border-none"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                            Adding Note...
                        </>
                    ) : (
                        "Add Note"
                    )}
                </Button>
            </form>
        </Form>
    );
}
