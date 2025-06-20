import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import InviteMemberForm from "../forms/invite-member-form";
import { useState } from "react";

type Props = {
    children: React.ReactNode;
};

export default function InviteMemberDialog({ children }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Project Member</DialogTitle>
                </DialogHeader>
                <InviteMemberForm
                    onSuccess={() => setOpen(false)}
                ></InviteMemberForm>
            </DialogContent>
        </Dialog>
    );
}
