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
            <DialogContent className="max-w-md border border-purple-400/30 bg-gradient-to-br from-background to-purple-600/10 dark:to-purple-400/10 backdrop-blur rounded-xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Update Profile Picture
                    </DialogTitle>
                </DialogHeader>
                <ProfilePictureForm />
            </DialogContent>
        </Dialog>
    );
}
