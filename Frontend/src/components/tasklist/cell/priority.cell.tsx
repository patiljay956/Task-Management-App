import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";

export function PriorityCell({ priority }: { priority: string }) {
    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case "high":
                return {
                    className: "bg-red-500/20 text-red-500 border-red-500/30",
                    icon: <ArrowUp className="h-3 w-3 mr-1" />,
                    label: "High",
                };
            case "medium":
                return {
                    className:
                        "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
                    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
                    label: "Medium",
                };
            case "low":
                return {
                    className:
                        "bg-green-500/20 text-green-700 border-green-500/30",
                    icon: <ArrowDown className="h-3 w-3 mr-1" />,
                    label: "Low",
                };
            default:
                return {
                    className:
                        "bg-gray-500/20 text-gray-500 border-gray-500/30",
                    icon: null,
                    label: priority,
                };
        }
    };

    const config = getPriorityConfig(priority);

    return (
        <Badge
            className={`${config.className} flex items-center capitalize border px-2`}
        >
            {config.icon}
            {config.label}
        </Badge>
    );
}
