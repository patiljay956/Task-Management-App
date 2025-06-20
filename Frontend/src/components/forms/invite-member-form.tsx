// InviteMemberForm.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { InviteMemberSchema } from "@/schemas/invite-member-schema";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useParams } from "react-router";
import { toast } from "sonner";
import axios, { type AxiosResponse } from "axios";
import { LoaderCircle } from "lucide-react";
import { useStore } from "../contexts/store-provider";

type InviteMemberValues = z.infer<typeof InviteMemberSchema>;

type Props = {
    onSuccess: () => void;
};

export default function InviteMemberForm({ onSuccess }: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { setStore } = useStore();

    const form = useForm<InviteMemberValues>({
        resolver: zodResolver(InviteMemberSchema),
        defaultValues: {
            email: "",
            role: "member",
        },
    });

    async function onSubmit(values: InviteMemberValues) {
        try {
            const response: AxiosResponse | undefined =
                await API_PROJECT_ENDPOINTS.inviteMember({
                    projectId: projectId!,
                    email: values.email,
                    role: values.role,
                });

            console.log(response);

            if (response.data.statusCode === 201) {
                console.log(response.data);

                setStore((prev) => ({
                    ...prev,
                    projectMembers: {
                        ...prev.projectMembers,
                        [projectId!]: [
                            ...prev.projectMembers[projectId!],
                            response.data.data,
                        ],
                    },
                }));

                form.reset();
                toast.success("Member invited successfully!");
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="user@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={"project_admin"}>
                                        Project Admin
                                    </SelectItem>
                                    <SelectItem value="project_manager">
                                        Project Manager
                                    </SelectItem>
                                    <SelectItem value="member">
                                        Member
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="w-full"
                >
                    {form.formState.isSubmitting && (
                        <LoaderCircle className="animate-spin" />
                    )}
                    Invite
                </Button>
            </form>
        </Form>
    );
}
