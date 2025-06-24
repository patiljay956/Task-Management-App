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
                {" "}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground font-medium">
                                Email
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        placeholder="colleague@example.com"
                                        className="bg-blue-500/5 border-blue-500/20 focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                                        {...field}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/70"
                                    >
                                        <rect
                                            width="20"
                                            height="16"
                                            x="2"
                                            y="4"
                                            rx="2"
                                        ></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground font-medium">
                                Role
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <div className="relative">
                                        <SelectTrigger className="bg-blue-500/5 border-blue-500/20 focus:border-blue-500 focus:ring-blue-500/20 pl-10">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/70"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                            <circle
                                                cx="9"
                                                cy="7"
                                                r="4"
                                            ></circle>
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                </FormControl>
                                <SelectContent className="border-blue-500/20 bg-background/30 backdrop-blur">
                                    <SelectItem
                                        value={"project_admin"}
                                        className="focus:bg-blue-500/10"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-red-500"></span>
                                            Project Admin
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="project_manager"
                                        className="focus:bg-blue-500/10"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-amber-500"></span>
                                            Project Manager
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="member"
                                        className="focus:bg-blue-500/10"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-blue-500"></span>
                                            Member
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-none shadow-md mt-4"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Inviting...
                        </>
                    ) : (
                        "Invite Member"
                    )}
                </Button>
            </form>
        </Form>
    );
}
