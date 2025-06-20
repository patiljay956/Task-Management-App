import ChangePasswordForm from "@/components/forms/change-password-form";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
    children: React.ReactNode;
};

export default function ChangePasswordDialog({ children }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <AlertDialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </AlertDialogHeader>
                <ChangePasswordForm />
            </DialogContent>
        </Dialog>
    );
}
