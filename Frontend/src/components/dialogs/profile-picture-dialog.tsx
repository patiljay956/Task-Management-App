// components/ProfilePictureDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ProfilePictureForm from "@/components/forms/profile-picture-form";
import type { JSX } from "react";

type Props = {
    children: JSX.Element;
};

export default function ProfilePictureDialog({ children }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                </DialogHeader>
                <ProfilePictureForm />
            </DialogContent>
        </Dialog>
    );
}
