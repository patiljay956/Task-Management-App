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
            <DialogContent className="max-w-md border border-blue-400/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl">
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
