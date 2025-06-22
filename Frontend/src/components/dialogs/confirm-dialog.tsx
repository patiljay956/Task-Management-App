import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { JSX } from "react/jsx-runtime";

type Props = {
    title?: string;
    description?: string;
    actionText?: string;
    children?: JSX.Element;
    onAction?: () => void;
};

export default function ConfirmDialog({
    children,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently have an effect.",
    actionText = "Yes",
    onAction = () => {},
}: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="max-w-md border border-red-400/30 bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold text-red-600 dark:text-red-400">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600 dark:text-slate-300">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="rounded-md border border-red-500 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 dark:border-red-700"
                        onClick={onAction}
                    >
                        {actionText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
