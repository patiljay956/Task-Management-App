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
            <DialogContent className="max-w-md border border-indigo-400/30 bg-gradient-to-br from-background to-indigo-600/10 dark:to-indigo-400/10 backdrop-blur rounded-xl shadow-xl">
                <AlertDialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Change Password
                    </DialogTitle>
                </AlertDialogHeader>
                <ChangePasswordForm />
            </DialogContent>
        </Dialog>
    );
}
