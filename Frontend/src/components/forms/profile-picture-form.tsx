// components/ProfilePictureForm.tsx
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { API_USER_ENDPOINTS } from "@/api/endpoints";
import type { AxiosResponse } from "axios";
import { LoaderCircle } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const schema = z.object({
    file: z
        .any()
        .refine((file) => file?.length === 1, "Image is required")
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type), {
            message: "Only .jpg, .png, .webp formats are supported.",
        })
        .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, {
            message: "File must be under 2MB",
        }),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePictureForm({
    onUploadSuccess,
}: {
    onUploadSuccess?: () => void;
}) {
    const { user, setLocalUser } = useAuth();

    const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
        return user.avatar?.url;
    });

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const file = data.file[0];

        try {
            // 🔁 Replace this with actual upload logic (e.g., Cloudinary/AWS API)
            const response: AxiosResponse | undefined =
                await API_USER_ENDPOINTS.updateAvatar(file);
            console.log(response.data);
            if (response && response.status === 200) {
                toast.success("Image uploaded successfully");
                setLocalUser({ ...user, avatar: response.data?.data?.avatar });
                setPreviewUrl(response.data?.data?.avatar?.url);
                onUploadSuccess?.();
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to upload image");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Image</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        field.onChange(e.target.files)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {previewUrl && (
                    <div className="w-32 h-32 overflow-hidden rounded-lg border">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <LoaderCircle className="animate-spin"></LoaderCircle>
                    ) : null}
                    Upload
                </Button>
            </form>
        </Form>
    );
}
