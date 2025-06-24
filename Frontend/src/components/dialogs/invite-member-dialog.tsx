import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import InviteMemberForm from "../forms/invite-member-form";
import { useState } from "react";
import { UserPlus } from "lucide-react";

type Props = {
    children: React.ReactNode;
};

export default function InviteMemberDialog({ children }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md border-blue-500/20 backdrop-blur bg-gradient-to-b from-background to-blue-500/5">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <UserPlus className="h-5 w-5 text-blue-500" />
                        </div>
                        <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Invite Team Member
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground">
                        Add someone to your project by email address and assign
                        them a role.
                    </DialogDescription>
                </DialogHeader>
                <InviteMemberForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
